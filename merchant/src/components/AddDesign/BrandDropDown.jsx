// components/BrandDropdown/BrandDropdown.jsx
"use client";

import { useMemo, useState, useEffect } from "react";
import CustomSelect from "../CustomSelect/CustomSelect";

export default function BrandDropdown({ brands = [], onBrandChange }) {
  const options = useMemo(
    () => brands.map((b) => ({ value: b.id, label: b.name })),
    [brands]
  );

  const [value, setValue] = useState(null);

  // If the brand list changes, keep the selection valid or reset to placeholder
  useEffect(() => {
    if (!options.find((o) => o.value === value?.value)) {
      setValue(null);
    }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (selected) => {
    setValue(selected);
    onBrandChange?.(selected?.value ?? null);
  };

  return (
    <div className="mt-2">
      <CustomSelect
        options={options}
        value={value} // <-- start as null, shows placeholder
        placeholder="-- Select a Brand --"
        onChange={handleChange}
        isSearchable={false}
        isClearable={true}
      />
    </div>
  );
}
