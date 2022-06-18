const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/usersSchema");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

  

//회원가입

  router.post('/register', async (req, res) => {
    const {email, nickname, password, password_check } = req.body

    if (password !== password_check) {
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 일치하지 않습니다.',
        });
        return;
    } 

    const existUsers = await User.find({ nickname })
    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '이미 가입된 아이디가 있습니다.',
        })
        return;
    }
    if (password.indexOf(nickname)>-1 || password.length < 4) {
        res.status(400).send({
            errorMessage: '비밀번호 4자 이상이며 아이디를 포함하면 안됩니다.',
        })
        return;
    }
    if (!nickname.match(/[a-zA-Z0-9]+$/) || nickname.length < 3) {
        res.status(400).send({
            errorMessage:
                '닉네임은 3자 이상이며 알파벳(대소문자), 숫자(0~9)를 포함해야됩니다.',
        })
        return;
    }
    const user = new User({ nickname, password })
    await user.save()
    res.status(201).send({})
});




//로그인


  router.post("/login", async (req, res) => {
    try {
      const { userId, password } = await (req.body);
      const user = await User.findOne({ userId, password }).exec();
      if (!user) {
        res.status(400).send({
          errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
        });
        return;
      }
      const token = jwt.sign({ userId: user.userId }, "my-secret-key");
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