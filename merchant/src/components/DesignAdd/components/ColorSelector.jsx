export default function ColorSelector({
  colors,
  selectedColors,
  onToggle,
  onHover,
}) {
  return (
    <div className='color-selector'>
      <p>Choose colors:</p>

      <div className='d-flex gap-2 flex-wrap'>
        {colors.map((color) => {
          const checked = selectedColors.includes(color);

          return (
            <span
              key={color}
              onClick={() => onToggle(color)}
              onMouseEnter={() => onHover(color)}
              onMouseLeave={() => onHover(null)}
              title={color}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: color,
                border: checked ? "3px solid #000" : "1px solid #ccc",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {checked ? "✓" : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
