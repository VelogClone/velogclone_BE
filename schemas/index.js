<<<<<<< HEAD

const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb://localhost:27017/clone", { ignoreUndefined: true }).catch((err) => {
        console.error(err);
    })
}


module.exports = connect;

=======
const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
  mongoose.connect(process.env.DB_URL).catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
>>>>>>> 27e759dff461bd6bcfc08cea35fdaecdd47ef934
