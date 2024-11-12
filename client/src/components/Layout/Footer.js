import React from 'react'
import {Link} from "react-router-dom";


const Footer = () => {
  return (
    <div className="footer">
      <h4 className='text-center'>All rights reserved ©Pratyush </h4>
      <p className = "text-center mt-3">
        <Link to ="/about">About</Link> 
        &nbsp;|&nbsp;
        <Link to ="/contact">Contact</Link>
        &nbsp; |&nbsp;
        <Link to ="/policy">Policy</Link> 


      </p>
    </div>
  )
}

export default Footer
