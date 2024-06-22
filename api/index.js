const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const CreateExb = require('./models/create-ex.js');
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'skdgnoerig';

app.use(express.json());
app.use(cookieParser()) ;
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin:'http://localhost:5173',
}));


mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) =>{
    res.json('test ok');
})

app.post('/register', async(req, res) =>{
    const {name , email , password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email, 
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e)
    }

    
})

app.post('/login', async(req, res) =>{
    const {email , password} = req.body;
   const userDoc= await User.findOne({email})
   if(userDoc){
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if(passOk){
        jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err , token) =>{
            if(err) throw err ;
            res.cookie('token', token).json(userDoc)
        })
        
    }else{
        res.status(422).json('pass not ok')
    }
   } else {
    res.json('Not Found')
   }
})

app.get('/profile' , (req, res) =>{
    const {token} = req.cookies;
    
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error("Token verification error:", err); // Debug log
                return res.status(401).json({ error: "Token verification failed" });
            }

            try {
                const userDoc = await User.findById(userData.id);
                if (!userDoc) {
                    return res.status(404).json({ error: "User not found" });
                }

                const { name, email, _id } = userDoc;
                res.json({ name, email, _id });
            } catch (error) {
                console.error("Database error:", error); // Debug log
                res.status(500).json({ error: "Internal server error" });
            }
        });
    } else {
        res.json(null);
        
    }
    /*if(token) {
        jwt.verify(token , jwtSecret, {}, (err, userData) =>{
            if(err) throw err;
            const {name , email , _id} = User.findById(userData._id);
            res.json({name , email , _id});
        } );
    } else {
        res.json(null);
    }
    */
})

app.post('/logout' , (req, res) =>{
    res.cookie('token', '').json(true);
})

app.post('/create-exb', (req, res)=>{
    const {token} = req.cookies;
    const {title , description , datefrom , dateto} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err ;
            
            const createDoc = await CreateExb.create({
                owner: userData.id,
                title, description , datefrom , dateto
            });
            res.json(createDoc);
        })  
    
})

app.get('/create', (req, res) =>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData ;
        res.json(await CreateExb.find({owner:id}) )
    })

});

 
app.post('/upload-by-link', async (req, res) =>{
    const {link} = req.body;
    const newName = 'photo'+ Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/'+ newName ,
    });
    res.json(newName);
} )

app.listen(4000);