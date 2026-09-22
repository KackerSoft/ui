import React, { useEffect, useRef, useState } from "react";
import { ViewStack } from "@/context/viewstack";
import { goBack } from "./router";

// Fraction of the screen width (or a fast-enough flick) needed to commit the pop.
const COMMIT_RATIO = 0.3;
const COMMIT_VELOCITY = 0.5; // px/ms
const TRANSITION = "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)";

// Waits a full paint before invoking `cb`, so a style set just before calling
// this actually takes effect and the following change is transitioned to.
const nextFrame = (cb: () => void) => {
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(cb);
  });
  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };
};

type CurrentPhase = "enter-start" | "enter-active" | "resting";
type DragPhase = "idle" | "dragging" | "commit" | "cancel";
type Reveal = ViewStack | "floor" | null;

interface DragTrack {
  startX: number;
  startY: number;
  lastX: number;
  lastT: number;
  velocity: number;
  active: boolean;
}

export interface StackedPagesProps {
  // Ordered, oldest first: every pushed page that isn't a main tab route.
  stackViews: ViewStack[];
  // The most recently active main-tab route, revealed once the stack empties.
  mainEntryPath: string | null;
  // Lets the main tab layer know it should stay visible while being revealed.
  onRevealMain: (path: string | null) => void;
}

