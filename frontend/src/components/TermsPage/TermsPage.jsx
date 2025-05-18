'use client'
import Link from 'next/link';
import React from 'react';
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';


import { tabs, termsData } from './tabsData';

const TermsPage = () => {

    const defaultEventKey = tabs[0]?.id;
    console.log(
        defaultEventKey
    );
    
    return (
        <section className='terms-page'>
            <Container>
                <div className="terms-page__top">
                <ul className="commerce-breadcrumb list-unstyled">
            <li><Link href="/">Home</Link></li>
            
            <li><span>Terms and Condition</span></li>
        </ul>
                <h2 className="terms-section-title">Terms and Condition</h2>
                
                </div>
                <div className="terms-inner">
                <Tab.Container
            id='left-tabs-example'
            defaultActiveKey={defaultEventKey}
          >
                <Row>
                    <Col lg={4}>
                    <div className='terms-tabs-wrap'>
                  <Nav variant='pills' className='flex-column'>
                    {tabs &&
                      tabs.map((faqTab) => (
                        <Nav.Item key={faqTab.id} >
                          <Nav.Link eventKey={faqTab.id}>
                            {faqTab?.label} 
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                  </Nav>
                  </div>
                    
                    </Col>
                    <Col lg={8}>
                    
                    <Tab.Content className='terms-tabs-content'>
                  {termsData.map((tabData) => (
                    <Tab.Pane key={tabData.id} eventKey={tabData.id}>
                      {tabData.tabs.map((section, index) => (
                        <div key={index} className="mb-4">
                          <h3>{section.title}</h3>
                          <p>{section.content}</p>
                        </div>
                      ))}
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
                </div>
                
            </Container>
        </section>
    );
};

export default TermsPage;