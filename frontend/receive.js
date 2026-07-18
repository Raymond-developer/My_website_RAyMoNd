   
  
    export const orderArray = JSON.parse(localStorage.getItem('orders'))  || []
   
    export function savetostorage() {
      localStorage.setItem('orders', JSON.stringify(orderArray))
     }
     
      function render() {

      let htmlproduct = '';
      
      orderArray.forEach((product) => {
      htmlproduct += `
      <div class="container">
         <div class="dis1">
             <img class="img" src="${product.name}">
          <h2 class="hh2"> ${product.about} </h2>
         </div>
       
         <div class="dis2">
       <h2 class="firstname"> ${product.username} </h2>
       <h2 class="name"> ${product.email} </h2>
       <span> <button class="delete" data-id="${product.id}"> delete </button> </span>
      <span> <button class="edit" data-id="${product.id}"> Update  </button> </span>
      </div>

      <div class="dis3">
      <h2 class="up"> Update input </h2> 
      <h2 class="h3"> ${product.wel} </h2> 
      <input type="text" class="input" data-id="${product.id} value="${product.wel}" placeholder="Update input" required>
      </div>
     
      </div>
      `
   

   document.querySelector('.containerr').innerHTML = htmlproduct ;
   
   
    document.querySelectorAll('.edit').forEach((btn) => {
      btn.addEventListener('click', () => {
      const id = btn.dataset.id
      // console.log(id)
     const input =  document.querySelectorAll('.input').forEach((input) => {
       const inputValue = input.value

       if(inputValue === '') {
          console.log('empty')
       } else {
        console.log(inputValue)
        const item = orderArray.find(p => p.id === id)
      
        item.wel = inputValue
        savetostorage()
         render() 
       
       } }) })  })  
      
      document.querySelectorAll('.delete').forEach((btn) => {
         btn.addEventListener('click', () => {
           const id = btn.dataset.id

        orderArray = orderArray.filter(product => product.id !== id)

         savetostorage()
            render()
         })

      })
      
      }) }
        
       render()
  
   
