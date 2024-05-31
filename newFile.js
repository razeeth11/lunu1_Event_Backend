import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import {
  createCollectionByUserID,
  createLeaveApplication,
  findUserByEmail,
  getUserByUserID,
  signupUser,
  updateLeavePermissions
} from "./findUserByEmail.js";
import { client, secretKey } from "./index.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const getUserEmail = findUserByEmail();

  const userEmail = await getUserEmail(email);

  if (userEmail) {
    res.send({ status: 0, message: "User already exists" }).status(400);
  } else {
    const userID = `${username.toUpperCase()}${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    await signupUser(username, email, hashedPassword, userID);
    await createCollectionByUserID(userID, username, email);
    res
      .send({ status: 1, message: "Successfully signed up", userID: userID })
      .status(200);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const getUserEmail = findUserByEmail();

  const userEmail = await getUserEmail(email);

  if (userEmail) {
    const isPasswordValid = await bcrypt.compare(password, userEmail.password);
    if (isPasswordValid) {
      const token = jwt.sign({ userID: userEmail.userID }, secretKey, {
        expiresIn: "1h",
      });
      res
        .send({
          status: 1,
          message: "Successfully logged in",
          userID: userEmail.userID,
          token,
        })
        .status(200);
    } else {
      res.status(400).send({ status: 0, message: "Invalid Credentials" });
    }
  } else {
    res.status(400).send({ status: 0, message: "User does not exist" });
  }
});
router.post("/leaveApplication", async (req, res) => {
  const { userID, leaveType, startDate, endDate, leaveReason } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  const positiveDaysDifference = Math.abs(daysDifference);

  const getUserID = getUserByUserID();

  const user = await getUserID(userID);

  await createLeaveApplication(
    userID,
    leaveType,
    startDate,
    endDate,
    leaveReason,
    positiveDaysDifference
  );

  await updateLeavePermissions(userID, user, positiveDaysDifference);

  res.status(200).send({
    status: 1,
    message: "Successfully permission updated!",
  });
});


router.get("/leaveApplicationHistory/:userID", async (req, res) => {
  const { userID } = req.params;

  const leaveHistory = await client
    .db("lunu1")
    .collection("leaveApplication")
    .find({})
    .toArray();

  const result = leaveHistory.filter((item) => item.userID == userID);

  res.send({status : 1 , leaveHistory : result});
});

router.get("/userDetail/:userID", async (req, res) => {
  const { userID } = req.params;

  const leaveHistory = await client
    .db("lunu1")
    .collection("usersDetails")
    .find({})
    .toArray();

  const result = leaveHistory.filter((item) => item.userID == userID);

  res.send({status : 1 , leaveHistory : result});
});

export default router;
