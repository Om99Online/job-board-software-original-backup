import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Success = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const url = window.location.href;

    if (url.includes("succeeded")) {
      setMessage("Payment succeeded!");
    }
    if (url.includes("processing")) {
      setMessage("Your payment is processing.");
    }
    if (url.includes("requires_payment_method")) {
      setMessage("Your payment was not successful, please try again.");
    } else {
      setMessage("Something went wrong.");
    }
  }, []);
  return (
    <div>
      Success {message}
      <Link to="/candidates/myaccount">My profile</Link>
    </div>
  )
}

export default Success
