import { FiInbox } from 'react-icons/fi';
import './EmptyState.scss';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  description,
  action,
  actionLabel,
}) => (
  <div className="empty-state">
    <div className="empty-state__icon">
      <Icon size={48} />
    </div>
    <h3 className="empty-state__title">{title}</h3>
    {description && <p className="empty-state__desc">{description}</p>}
    {action && actionLabel && (
      <button type="button" className="btn btn-brand mt-3" onClick={action}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
