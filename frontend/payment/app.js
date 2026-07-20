const express = require('express')
const app = express()
const axios = require('axios')
const bodyparser = require('body-parser')
const env = require('dotenv')
const cors = require('cors')

//PAYSTACK_KEY
// 3FmTVNIcA5pO8LrGz9Zp3JCWQWX_5xxYb1fonEuGpLpq3F538

env.config();

app.use(bodyparser.json())
app.use(express.json())
app.use(cors())
const port = 4000;

app.post('/payments', async (req, res) => {
  const {amount, email} = req.body
  const url = 'https://api.paystack.co/transaction/initialize';

    const response = await axios.post(url, {
      email, 
      amount: amount * 100,
      currency: 'NGN'
    },
     
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
      },
    }
  )
  res.status(200).json(response.data)

});

 app.post('webhook', express.json(), (req, res) => {
  const event = req.body;

  if(event.event === 'Charge.success') {
    console.log(event.data)

    const payment = event.data
  }

  res.status(200).json({success: true})
}) 

app.listen(port, () => {
  console.log(`server is running on port ${port}....`)
})