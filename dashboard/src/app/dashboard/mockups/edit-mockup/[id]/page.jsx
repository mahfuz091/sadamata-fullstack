// app/dashboard/mockups/edit/[id]/page.jsx

import EditMockup from "@/components/EditMockup/EditMockup";
import { prisma } from "@/lib/prisma";

export default async function EditMockupPage({ params }) {
  const mockup = await prisma.mockup.findUnique({
    where: { id: params.id },
    include: { variants: true },
  });

  if (!mockup) {
    return <div className='p-6'>Mockup not found</div>;
  }

  return <EditMockup mockup={mockup} />;
}
