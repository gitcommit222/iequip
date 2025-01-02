export const supplyCategories = [
  "Food",
  "Water",
  "Medical Supplies",
  "Office Supplies",
  "Shelter",
  "Clothing",
  "Communication Devices",
  "Hygiene Products",
  "Tools",
  "Emergency Equipment",
  "Transportation",
];

export const supplyUnits = [
  "Pcs",
  "Pack",
  "Unit",
  "Set",
  "Sack",
  "Kg",
  "Liter",
];

export const getSupplyCategoryLabel = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const getUnitLabel = (unit) => {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
};
