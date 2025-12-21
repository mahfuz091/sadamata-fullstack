export default function FitSelector({ fits, selectedFits, onToggle, onHover }) {
  return (
    <div className='fit-selector'>
      <p>Choose fit types:</p>

      <div className='d-flex gap-3 flex-wrap'>
        {fits.map((fit) => {
          const checked = selectedFits.includes(fit);
          return (
            <label
              key={fit}
              onMouseEnter={() => onHover(fit)}
              onMouseLeave={() => onHover(null)}
              className='fit-checkbox'
            >
              <input
                type='checkbox'
                checked={checked}
                onChange={() => onToggle(fit)}
              />
              <span className='custom-check' />
              {fit}
            </label>
          );
        })}
      </div>
    </div>
  );
}
