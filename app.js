import express from 'express'
import { fileURLToPath } from 'url'
// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
import mongoose from 'mongoose'
import user from './model/user.js';
// import mongodb from './model/schema.js';
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import bordyparser from 'body-parser'
import dotenv from 'dotenv'
import axios from 'axios'
import multer from 'multer'
import fs from 'fs'
dotenv.config()

const port = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET
const url = process.env.MONGO_URL

 async function main() {
  try{
      await mongoose.connect(url)
      console.log("atlas connected successfully")

  }catch(err){
    console.log('err')
     console.log(err)
  }
} 
main()

app.use(cors())
app.use(express.json())
app.use(bordyparser())

 app.use(express.static(path.join(__dirname, 'frontend')))

 //start her sdfyuiopiuytrewrtyuiopoiuytretyui

app.use('/uploads', express.static('uploads')); // serve files


// 2. Media Schema
const mediaSchema = new mongoose.Schema({
    filename: { type: String, required: true }, // saved name on server
    originalname: { type: String, required: true }, // original name
    type: { type: String, required: true }, // image/video
    size: Number,
    createdAt: { type: Date, default: Date.now }
});
const Media = mongoose.model('Media', mediaSchema);

// 3. Create uploads folder
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// 4. Multer config
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images and videos allowed'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// 5. Routes
// Upload
app.post('/upload', upload.array('files', 10), async (req, res) => {
    try {
        const files = req.files;
        const docs = files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            type: file.mimetype,
            size: file.size
        }));
        await Media.insertMany(docs);
        res.json({ status: 'ok', count: files.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all files
app.get('/files', async (req, res) => {
    try {
        const files = await Media.find().sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete file
app.delete('/delete/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (media) {
            // delete from disk
            fs.unlink(path.join('uploads', media.filename), (err) => {
                if (err) console.log("File delete error:", err);
            });
            // delete from DB
            await Media.findByIdAndDelete(req.params.id);
        }
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clear all
app.delete('/clear', async (req, res) => {
    try {
        const allFiles = await Media.find();
        allFiles.forEach(file => {
            fs.unlink(path.join('uploads', file.filename), (err) => {
                if (err) console.log("File delete error:", err);
            });
        });
        await Media.deleteMany({});
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
  