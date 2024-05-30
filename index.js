import bcrypt from "bcryptjs";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
dotenv.config();
const app = express();
const PORT = 4000;

const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
client.connect();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const getUserEmail = async (email) => {
    const user = await client
      .db("lunu1")
      .collection("usersDetails")
      .findOne({ email: email });
    return user;
  };

  const userEmail = await getUserEmail(email);

  if (userEmail) {
    res.send({ status: 0, message: "User already exists" }).status(400);
  } else {
    const userID = `${username.toUpperCase()}${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client
      .db("lunu1")
      .collection("usersDetails")
      .insertOne({
        username: username,
        email: email,
        password: hashedPassword,
        userID: userID,
      });
    const result1 = await client.db("lunu1").collection(`${userID}`).insertOne({
      username: username,
      email: email,
      userID: userID,
    });
    res
      .send({ status: 1, message: "Successfully signed up", userID: userID })
      .status(200);
  }
});

app.post("/login",async (req, res) => {
  const { email, password } = req.body;

  const getUserEmail = async (email) => {
    const user = await client
      .db("lunu1")
      .collection("usersDetails")
      .findOne({ email: email });
    return user;
  };

  const userEmail = await getUserEmail(email);

  if(userEmail){
    const isPasswordValid = await bcrypt.compare(password, userEmail.password);
    if(isPasswordValid){
      res.send({status : 1 , message : "Successfully logged in"}).status(200)
    }else {
      res.status(400).send({ status: 0, message: 'Invalid Credentials or Please signup' });
    }
  }else {
    res.status(400).send({ status: 0, message: 'User does not exist' });
  }

  
});

app.listen(PORT, () => console.log(`The port is running on ${PORT}`));
