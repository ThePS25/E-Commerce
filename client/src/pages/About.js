import React from 'react'
import Layout from '../components/Layout/Layout'

const About = () => {
  return (
    <Layout title={'About Us - ZooPHii.com'}>
      <div className="row contactus">
        <div className="col-md-6">
          <img src="/images/aboutus.png" className="img-abt" alt="About Us" style= {{ width : "75%" }} />
        </div>
        <div className="col-md-5" style={{ padding: '50px 0 0 0' }}>
          <h1 className='bg-dark p-2 text-white text-center'>ABOUT US</h1>
          <p className="text-justify">
              At Zophii.com, we are passionate about providing top-quality pet supplies for your beloved furry friends. As pet owners ourselves, we understand the importance of keeping your pets happy, healthy, and well-cared for.
           
              Our mission is to offer a wide range of high-quality pet products that cater to the unique needs of different pets, including dogs, cats, birds, and small animals. We carefully select each product in our inventory, ensuring that they meet our rigorous standards for safety, durability, and functionality.
            </p>
            <p className="text-justify">
              With Zophii.com, you can conveniently browse through our extensive collection of pet supplies, including food, treats, toys, grooming essentials, and more. We strive to provide a seamless shopping experience, with user-friendly navigation, secure payment options, and fast shipping.
            </p>
            <p className="text-justify">
              Our team of pet enthusiasts is always ready to assist you with any questions or concerns you may have. We are dedicated to building a strong relationship with our customers, ensuring their satisfaction and their pets' well-being.
            </p>
            <p className="text-justify">
              Thank you for choosing Zophii.com as your trusted source for premium pet supplies. We look forward to serving you and your furry companions!
            </p>
          {/* <p className='mt-3'>
            <GrMail /> Email: contact@example.com
          </p>
          <p className='mt-3'>
            <BsFillTelephoneFill /> Phone: +1234567890
          </p>
          <p className='mt-3'>
            <GiRotaryPhone /> Toll Free: 1800-123-4567
          </p> */}
        </div>
      </div>
    </Layout>
  )
}

export default About
