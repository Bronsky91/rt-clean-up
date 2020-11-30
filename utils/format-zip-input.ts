export const formatZipInput = (value: string) => {
  if (value.length > 5) {
    const zipNumber = value.replace(/\D/g, "");
    return zipNumber.slice(0, 5) + "-" + zipNumber.slice(5, 9);
  }
  return value;
};
