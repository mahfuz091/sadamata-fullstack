"use client";

import Image from "next/image";
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

const brandData = [
  {
    title: "Music Brand T-shirt",
    images: [group1_1, group1_2, group1_3, group1_4],
  },
  {
    title: "Movie’s T-shirt",
    images: [group2_1, group2_2, group2_3, group2_4],
  },
  {
    title: "Natok T-shirt",
    images: [group3_1, group3_2, group3_3, group3_4],
  },
  {
    title: "Tranding Event’s T-shirt",
    images: [group4_1, group4_2, group4_3, group4_4],
  },
];

const BrandInfo = () => {
  return (
    <section className='brand-info py-5'>
      <Container>
        <Row className='g-4'>
          {brandData.map((item, idx) => (
            <Col key={idx} xl={3} lg={4} md={6}>
              <div className='brand-info__item'>
                <h3 className='brand-info__item__title'>{item.title}</h3>
                <div className='brand-info__item__group'>
                  {item.images.map((imgSrc, i) => (
                    <div className='brand-info__item__sub-item' key={i}>
                      <div className='brand-info__item__thumb'>
                        <Image src={imgSrc} alt='brand image' />
                      </div>
                      <h4 className='brand-info__item__sub-item__title'>
                        Brand name
                      </h4>
                    </div>
                  ))}
                </div>
                <a href='/product' className='brand-info__item__btn'>
                  Shop Now <i className='icon-right-arrow'></i>
                </a>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default BrandInfo;
