export function getSelectOptionsFromBrandCategories(brandCategories) {
  return brandCategories.map(category => ({
    value: category.id,
    label: category.name,
  }));
}
