import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import axios from 'axios';
import session from "express-session";
import UsersRoutes from "./routes/UsersRoute.js";
import configPromptsRoutes from "./routes/configPrompts.js";
import { PhoneNumberRoutes } from "./routes/PhoneNumberRoute.js";
import DocumentRoutes from './routes/DocumentsRoute.js'
import TranscriberRoutes from './routes/TranscribeRoute.js'
import CallLogRoutes from './routes/CallLogRoute.js'
import VoiceRoutes from './routes/VoiceRoute.js'



const app = express();
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "techHelps",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Serve static files from the 'upload' directory
app.use('/uploads', express.static('uploads'));


// mongoose.connect("mongodb+srv://akhil1659:akhil1659@cluster0.35ongwb.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database Connected");
});

// const express = require('express');
// const axios = require('axios');

const port = 3000;

const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/19529895/22gwdgj/'; //  Zapier webhook URL


app.post('/receive-info', (req, res) => {
  const info = req.body;

  if (info) {
    console.log(info,'==============receive-info');
    console.log('AI Assistant received information:', info);
    res.status(200).send({ message: 'Information received successfully' });
  } else {
    console.log('No information received by AI Assistant.');
    res.status(400).send({ message: 'No information received' });
  }
});

app.post('/send-data', (req, res) => {
  const { name, email, message } = req.body;
  console.log(req.body,'==============send-data');
  axios.post(zapierWebhookUrl, { name, email, message })
    .then(response => {
      res.status(200).json({ message: 'Data sent successfully!' });
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to send data', error: error.message });
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the user management API!");
});
app.use("/upload", express.static("upload"));
app.use("/api/users", UsersRoutes);
app.use("/api/configs", configPromptsRoutes);
app.use("/api/phone-numbers", PhoneNumberRoutes)
app.use("/api/documents", DocumentRoutes)
app.use("/api/transcriber", TranscriberRoutes)
app.use("/api/callLog", CallLogRoutes)
app.use("/api/voice", VoiceRoutes)

