const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const UsersSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
   type: String,
  required: true,
},
  password: {
    type: String,
    required: true,
  },
  //userImage: {
  //  type: String,
  //},
});


UsersSchema.pre("save", function (next) {
  const user = this;

  if (user.password) {
    
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
} else {
    next();
}
});

UsersSchema.methods.compare = function (password) {
  const user = this;

  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UsersSchema);

