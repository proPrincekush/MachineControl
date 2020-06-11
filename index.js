const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const app = express();

//// firebase firestore system /////////////////////////////////////////////////////////
var serviceAccount = require("./mailerservice-eac26-firebase-adminsdk-emfg7-80f01c0868.json");
var firebaseAdmin = admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://mailerservice-eac26.firebaseio.com"
})
let database = firebaseAdmin.database();

////// app code  ////////////////////////////////////////////////////////////////////////////////////////

app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs");
app.use(express.static("public"));
app.set("views",__dirname+"/public");
app.use(bodyparser.json())




app.get("/",function(req,res){
    // res.send("node server working...");
    // res.sendFile(__dirname+"/test.html");
    var otpBox = "hidden";
    var idBox = "visible";
    var route =  "/mail"
    res.render("home.ejs",{otpBox:otpBox,route:route,idBox:idBox});
})


let userOtp ;
let globalData;
var machine;
app.post("/mail",function(req,res){
        
        const machineId = req.body.machine;
            machine =machineId;
        console.log(req.body.machine);
        data(machineId); /////   1
        var otpBox = "visible";
        var idBox = "hidden";
        var route =  "/otpCheck"
        res.render("home.ejs",{otpBox:otpBox,route:route,idBox:idBox});
        
        
})

app.post("/otpCheck",function(req,res){
    var EmailOtp = req.body.otp;
    if(userOtp==EmailOtp){
        res.render("user.ejs",{data:globalData})
    }
    else{
        res.send("Sorry! you are not Authorized for this machine.")
    }
})

app.post("/machineOn",function(req,res){
    // if(globalData.state=="off")
    // {
        let restRef =database.ref("/"+machine);
        restRef.update({state:"on"});
        restRef.once("value",function(snapshot){
        
    res.render("user.ejs",{data:snapshot.val()})
        })
    // }
    
    
})

app.post("/machineOff",function(req,res){
    
        let restRef =database.ref("/"+machine);
        restRef.update({state:"off"});
        restRef.once("value",function(snapshot){
        
    res.render("user.ejs",{data:snapshot.val()})
        })
    
    
})








  function data (machine) {
    let restRef=database.ref("/"+machine);

    restRef.once("value",function(snapshot){
        console.log(snapshot.val());
        let RestNames = snapshot.val();
        globalData = snapshot.val();
        if(!RestNames){
            RestNames={}
        }

        console.log(globalData.user);
        mailer(globalData.user);
        
    })
}


function mailer(mailAdd) {
    var transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: "simpleMailService2@gmail.com",
            pass:"#Simple@mail+"
        }
    });
    userOtp = Math.floor(Math.random(10)*1000000);
    console.log(userOtp);
        
        
        
    var mailOptions={
        from:"princetechspacer@gmail.com",
        to:mailAdd,
        subject:"testing mail",
        text:"your otp is "+userOtp+" . please enter the otp in form."
    };

    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err);   
        }
        else{
            console.log("email sent"+info.response);  
        }
    })
}


















app.listen(3000,function(){
    console.log("server started at port 3000");
    
})
