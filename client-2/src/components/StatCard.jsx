import './StatCard.scss';

const StatCard = ({ icon: Icon, label, value, trend, color = 'primary' }) => (
  <div className={`stat-card stat-card--${color}`}>
    {Icon && (
      <div className="stat-card__icon">
        <Icon size={24} />
      </div>
    )}
    <div className="stat-card__content">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {trend && <span className="stat-card__trend">{trend}</span>}
    </div>
  </div>
);

export default StatCard;
