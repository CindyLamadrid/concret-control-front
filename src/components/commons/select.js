import React from "react";
const Select = ({ id, name, array, selectedValue, setSelectedValue, disabled }) => {
  return (
    <select
      className="select"
      value={selectedValue}
      disabled={disabled}
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
