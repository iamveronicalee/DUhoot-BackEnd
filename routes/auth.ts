require("dotenv").config();
const axios = require("axios");
const {} = require("express");
var express = require("express");
var router = express.Router();
const app = express();
import { verify} from "jsonwebtoken";
import { User } from "../src/entities/User";
import { sendRefreshToken } from "../src/sendRefreshToken";
import { AppDataSource } from "../src/data-source";
import {
  generateAccessToken,
  generateRefreshAccessToken,
} from "../src/generateToken";

app.use(express.json());

const userRepository = AppDataSource.getRepository(User);
let refreshTokens: string[] = [];

router.get("/user", (req, res, next) => {
  // authenticate token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
  res.json(req.user);
});

router.post("/login", async function (req, res) {
  
  const existUser = await userRepository.findOneBy({
    userName: req.body.username,
  });

  axios
    .post(
      "https://bluejack.binus.ac.id/lapi/api/Account/LogOnBinusian",
      req.body
    )
    .then((response) => {
      // console.log(response.data.User)
      const username = response.data.User.UserName;
      const userId = response.data.User.UserId;
      const binusianId = response.data.User.BinusianId;
      const realname = response.data.User.Name;
      if (existUser === null) addNewUser(username, userId, binusianId); // kalo user belum ada di db save ke db

      const user = {
        username: username,
        userId: userId,
        binusianId: binusianId,
        realname: realname,
      };

      const accessToken = generateAccessToken(user);
      res.json({ accessToken: accessToken });
      // const refreshToken = generateRefreshAccessToken(user);
      // refreshTokens.push(refreshToken);
      // res.json({ accessToken: accessToken, refreshToken: refreshToken });
    })
    .catch((error) => {
      res.send(error);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.post("/login/lecturer", async function (req, res) {
  const existUser = await userRepository.findOneBy({
    userName: req.body.username.toUpperCase(),
  });
  axios
    .post(
      "https://bluejack.binus.ac.id/lapi/api/Account/LogOnQualification",
      req.body
    )
    .then((response) => {
      const username = response.data.User.UserName;
      const userId = response.data.User.UserId;
      const binusianId = response.data.User.BinusianId;
      if (existUser === null) addNewUser(username, userId, binusianId); // user belum ada di db save ke db

      const user = {
        username: username,
        userId: userId,
        binusianId: binusianId,
        realname: username,
      };
      const accessToken = generateAccessToken(user);
      res.json({ accessToken: accessToken });
      // const refreshToken = generateRefreshAccessToken(user);
      // refreshTokens.push(refreshToken);
      // res.json({ accessToken: accessToken, refreshToken: refreshToken });
    })
    .catch((error) => {
      res.send(error);
    });
});

router.post("/refresh_token", async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }

  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.send({ ok: false, accessToken: "" });
  }

  // token is valid and we can send back an access token
  const user = await User.findOne({ where: { userName: payload.userName } });
  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  sendRefreshToken(
    res,
    generateRefreshAccessToken({ userName: user.userName })
  );

  return res.send({
    ok: true,
    accessToken: generateAccessToken({ userName: user.userName }),
  });
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  });
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  console.log("token" + token);
  verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

async function addNewUser(userName, userId, binusianId) {
  const newUser = new User();
  newUser.userId = userId;
  newUser.binusianId = binusianId;
  newUser.userName = userName;

  await userRepository.save(newUser);
  // const savedUsers = await userRepository.find();
  // console.log("All users from the db: ", savedUsers);
}

module.exports = router;
