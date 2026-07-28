import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { fileURLToPath } from 'url'
// Recreate __dirname for ESM

import mongoose from 'mongoose'
import user from './model/user.js';
// import mongodb from './model/schema.js';
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import bordyparser from 'body-parser'
import axios from 'axios'
import multer from 'multer'
import fs from 'fs'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {v2 as cloudinary } from 'cloudinary';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()


const port = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET
const url = process.env.MONGO_URL

 

//app.use(cors())
app.use(cors({ origin: "*",
  methods: ["GET", "POST" , "DELETE"]
 }));
app.use(express.json())
app.use(bordyparser())
 app.use(express.static(path.join(__dirname, 'frontend')))

 //start her sdfyuiopiuytrewrtyuiopoiuytretkjhgf

// 1. CONFIGURE CLOUDINARY
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});
console.log("Cloudinary Configured:", process.env.CLOUD_NAME);

// 2. CONFIGURE MULTER + CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'media_vault',
    resource_type: 'auto', // allows image, video, pdf
  },
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for now
});

// 3. MONGO SCHEMA
const mediaSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  originalname: String,
  type: String,
  size: Number,
  createdAt: { type: Date, default: Date.now }
});
const Media = mongoose.model('Media', mediaSchema);

// 4. CONNECT MONGODB
async function main() {
  try {
    await mongoose.connect(url);
    console.log("atlas connected successfully");
  } catch(err) {
    console.log("MONGO ERROR:", err);
  }
}
main();

// 5. UPLOAD ROUTE
app.post('/upload', upload.array('files', 10), async (req, res) => {
  console.log("ROUTE HIT");
  console.log("Files received:", req.files);
  
  try {
    if(!req.files || req.files.length === 0){
      return res.status(400).json({error: "No files uploaded"});
    }
    
    const docs = req.files.map(file => ({
      url: file.path, // cloudinary url
      public_id: file.filename,
      originalname: file.originalname,
      type: file.mimetype,
      size: file.size,
    }));
    
    await Media.insertMany(docs);
    res.json({ status: 'ok', count: req.files.length, files: docs });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. GET FILES ROUTE - to show in gallery
app.get('/files', async (req, res) => {
  try {
    const files = await Media.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ERROR HANDLER - MUST BE LAST
app.use((err, req, res, next) => {
  console.log("SERVER ERROR:", err);
  res.status(500).json({ error: err.message });
});


// DELETE ONE FILE
app.delete('/delete/:id', async (req, res) => {
  try {
    const file = await Media.findById(req.params.id);
    if(!file) return res.status(404).json({error: "Not found"});
    
    // Delete from cloudinary too
    await cloudinary.uploader.destroy(file.public_id);
    await Media.findByIdAndDelete(req.params.id);
    
    res.json({status: "ok"});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

// DELETE ALL FILES
app.delete('/clear', async (req, res) => {
  try {
    const files = await Media.find();
    for(let file of files) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    await Media.deleteMany({});
    res.json({status: "All files cleared"});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});
 //end here kuytrewrtyuiyutrsdfgufdfguigfd
 

  let token = '';

 let User = '';

  app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'register.html'));
 }) 



 app.post('/change', async (req, res) => {
   console.log(req.body)
   const { token, newPassword } = req.body
    
    if(!newPassword) {
       return res.json({status: 'error', error: 'Invalid password'})

     }  else if(newPassword.length <= 5) {
       return res.json({status: 'error', error: 'password should be at least 6 character'})
    }  

   try{
   const Userr = jwt.verify(token, JWT_SECRET)
    //console.log(Userr)
 
    const password = await bcrypt.hash(newPassword, 10)
   const email = Userr.email
   await user.updateOne(
    { email }, 
          {
             $set:  { password }
          }
   )

    res.json({status: 'ok'})

   }catch(err) {
    console.log(err)
    res.json({ status: 'error', error: 'failed' })
   }
 })
  

 app.post('/login', async (req, res) => {
  console.log(req.body)
  const {name, email, password} = req.body

     User = await user.findOne({email}).lean()
     //console.log(User)
   
   if(!User) {
    return res.json({status: 'error', error: 'Invalid username/password'})
   }
    
    const bcryptcheck = await bcrypt.compare(password, User.password)

   
    if(!bcryptcheck) {  
        return res.json({status: 'error', error: 'invalid password'})
    } 

    token = jwt.sign({ 
        email: User.email, 
        userid: User.name
        }, JWT_SECRET )
   

   res.json({status:'ok', data: token, Name: name })
}) 

 
app.post('/register', async (req, res) => {
   console.log(req.body)
   const {name, email, passwords} = req.body

    if(!name || typeof name !== 'string') {
       return res.send({status: 'error', error: 'Invalid username'})

    } else if(!email) {
       return res.send({status: 'error', error: 'Invalid email'})
    }

     if(!passwords) {
       return res.send({status: 'error', error: 'Invalid password'})
     } 
     if(passwords.length <= 4) {
       return res.send('password should be at least 6 character')
    }


   const password = await bcrypt.hash(passwords, 10)

   try {
   const response = await user.create({
      name,
      email,
      password
    })

    console.log('users created successfully', response)

   } catch(err) {
     if(err.code === 11000) {
       return res.send({status: 'error', error: 'Username already in use'})
     }
     throw err  
   }

   res.json({status:'ok'})
})

  

app.get('/get', (req, res) => {

  res.json({status: 'ok', data: 'Selection', input: 'input'})
})

  
app.post('/create', (req, res) => {
  console.log(req.body)
  const {select} = req.body

  res.json({status: 'ok', data: select, input: 'input'})
})


    

app.post('/payment', async (req, res) => {
  console.log(req.body)
  const { price, email} = req.body

  try{

   const url = 'https://api.paystack.co/transaction/initialize';
  
      const response = await axios.post(url, {
        email, 
        amount: price * 100,
        currency: 'NGN',
        Callback_url: 'https://my-website-r-ay-mo-nd.vercel.app/callback'
        },
       
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
        },
      }
    )
    res.status(200).json(response.data)

  }catch(err) {
   
    console.log(err)
  }   
})


 app.post('webhook', express.json(), (req, res) => {
   const event = req.body;
 
   if(event.event === 'Charge.success') {
     console.log(event.data)
 
     const payment = event.data
   }
 
   res.status(200).json({success: true})
 }) 
 
  app.post('/recover', async (req, res) => {
    console.log(req.body)
    const {email, passwords} = req.body

   const Uuser = await user.findOne({email}).lean()
     console.log(Uuser)
   
   if(!Uuser) {
    return res.json({status: 'error', error: 'Incorrect email / please provide a register email'})
   }  
    
const password = await bcrypt.hash(passwords, 10)

  const emailuser = await user.updateOne(
    { email }, 
          {
             $set:  { password }
          }
   )
   
   res.json({status: 'ok'})
  })

  

  app.listen(port, console.log('server is running on port 8000')
  )
  