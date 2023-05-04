const User = require("../models/User");

async function createUser(firstName, lastName, email, hashedPassword) {
  const user = new User({
    firstName,
    lastName,
    hashedPassword,
  });

  user.save();
  return user;
}

async function getUserByFirstName(firstName) {
  const pattern = new RegExp(`^${firstName}$`, "i");
  const user = await User.findOne({ firstName: { $regex: pattern } });
  return user;
}

async function getUserByLastName(lastName) {
    const pattern = new RegExp(`^${lastName}$`, "i");
    const user = await User.findOne({ lastName: { $regex: pattern } });
    return user;
  }

async function getUserByEmail(email) {
  const pattern = new RegExp(`^${email}$`, "i");
  const user = await User.findOne({
    email: { $regex: pattern },
  });

  return user;
}

async function findById(id) {
  return User.findById(id);
}

module.exports = {
  createUser,
  getUserByFirstName,
  getUserByLastName,
  getUserByEmail,
  findById,
};
