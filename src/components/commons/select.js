import React from "react";
const Select = ({ id, name, array, selectedValue, setSelectedValue }) => {
  return (
    <select
      className="select"
      value={selectedValue}
      onChange={(event) => setSelectedValue(event.target.value)}
    >
      {array.map((x, index) => {
        return (
          <option key={index.toString()} value={x[id]}>
            {x[name]}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
