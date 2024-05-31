import { client } from "./index.js";

export async function updateLeavePermissions(userID, user, positiveDaysDifference) {
  await client
    .db("lunu1")
    .collection("usersDetails")
    .updateOne(
      { userID: userID },
      { $set: { permissions: user.permissions - positiveDaysDifference } }
    );
}
export async function createLeaveApplication(userID, leaveType, startDate, endDate, leaveReason, positiveDaysDifference) {
  await client.db("lunu1").collection("leaveApplication").insertOne({
    userID,
    leaveType,
    startDate,
    endDate,
    leaveReason,
    positiveDaysDifference,
  });
}
export function getUserByUserID() {
  return async (userID) => {
    const user = await client
      .db("lunu1")
      .collection("usersDetails")
      .findOne({ userID: userID });
    return user;
  };
}
export async function createCollectionByUserID(userID, username, email) {
  await client.db("lunu1").collection(`${userID}`).insertOne({
    username: username,
    email: email,
    userID: userID,
  });
}
export async function signupUser(username, email, hashedPassword, userID) {
  await client.db("lunu1").collection("usersDetails").insertOne({
    username: username,
    email: email,
    password: hashedPassword,
    userID: userID,
    permissions: 21,
  });
}
export function findUserByEmail() {
  return async (email) => {
    const user = await client
      .db("lunu1")
      .collection("usersDetails")
      .findOne({ email: email });
    return user;
  };
}
