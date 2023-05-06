const User = require("../models/User");

async function createUser(firstName, lastName, email, hashedPassword) {
  const user = new User({
    firstName,
    lastName,
    email,
    hashedPassword,
  });

  user.save();
  return user;
}