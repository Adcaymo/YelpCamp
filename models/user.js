var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: String
}, {usePushEach: true});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
