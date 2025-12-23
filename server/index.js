const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// 🔹 SendGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection (unchanged)
mongoose
    .connect(
        "mongodb+srv://thahseen:12345@cluster0.vkw0tt7.mongodb.net/passkey?appName=Cluster0"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err.message));

const credentials = mongoose.model("credentials", {}, "bulkmail");

// 🔹 Test route
app.get("/", (req, res) => {
    res.send("BulkMail Server Running");
});

// 🔹 Send email route (SendGrid integrated)
app.post("/sendemail", async (req, res) => {
    const { msg, subject, emailList } = req.body;

    if (!emailList || emailList.length === 0) {
        return res.status(400).send(false);
    }

    try {
        // 🔹 Prepare bulk emails
        const messages = emailList.map((email) => ({
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: "Thahseen | ZapMail App"
            },
            subject: subject,
            text: msg,
        }));

        // 🔹 Send via SendGrid API
        await sgMail.send(messages);

        console.log("All emails sent using SendGrid 🚀");
        res.send(true);
    } catch (error) {
        console.error(
            "SendGrid Error:",
            error.response?.body || error.message
        );
        res.send(false);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

