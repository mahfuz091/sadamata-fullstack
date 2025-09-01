import { createMockup } from "../actions/mockup/mockup.actions";

export default function MockupsPage() {
  // Example for a create form
  return (
    <form action={createMockup}>
      <input name='name' placeholder='Mockup Name' required />
      <input name='color' placeholder='Color' required />
      <input name='frontImg' type='file' accept='image/*' required />
      <input name='backImg' type='file' accept='image/*' />
      <button type='submit'>Create</button>
    </form>
  );
}
