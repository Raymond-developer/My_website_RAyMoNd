    import {orderArray, savetostorage} from './receive.js'
      //'amazon-images/round-sunglasses-black (1).jpg'
     const product = [{
      id: 'ufddfghjkfjkdfbrertyuutreertyui',
      name: 'photo_2026-07-04_21-16-27.jpg',
      username: 'RAyMoNd',
      about: 'RAyMoNd',
      email: 'Last Active:  5 min ago',
      wel: 'Welcome'
     }, {
      id: 'product/photo_2026-07-04_21-34-22.jpg',
      name: 'photo_2026-07-04_21-34-22.jpg',
      username: 'Projects 8',
      about: 'Projects: 8',
      email: 'Skills: Design, code',
      wel: 'Welcome'
     }, {
      id: 'jhgfddfghjkfdfirertyuutrejxcbrtyui',
      name: 'photo_2026-07-04_21-32-32.jpg',
      username: 'Proclused',
      about: 'Lan 3 Gasferrs',
      email: 'Skills: Design, code',
      wel: 'Welcome'
     }, {
      id: 'dcvddfghjkfdfirertyuhdjdtreertyui',
      name: 'photo_2026-07-04_21-34-40.jpg',
      username: '1Featured',
      about: 'notificions',
      email: 'Member since 2024',
      wel: 'Welcome'
     }, {
      id: 'ertgbfddfghjkfdfirertyuutreertyui',
      name: 'photo_2026-07-04_21-32-33.jpg',
      username: 'Famzy',
      about: 'Education',
      email: 'Ranky 1.2',
      wel: 'Welcome'
     }, {
      id: '4regffddfghjkfdfirerdshbvcdbjhgfutreertyui',
      name: 'photo_2026-07-04_21-34-16.jpg',
      username: 'Trader',
      about: 'Trader',
      email: 'Date Join: 2024',
      wel: 'Welcome'
     }, {
      id: 'jhgfddfghjkfdfirertyuvjhgnbvutrejxcbrtyui',
      name: 'photo_2026-07-04_21-32-31.jpg',
      username: 'Content Official',
      about: 'Selft',
      email: '20 Million Followers',
      wel: 'Welcome'
     }, {
      id: 'hbnddfghjkfdfirertynvcbuutreertyui',
      name: 'photo_2026-07-04_21-34-39.jpg',
      username: ' memerious',
      about: 'notificions',
      email: 'olympic',
      wel: 'Welcome'
     }
    ]

    let htmlproduct = '';

   product.forEach((product) => {
      htmlproduct += `
      <div class="container">
      <img class="img" src="${product.name}">
      <h1 class="name"> ${product.username} </h1>
      <h1 class="name"> ${product.email} </h1>
      <button class="btn" data-bot="${product.id}"> Click </button>
      <h1 class="lastname"> ${product.wel} </h1>
      <h2> Author: RAyMoMd </h2>
      </div>
      `
   })

   document.querySelector('.containerr').innerHTML = htmlproduct;

      
   try{

     document.querySelectorAll('.btn').forEach((button) => {
      button.addEventListener('click', async (btn) => {

        
      const dataset = btn.target.dataset.bot
      const select = product.find(p => p.id === dataset)

     // const input = document.querySelectorAll('.input').value


     const response = await fetch('https://my-project-beta-liard.vercel.app/create', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
         select,
      })
     })
     
      

     const result = await response.json()
      const order = result.data
       orderArray.push(order)
            savetostorage()

     window.location.href="receivep.html"

     })
     })

   }catch(err) {
      console.log(err)
   }
