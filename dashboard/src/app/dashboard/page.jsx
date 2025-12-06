import { BlogSectionCards } from "@/components/section-cards";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BookingChart from "@/components/BookingChart/BookingChart";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// export async function getStatistics() {
//   const res = await fetch(`${API_BASE}/api/v1/statistics/overview`, {
//     cache: "no-store", // always fresh
//   });
//   return res.json();
// }
// export async function getBookingsbyMonth() {
//   const res = await fetch(`${API_BASE}/api/v1/statistics/bookings-by-month`, {
//     cache: "no-store", // always fresh
//   });
//   return res.json();
// }
export default async function Page() {
  const session = await auth();
  // const statistics = await getStatistics();
  // const bookingsbyMonth = await getBookingsbyMonth();
  if (!session) {
    redirect("/");
  }

  console.log(session, "session s");

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            {/* <BlogSectionCards statistics={statistics.data} /> */}

            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              {/* <Blog allPost={allPost} /> */}
              {/* <BookingChart data={bookingsbyMonth.data} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
