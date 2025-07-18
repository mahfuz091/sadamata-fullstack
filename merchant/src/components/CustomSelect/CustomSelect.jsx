// components/CustomSelect.jsx
'use client';

import Select from 'react-select';

const customStyles = {
  container: (base) => ({
    ...base,
    width: '100%',
    zIndex: 99,
    
  }),
  control: (base) => ({
    ...base,
    border: '1px solid #E8EFFC',
    boxShadow: 'none',
    zIndex: 99,
 
    '&:hover': {
      background: '#E8EFFC',
    },
  }),
  indicatorSeparator: () => null,
  option: (base, state) => ({
    ...base,
    backgroundColor:
      state.isFocused || state.isSelected ? 'var(--commerce-base)' : 'white',
    color: state.isFocused || state.isSelected ? 'white' : 'black',
    borderBottom: '1px solid grey',
  }),
};

export default function CustomSelect({ options, onChange , placeholder}) {
  return (
    <Select
      options={options}
      styles={customStyles}
      components={{
        IndicatorSeparator: () => null,
      }}
      defaultValue={options[0]}
      isClearable={false}
      isSearchable={false}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
