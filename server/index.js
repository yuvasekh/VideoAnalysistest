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
app.post("/upload", upload.single("video"), async (req, res) => {
    try {
        console.log(req.body, req.file)
        const { base64Data, filename } = req.body;

        if (!base64Data || !filename) {
            return res.status(400).json({ error: "Invalid data" });
        }

        const filePath = `uploads/${Date.now()}_${filename}`;
        const buffer = Buffer.from(base64Data, "base64");
        // var response=await analysis(buffer)
        fs.writeFileSync(filePath, buffer);
        res.json({ message: "Video uploaded successfully", filename: base64Data });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.post("/query", async (req, res) => {
    const { question, videoURL } = req.body;
    if (!question && !videoURL) {
        return res.status(400).json({ error: "No question provided" });
    }
    var response = await analysis(question, videoURL)
    // Placeholder AI processing logic
    console.log(response,"yuva")
    const answer = ` "${response}"`;
    res.json({ answer });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//AIzaSyC_yBhja8pLtvI887aE2z32JjA35w4J2Vo

async function analysis(question, url) {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify({
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            
                                "fileData": {
                                  "fileUri": url,
                                  "mimeType": "video/*"
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
                        "text": "You are an Youtube video summariser you need to summarize the video based on user query"
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