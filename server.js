const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const shortid = require('shortid');
const  validUrl = require('valid-url');
const mongoose = require('mongoose');
require('dotenv').config();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const Schema = mongoose.Schema;

const urlSchema = new Schema({
   original_url: String,
   short_url: String,
});
const URL = mongoose.model('URL',urlSchema);

 
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// // Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post("/api/shorturl",(req,res) =>{
  let url = req.body.url; 
  let shortId = shortid.generate();
  if(!validUrl.isWebUri(url)){
    res.json({
      error:"Invalid url"
    })
  }else{
  
      let findUrl = URL.findOne({ original_url : url },(err,data)=>{
        
         if(!data){
           
             findUrl= new URL({original_url : url , 
               short_url: shortId })
               findUrl.save()
           res.json({ original_url : url,                     short_url: shortId})
         }else if(data.original_url){
           console.log("shor",data.original_url)
           console.log("yes exist")
             res.json({original_url : data.original_url,           short_url: data.short_url})
         }  
        else{
         return console.log(err)
          
        }
      
      })
    
  
  }

})
// app.get("/api/shorturl/:short_url",async(req,res)=>{
//   let shortUrl = req.params.short_url;
  
//   const url = await URL.findOne({short_url : shortUrl},(err,data) => {
 
//    if (data.short_url) {
//     res.redirect(url.original_url);
//   } else {
//     console.log(err)
//     res.json({ error: 'invalid URL' });
//   }
// })
  
// })
app.get('/api/shorturl/:short_url',async (req, res) => {
  let shorturl = req.params.short_url
 const shortUrl = await URL.findOne({
   short_url: shorturl,
 });
 if (shortUrl) {
   return res.redirect(shortUrl.original_url);
 }

else {
 console.log("err");
 
}
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
