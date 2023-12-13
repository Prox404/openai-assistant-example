const express = require('express')
const morgan = require('morgan')
const { OpenAIAssistantRunnable } = require("langchain/experimental/openai_assistant")

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(morgan('combined'));

var cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
//port
const port = process.env.PORT || 3000

// cors
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// test route
app.get('/', (req, res) => {
  res.send("Hello World")
})

app.post('/assisstant', async (req, res) => {
  const body = req.body;
  const message = body.message;


  if (!(message)) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }


  const assistant = new OpenAIAssistantRunnable({
    assistantId: process.env.ASSISSTANT_ID,
  });

  await assistant.invoke({
    content: message,
  }).then((result) => {
    console.log("load chain");
    console.log(result);
    res.status(200).send({
      message: result[0].content[0].text.value,
    });
  }).catch((err) => {
    console.log(err);
    res.status(200).send({
      message: "Hệ thống đang bận, vui lòng thử lại sau.",
    });
  });
});

app.listen(port || 5000, () => {
  console.log(`Example app listening on port ${port}`)
})

app.listen(8000, function () {
  console.log('CORS-enabled web server listening on port 8000')
})