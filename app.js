const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();
app.use(express.urlencoded({extended:true}));
/*==========Static Files to use CSS==========*/
app.use(express.static(__dirname + '/'));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
})

/*==============================MAILCHIMP COMFIG======================================*/
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
     apiKey: "6832b2967db54edcc9973380bca2c8d1-us8",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
     server: "us8"
});

app.post("/", function(req, res){
    const fName = req.body.firstname;
    const lName = req.body.lastname;
    const email = req.body.email;
    const listID = '2b46142a21';
    /*==========Uploading the data to the server=========*/
    async function run() {
        try{
            const response = await mailchimp.lists.addListMember(listID, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                FNAME: fName,
                LNAME: lName
                }
            });
            /*==========Uploading different HTML Thank You File=========*/
            res.sendFile(__dirname + "/success.html")
            console.log("Successfully added contact as an audience member.");
        }
        catch(err){
        /* So the catch statement is executed when there is an error so if anything goes wrong 
        the code in the catch code is executed. In the catch block we're sending back the failure 
        page. This means if anything goes wrong send the faliure page */
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html");
        }
    };
    run();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server running at local host 3000");
})
