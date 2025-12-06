// app/dashboard/careers/view/[id]/page.jsx
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Fetch career by ID (server-side)
async function getCareer(id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/careers/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

export default async function CareerViewPage({ params }) {
  const { id } = params;
  const career = await getCareer(id);

  if (!career) notFound();

  const {
    title,
    shortDescription,
    location,
    jobType,
    department,
    experienceLevel,
    aboutRole,
    responsibilities = [],
    requirements = [],
    benefits = [],
    applyUrl,
    keyResponsibilitiesShortDesc,
    requirementsShortDesc,
    benefitsShortDesc,
  } = career;

  return (
    <section className='px-6 py-12 text-gray-800'>
      <div className='container mx-auto space-y-[60px]'>
        {/* Header */}
        <div>
          <h1 className='text-3xl md:text-5xl font-bold mb-[16px] text-[#1D1D1D]'>
            {title}
          </h1>

          {/* shortDescription under title */}
          {shortDescription && (
            <p className='mb-[24px] text-[18px] font-normal text-[#4F4F4F] whitespace-pre-line max-w-[1100px]'>
              {shortDescription}
            </p>
          )}

          <div className='flex flex-wrap gap-[40px] justify-between bg-[#E7F2EE] p-6 rounded-lg max-w-[700px]'>
            <div>
              <p className='font-medium text-[#4F4F4F] mb-[12px]'>Location:</p>
              <p className='text-[#011C44] font-semibold text-[20px] m-0'>
                {location || "—"}
              </p>
            </div>
            <div>
              <p className='font-medium text-[#4F4F4F] mb-[12px]'>Job Type:</p>
              <p className='text-[#011C44] font-semibold text-[20px] m-0'>
                {jobType || "—"}
              </p>
            </div>
            <div>
              <p className='font-medium text-[#4F4F4F] mb-[12px]'>
                Department:
              </p>
              <p className='text-[#011C44] font-semibold text-[20px] m-0'>
                {department || "—"}
              </p>
            </div>
            <div>
              <p className='font-medium text-[#4F4F4F] mb-[12px]'>
                Experience Level:
              </p>
              <p className='text-[#011C44] font-semibold text-[20px] m-0'>
                {experienceLevel || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* About the Role */}
        <div className='max-w-[1100px]'>
          <h3 className='text-3xl font-semibold text-black mb-6'>
            About the Role
          </h3>
          <p className='mb-[12px] text-[18px] font-normal text-[#4F4F4F] whitespace-pre-line'>
            {aboutRole ||
              "This role plays a vital part in maintaining a comfortable, welcoming environment for our guests. You'll be responsible for maintaining guest rooms and public areas to the highest standards, ensuring every stay feels like home."}
          </p>
        </div>

        {/* Key Responsibilities */}
        <div className='max-w-[1100px]'>
          <h3 className='text-3xl font-semibold text-black mb-6'>
            Key Responsibilities
          </h3>

          {/* short description for responsibilities */}
          {keyResponsibilitiesShortDesc && (
            <p className='mb-[12px] text-[18px] font-normal text-[#4F4F4F] whitespace-pre-line'>
              {keyResponsibilitiesShortDesc}
            </p>
          )}

          <ul className='list-disc pl-6 space-y-2'>
            {responsibilities.length > 0 ? (
              responsibilities.map((item, i) => <li key={i}>{item}</li>)
            ) : (
              <li>No specific responsibilities listed.</li>
            )}
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h3 className='text-3xl font-semibold text-black mb-6'>
            Requirements
          </h3>

          {/* short description for requirements */}
          {requirementsShortDesc && (
            <p className='mb-[12px] text-[18px] font-normal text-[#4F4F4F] whitespace-pre-line'>
              {requirementsShortDesc}
            </p>
          )}

          <ul className='list-disc pl-6 space-y-2'>
            {requirements.length > 0 ? (
              requirements.map((req, i) => <li key={i}>{req}</li>)
            ) : (
              <li>No specific requirements listed.</li>
            )}
          </ul>
        </div>

        {/* What We Offer */}
        <div>
          <h3 className='text-3xl font-semibold text-black mb-6'>
            What We Offer
          </h3>

          {/* short description for benefits */}
          {benefitsShortDesc && (
            <p className='mb-[12px] text-[18px] font-normal text-[#4F4F4F] whitespace-pre-line'>
              {benefitsShortDesc}
            </p>
          )}

          <ul className='list-disc pl-6 space-y-2'>
            {benefits.length > 0 ? (
              benefits.map((b, i) => <li key={i}>{b}</li>)
            ) : (
              <li>No benefits listed.</li>
            )}
          </ul>
        </div>

        {/* Apply Button */}
        <div>
          <a
            href={applyUrl || "#"}
            target={applyUrl ? "_blank" : undefined}
            rel={applyUrl ? "noreferrer" : undefined}
            className='bg-[#0B7956] text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-400 transition inline-block'
          >
            Apply for this job
          </a>
        </div>
      </div>
    </section>
  );
}
