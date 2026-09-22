const ROWS = [0, 1, 2, 3, 4, 5, 6, 7];

export function Bone({ className }: { className?: string }) {
  return <span aria-hidden="true" className={`bone ${className ?? ""}`} />;
}

export function RowsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="repos">
      {ROWS.slice(0, count).map((i) => (
        <li className="repo is-bone" key={i}>
          <Bone className="bone-mark" />
          <span className="repo-body">
            <Bone className="bone-title" />
            <Bone className="bone-sub" />
          </span>
          <Bone className="bone-meta" />
        </li>
      ))}
    </ul>
  );
}
