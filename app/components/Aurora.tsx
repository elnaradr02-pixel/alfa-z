/**
 * Аврора — три размытых пятна коралл/персик/тёмный коралл (стили в globals.css).
 * Декоративная, не перехватывает клики. Анимируется только на десктопе.
 * `soft` — приглушённая версия для кремовых секций.
 */
export default function Aurora({ soft = false, className = "" }: { soft?: boolean; className?: string }) {
  return (
    <div aria-hidden className={`aurora ${soft ? "aurora-soft" : ""} ${className}`}>
      <span className="a1" />
      <span className="a2" />
      <span className="a3" />
    </div>
  );
}
