const express = require("express");
const admin = require("firebase-admin");

const app = express();

var serviceAccount = require("./iotp-692b6-firebase-adminsdk-f09eb-ad06b9590d.json");
var firebaseAdmin = admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://iotp-692b6.firebaseio.com"
})
let database = firebaseAdmin.database();


////// app code  ////////////////////////////////////////////////////////////////////////////////////////






app.get("/",function(req,res){
    // res.send("node server working...");
    res.sendFile(__dirname+"/test.html");
})

app.post("/getdata",function(req,res){
    let restRef=database.ref("/machine1");

    restRef.once("value",function(snapshot){
        console.log(snapshot.val());
        let RestNames = snapshot.val();
        if(!RestNames){
            RestNames={}
        }
        res.render("home.ejs",{rest :RestNames})

       
    })
})

app.listen(3000,function(){
    console.log("server started at port 3000");
    
})