import Link from "next/link";

export default function AboutCta() {
  return (
    <section className='about-cta'>
      <div className='container'>
        <div className='about-cta__inner text-center'>
          <h2 className='about-cta__title'>
            Want to join our community of content creators?
          </h2>
          <p className='about-cta__text'>
            Click on “Register” and provide the required information. We will verify your details and notify you via email within 9 days. You can also log in to your merch portal anytime to check your application status.
          </p>
          <Link href='/signup' className='commerce-btn'>
            Register <i className='icon-right-arrow'></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
