"use client";

import { Accordion } from "react-bootstrap";

const faqs = [
  {
    question: "What is Brand.Sadamata.com?",
    answer: `
      <p>
        Brand.Sadamata.com is Sadamata’s official brand portal where creators, influencers, and entrepreneurs can launch their own merchandise brand without handling production or delivery operations.
      </p>
    `,
  },
  {
    question: "Is there any cost to open a brand on Sadamata?",
    answer: `
      <p>
        No. Brand registration on Sadamata is completely free of cost. There are no upfront fees or hidden charges.
      </p>
    `,
  },
  {
    question: "Who can apply for a brand?",
    answer: `
      <p>Anyone can apply for a brand, including:</p>
      <ul>
        <li>Content creators and influencers</li>
        <li>Artists and designers</li>
        <li>Online entrepreneurs</li>
        <li>Community or page administrators</li>
      </ul>
      <p>A large follower base is not required to apply.</p>
    `,
  },
  {
    question: "How does the brand approval process work?",
    answer: `
      <p>
        You submit your brand application with the required details. After review, once approved, you will be assigned a dedicated Brand Manager and receive access to your Brand Dashboard.
      </p>
    `,
  },
  {
    question: "Do I need to upload designs myself?",
    answer: `
      <p>
        No. After approval, you simply share your artwork or design ideas with your assigned Brand Manager. Sadamata handles the design setup and merchandise preparation.
      </p>
    `,
  },
  {
    question: "Can I co-design with Sadamata?",
    answer: `
      <p>
        Yes. You may submit your own artwork or collaborate with Sadamata for co-designing merchandise.
      </p>
    `,
  },
  {
    question: "Where will my brand’s products be sold?",
    answer: `
      <p>
        Your approved products will be listed and sold on Sadamata.com under your brand name.
      </p>
    `,
  },
  {
    question: "How do I earn money?",
    answer: `
      <p>
        You earn a commission on every sale made under your brand. All sales and earnings are visible in real time from your Brand Dashboard.
      </p>
    `,
  },
  {
    question: "Who handles production and delivery?",
    answer: `
      <p>Sadamata fully manages:</p>
      <ul>
        <li>Product manufacturing</li>
        <li>Printing and quality control</li>
        <li>Order processing</li>
        <li>Nationwide delivery</li>
        <li>Customer support</li>
      </ul>
      <p>You focus on marketing and growing your brand.</p>
    `,
  },
  {
    question: "How do payouts work?",
    answer: `
      <p>
        Your brand’s royalty from the current month’s sales will be transferred to your provided bank account between the 1st and 10th of the following month.
      </p>
      <p>
        All earnings, commissions, and payout details are transparently available in your Brand Dashboard.
      </p>
    `,
  },
  {
    question: "Can Sadamata reject a brand application?",
    answer: `
      <p>
        Yes. Sadamata reserves the right to approve or reject any brand application based on its internal review guidelines.
      </p>
    `,
  },
];


export default function Faq() {
  return (
    <section className="faq-area">
      <div className="container">
        <div className="faq-area__top text-center mb-4">
          <h2 className="section-title">Frequently Asked Question</h2>
        </div>

        <div className="faq-area__inner">
          <Accordion defaultActiveKey="0">
            {faqs.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{faq.question}</Accordion.Header>

                <Accordion.Body>
                  <div
                    className="faq-content"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
