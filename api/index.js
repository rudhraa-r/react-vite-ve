const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const CreateExb = require('./models/create-ex.js');
const CreateStall = require('./models/stall.js');
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const fs = require('fs');
const mime = require('mime-types');


require('dotenv').config()
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'skdgnoerig';
const bucket = 'virtual-exhibition-app';

app.use(express.json());
app.use(cookieParser()) ;
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin:'https://react-vite-ve-git-main-rudhraas-projects.vercel.app',
}));




async function uploadtoS3(path , originalFilename, mimetype){
    const client = new S3Client({
        region: 'eu-north-1',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });

    const parts = originalFilename.split('.');
    const ext = parts[parts.length -1];
    const newFilename = Date.now() + '.' + ext;
     await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read'
    }))
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}
  
app.get('/api/test', (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    res.json('test ok');
})   

app.post('/api/register', async(req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
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

app.post('/api/login', async(req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
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

app.get('/api/profile' , (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
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

app.post('/api/logout' , (req, res) =>{
    res.cookie('token', '').json(true);       
})              

app.post('/api/create-exb', (req, res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {title , description ,coverphoto, datefrom , dateto} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err ;
            
            const createDoc = await CreateExb.create({
                owner: userData.id,
                title, description ,coverphoto, datefrom , dateto
            });
            res.json(createDoc);  
        })  
           
})     

app.get('/api/create', (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData ;
        res.json(await CreateExb.find({owner:id}) )
    })

});

app.get('/api/exhibitions/:id', async(req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
        const {id} = req.params ;
        res.json(await CreateExb.find({owner:id}) )

});

app.get('/api/create/:id' , async (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    res.json(await CreateExb.findById(id));
})


app.put('/api/create-exb', async(req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const { id, title, description,coverphoto, datefrom, dateto} = req.body;
    const exbDoc = await CreateExb.findById(id);
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(userData.id === exbDoc.owner.toString()){
            exbDoc.set({
                title, description,coverphoto, datefrom, dateto,
            });
            await exbDoc.save();    
            res.json('ok');   
        } 

    })

})

  
app.get('/api/stall/:stallId' , async (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {stallId} = req.params;
    res.json(await CreateStall.findById(stallId));  
}) ;  
 
app.post('/api/upload-by-link', async (req, res) =>{
    const {link} = req.body;
    const newName = 'photo'+ Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: '/tmp/'+ newName ,
    });
    const url = await uploadtoS3('/tmp/'+ newName, newName,mime.lookup('/tmp/'+ newName))
    res.json(url);
} )

const photosMiddleware = multer({dest:'/tmp'});
app.post('/api/upload', photosMiddleware.array('photos', 100) ,async (req, res) =>{
    const uploadedFiles = [];
    for(let i=0 ; i<req.files.length ; i++) {
        const {path, originalname, mimetype} = req.files[i];
        const url = await uploadtoS3(path , originalname, mimetype);
        uploadedFiles.push(url);
    }
    res.json(uploadedFiles); 
}) 

app.post('/api/uploadcover', photosMiddleware.single('coverphoto') ,async (req, res) =>{
    const {path, originalname, mimetype} = req.file;
    const uploadedFile= await uploadtoS3(path , originalname, mimetype);
    res.json(uploadedFile);
})   

app.post('/api/stall', (req, res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {name,addedPhotos,exhibitionId, } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err ;
            const createStallDoc = await CreateStall.create({
                owner:userData.id,
                name, 
                photos: addedPhotos,
                exhibition: exhibitionId,
            });
            res.json(createStallDoc);
        })  
    
})
   
app.get('/api/stall/:exhibitionId', (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const { exhibitionId } = req.params;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData ;
        res.json(await CreateStall.find({owner:id, exhibition: exhibitionId}) )
    }) 

});    

app.get('/api/stalls/:exhibitionId', async (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const { exhibitionId } = req.params;
        res.json(await CreateStall.find({exhibition: exhibitionId}) )
});    

app.get('/api/exb/stalls', async (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    res.json(await CreateStall.find());
}) 

app.get('/api/create/:exbTitle/:stallId' , async (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {stallId} = req.params;
    res.json(await CreateStall.findById(stallId));  
}) 

 


app.put('/api/stall', async(req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies; 
    const { stallId, name, addedPhotos,exhibitionId} = req.body;
    const StallDoc = await CreateStall.findById(stallId);
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(userData.id === StallDoc.owner.toString()){
            StallDoc.set({
                name, 
                photos:addedPhotos,
                exhibition: exhibitionId,
            });
            await StallDoc.save();       
            res.json('ok');            
        } 
            
    })

})

app.get('/api/exhibitions' , async (req, res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const exbs = await CreateExb.find();
    res.json(exbs);  
})
app.get('/api/exhibition/:id', async(req, res) =>{
    const {id} = req.params;
    res.json(await CreateExb.findById(id));
})

app.delete('/api/stalls/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    try {
        const { id } = req.params;
        await CreateStall.findByIdAndDelete(id);
        res.status(200).send({ message: 'Stall deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete stall' });
    }
});     

                
   
app.listen(4000);      