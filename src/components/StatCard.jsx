function StatCard({ title, value, subtitle, icon: Icon, type }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-icon">
        <Icon size={25} />
      </div>

      <div className="stat-content">
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export default StatCard;