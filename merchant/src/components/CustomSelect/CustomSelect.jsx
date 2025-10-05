// components/CustomSelect.jsx
"use client";

import Select from "react-select";

const customStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
    zIndex: 99,
  }),
  control: (base) => ({
    ...base,
    border: "1px solid #E8EFFC",
    boxShadow: "none",
    zIndex: 99,

    "&:hover": {
      background: "#E8EFFC",
    },
  }),
  indicatorSeparator: () => null,
  option: (base, state) => ({
    ...base,
    backgroundColor:
      state.isFocused || state.isSelected ? "var(--commerce-base)" : "white",
    color: state.isFocused || state.isSelected ? "white" : "black",
    borderBottom: "1px solid grey",
  }),
};

export default function CustomSelect({ options = [],
  value,                 // <-- use controlled value
  onChange,
  placeholder,
  isSearchable = false,
  isClearable = true,}) {
  return (
    <Select
      options={options}
      value={value}       // <-- controlled
      onChange={onChange}
      placeholder={placeholder}
      isClearable={isClearable}
      isSearchable={isSearchable}
      styles={customStyles}
      components={{ IndicatorSeparator: () => null }}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
    />
  );
}
