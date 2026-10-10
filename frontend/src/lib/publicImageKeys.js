import prisma from "@/lib/prisma";

/**
 * The storefront signs image keys that the browser sends back to it (cart
 * lines, recently-viewed entries). Signing whatever arrives would hand out
 * read URLs for any object in the private bucket — merchant design uploads,
 * identity documents, other people's profile images — to anyone who can guess
 * a key. Only keys that are already on public display are signed.
 */
export async function filterPublicImageKeys(keys = []) {
  const wanted = [...new Set((keys || []).filter(Boolean).map(String))];
  if (wanted.length === 0) return new Set();

  const [variants, products] = await Promise.all([
    prisma.mockupVariant.findMany({
      where: {
        OR: [{ frontImg: { in: wanted } }, { backImg: { in: wanted } }],
      },
      select: { frontImg: true, backImg: true },
    }),
    prisma.product.findMany({
      where: {
        OR: [{ frontDesign: { in: wanted } }, { backDesign: { in: wanted } }],
      },
      select: { frontDesign: true, backDesign: true },
    }),
  ]);

  const allowed = new Set();
  for (const v of variants) {
    if (v.frontImg) allowed.add(v.frontImg);
    if (v.backImg) allowed.add(v.backImg);
  }
  for (const p of products) {
    if (p.frontDesign) allowed.add(p.frontDesign);
    if (p.backDesign) allowed.add(p.backDesign);
  }

  return new Set(wanted.filter((key) => allowed.has(key)));
}
