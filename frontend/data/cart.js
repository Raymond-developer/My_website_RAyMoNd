export let Cart = JSON.parse(localStorage.getItem('Cart'));

  if (!Cart) {
      Cart = [{
        productId: 'rhrhur784754u-jkvh674784-kghg7t4y-4784764g',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: 'uifg46764-hr46464g-jfg4rt764r-hfgytr4t7r4',
        quantity: 1,
        deliveryOptionId: '2'
      }];
   }
    


 function saveToStorage() {
   localStorage.setItem('Cart', JSON.stringify(Cart));
 }



 export function addToCart (productId) {
    let matchingItem;

       Cart.forEach((cartItem) => {
        if(productId === cartItem.productId) {
           matchingItem = cartItem;
        }
       });

       if (matchingItem) {
         matchingItem.quantity += 1
       } else {
         Cart.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
       });
       };
       saveToStorage();
  };


   export function removeFromCart (productId) {
         const newCart = [];
         
         Cart.forEach((cartItem) => {
           if(cartItem.productId !== productId) {
             newCart.push(cartItem)
           }
         });
         Cart = newCart;
         saveToStorage();
      }; 

       export function updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        Cart.forEach((cartItem) => {
        if(productId === cartItem.productId) {
           matchingItem = cartItem;
        }
       });

       matchingItem.deliveryOptionId = deliveryOptionId;
       saveToStorage();
      }