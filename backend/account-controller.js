import mongoose from "mongoose";

const User = mongoose.model("User");

const getUser = async (req, res) => {
    const user = await User.findOne({email: req.query.upmail})
    res.send(user)
}

const getStudentAccounts = async (req, res) => {
    const accounts = await User.find({userType: "student", isApproved: false})
    res.send(accounts)
}

// get student account by student number
const getStudentAccountByStudno = async (req, res) => {
	const account = await User.findOne({ userType: "student" , studentno: req.query.studentno })
	res.send(account)
}

export {getUser, getStudentAccounts, getStudentAccountByStudno}