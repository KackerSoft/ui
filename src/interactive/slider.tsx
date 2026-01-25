import React from "react";

export default function Slider(props: {
  min: number;
  max: number;
  step?: number;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { min, max, value, onChange, step } = props;

  const sliderDelta = max - min;

  const trailPercent =
    ((Math.round(((Number(value) || min) + Number.EPSILON) * 100) / 100 - min) /
      sliderDelta) *
    100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      step={step || 1}
      onChange={onChange}
      className="__kui-slider"
      style={
        {
          "--background": `linear-gradient(to right, var(--color-accent-500) ${trailPercent}%, var(--color-primary-800) ${trailPercent}%,  var(--color-primary-800))`,
        } as React.CSSProperties
      }
    />
  );
}
