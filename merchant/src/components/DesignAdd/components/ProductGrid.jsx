export default function ProductGrid({ products, onSelect }) {
  return (
    <div className='d-flex gap-3'>
      {products.map((p, i) => (
        <button key={p.id} onClick={() => onSelect(i)}>
          {p.name}
        </button>
      ))}
    </div>
  );
}
