const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
var bodyParser = require('body-parser')
const axios = require('axios');
const { data } = require("autoprefixer");
const { rejects } = require("assert");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json({ limit: "150mb" })); // Increase limit for large files
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Upload Base64 Video  
app.get('/hello', (req, res) => {
    res.send("hello")
})

app.post('/addinstance', (req, res) => {
    const { instanceUrl, accesskey } = req.body;

    if (!instanceUrl || !accesskey) {
        return res.status(400).json({ message: "instanceUrl and accesskey are required" });
    }

    const newInstance = {
        instanceUrl,
        accesskey
    };

    const filePath = path.join(__dirname, 'instances.json');

    // Read the existing file, or create a new one
    fs.readFile(filePath, 'utf8', (err, data) => {
        let instances = [];
        if (!err && data) {
            instances = JSON.parse(data);
        }

        instances.push(newInstance);

        fs.writeFile(filePath, JSON.stringify(instances, null, 2), (err) => {
            if (err) {
                console.error('Error writing file', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.json({ message: 'Instance added successfully' });
        });
    });
});

app.get('/listobjects', (req, res) => {
    return new Promise(async (resolve, reject) => {

        let Instance = await readInstance()
        console.log(Instance, "yuva")
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://demo-wigmore.gainsightcloud.com/v1/api/describe/listobjects',
            headers: {
                'accesskey': 'a6b3e564-2f86-4b0c-aa1d-137203b7640c',
                'Content-Type': 'application/json'
            }
        };

        axios.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                res.send(response.data)
            })
            .catch((error) => {
                console.log(error);
                res.send(error)
            });


    })
}
)
app.get('/instances', (req, res) => {
    const filePath = path.join(__dirname, 'instances.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        let instances = [];
        if (data) {
            try {
                instances = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON', parseErr);
                return res.status(500).json({ message: 'Error parsing instances.json' });
            }
        }

        res.json(instances);
    });
});

// app.get('/listfields', (req, res) => {
//     return new Promise((resolve, reject) => {
//         let config = {
//             method: 'get',
//             maxBodyLength: Infinity,
//             url: 'https://demo-wigmore.gainsightcloud.com/v1/api/describe/listobjects',
//             headers: {
//                 'accesskey': 'a6b3e564-2f86-4b0c-aa1d-137203b7640c',
//                 'Content-Type': 'application/json'
//             }
//         };

//         axios.request(config)
//             .then((response) => {
//                 console.log(JSON.stringify(response.data));
//                 resolve(response.data)
//             })
//             .catch((error) => {
//                 console.log(error);
//                 reject(error)
//             });


//     })
// }
// )

