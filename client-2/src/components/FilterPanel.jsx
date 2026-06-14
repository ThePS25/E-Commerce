import { Checkbox, Radio } from 'antd';
import { PRICE_RANGES } from '@/utils/constants';
import './FilterPanel.scss';

const FilterPanel = ({
  categories = [],
  checked = [],
  priceRange = null,
  onCategoryChange,
  onPriceChange,
  onReset,
}) => (
  <aside className="filter-panel">
    <div className="filter-panel__header">
      <h3>Filters</h3>
      <button type="button" className="filter-panel__reset" onClick={onReset}>
        Clear all
      </button>
    </div>

    <div className="filter-panel__section">
      <h4>Categories</h4>
      <Checkbox.Group
        value={checked}
        onChange={onCategoryChange}
        className="filter-panel__checkboxes"
      >
        {categories.map((cat) => (
          <Checkbox key={cat._id} value={cat._id}>
            {cat.name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>

    <div className="filter-panel__section">
      <h4>Price Range</h4>
      <Radio.Group
        value={priceRange}
        onChange={(e) => onPriceChange(e.target.value)}
        className="filter-panel__radios"
      >
        {PRICE_RANGES.map((range) => (
          <Radio key={range.id} value={range.array}>
            {range.name}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  </aside>
);

export default FilterPanel;
