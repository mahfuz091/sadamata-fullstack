"use client";

import { Accordion } from "react-bootstrap";

const faqs = [
  {
    question: "Do my submissions need to comply with a content policy?",
    answer:
      "Yes. If Sadamata determines that your design violates our content guidelines, we may remove it without prior notice. Sadamata reserves the right to judge whether content is appropriate. Submitting designs that violate our guidelines may result in removal of your listings or suspension of your Sadamata Made Merch account. Every item you submit must follow our Content Policy.",
  },
  {
    question: "How are royalties calculated?",
    answer:
      "For complete details on how Sadamata calculates your royalties, please visit our Royalty Calculation page.",
  },
  {
    question: "Can I order a sample before I publish a product?",
    answer:
      "When you are about to publish your product, you can choose to make it accessible via a direct link only, or public so that customers can search and find it on Sadamata.com. In either case, we encourage you to order a sample to check that your design works perfectly with the selected product attributes. This allows you to verify the quality and printing before offering it to your own customers with confidence.",
  },
  {
    question: "How should I prepare my t-shirt artwork to be uploaded?",
    answer:
      "Your design should be a 300 dpi PNG. While the printable area of the product is 15 x 20 inches, we recommend creating a design that fits comfortably within this space instead of filling it entirely. For downloadable templates and additional design tips, please visit our Best Practices page.",
  },
  {
    question:
      "I want to upload a product design to Amazon Merch on Demand. Can I submit the same design to another website or manufacturer?",
    answer:
      "Yes. Sadamata Made Merch is non-exclusive, which means you are free to submit the same design to other websites or manufacturers.",
  },
  {
    question: "What shipping options do my customers get?",
    answer:
      "Yes. Sadamata Made Merch offers fast delivery: within Dhaka, a delivery charge of 50 BDT ensures delivery in 24–48 hours, and across Bangladesh, a 100 BDT delivery charge ensures delivery in 48–72 hours. Free delivery is also available for orders above 2,000 BDT within Dhaka and above 5,000 BDT nationwide.",
  },
  {
    question:
      "How will we connect you with brands, and how will you work with them?",
    answer:
      "When you upload a design, you will see a “Brands” section. There, you will find a list of all registered brands connected with Sadamata. Simply select the brand for which you created the design, and your design will be listed under that brand. For more details, please visit our Brand Listed page.",
  },
];

export default function Faq() {
  return (
    <section className='faq-area'>
      <div className='container'>
        <div className='faq-area__top text-center mb-4'>
          <h2 className='section-title'>Frequently Asked Question</h2>
        </div>
        <div className='faq-area__inner'>
          <Accordion defaultActiveKey='0'> 
            {faqs.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{faq.question}</Accordion.Header>
                <Accordion.Body>{faq.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
