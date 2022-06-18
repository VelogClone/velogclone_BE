const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://choi927:choi927@cluster0.2wcr6.mongodb.net/velog?retryWrites=true&w=majority'
    )
    .catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
