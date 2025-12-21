import { LIMITS } from "../constants";

export default function ProductDetailsForm({
  features,
  brandOption,
  brands,
  brandId,
  setBrandId,
  setBrandOption,
  handleFeatureChange,
  remainingChars,
}) {
  return (
    <div className='product-details__form'>
      <h2>Product details</h2>

      {/* DESIGN TITLE */}
      <div className='form-control-two'>
        <label>Design Title</label>
        <input
          name='title'
          value={features.title}
          maxLength={LIMITS.title}
          onChange={handleFeatureChange}
        />
        <span>
          {remainingChars(features.title, LIMITS.title)} characters remaining
        </span>
      </div>

      {/* BRAND */}
      <div className='form-control-two'>
        <label>Brand</label>

        <div className='d-flex gap-3'>
          <label>
            <input
              type='radio'
              checked={brandOption === "non-brand"}
              onChange={() => setBrandOption("non-brand")}
            />
            Non-brand
          </label>

          <label>
            <input
              type='radio'
              checked={brandOption === "select-brand"}
              onChange={() => setBrandOption("select-brand")}
            />
            Select Brand
          </label>
        </div>

        {brandOption === "non-brand" && (
          <input
            name='brandName'
            placeholder='Brand name'
            value={features.brandName}
            maxLength={LIMITS.brandName}
            onChange={handleFeatureChange}
          />
        )}

        {brandOption === "select-brand" && (
          <select onChange={(e) => setBrandId(e.target.value)}>
            <option value=''>Select brand</option>
            {brands?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* FEATURES */}
      <div className='form-control-two'>
        <label>Feature 1</label>
        <input
          name='feature1'
          value={features.feature1}
          onChange={handleFeatureChange}
        />
      </div>

      <div className='form-control-two'>
        <label>Feature 2</label>
        <input
          name='feature2'
          value={features.feature2}
          maxLength={LIMITS.feature}
          onChange={handleFeatureChange}
        />
      </div>

      {/* DESCRIPTION */}
      <div className='form-control-two'>
        <label>Description</label>
        <textarea
          name='description'
          value={features.description}
          maxLength={LIMITS.description}
          onChange={handleFeatureChange}
        />
        <span>
          {remainingChars(features.description, LIMITS.description)} remaining
        </span>
      </div>
    </div>
  );
}
