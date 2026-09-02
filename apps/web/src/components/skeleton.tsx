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

export function PageSkeleton({
  filters = false,
  rows = 6,
}: {
  filters?: boolean;
  rows?: number;
}) {
  return (
    <article aria-busy="true" className="document">
      <header className="page-head">
        <Bone className="bone-display" />
        <Bone className="bone-lede" />
      </header>
      <section className="section">
        {filters ? (
          <div className="filters">
            <Bone className="bone-search" />
            <Bone className="bone-meta" />
          </div>
        ) : (
          <div className="section-head">
            <Bone className="bone-head" />
          </div>
        )}
        <RowsSkeleton count={rows} />
      </section>
    </article>
  );
}

export function HomeSkeleton() {
  return (
    <article aria-busy="true" className="document">
      <header className="intro">
        <Bone className="bone-display" />
        <Bone className="bone-meta" />
        <Bone className="bone-lede" />
        <Bone className="bone-chips" />
      </header>
      <section className="section">
        <div className="section-head">
          <Bone className="bone-head" />
        </div>
        <Bone className="bone-stage" />
      </section>
      <section className="section">
        <div className="section-head">
          <Bone className="bone-head" />
        </div>
        <RowsSkeleton count={3} />
      </section>
    </article>
  );
}
