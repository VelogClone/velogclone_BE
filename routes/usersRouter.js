const router = require('express').Router();
const joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { hash, compare } = require('bcryptjs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const connect = require('../schemas');
const User = require('../schemas/usersSchema');
connect();

// 이미지 업로드 Multer
const upload = multer({
  storage: multerS3({

    s3: s3,
    bucket: 'jerryjudymary',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        'userImage/' + Date.now() + '.' + file.originalname.split('.').pop()
      ); // 이름 설정
    },
  }),
});

const userSchema = joi.object({
  email: joi.string(),
  nickname: joi.string(),
  password: joi.string(),
  passwordCheck: joi.string(),
  userImage: joi.string(),
});

//회원가입
router.post('/signup', upload.single('userImage'), async (req, res) => {
  try {
    const { email, nickname, password, passwordCheck } =
      await userSchema.validateAsync(req.body);

    if (password !== passwordCheck) {
      return res.status(400).send({
        errormessage: '패스워드가 일치 하지 않습니다',
      });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser) {
      return res.status(400).send({
        errormessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
      });
    }

    const hashedPassword = await new hash(password, 10);
    if (req.file == undefined) {

      const userImage =
        process.env.DEFAULT_USER_IMG + 'defaultuserImage1655721219161.png';
      const user = await User.create({
        email,
        nickname,
        hashedPassword,
        userImage,
      });
      res
        .status(200)
        .json({ success: true, message: '회원가입 성공', user, userImage });
    } else {
      const userImage = req.file.location;
      const user = await User.create({
        userImage,
        email,
        nickname,
        hashedPassword,
      });
      res
        .status(200)
        .json({ success: true, message: '회원가입 성공', user, userImage });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ errormessage: '요청한 데이터 형식이 올바르지 않습니다' });
  }
});

// 로그인 기능
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    const isValid = await compare(password, user.hashedPassword);
    if (!isValid) {
      return res.status(400).send({
        errormessage: '이메일 또는 비밀번호를 확인해주세요',
      });
    }
    const token = jwt.sign(
      { userId: user._id.toHexString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '6h' }
    );
    res.status(200).json({
      token,
      user: {
        nickname: user.nickname,
        userImage: user.userImage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      errormessage: '이메일 또는 비밀번호를 확인해주세요',
    });
  }
});

router.get('/auth', authMiddleware, async (req, res) => {
  try {
    console.log(res.locals);
    const { user } = res.locals;
    res.status(200).send({
      user: {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        userImage: user.userImage,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      errormessage: '사용자 정보를 가져오지 못하였습니다.',
    });
  }
});

module.exports = router;


/*const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

//const passport = require("../passport/passport.js");
require("dotenv").config();

//Kakao 로그인

/*const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      console.log("콜백~~~");
      const { email, nickname } = user;
      console.log(email)
      console.log(nickname)
      // 토큰 옵션 설정
      const payload = { email };
      const secret = process.env.JWT_SECRET_KEY; //시크릿키 
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
router.get("/auth/kakao/callback", kakaoCallback);*/
