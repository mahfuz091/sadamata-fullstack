"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Import all images statically
import group1_1 from "@/assets/images/resources/group-info-1-1.jpg";
import group1_2 from "@/assets/images/resources/group-info-1-2.jpg";
import group1_3 from "@/assets/images/resources/group-info-1-3.jpg";
import group1_4 from "@/assets/images/resources/group-info-1-4.jpg";

import group2_1 from "@/assets/images/resources/group-info-2-1.jpg";
import group2_2 from "@/assets/images/resources/group-info-2-2.jpg";
import group2_3 from "@/assets/images/resources/group-info-2-3.jpg";
import group2_4 from "@/assets/images/resources/group-info-2-4.jpg";

import group3_1 from "@/assets/images/resources/group-info-3-1.jpg";
import group3_2 from "@/assets/images/resources/group-info-3-2.jpg";
import group3_3 from "@/assets/images/resources/group-info-3-3.jpg";
import group3_4 from "@/assets/images/resources/group-info-3-4.jpg";

import group4_1 from "@/assets/images/resources/group-info-4-1.jpg";
import group4_2 from "@/assets/images/resources/group-info-4-2.jpg";
import group4_3 from "@/assets/images/resources/group-info-4-3.jpg";
import group4_4 from "@/assets/images/resources/group-info-4-4.jpg";

// Each card shows a 2x2 grid, so it always needs exactly 4 tiles.
const toTiles = (brands = [], fallbacks) =>
  Array.from({ length: 4 }, (_, i) => {
    const brand = brands[i];
    const fallback = fallbacks[i % fallbacks.length];

    if (!brand) {
      return {
        key: `placeholder-${i}`,
        name: "Brand name",
        img: fallback,
        href: null,
      };
    }

    const slug = brand.brandSlug || brand.id;

    return {
      key: brand.id || `brand-${i}`,
      name: brand.name || brand.user?.name || "Brand name",
      // landscape first — the tile crops 4:3, banners survive that better than avatars
      img: brand.bannerImageUrl || brand.previewUrl || brand.profileImageUrl || fallback,
      href: slug ? `/brand/${slug}` : null,
    };
  });

const BrandInfo = ({
  musicBrands = [],
  movieBrands = [],
  natokBrands = [],
  bangladeshBrands = [],
}) => {
  const brandData = useMemo(
    () => [
      {
        title: "Music Merchandise",
        link: "/categories/music",
        tiles: toTiles(musicBrands, [group1_1, group1_2, group1_3, group1_4]),
      },
      {
        title: "Movie Merchandise",
        link: "/categories/movies",
        tiles: toTiles(movieBrands, [group2_1, group2_2, group2_3, group2_4]),
      },
      {
        title: "Drama Merchandise",
        link: "/categories/drama",
        tiles: toTiles(natokBrands, [group3_1, group3_2, group3_3, group3_4]),
      },
      {
        title: "Bangladesh Merchandise",
        link: "/categories/bangladesh",
        tiles: toTiles(bangladeshBrands, [group4_1, group4_2, group4_3, group4_4]),
      },
    ],
    [musicBrands, movieBrands, natokBrands, bangladeshBrands]
  );

  return (
    <section className='brand-info py-5'>
      <Container>
        <Row className='g-4'>
          {brandData.map((item, idx) => (
            <Col key={idx} xl={3} lg={4} md={6}>
              <div className='brand-info__item'>
                <h3 className='brand-info__item__title'>{item.title}</h3>
                <div className='brand-info__item__group'>
                  {item.tiles.map((tile) => {
                    const inner = (
                      <>
                        <div className='brand-info__item__thumb'>
                          <Image
                            src={tile.img}
                            alt={tile.name}
                            width={300}
                            height={225}
                          />
                        </div>
                        <h4 className='brand-info__item__sub-item__title'>
                          {tile.name}
                        </h4>
                      </>
                    );

                    return tile.href ? (
                      <Link
                        key={tile.key}
                        href={tile.href}
                        className='brand-info__item__sub-item'
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={tile.key} className='brand-info__item__sub-item'>
                        {inner}
                      </div>
                    );
                  })}
                </div>
                <Link href={item.link} className='brand-info__item__btn'>
                  Shop Now
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default BrandInfo;
