import React from 'react';
import { BsFillTelephoneFill} from 'react-icons/bs';
import {GrMail } from 'react-icons/gr';
import {GiRotaryPhone } from 'react-icons/gi';
import Layout from './../components/Layout/Layout';

const Contact = () => {
  return (
    <Layout title={'Contact Us - ZooPHii.com'}>
      <div className="row contactus">
        <div className="col-md-6">
          <img src="/images/contactus.png" className="img-con" alt="Contact Us" style= {{ width : "75%" }} />
        </div>
        <div className="col-md-4">
          <h1 className='bg-dark p-2 text-white text-center'>CONTACT US</h1>
          <p className = " text-justify mt-2">
            Query?? Feel free to contact us any time.
          </p>
          <p className='mt-3'>
            <GrMail /> Email: contact@example.com
          </p>
          <p className='mt-3'>
            <BsFillTelephoneFill /> Phone: +1234567890
          </p>
          <p className='mt-3'>
            <GiRotaryPhone /> Toll Free: 1800-123-4567
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;