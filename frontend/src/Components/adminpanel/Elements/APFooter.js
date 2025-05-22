import React from 'react'
import { Link } from 'react-router-dom'

const APFooter = () => {
  return (
    <div className="APFooter">
      <p>Designed and Developed by <span><Link to="https://www.logicspice.com/" target='_blank'><img src="/Images/LS-logo.png" className='footerLogo' alt="" /></Link></span></p>
    </div>
  )
}

export default APFooter