app.get('/listfields', (req, res) => {
    let fieldDBName = req.query.objectName
    return new Promise((resolve, reject) => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://demo-wigmore.gainsightcloud.com/v1/meta/services/objects/${fieldDBName}/describe?ic=true&idd=true`,
            headers: {
                'AccessKey': 'a6b3e564-2f86-4b0c-aa1d-137203b7640c',
                'Content-Type': 'application/json'
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res.send(response.data)
            })
            .catch((error) => {
                res.send(error)
            });


    })
}
)
async function fetchFields(objectName) {
    let fieldDBName = objectName
    return new Promise((resolve, reject) => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://demo-wigmore.gainsightcloud.com/v1/meta/services/objects/${fieldDBName}/describe?ic=true&idd=true`,
            headers: {
                'AccessKey': 'a6b3e564-2f86-4b0c-aa1d-137203b7640c',
                'Content-Type': 'application/json'
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            });


    })
}
app.put('/addfield', async (req, res) => {
    return new Promise(async (resolve, reject) => {
        console.log(req.body)
        let objectName = req.body.objectName
        let ColumnName = req.body.displayName
        let dataType = req.body.fieldName
        let data = JSON.stringify({
            "objectDetails": {
                "label": objectName,
                "name": objectName,
                "dataStore": "HAPOSTGRES",
                "description": "",
                "group": "Custom",
                "originalName": objectName,
                "originalLabel": objectName,
                "originalDescription": "",
                "originalDataStore": "HAPOSTGRES",
                "richTextMaxSize": 150000
            },
            "createdColumns": [
                {
                    "name": ColumnName,
                    "label": ColumnName,
                    "defaultValue": null,
                    "description": null,
                    "type": dataType,
                    "group": "custom",
                    "hidden": false,
                    "required": false
                }
            ],
            "updatedColumns": [],
            "deletedColumns": []
        });

        let token = await readToken()
        console.log(token, "yuva")
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: 'https://demo-wigmore.gainsightcloud.com/v1/meta/v10/gdm/objects',
            headers: {
                'Cookie': `${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res.send(response.data)
                return response.data
            })
            .catch((error) => {
                console.log(error);
                res.send(error)
            });



    })
})
app.post('/addobject', async (req, res) => {
    console.log(req.body)
    let displayName = req.body.displayName
    let fieldName = req.body.fieldName
    return new Promise(async (resolve, reject) => {
        let data = JSON.stringify({
            "objectDetails": {
                "label": displayName,
                "name": fieldName,
                "dataStore": "HAPOSTGRES",
                "description": "",
                "group": "Custom",
                "originalName": fieldName,
                "originalLabel": displayName,
                "originalDescription": "",
                "originalDataStore": "HAPOSTGRES",
                "richTextMaxSize": 150000
            }
        });

        let token = await readToken()
        console.log(token, "yuva")
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://demo-wigmore.gainsightcloud.com/v1/meta/v10/gdm/objects',
            headers: {
                'Cookie': `${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res.send(response.data)
                return response.data
            })
            .catch((error) => {
                console.log(error);
                res.send(error)
            });



    })
})
app.post('/migrate', async (req, res) => {
    const { targetUrl, accessKey: targetAccessKey, targetObject, sourceObject } = req.body;
  
    // Basic validation
    if (!targetUrl || !targetAccessKey || !targetObject || !sourceObject) {
      return res.status(400).json({ error: 'Missing required fields in request body.' });
    }
  
    try {
      const fields = await fetchFields(sourceObject);
      const fieldList = fields?.data?.[0]?.fields || [];
      const objectType = fields?.data?.[0]?.objectType || 'Unknown';
  
      const formattedFields = [];
  
      fieldList.forEach(item => {
        if (item.meta?.fieldGroupType !== 'SYSTEM') {
          formattedFields.push({
            name: item.fieldName,
            label: item.label,
            defaultValue: item.defaultValue || null,
            description: item.description || null,
            type: item.dataType,
            group: objectType,
            hidden: false,
            required: item.meta?.dataType || false
          });
        }
      });
  
      console.log('Prepared fields:', formattedFields);
  
      const response = await addfield(targetUrl, targetAccessKey, targetObject, formattedFields);
  
      return res.status(200).json(response);
    } catch (error) {
      console.error('Migration failed:', error);
      return res.status(500).json({ error: 'Migration failed', details: error.message });
    }
  });
  
async function addfield(targetUrl, targetAcccesKey, objectName, ColumnNames) {


    return new Promise(async (resolve, reject) => {
        let data = JSON.stringify({
            "objectDetails": {
                "label": objectName,
                "name": objectName,
                "dataStore": "HAPOSTGRES",
                "description": "",
                "group": "Custom",
                "originalName": objectName,
                "originalLabel": objectName,
                "originalDescription": "",
                "originalDataStore": "HAPOSTGRES",
                "richTextMaxSize": 150000
            },
            "createdColumns": ColumnNames,
            "updatedColumns": [],
            "deletedColumns": []
        });

        let token = await readToken()
        console.log(token, "yuva")
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${targetUrl}/v1/meta/v10/gdm/objects`,
            headers: {
                'Cookie': `${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                // res.send(response.data)
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error);
            reject(error)
            });



    })
}
async function readToken() {
    const filePath = path.join(__dirname, 'token.json');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }


            if (data) {
                try {
                    let instances = JSON.parse(data);
                    console.log(instances, "token")
                    resolve(instances?.token)
                } catch (parseErr) {
                    console.error('Error parsing JSON', parseErr);
                    reject(parseErr)
                }
            }


        });

    })


}
app.post('/message', async (req, res) => {
    console.log(req.body)
    let message = req.body.message
    let messages = req.body.messages
    // let fieldName = req.body.fieldName
    let response=await startAgent(message,messages)
    console.log(message)
 res.send(response)
  
})
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
async function readInstance(params) {
    const filePath = path.join(__dirname, 'instances.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        let instances = [];
        if (data) {
            try {
                instances = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON', parseErr);
                return res.status(500).json({ message: 'Error parsing instances.json' });
            }
        }

        return instances
    });


}
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

