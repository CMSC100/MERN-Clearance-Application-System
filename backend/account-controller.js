import mongoose from "mongoose";

const User = mongoose.model("User");

const getUser = async (req, res) => {
    const user = await User.findOne({email: req.query.upmail})
    res.send(user)
}

const getStudentAccounts = async (req, res) => {
    const accounts = await User.find({}).where("userType").equals("student")
    res.send(accounts)
}

export {getUser, getStudentAccounts}