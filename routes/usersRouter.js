const express = require('express');
const jwt = require("jsonwebtoken");
const User = require("../schemas/usersSchema");
const router = require('express').Router();
//const Joi = require("joi")
//회원가입


/*const postUsersSchema = Joi.object({
    userId: Joi
        .string()
        .required(),
    nickname: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required()
  });*/
  

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
  //const postUserSchema = Joi.object({
   // userId: Joi.string().required(),
  //  password: Joi.string().required(),
  //});
  

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