"use client";

import CustomSelect from "../CustomSelect/CustomSelect";


export default function BrandDropdown({ brands, onBrandChange }) {
  // Convert brands to react-select format
  const options = brands?.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));

  return (
    <div className="mt-2">
      <CustomSelect
        options={options}
        placeholder="-- Select a Brand --"
        onChange={(selected) => onBrandChange(selected?.value)}
      />
    </div>
  );
}
