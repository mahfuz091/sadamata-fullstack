"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
  attachCategoryToProduct,
  removeCategoryFromProduct,
} from "@/app/actions/productCategory.actions";

export default function ProductCategoriesSection({
  productId,
  selectedCategories,
  allCategories,
}) {
  const [selected, setSelected] = React.useState(
    selectedCategories.map((c) => c.id)
  );
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toggleCategory = async (categoryId) => {
    setLoading(true);
    try {
      if (selected.includes(categoryId)) {
        await removeCategoryFromProduct(productId, categoryId);
        setSelected((prev) => prev.filter((id) => id !== categoryId));
      } else {
        await attachCategoryToProduct(productId, categoryId);
        setSelected((prev) => [...prev, categoryId]);
      }
    } catch {
      message.error("Failed to update categories");
    } finally {
      setLoading(false);
    }
  };

  const selectedNames = allCategories
    .filter((c) => selected.includes(c.id))
    .map((c) => c.name)
    .join(", ");

  return (
    <div className='space-y-3'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {selected.length ? selectedNames : "Select product categories"}
            <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput placeholder='Search categories...' />
            <CommandEmpty>No category found.</CommandEmpty>

            <CommandGroup>
              {allCategories.map((cat) => {
                const isSelected = selected.includes(cat.id);

                return (
                  <CommandItem
                    key={cat.id}
                    onSelect={() => toggleCategory(cat.id)}
                    className='flex items-center gap-2'
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                    >
                      {isSelected && <Check className='h-3 w-3' />}
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
        <p className='text-sm text-muted-foreground'>Updating categories…</p>
      )}

      {/* Selected category pills */}
      {selected.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {allCategories
            .filter((c) => selected.includes(c.id))
            .map((c) => (
              <span key={c.id} className='rounded border px-2 py-1 text-sm'>
                {c.name}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
