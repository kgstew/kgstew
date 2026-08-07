/**
 * One divider, three renderings. Signal is a flat hairline, Shop Drawing is a
 * dimension line with tick ends, Index is a slightly heavier table rule.
 */
export default function Rule({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label ? <span className="legend shrink-0">{label}</span> : null}
      <div className="h-px flex-1 bg-hairline index:bg-rule draft:dimension-line" />
    </div>
  )
}
