import Link from "next/link";

export default function FeatureArea() {
  const features = [
    { icon: "icon-downlode", title: "Upload your artwork" },
    { icon: "icon-doller", title: "Suggest a list price" },
    { icon: "icon-prient", title: "We print what’s sold" },
    { icon: "icon-delefery", title: "Fast shipping with Prime" },
    { icon: "icon-save-doller", title: "Earn monthly royalties" },
  ];

  return (
    <section className='feature-area section-space'>
      <div className='container'>
        <ul className='feature-area__list list-unstyled'>
          {features.map((feature, index) => (
            <li className='feature-area__list__item' key={index}>
              <div className='feature-area__list__item__icon'>
                <i className={feature.icon}></i>
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
