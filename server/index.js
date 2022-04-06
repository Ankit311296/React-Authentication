const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/full-mern-stack-video");

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
    const newPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
      });
      res.json({ status: "ok", user: user });
    } else {
      res.json({ status: "error", user: false });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        "secret123"
      );
      return res.json({ status: "ok", user: token });
    } else {
      return res.json({ status: "error", user: false });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    console.log(email);
    if (req.body.quote.length > 0) {
      await User.updateOne(
        { email: email },
        { $set: { quote: req.body.quote } }
      );
      return res.json({ status: "ok" });
    } else {
      console.log("no length");
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(1337, () => {
  console.log("server Started port 1337");
});
