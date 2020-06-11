const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const app = express();

//// firebase firestore system /////////////////////////////////////////////////////////
var serviceAccount = require("./iotp-692b6-firebase-adminsdk-f09eb-ad06b9590d.json");
var firebaseAdmin = admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://iotp-692b6.firebaseio.com"
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
app.post("/mail",function(req,res){
  
        const mailAdd = req.body.Email;
        console.log(mailAdd);
        console.log(req.body.machine);
        data(req.body.machine);
        // console.log(globalData); 
        mailer(mailAdd); //send the mail
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


var globalData;
function data(machine) {
    let restRef=database.ref("/"+machine);

    restRef.once("value",function(snapshot){
        console.log(snapshot.val());
        let RestNames = snapshot.val();
        globalData = snapshot.val();
        if(!RestNames){
            RestNames={}
        }

        console.log(globalData);
      
        return true;
    })
}


function mailer(mailAdd) {
    var transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: "princetechspacer@gmail.com",
            pass:""
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