// async function functioncalling(input) {

//     let data = JSON.stringify({
//         "contents": [
//             {
//                 "role": "user",
//                 "parts": [
//                     {
//                         "text": "Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about the Q3 planning."
//                     }
//                 ]
//             }
//         ],
//         "tools": [
//             {
//                 "functionDeclarations": [
//                     {
//                         "name": "schedule_meeting",
//                         "description": "Schedules a meeting with specified attendees at a given time and date.",
//                         "parameters": {
//                             "type": "object",
//                             "properties": {
//                                 "attendees": {
//                                     "type": "array",
//                                     "items": {
//                                         "type": "string"
//                                     },
//                                     "description": "List of people attending the meeting."
//                                 },
//                                 "date": {
//                                     "type": "string",
//                                     "description": "Date of the meeting (e.g., 2024-07-29)"
//                                 },
//                                 "time": {
//                                     "type": "string",
//                                     "description": "Time of the meeting (e.g., 15:00)"
//                                 },
//                                 "topic": {
//                                     "type": "string",
//                                     "description": "The subject or topic of the meeting."
//                                 }
//                             },
//                             "required": [
//                                 "attendees",
//                                 "date",
//                                 "time",
//                                 "topic"
//                             ]
//                         }
//                     }
//                 ]
//             }
//         ]
//     });

//     let config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBYR6gyhmJ5nqmEGUdit8Z3X1TXtQZFg6g',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: data
//     };

//     axios.request(config)
//         .then((response) => {
//             console.log(JSON.stringify(response.data));
//         })
//         .catch((error) => {
//             console.log(error);
//         });

// }

async function startAgent(input,messages) {

    return new Promise(async(resolve,reject)=>
    {
        const data = {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Let's create a new object. Please collect the object name, field name, and data type from me  I 'll  user and bot previous messages ${messages}. You need to respond accordingly`
                  }
                ]
              }
            ],
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "create_object_with_field",
                    description: "Creates an object by collecting object name, field name, and data type from the user.",
                    parameters: {
                      type: "object",
                      properties: {
                        objectName: {
                          type: "string",
                          description: "The name of the object to create."
                        },
                        fieldName: {
                          type: "string",
                          description: "The field to add to the object."
                        },
                        dataType: {
                          type: "string",
                          description: "The data type of the field.",
                          enum: ["string", "number", "boolean", "date"]
                        }
                      },
                      required: ["objectName", "fieldName", "dataType"]
                    }
                  }
                ]
              }
            ],
            toolConfig: {
              functionCallingConfig: {
                mode: "AUTO"
              }
            }
          };
        
          const config = {
            method: "post",
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBYR6gyhmJ5nqmEGUdit8Z3X1TXtQZFg6g',
                headers: {
              "Content-Type": "application/json"
            },
            data: JSON.stringify(data)
          };
        
          try {
            const response = await axios.request(config);
            console.log(response.data.candidates[0].content.parts[0])
            resolve(response.data.candidates[0].content?.parts[0]?.text)
            // console.log(JSON.stringify(response.data.candidates[0], null, 2));
          } catch (error) {
            console.error("Error calling Gemini agent:", error);
            reject(error)
          }
    })

}
