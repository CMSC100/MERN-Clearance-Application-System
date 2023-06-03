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

// approve student account request (done by admin), update isApproved field of user in db
const approveAccount = async (req, res) => {
	const { studentno } = req.body

	const result = await User.updateOne({ studentno }, {$set: {isApproved: true}})

	if (result.modifiedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}

// when student account request is rejected by admin, the account must then be deleted in the db
const rejectAccount = async (req, res) => {
	const { studentno } = req.body

	const result = await User.deleteOne({ studentno })

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
	
}

export {getUser, getStudentAccounts, getStudentAccountByStudno, approveAccount, rejectAccount}