import { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);
  const handleToggle = (c) => () => {
    const currentCategoryId = checked.indexOf(c);
    const newCheckedCategoryId = [...checked];
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    // console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId, "category");
  };
  return categories.map((category, i) => {
    return (
      <li key={category._id} className="list-unstyled">
        <input
          onChange={handleToggle(category._id)}
          value={checked.indexOf(category._id === -1)}
          type="checkbox"
          className="form-check-input"
        />
        <label className="form-check-label">{category.name}</label>
      </li>
    );
  });
};

export default Checkbox;
