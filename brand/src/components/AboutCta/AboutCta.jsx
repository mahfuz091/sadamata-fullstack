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
            Sign up with your existing Amazon account to get started. New to
            Amazon? Create an account during the sign up process.
          </p>
          <Link href='/login' className='commerce-btn'>
            Sign Up <i className='icon-right-arrow'></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
