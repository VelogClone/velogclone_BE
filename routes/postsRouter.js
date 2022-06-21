const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Post = require('../schemas/postsSchema');
const Comment = require('../schemas/commentsSchema');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const path = require('path');

const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'jerryjudymary',
      acl: 'public-read',
      key: function(req, file, cb){
          cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
      }
  })
});

router.post('/', authMiddleware, upload.single('postImage'), async (req, res) => {

    const now = new Date();
    const date = now.toLocaleDateString('ko-KR');
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const postDate = date + ' ' + hours + ':' + minutes;
    const { nickname, userImage } = res.locals.user;
    const { postTitle, postContent } = req.body;
    const postImage = req.file.location;

    const post = await Post.create({
      postTitle,
      postContent,
      nickname,
      postDate,
      postImage,
      userImage,
    });

    res.status(200).json({ success: true, post });
  }
);

//전체 게시물 조회
router.get('/', async (req, res) => {
  const post = await Post.find().sort({ postId: -1 });
  res.send({ post });
});

//상세 페이지 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId: postId });
  const comments = await Comment.find({ postId: postId }).sort({
    commentId: -1,
  });
  res.status(200).json({ post, comments });
});

//게시글 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const user = res.locals.user;

  const nickname = user.nickname;
  const existPost = await Post.findOne({ postId: parseInt(postId) });
  const existComment = await Comment.find({ postId: parseInt(postId) });
  console.log('코멘트입니다:', existComment);
  console.log(nickname);
  console.log(existPost.nickname);

  if (nickname === existPost.nickname) {
    if (existPost && existComment) {
      await Post.deleteOne({ postId: parseInt(postId) });
      await Comment.deleteMany({ postId: parseInt(postId) });
      res.send({ result: 'success' });
    } else if (existPost) {
      await Post.deleteOne({ postId: parseInt(postId) });
      res.status(200).send({ result: 'success' });
    }
  } else {
    res.status(401).send({ result: 'fail' });
  }
});

// 게시글 수정
router.put('/:postId', authMiddleware, upload.single('postImage'), async (req, res) => {

    const { postId } = req.params;
    const user = res.locals.user;
    const nickname = user.nickname;
    const { postTitle, postContent } = req.body;

    const existPost = await Post.findOne({ postId: postId });
    const postImage = req.file.location;

    console.log(req.file);
    if (nickname === existPost.nickname) {
      if (existPost) {
        await Post.updateOne(
          { postId: postId },
          { $set: { postTitle, postContent, postImage } }
        );
        res.status(200).json({ result: 'success', postImage });
      } else {
        res.status(400).send({ result: 'fail' });
      }
    } else {
      res.status(400).send({ result: 'fail' });
    }
  }
);

module.exports = router;