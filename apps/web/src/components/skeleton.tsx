const ROWS = [0, 1, 2, 3, 4, 5, 6, 7];

export function Bone({ className }: { className?: string }) {
  return <span aria-hidden="true" className={`bone ${className ?? ""}`} />;
}

export function RowsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="rows">
      {ROWS.slice(0, count).map((i) => (
        <div className="row" key={i}>
          <Bone className="bone-title" />
          <Bone className="bone-meta" />
          {i % 2 === 0 ? <Bone className="bone-sub" /> : null}
        </div>
      ))}
    </div>
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
      <header>
        <Bone className="bone-display" />
        <Bone className="bone-lede" />
      </header>
      <div className="section">
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
      </div>
    </article>
  );
}

export function HomeSkeleton() {
  return (
    <article aria-busy="true" className="document">
      <section className="stat-hero">
        <Bone className="bone-lede" />
        <Bone className="bone-meta" />
        <Bone className="bone-figure" />
        <Bone className="bone-lede" />
        <Bone className="bone-stage" />
        <div className="readouts">
          {[0, 1, 2, 3].map((i) => (
            <div className="readout" key={i}>
              <Bone className="bone-meta" />
              <Bone className="bone-head" />
            </div>
          ))}
        </div>
      </section>
      <div className="section">
        <div className="section-head">
          <Bone className="bone-head" />
        </div>
        <RowsSkeleton count={3} />
      </div>
    </article>
  );
}
