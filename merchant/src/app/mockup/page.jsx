"use client";
import { useState } from "react";
import { createMockup } from "../actions/mockup/mockup.actions";

export default function MockupsPage() {
  const [variants, setVariants] = useState([
    { color: "", fitType: "MEN", frontImg: null, backImg: null },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", fitType: "MEN", frontImg: null, backImg: null },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  return (
    <form action={createMockup} className="space-y-6 p-4">
      {/* Mockup Name */}
      <div>
        <label className="block text-sm font-medium">Mockup Name</label>
        <input
          name="name"
          placeholder="Mockup Name"
          required
          className="w-full border rounded p-2"
        />
      </div>

      {/* Variants Section */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-2 bg-gray-50"
          >
            <h3 className="font-semibold">Variant {index + 1}</h3>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium">Color</label>
              <input
                name={`variants[${index}][color]`}
                placeholder="e.g. red"
                required
                className="w-full border rounded p-2"
                onChange={(e) =>
                  handleChange(index, "color", e.target.value)
                }
              />
            </div>

            {/* Fit Type */}
            <div>
              <label className="block text-sm font-medium">Fit Type</label>
              <select
                name={`variants[${index}][fitType]`}
                className="w-full border rounded p-2"
                value={variant.fitType}
                onChange={(e) =>
                  handleChange(index, "fitType", e.target.value)
                }
              >
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="YOUTH">Youth</option>
              </select>
            </div>

            {/* Front Image */}
            <div>
              <label className="block text-sm font-medium">Front Image</label>
              <input
                type="file"
                name={`variants[${index}][frontImg]`}
                accept="image/*"
                required
                onChange={(e) =>
                  handleChange(index, "frontImg", e.target.files[0])
                }
              />
            </div>

            {/* Back Image */}
            <div>
              <label className="block text-sm font-medium">
                Back Image (optional)
              </label>
              <input
                type="file"
                name={`variants[${index}][backImg]`}
                accept="image/*"
                onChange={(e) =>
                  handleChange(index, "backImg", e.target.files[0])
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Variant
        </button>
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        Create Mockup
      </button>
    </form>
  );
}
