const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    "type": String,
    "default": ""
  },
  userPermissions :{
    "type": Number,
    "default": 1   // 0 = MUTED; 1 = MEMBER; 2 = MODO; 3 = ADMIN; 4 = OWNER
  },
  avatar :{
    "type": String,
    "default": ""
  },
  accountDate: {
    "type": Date,
    "default": ""
  },
  pseudo: {
    "type": String,
    "default": ""
  },
  password : {
    "type": String,
    "default": ""
  },
  firstName: {
    "type": String,
    "default": ""
  },
  lastName: {
    "type": String,
    "default": ""
  },
  age: {
    "type": String,
    "default": ""
  },
  email: {
    "type": String,
    "default": ""
  },
  phoneNumber: {
    "type": String,
    "default": ""
  },
  //Autre
  status: {
    "type": String,
    "default": ""
  },
  site: {
    "type": String,
    "default": ""
  },
  //Site
  theme: {
    "type": String,
    "default": "light"
  },

  
});

module.exports = mongoose.model("User", userSchema);