import { useMemo } from "react";
import { buildImageUrl } from "../utils/image";

export function useMockupConfig(allMockup) {
  return useMemo(() => {
    const data = {};
    allMockup.forEach((p) => {
      const fits = {};
      const fitSet = new Set();

      p.variants.forEach((v) => {
        const fit = v.fitType.toUpperCase();
        const color = v.color.toLowerCase();
        if (!fits[fit]) fits[fit] = { colors: [], front: {}, back: {} };

        fits[fit].colors.push(color);
        fits[fit].front[color] = buildImageUrl(v.frontImg);
        fits[fit].back[color] = buildImageUrl(v.backImg);
        fitSet.add(fit);
      });

      data[p.name.toLowerCase()] = {
        fits,
        fitTypes: [...fitSet],
      };
    });

    return data;
  }, [allMockup]);
}
