export default function EmptyState({ icon, message }) {
  return (
    <div className="empty-state">
      {icon && <div className="icon">{icon}</div>}
      <p>{message}</p>
    </div>
  );
}