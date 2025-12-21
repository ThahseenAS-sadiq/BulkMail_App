const express = require("express");
const cors = require("cors");
// Install nodemailer package before running this code: npm install nodemailer
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://thahseen:12345@cluster0.vkw0tt7.mongodb.net/passkey?appName=Cluster0").then(function () {
    console.log("Connected to MongoDB");
}).catch(function (err) {
    console.log("Error connecting to MongoDB: " + err.message);
});

const credentials = mongoose.model("credentials", {}, "bulkmail");


app.post("/sendemail", (req, res) => {
    var msg = req.body?.msg;
    var subject = req.body?.subject;
    var emailList = req.body?.emailList;

    credentials.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: "thahseen.sadiqas@gmail.com",
                        to: emailList[i],
                        subject: subject,
                        text: msg,
                    });
                    console.log("Email sent to: " + emailList[i]);
                }
                resolve("All emails sent successfully!");
            } catch (error) {
                reject("Error sending emails: " + error.message);
            }
        }).then(function () {
            res.send(true);
        }).catch(function () {
            res.send(false);
        });
    }).catch(function (err) {
        console.log(err.message);
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