export default function StackedPages(props: StackedPagesProps) {
  const { stackViews, mainEntryPath, onRevealMain } = props;

  const topView = stackViews[stackViews.length - 1] ?? null;
  const belowView = stackViews[stackViews.length - 2] ?? null;

  const [current, setCurrent] = useState<{
    view: ViewStack;
    phase: CurrentPhase;
  } | null>(topView ? { view: topView, phase: "resting" } : null);
  const [ghost, setGhost] = useState<{
    view: ViewStack;
    phase: "start" | "active";
  } | null>(null);
  const [reveal, setReveal] = useState<Reveal>(null);
  const [dragPhase, setDragPhase] = useState<DragPhase>("idle");
  const [dragX, setDragX] = useState(0);

  const prevLenRef = useRef(stackViews.length);
  const skipGhostRef = useRef(false);
  const dragTrackRef = useRef<DragTrack | null>(null);

  useEffect(() => {
    onRevealMain(reveal === "floor" ? mainEntryPath : null);
  }, [reveal, mainEntryPath, onRevealMain]);

  // Drive the enter/exit lifecycle whenever the top of the stack changes.
  useEffect(() => {
    const prevLen = prevLenRef.current;
    prevLenRef.current = stackViews.length;
    const nextTop = stackViews[stackViews.length - 1] ?? null;

    setCurrent((cur) => {
      if (cur?.view.id === nextTop?.id) return cur;

      if (stackViews.length > prevLen) {
        // Pushed a new page: reveal the old one underneath while it slides in.
        setReveal(cur?.view ?? "floor");
        return nextTop ? { view: nextTop, phase: "enter-start" } : cur;
      }

      if (stackViews.length < prevLen) {
        if (skipGhostRef.current) {
          // Already animated out interactively via a drag; just settle.
          skipGhostRef.current = false;
          setReveal(null);
          setDragPhase("idle");
          setDragX(0);
          return nextTop ? { view: nextTop, phase: "resting" } : null;
        }
        setGhost(cur ? { view: cur.view, phase: "start" } : null);
        setReveal(nextTop ? null : "floor");
        return nextTop ? { view: nextTop, phase: "resting" } : null;
      }

      // Replace at the same depth: swap instantly, no animation.
      setReveal(null);
      setGhost(null);
      return nextTop ? { view: nextTop, phase: "resting" } : null;
    });
  }, [stackViews]);

  // Kick off the enter transition on the next paint.
  useEffect(() => {
    if (current?.phase !== "enter-start") return;
    return nextFrame(() => {
      setCurrent((c) =>
        c?.phase === "enter-start" ? { ...c, phase: "enter-active" } : c,
      );
    });
  }, [current]);

  // Kick off the ghost's exit transition on the next paint.
  useEffect(() => {
    if (ghost?.phase !== "start") return;
    return nextFrame(() => {
      setGhost((g) => (g?.phase === "start" ? { ...g, phase: "active" } : g));
    });
  }, [ghost]);

  const handleTopTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform") return;

    if (dragPhase === "commit") {
      // Stay at translateX(100%) until the pop actually lands; the
      // stack-change effect above then swaps `current` and resets drag state.
      skipGhostRef.current = true;
      goBack();
      return;
    }
    if (dragPhase === "cancel") {
      setDragPhase("idle");
      setDragX(0);
      setReveal(null);
      return;
    }

    setCurrent((c) =>
      c?.phase === "enter-active" ? { ...c, phase: "resting" } : c,
    );
    if (current?.phase === "enter-active") setReveal(null);
  };

  const handleGhostTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform") return;
    setGhost(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!current || current.phase !== "resting" || dragPhase !== "idle") return;
    const touch = e.touches[0];
    dragTrackRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      lastX: touch.clientX,
      lastT: e.timeStamp,
      velocity: 0,
      active: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const drag = dragTrackRef.current;
    if (!drag) return;
    const touch = e.touches[0];
    const dx = touch.clientX - drag.startX;
    const dy = touch.clientY - drag.startY;

    if (!drag.active) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) {
        dragTrackRef.current = null;
        return;
      }
      drag.active = true;
      setReveal(belowView ?? "floor");
      setDragPhase("dragging");
    }

    const dt = e.timeStamp - drag.lastT || 1;
    drag.velocity = (touch.clientX - drag.lastX) / dt;
    drag.lastX = touch.clientX;
    drag.lastT = e.timeStamp;

    setDragX(Math.max(0, Math.min(dx, window.innerWidth)));
  };

  const handleTouchEnd = () => {
    const drag = dragTrackRef.current;
    dragTrackRef.current = null;
    if (!drag || !drag.active) return;

    const dx = drag.lastX - drag.startX;
    const commit =
      dx > window.innerWidth * COMMIT_RATIO || drag.velocity > COMMIT_VELOCITY;

    setDragPhase(commit ? "commit" : "cancel");
  };

  if (!current && !ghost) return null;

  let topTransform: string;
  let topTransition: string;
  if (dragPhase === "dragging") {
    topTransform = `translateX(${dragX}px)`;
    topTransition = "none";
  } else if (dragPhase === "commit") {
    topTransform = "translateX(100%)";
    topTransition = TRANSITION;
  } else if (dragPhase === "cancel") {
    topTransform = "translateX(0)";
    topTransition = TRANSITION;
  } else {
    topTransform =
      current?.phase === "enter-start" ? "translateX(100%)" : "translateX(0)";
    topTransition = current?.phase === "enter-start" ? "none" : TRANSITION;
  }

  // Rendered as a single keyed list (rather than separate conditional divs) so
  // that a page moving between roles (e.g. current -> reveal) reuses the same
  // DOM node/component instance instead of flash-remounting.
  const slots: {
    key: string;
    node: React.ReactNode;
    z: number;
    transform: string;
    transition: string;
    isTop: boolean;
    isGhost: boolean;
  }[] = [];

  if (reveal && reveal !== "floor") {
    slots.push({
      key: reveal.id,
      node: reveal.component,
      z: 1000,
      transform: "translateX(0)",
      transition: "none",
      isTop: false,
      isGhost: false,
    });
  }
  if (current) {
    slots.push({
      key: current.view.id,
      node: current.view.component,
      z: 1001,
      transform: topTransform,
      transition: topTransition,
      isTop: true,
      isGhost: false,
    });
  }
  if (ghost) {
    slots.push({
      key: ghost.view.id,
      node: ghost.view.component,
      z: 1002,
      transform: ghost.phase === "start" ? "translateX(0)" : "translateX(100%)",
      transition: ghost.phase === "start" ? "none" : TRANSITION,
      isTop: false,
      isGhost: true,
    });
  }

  return (
    <div className="absolute inset-0">
      {slots.map((slot) => (
        <div
          key={slot.key}
          onTransitionEnd={
            slot.isTop
              ? handleTopTransitionEnd
              : slot.isGhost
                ? handleGhostTransitionEnd
                : undefined
          }
          onTouchStart={slot.isTop ? handleTouchStart : undefined}
          onTouchMove={slot.isTop ? handleTouchMove : undefined}
          onTouchEnd={slot.isTop ? handleTouchEnd : undefined}
          onTouchCancel={slot.isTop ? handleTouchEnd : undefined}
          className="absolute inset-0 h-screen w-screen shadow-2xl will-change-transform"
          style={{
            zIndex: slot.z,
            transform: slot.transform,
            transition: slot.transition,
          }}
        >
          {slot.node}
        </div>
      ))}
    </div>
  );
}
