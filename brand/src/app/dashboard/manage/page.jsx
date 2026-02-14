import { getAllBrandProductsOfUser } from "@/app/actions/brand/brand-products.actions";
import { auth } from "@/auth";

import placeholder from "@/assets/images/products/cart.png";
import { getPrivateUrl } from "@/lib/s3";
import BrandDashboardManage from "@/components/DashboardManage/DashboardManage";

const SIGN_EXPIRES = 60 * 60; // 1 hour

async function attachPreviewUrl(items) {
  return await Promise.all(
    items.map(async (p) => {
      const key = p.previewImg || p.frontDesign || null;
      return {
        ...p,
        previewUrl: key ? await getPrivateUrl(key, SIGN_EXPIRES) : null,
      };
    })
  );
}

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <section className="container py-5">
        <p>Please sign in.</p>
      </section>
    );
  }

  // ✅ initial fetch
  const firstPage = await getAllBrandProductsOfUser({
    userId,
    page: 1,
    pageSize: 12,
    sort: "createdAt_desc",
  });

  const signedFirstItems = await attachPreviewUrl(firstPage.items);

  // ✅ server action for pagination + pageSize
  async function loadPageAction(prevState, formData) {
    "use server";
    const nextPage = Number(formData.get("page") || 1);
    const pageSize = Number(formData.get("pageSize") || 12);

    const res = await getAllBrandProductsOfUser({
      userId,
      page: nextPage,
      pageSize,
      sort: "createdAt_desc",
    });

    const signedItems = await attachPreviewUrl(res.items);

    return {
      ...res,
      items: signedItems,
    };
  }

  return (
    <BrandDashboardManage
      initialItems={signedFirstItems}
      totalPages={firstPage.totalPages}
      initialPage={firstPage.page}
      loadPageAction={loadPageAction}
      placeholderSrc={placeholder}
    />
  );
};

export default page;
