export interface PageProps {
  children?: React.ReactNode;
}

export default function Page(props: PageProps) {
  return (
    <div className="overflow-auto h-screen pt-[var(--safe-area-inset-top)] pb-[calc(var(--safe-area-inset-bottom)+3.5rem)] px-4">
      {props.children}
    </div>
  );
}

export function PageHeader(props: { children?: React.ReactNode }) {
  return <div className="text-3xl font-black">{props.children}</div>;
}
