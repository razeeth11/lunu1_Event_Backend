import express from "express";
import { MongoClient } from "mongodb";
const app = express();
const PORT = 4000;

const URL = "mongodb+srv://lunu:lunu1234@cluster0.mxmqnga.mongodb.net/";

const client = new MongoClient(URL);
client.connect();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const getUserEmail = async (email) => {
    const user = await client
      .db("lunu1")
      .collection("usersDetails")
      .findOne({ email : email });
      return user
  };

  const userEmail = await getUserEmail(email);


  if (userEmail) {
    res.send({ status: 0, message: "User already exists" }).status(400);
  } else {
    const userID = `${username.toUpperCase()}${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    const result = await client.db("lunu1").collection("usersDetails").insertOne({
      username: username,
      email: email,
      password: password,
      userID : userID
    });
    const result1 = await client.db("lunu1").collection(`${userID}`).insertOne({
      username: username,
      email: email,
      userID : userID
    });
    res.send({ status: 1, message: "Successfully signed up", userID : userID }).status(200);
  }
});

app.post("/login", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`The port is running on ${PORT}`));
