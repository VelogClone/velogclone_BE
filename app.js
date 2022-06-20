const express = require('express');
<<<<<<< HEAD
const userRouter = require('./routes/usersRouter');
=======
>>>>>>> 27e759dff461bd6bcfc08cea35fdaecdd47ef934
const cors = require('cors');
const app = express();
require('dotenv').config();
const connect = require('./schemas');
app.use(cors({ origin: true, credentials: true }));
connect();
<<<<<<< HEAD
app.use('port', process.env.PORT || 3000)
=======
>>>>>>> 27e759dff461bd6bcfc08cea35fdaecdd47ef934
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/comments', require('./routes/commentsRouter.js'));
app.use('/api/posts', require('./routes/postsRouter.js'));
app.use('/api', require('./routes/usersRouter.js'));
app.use(express.static('static'));

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`listening on 3000`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 27e759dff461bd6bcfc08cea35fdaecdd47ef934
