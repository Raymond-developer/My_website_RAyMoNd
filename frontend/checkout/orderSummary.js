import { Cart, removeFromCart, updateDeliveryOption } from "../data/cart.js";
import { products } from "../scripts/amazon.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../data/deliveryOptions.js";
import { getProduct } from "../scripts/amazon.js";
import {renderPaymentSummary} from './paymentSummary.js';

export function renderOrderSummary() {

let cartSummaryHTML = '';

Cart.forEach((cartItem) => {
 const productId = cartItem.productId;

 const matchingProduct = getProduct(productId);

 
  const deliveryOptionId = cartItem.deliveryOptionId;

  const deliveryOption = getDeliveryOption(deliveryOptionId);

 

   const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'Days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

    cartSummaryHTML +=   `
       <div class="double-dot js-cart-cart-item-container-${matchingProduct.id}">
           <div class="cart-item">
          <p class="paragraph-pp"> <strong> Delivery date: ${dateString} </strong> </p>

          <div class="div-height">
          <img class="images-order" src="${matchingProduct.image}">
          </div>
            
          <div class="name-price">
           <div class="item-name"> ${matchingProduct.name}
           </div>
           <div class="price-cents">$${(matchingProduct.pricecents / 100).toFixed(2)} </div>
           <div>
            <span>Quantity: ${cartItem.quantity} </span>
            <span class="update-delete">Update</span>
           <span class="update-delete js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
           </div>
          </div>
        </div>
          
            <div class="right-item">
              <div class="delivery-date"><strong class="">Choose a delivery option:</strong></div>
             ${deliveryOptionHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
  `;
});

 function deliveryOptionHTML (matchingProduct, cartItem) {

   let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'Days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCents === 0
      ? 'FREE -'
      : `${(deliveryOption.priceCents / 100).toFixed(2)} -`;

       const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `  
        <div class="last-di js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <div class="date-class"> ${dateString} </div>
          <div class="price-class"> <input class="input-class" type="radio" ${isChecked ? 'Checked' : ''} name="delivery-${matchingProduct.id}"> $${priceString} Shipping</div>
          </div> 
         
       `;
    });
    return html;
 } 

 document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

 document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      removeFromCart(productId); 
      renderPaymentSummary();

    const container =  document.querySelector(`.js-cart-cart-item-container-${productId}`);
    container.remove();
    });
 });

 document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      //const {productId, deliveryOptionId} = element.dataset;
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
 });
 };
 
  