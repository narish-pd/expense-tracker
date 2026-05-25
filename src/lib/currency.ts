export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value);
};
