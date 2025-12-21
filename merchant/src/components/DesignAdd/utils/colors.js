import { BLACK_KEYS } from "../constants";

export const prioritizeBlack = (colors = []) => {
  const index = colors.findIndex((c) =>
    BLACK_KEYS.includes(String(c).toLowerCase())
  );
  if (index <= 0) return colors;
  return [colors[index], ...colors.filter((_, i) => i !== index)];
};
