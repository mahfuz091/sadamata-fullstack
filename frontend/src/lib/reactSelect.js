export const customStyles = {
  container: (base) => ({
    ...base,
    minWidth: '180px',
  }),
  control: (base) => ({
    ...base,
    border: '1px solid var(--commerce-border-color)',
    borderRadius: '8px !important',
    boxShadow: 'none',
    minHeight: '46px',
  }),
  indicatorSeparator: () => null,
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused || state.isSelected ? 'var(--commerce-base)' : 'white',
    color: state.isFocused || state.isSelected ? 'white' : 'black',
    borderBottom: '1px solid grey',
  }),
};




















