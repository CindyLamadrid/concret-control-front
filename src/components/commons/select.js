import React from "react";
import ReactSelect from "react-select";

const Select = ({ id, name, array, selectedValue, setSelectedValue, disabled }) => {
  const options = (array || []).map((x) => ({
    value: x[id],
    label: x[name],
  }));

  const selected = options.find((o) => String(o.value) === String(selectedValue)) || null;

  const handleChange = (option) => {
    setSelectedValue(option ? option.value : "");
  };

  return (
    <ReactSelect
      className="react-select-container"
      classNamePrefix="react-select"
      options={options}
      value={selected}
      onChange={handleChange}
      isDisabled={disabled}
      placeholder="Seleccione..."
      menuPlacement="auto"
      isSearchable
    />
  );
};

export default Select;
