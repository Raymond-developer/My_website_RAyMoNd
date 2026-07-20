        /*export const array = []

         export const orderray = []

         //console.log(array);

        
         export const orderArray = JSON.parse(localStorage.getItem('orders')) || [];

         //JSON.parse(localStorage.getItem('orders')) ||

         console.log(orderArray);
    
          
        

       export function saveToStorage () {
         localStorage.setItem('orders', JSON.stringify(orderArray));
      };

       const product = [{
        productID: 'jkeur67ry8r4-fjrhu467-crbt464j3-ehuey76r4563',
        image: 'amazon-images/black-2-slot-toaster.jpg',
        name: '2 Slot Toaster - Black Orders available in pairs',
        
       }]
      let html = '';

          product.forEach((order) => {
          
          html += `
            <div class="div-three"> Order ID:
          <div class="font-weight"> jkeur67ry8r4-fjrhu467-crbt464j3-ehuey76r4563 </div> 
         </div>
          <div class="div-two"> Total: $${orderray} </div>
          <div class="div-one"> Order placed : april 19 </div>
          `;
        })
          try{
           document.querySelector('.js-id-div').innerHTML = html;
          }catch(error) {

          }
      

      let matching;
      function calculate () {}
      
       
       let pphtml = '';
      
      
      orderArray.forEach((product) => {
        const quantity = matching
         pphtml += `
        <div class="div-div1 js-order-html">
        <div class="class-package"> <p class="pe-class js-class">Tracking Package</p> </div> 
        <div class="position-re">
        <div class="class-div"> ${product.name} </div>
         <div class="class-class"> Delivered on: april 22</div>

       <span style="font-size: 24px; font-weight: 600;"> quantity:
       <span class="class-class js-quan-${product.id}"> ${product.quantity} </span> 
       </span>

          <div class="bot-bot">
             <span class="many-div"> <img class="buy-again" src="buy-again.png"> </span>
              <span class="div-but js-buyagain" data-id="${product.id}"> Buy it again </span> 
            </div> 
       </div>
      <img class="image-div1" src="${product.image}"> 
    
      </div>
         ` 
      })
      

      try {
       document.querySelector('.js-product').innerHTML = pphtml;

      } catch(error) {
        console.log('yoooo.....theres an error')
      }

    
      
      document.querySelectorAll('.js-buyagain')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const productID = button.dataset.id;
          console.log(productID)
  
          orderArray.forEach((order) => {
            if(productID === order.id ) {
            order.quantity += 1
            console.log(order.quantity)
            saveToStorage();  
            
          try{  
        document.querySelector(`.js-quan-${order.id}`).innerHTML = order.quantity;
       }catch (err) {
        console.log(err)
       }
      
      }
    })
 })
})
   */   