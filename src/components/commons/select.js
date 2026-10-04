import React from "react";
import ReactSelect from "react-select";

const Select = ({ id, name, array, selectedValue, setSelectedValue, disabled, secondaryLabel }) => {
  const options = (array || []).map((x) => ({
    value: x[id],
    label: secondaryLabel ? `${x[name]} - ${x[secondaryLabel]}` : x[name],
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
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        input: (base) => ({ ...base, color: '#333' }),
        singleValue: (base) => ({ ...base, color: '#333' }),
      }}
    />
  );
};

export default Select;
