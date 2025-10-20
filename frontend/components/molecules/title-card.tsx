import { ReactNode } from "react";

export default function TitleCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card">
      <h1 className="mb-6 font-bold">{title}</h1>
      {children}
    </div>
  );
}
