const express = require('express');
const jwt = require("jsonwebtoken");
const User = require('../schemas/usersSchema');
const router = require('express').Router();
const passport = require("../passport/passport.js");
require("dotenv").config();

//Kakao 로그인
router.get("/kakao", passport.authenticate("kakao"));

const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      console.log("콜백~~~");
      const { email, nickname } = user;

      // 토큰 옵션 설정
      const payload = { email };
      const secret = process.env.JWT_SECRET_KEY; 시크릿키 
      const options = {
        issuer: "백엔드 개발자", // 발행자
        expiresIn: "1d", // 날짜: $$d, 시간: $$h, 분: $$m, 그냥 숫자만 넣으면 ms단위
      };

      const token = jwt.sign(payload, secret, options);
      result = {
        token,
        email,
        nickname,
      };
      res.json({ result });
    }
  )(req, res, next);
};
router.get("auth/kakao/callback", kakaoCallback);


//회원가입
router.post("/register", async (req, res) => {
     {const {
        email,
        nickname,
        password,
      } = (req.body);

      const existUsers = await User.find({
        $or: [{ email }, { nickname }],
      });
      if (existUsers.length) {
        res.status(400).send({
          errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
      }

      const user = new User({ email, nickname, password });
      await user.save();
      res.status(201).send({ message: "회원가입이 완료!" });
    } (err) 
      console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  );
  

//로그인

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = await (req.body);
      const user = await User.findOne({ email, password }).exec();
      if (!user) {
        res.status(400).send({
          errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
        });
        return;
      }
      const token = jwt.sign({ email: user.email }, "my-secret-key");
      res.send({
        token,
      });
    } catch (err) {
        console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  module.exports = router;