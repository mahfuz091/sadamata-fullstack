import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // space → hyphen
    .replace(/[^a-z0-9-]/g, '')  // non-url chars remove
    .replace(/-+/g, '-');        // dedupe

export async function GET() {
  try {
    const mockups = await prisma.mockup.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    // react-select option: value = slug, label = name
    const options = mockups.map(m => ({
      value: slugify(m.name),
      label: m.name,
    }));

    return NextResponse.json({ options });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ options: [] }, { status: 500 });
  }
}
