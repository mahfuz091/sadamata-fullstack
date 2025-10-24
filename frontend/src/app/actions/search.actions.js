'use server';
import { redirect } from 'next/navigation';

export async function searchRedirect(formData) {
  const qRaw = formData.get('text');
  const slugRaw = formData.get('slug');

  const q = typeof qRaw === 'string' ? qRaw.trim() : '';
  const slug = typeof slugRaw === 'string' ? slugRaw.trim() : '';

  // কিছুই না থাকলে কিছু করব না
  if (!q && !slug) return;

  const params = new URLSearchParams();
  if (slug) params.set('slug', slug);
  if (q) params.set('q', q);

  redirect(`/products/?${params.toString()}`);
}
