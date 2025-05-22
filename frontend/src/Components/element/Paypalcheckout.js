// import React, { useState } from "react";
// import { PayPalButtons } from "@paypal/react-paypal-js";
// import Swal from "sweetalert2";


// const Paypalcheckout = (props) => {
//   const { product } = props;
//   const [paidFor, setPaidFor] = useState(false);
//   const [error, setError] = useState(null);

  

//   const handleApprove = (orderID) => {
//     // call backend to fulfill the order

//     // if response is success
//     setPaidFor(true);

//     // Refresh the users account for subscription status. Below

//     // If the response is error
//     // setError("your payment was processed successfully, however we are unable to fulfill your order. Please contact the support@domain.com");
//   };

//   if (paidFor) {
//     console.log("paid true")
//     // display success message, modal or redirect user to success page.
//     Swal.fire({
//         title: "Thank you for your purchase!",
//         text: "Your plan is activated and you can check it's details in your profle.",
//         icon: "success",
//         confirmButtonText: "Close",
//       });
//   }

//   if (error) {
//     // display an error message, modal or redirewct the user to a error page.
//     Swal.fire({
//         title: "Failed",
//         text: error,
//         icon: "error",
//         confirmButtonText: "Close",
//       });
//   }

//   const paymentButtonClick = async () => {
//     console.log("buttonclicked")
//     // try {
//     //   const response = await axios.post(BaseApi + "/payments/planpurchase",
//     //   planId,{
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       key: ApiKey,
//     //       token: tokenKey,
//     //     },
//     //   })
//     //   if(response.data.status === 200){
//     //     setResponseOnButtonClick(response.data.response);
//     //   }
//     // } catch (error) {
//     //   console.log(error)
//     // }
//   }

//   return (
//     <div>
//       <PayPalButtons
//         style={{
//           color: "silver",
//           layout: "horizontal",
//           height: 48,
//           tagline: false,
//           shape: "pill",
//         }}
        
//         onClick={(data, actions) => {
        
//           paymentButtonClick();
//           // Validate on button click, either on client or server side.
//           const hasAlreadyBoughtPlan = false;

//           if (hasAlreadyBoughtPlan) {
//             setError(
//               "You already have this plan, Go to your profile to view the active plan."
//             );
//             return actions.reject();
//           } else {
//             return actions.resolve();
//           }
          
          
//         }}
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             purchase_units: [
//               {
//                 description: product.description,
//                 amount: {
//                   currency_code: "USD",
//                   value: product.price,
//                 },
//               },
//             ],
//           });
//         }}
//         onApprove={async (data, actions) => {
//           const order = await actions.order.capture();
//           console.log(order, "Order");

//           handleApprove(data.orderID);
//         }}
//         onCancel={() => {
//           // Display the cancel message, modal or redirect the user to the cancel page or back to the cart.
//           alert("Payment cancelled.")
//         }}
//         onError={(err) => {
//           setError(err);
//           console.error("Paypal checkout error", err);
//         }}
//       />
//     </div>
//   );
// };

// export default Paypalcheckout;

// // sandbox personal ac info

// // sb-xlypc27882149@personal.example.com

// // o)2jx,Oe
