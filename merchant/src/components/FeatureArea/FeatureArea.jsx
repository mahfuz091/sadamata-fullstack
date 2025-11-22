import Image from "next/image";
import Link from "next/link";

export default function FeatureArea() {
  const features = [
    { icon: "/images/Upload.svg", title: "Upload your artwork" },
    { icon: "/images/Upload.svg", title: "Suggest a list price" },
    { icon: "/images/sold.svg", title: "We print what’s sold" },
    { icon: "/images/shipping.svg", title: "Fast shipping with Free" },
    { icon: "/images/Upload.svg", title: "Earn monthly royalties" },
  ];

  return (
    <section className='feature-area section-space'>
      <div className='container'>
        <ul className='feature-area__list list-unstyled'>
          {features.map((feature, index) => (
            <li className='feature-area__list__item' key={index}>
              <div className='feature-area__list__item__icon'>
                <Image src={feature.icon} alt={feature.title} width={80} height={80}/>
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
