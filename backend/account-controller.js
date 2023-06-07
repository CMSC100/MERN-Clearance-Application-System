import mongoose from "mongoose";

const User = mongoose.model("User");
const Application = mongoose.model("Application");

const getUser = async (req, res) => {
    const user = await User.findOne({email: req.query.upmail})
    res.send(user)
}

const getAdviser = async (req, res) => {
    const user = await User.findOne({email: req.query.upmail})
	const approver = await User.findOne({_id: user.adviser})
    res.send(approver)
}

const getClearanceOfficer = async (req, res) => {
User.findOne({ email: req.query.upmail })
  .populate({
    path: "applications",
    select: "clearance_officer",
    populate: {
      path: "clearance_officer",
      select: "fname mname lname" // Retrieve the fname mname and lname of the clearance officer
    }
  })
  .exec().then((user) => {
      if (user) {
        // Access the clearance officer details through the applications array
        const applications = user.applications;
		console.log(applications)
        if (applications.length > 0) {
          const clearanceOfficer = applications[applications.length - 1].clearance_officer;
		  console.log(clearanceOfficer)
          res.send(clearanceOfficer)
        } else {
          console.log("No applications");
        }}
      else {
        console.log("Student not found.");
      }
    }).catch((err) => {
		// Handle the error
		console.error(err);
	  });
}

const getStudentAccounts = async (req, res) => {
    const accounts = await User.find({userType: "student", isApproved: false})
    res.send(accounts)
}

const getApproverAccounts = async (req, res) => {
    const clearanceOfficers = await User.find({userType: "clearanceOfficer"})
	const advisers = await User.find({userType: "adviser"})
	const approvers = [].concat(clearanceOfficers, advisers)
    res.send(approvers)
}

// get student account by student number
const getStudentAccountByStudno = async (req, res) => {
	const account = await User.findOne({ userType: "student" , studentno: req.query.studentno })
	res.send(account)
}

// approve student account request (done by admin), update isApproved field of user in db
const approveAccount = async (req, res) => {
	const { studentno } = req.body

	console.log(studentno)

	const result = await User.updateOne({ studentno }, {$set: {isApproved: true}}).where("userType").equals("student")

	if (result.modifiedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}

// when student account request is rejected by admin, the account must then be deleted in the db
const rejectAccount = async (req, res) => {
	const { studentno } = req.body

	const result = await User.deleteOne({ studentno }).where("userType").equals("student")

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
	
}

const getApproverAccountByEmail = async (req, res) => {
	const account = await User.findOne({ email: req.query.email })
	console.log(account)
	res.send(account)
}

const editApprover = async (req, res) => {
	const account = await User.updateOne({ fname: req.body.fname, mname: req.body.mname, lname: req.body.lname, userType: req.body.userType, email: req.body.email }).where({email: req.query.email})
	if(account.matchedCount > 0){
		res.send({ success:true })
	  }else{
		res.send({ success:false })
	  }
}

const deleteApprover = async (req, res) => {
	const { upmail } = req.body
	console.log(upmail)
	const result = await User.deleteOne({ email: upmail })
	console.log(result)
	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
	
}

const getAdviserAccounts = async (req, res) => {
    const accounts = await User.find({userType: "adviser"})
    res.send(accounts)
}

const assignAdviser = async (req, res) => {
	const account = await User.updateOne({adviser: req.body.adviserID}).where({studentno: req.body.studentno})
	console.log(account.matchedCount)
	if(account.matchedCount > 0){
		res.send({ success:true })
	  }else{
		res.send({ success:false })
	  }
}

export {getUser, getStudentAccounts, getApproverAccounts, getStudentAccountByStudno, approveAccount, rejectAccount, getAdviser, deleteApprover, getApproverAccountByEmail, editApprover, getAdviserAccounts, assignAdviser, getClearanceOfficer }