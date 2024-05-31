import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import router from "./newFile.js";
dotenv.config();
export const app = express();
const PORT = 4000;
export const secretKey = process.env.SECRET_KEY;
const MONGO_URL = process.env.MONGO_URL;


export let client;

async function initializeMongoClient() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);  // Exit process if the connection fails
  }
}

initializeMongoClient();


// export const client = new MongoClient(MONGO_URL);
// client.connect();

app.use(express.json());
app.use(cors());
app.use("/" , router)

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`The port is running on ${PORT}`));
