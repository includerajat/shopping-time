import { useState, useEffect } from "react";

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);
  const handleChange = (e) => {
    handleFilters(e.target.value, "price");
    setValue(e.target.value);
  };
  return prices.map((p, i) => {
    return (
      <div key={i}>
        <input
          onChange={handleChange}
          value={`${p._id}`}
          type="radio"
          className="mr-2 ml-4"
          name={p}
        />
        <label className="form-check-label">{p.name}</label>
      </div>
    );
  });
};

export default RadioBox;
