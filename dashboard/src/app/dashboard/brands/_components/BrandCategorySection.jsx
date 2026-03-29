"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { message } from "antd";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  assignProductCategoryToBrand,
  removeProductCategoryFromBrand,
} from "@/app/actions/brandCategory.actions";

export default function BrandCategorySection({
  brandId,
  selectedCategory,
  allCategories,
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(selectedCategory || null);

  const handleSelect = async (category) => {
    if (!brandId) {
      message.error("Brand not found");
      return;
    }

    setLoading(true);
    try {
      const res = await assignProductCategoryToBrand(brandId, category.id);

      if (!res?.success) {
        throw new Error(res?.message || "Failed");
      }

      setSelected(category);
      setOpen(false);
      message.success("Category assigned successfully");
    } catch (error) {
      message.error("Failed to assign category");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!brandId) {
      message.error("Brand not found");
      return;
    }

    setLoading(true);
    try {
      const res = await removeProductCategoryFromBrand(brandId);

      if (!res?.success) {
        throw new Error(res?.message || "Failed");
      }

      setSelected(null);
      message.success("Category removed successfully");
    } catch (error) {
      message.error("Failed to remove category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 col-span-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {selected ? selected.name : "Select brand category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>

            <CommandGroup>
              {allCategories.map((cat) => {
                const isSelected = selected?.id === cat.id;

                return (
                  <CommandItem
                    key={cat.id}
                    onSelect={() => handleSelect(cat)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {cat.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {loading && (
        <p className="text-sm text-muted-foreground">Updating category...</p>
      )}

      {selected && (
        <div className="flex items-center gap-2 mt-2">
          <span className="rounded border px-3 py-1 text-sm">
            {selected.name}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}