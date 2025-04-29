const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
var bodyParser = require('body-parser')
const axios = require('axios')
const app = express();
const port = 5000;
const multer = require("multer");
const { rejects } = require("assert");
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
app.use(cors());
app.use(express.json({ limit: "150mb" })); // Increase limit for large files
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// Upload Base64 Video

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


async function analysis(question, base64Data) {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify({
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "inlineData": {
                                "mimeType": "video/mp4",
                                "data": base64Data

                            }
                        },
                        {
                            "text": question
                        },
                    ]
                }
            ],
            "systemInstruction": {
                "role": "user",
                "parts": [
                    {
                        "text": "You are Video assistant to answrr the user queries If it's a greeting greet him if it is related to video answer based on the given video"
                    }
                ]
            },
            "generationConfig": {
                "temperature": 1,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 8192,
                "responseMimeType": "text/plain"
            }
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC_yBhja8pLtvI887aE2z32JjA35w4J2Vo',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data?.candidates[0]?.content.parts[0]?.text)
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    })





}