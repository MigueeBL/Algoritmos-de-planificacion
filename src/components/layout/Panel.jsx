export default function Panel({ title, children, style, className, bodyClassName }) {
  return (
    <div className={`panel ${className || ''}`} style={style}>
      {title && (
        <div className="panel-header">
          <span className="panel-title">{title}</span>
        </div>
      )}
      <div className={`panel-body ${bodyClassName || ''}`}>
        {children}
      </div>
    </div>
  );
}