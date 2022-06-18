
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Post = require('../schemas/postsSchema');
const Comment = require('../schemas/commentsSchema');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'static/',
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './static');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
    fileFilter: (req, file, cb) => {
      if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype))
        cd(null, true);
      else cd(Error('PNG, jpeg만 업로드 하세요'), false);
    },
    limits: {
      fileSize: 1024 * 1024,
    },
  }),
});

// 게시물 작성
// upload.single('postImage')에서 'image'는 변수명
// auth추가
// router.post("/", upload.single(postImage), async(req, res) => { //posts
//     console.log(req.file)
//     // req.file내에는 fieldname, originalname,
//     //encoding, destination, filename 등의 정보가 저장
//     // 저장 성공시 asw s3 버킷에 저장
//     const postImage = req.file.location;
//     const createdAt = new Date().toLocaleString()
//     // const { user } = res.locals.user
//     // const userId = user["userId"]
//     const userId = "TEST입니다"
//     const { title, content, nickName} = req.body; // userId 추가해야합니다.
//     console.log(postId);
//     await Post.create({ title, content, nickName, postImage, userId, createdAt });

//     res.json({ success: "msg"})

// });

// 게시물작성

router.post('/', /*auth,*/ upload.single('postImage'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const now = new Date();
  const date = now.toLocaleDateString('ko-KR');
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const postDate = date + ' ' + hours + ':' + minutes;
  const userId = 'userId123';
  const userImage = 'http://3.39.226.20/imagename.jpg';

  //const { userId, userImage } = res.locals.user;
  const { postTitle, postContent } = req.body;
  const postImage = 'http://3.39.226.20/' + req.file.filename;


  await Post.create({
    postTitle,
    postContent,
    userId,
    postDate,
    postImage,
    userImage,
  });

  res.json({ success: 'msg' });
});

//전체 게시물 조회
router.get('/', async (req, res) => {
  const post = await Post.find().sort('postId');

  res.send({ post });
});

//상세 페이지 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId: postId });
  const comments = await Comment.find({ postId: postId });

  res.json({ post, comments });
});

//게시글 삭제
router.delete(
  '/:postId',
  /*auth,*/ async (req, res) => {
    const { postId } = req.params;
    // const user = res.locals.user;
    /* console.log(user)
    const userId = user["userId"]  //user["userId"];
    console.log(userId) */
    const userId = 'userId123';
    const existPost = await Post.find({ postId: postId });
    const existComment = await Comment.find({ postId: postId });
    console.log('코멘트입니다:', existComment);

    if (userId === existPost[0]['userId']) {
      if (existPost && existComment) {
        await Post.deleteOne({ postId: postId });
        await Comment.deleteMany({ postId: postId });
        res.send({ result: 'success' });
      } else if (existPost) {
        await Post.deleteOne({ postId: postId });
        res.send({ result: 'success' });
      }
    } else {
      res.status(401).send({ result: 'fail' });
    }
  }
);

//게시글 수정
router.put(
  '/:postId',
  /* auth,*/ upload.single('postImage'),
  async (req, res) => {
    ///posts/:postId
    const { postId } = req.params;
    /* const user = res.locals.user;
    const userId = user.userId */
    const userId = 'userId123';

    const { postTitle, postContent } = req.body;


    // const obj = JSON.parse(JSON.stringify(req.file));
    // console.log("obj입니다:", obj)
    // const value = Object.values(obj)
    // const imageUrl = 'http://3.34.45.167/' + value.splice(5,1)
    // console.log("imgaUrl 입니다:", imageUrl);
    const existPost = await Post.findOne({ postId: postId });


    const postImage = 'http://localhost:3000/' + req.file.filename;
    console.log(req.file);
    if (userId === existPost.userId) {
      if (existPost) {
        await Post.updateOne(
          { postId: postId },
          { $set: { postTitle, postContent, postImage } }
        );

        res.send({ result: 'success' });
      } else {
        res.status(400).send({ result: 'fail' });
      }
    } else {
      res.send({ result: 'fail ' });
    }
  }
);

module.exports = router;

