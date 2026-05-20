export const formatDate = (date: string) => {
  const parsed = new Date(date);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
``;
