import { Link } from 'react-router-dom';
import './SectionHeader.scss';

const SectionHeader = ({
  title,
  subtitle,
  linkTo,
  linkLabel = 'View all',
  align = 'left',
}) => (
  <div className={`section-header section-header--${align}`}>
    <div>
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </div>
    {linkTo && (
      <Link to={linkTo} className="section-header__link">
        {linkLabel} →
      </Link>
    )}
  </div>
);

export default SectionHeader;
