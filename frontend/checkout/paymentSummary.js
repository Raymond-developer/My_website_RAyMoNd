 import { Cart } from "../data/cart.js";
 import { getProduct } from "../scripts/amazon.js";
 import { getDeliveryOption } from "../data/deliveryOptions.js";
 //import { orderArray, saveToStorage, array, orderray } from "../scripts/orders.js";

 
 export function renderPaymentSummary() {
  let totalCents = '';
  let productPriceCents = 0;
  let shippingPriceCents = 0;

   Cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
   productPriceCents += product.pricecents * cartItem.quantity;

   const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
   shippingPriceCents += deliveryOption.priceCents

   });

   const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
   const taxCents = totalBeforeTaxCents * 0.1;
   
   totalCents = totalBeforeTaxCents + taxCents;


   const paymentSummaryHTML = `
         <div class="order-margin">
            <div class="order-strong"> Order Summary</div>
          </div>

           <div class="order-margin">  <span class="order-1">items (3): </span>  <span> $${(productPriceCents / 100).toFixed(2)}</span>
           </div>     

           <div class="order-margin"> <span class="order-2"> Shipping & handling </span> <span> $${(shippingPriceCents / 100).toFixed(2)}</span>
           </div>

            <div class="order-margin">
              <span class="order-3"> Total before tax </span> <span> $${(totalBeforeTaxCents / 100).toFixed(2)}</span>
            </div>

             <div class="order-margin">
               <span class="order-4"> Estimated tax (10%):</span> <span> $${(taxCents / 100).toFixed(2)}</span>
             </div>

          <div>_______________________________________</div>
           
           <div class="total-amount">
              <span> <strong class="order-5">Order total:</strong> </span> <span> <strong> $${(totalCents / 100).toFixed(2)} </strong> </span>
           </div>
            
           <button class="place-order js-place-order"> pay now </button>
   `;

  
    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;


    document.querySelector('.js-place-order').addEventListener('click', async () => {
      //http://localhost:7000
      //https://my-project-three-psi-85.vercel.app
      const response = await fetch('https://my-project-three-psi-85.vercel.app/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "limax4644@gmail.com",
          price: totalCents 
        })
      })

      const payment = await response.json();
      console.log(payment)
      window.location.href = payment.data.authorization_url
    })
     
   
}

renderPaymentSummary();

  
 

  
