const mongoose = require("mongoose");
const { User } = require("../models/index");
const user = require("../models/user");

/*exports.getUsers = async () => {
    const data = await User.find();
    if (data) return data;
  };*/
exports.getUsers = async (skip) => {
  const data = await User.find()
  .sort({$natural:-1})
  .skip(skip)
  .limit(5)
  if (data) return data;
  else return undefined
};
exports.getUser = async id => {
    const data = await User.findOne({ userID : id});
    if (data) return data;
    else return false
  };
  exports.getUserLogin = async (pseudo, password) => {
    const data = await User.findOne({ pseudo : pseudo, password : password});
    if (data) return data;
    else return false
  };

  exports.getUserByPseudo = async pseudo => {
    const data = await User.findOne({ pseudo : pseudo});
    if (data) return data;
    else return false
  };

  exports.isUniquePseudo = async pseudo => {
    const data = await User.findOne({ pseudo : pseudo});
    if (data) return false;
    else return true
  };

exports.createUser = async user => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, user);
    const createUser = await new User(merged);
    await createUser.save().then(g => console.log(`Nouveau user -> ${g.pseudo}`));
};

exports.updateUser = async (user, newParams) => {
    let data = user;
    if (typeof data !== "object") data = {};
    for (const key in newParams) {
      if (data[key] !== newParams[key]) data[key] = newParams[key];
    }
    return data.updateOne(newParams);
}

exports.deleteUser = async user => {
    if(user){
        console.log(user)
        user.delete();
        return true;
    }else return false;
}