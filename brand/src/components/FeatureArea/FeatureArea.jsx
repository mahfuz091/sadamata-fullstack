import Link from "next/link";

export default function FeatureArea() {
  const features = [
    { icon: "/feature/Apply-for-Brand.png", title: "Apply for Brand" },
    { icon: "/feature/Brand-Review-&-Approval.png", title: "Brand Review & Approval" },
    { icon: "/feature/Send-Your-Artwork.png", title: "Send Your Artwork" },
    { icon: "/feature/Products-Go-Live.png", title: "Products Go Live" },
    { icon: "/feature/Earn-monthly-royalties.png", title: "Earn monthly royalties" },
  ];

  return (
    <section className='feature-area section-space'>
      <div className='container'>
        <ul className='feature-area__list list-unstyled'>
          {features.map((feature, index) => (
            <li className='feature-area__list__item' key={index}>
              <div className='feature-area__list__item__icon'>
                <img src={feature.icon}></img>
              </div>
              <h4 className='feature-area__list__title'>
                <Link href='#'>{feature.title}</Link>
              </h4>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
