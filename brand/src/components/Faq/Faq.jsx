"use client";

import { Accordion } from "react-bootstrap";

const faqs = [
  {
    question: "Do my submissions need to comply with a content policy?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice. Amazon reserves the right to make judgments about whether or not content is appropriate. Listing a design that violates our content policies may result in the cancellation of your listings, or the suspension or termination of your Amazon Merch on Demand account. Each item that you submit to us must adhere to our Content Policy.",
  },
  {
    question: "How are royalties calculated?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice...",
  },
  {
    question: "Can I order a sample before I publish a product?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice...",
  },
  {
    question: "How should I prepare my t-shirt artwork to be uploaded?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice...",
  },
  {
    question:
      "I want to upload a product design to Amazon Merch on Demand. Can I submit the same design to another website or manufacturer?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice...",
  },
  {
    question: "What shipping options do my customers get?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice...",
  },
  {
    question:
      "I've signed up for an Amazon Merch on Demand account. What happens next?",
    answer:
      "Yes. If Amazon determines that your design violates one of our content policies, we may remove it without notice...",
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
