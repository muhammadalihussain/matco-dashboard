interface CardProps {
  title?: string; // Note the ?
  children: React.ReactNode;
}

interface TableCardProps {
  children: React.ReactNode;
  className?: string;
}
export function Card({ title, children }: CardProps) {
  return (
    <>
      <div className="p-4 rounded-lg shadow-md h-64 flex flex-col">
        {title ? (
          <h2 className="text-lg font-semibold mb-2 text-green-500 ">
            {title}
          </h2>
        ) : (
          ""
        )}
        <div className="flex-1">{children}</div>
      </div>{" "}
    </>
  );
}

export function TableCard({ children, className = "" }: TableCardProps) {
  return (
    <div className={`border rounded-lg p-4 shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>;
}
