import mongoose from "mongoose";

const Application = mongoose.model("Application")
const User = mongoose.model("User")
 
const addNewApplication = async (req, res) => {
  try {
    const {upmail, submission_remark} = req.body

    const newApplication = new Application({
      status: "pending",
      step: 1,
      remarks: [],
      student_submission: {
        submission_remark: submission_remark,
        submission_date: new Date(Date.now()),
        step_given: 1
      }
    })

    // const user = await User.findOne({email: upmail})
    // user.applications.push(newapplication)
    // user.save();

    const result = await newApplication.save()
    const updatedUser = await User.findOneAndUpdate(
      {email: upmail},
      {$push: {applications: result._id}},
      {new: true})

    if (result._id) {
      res.send({ success: true })
    } else {
      res.send({ success: false })
    }

    // return res.send({success: true })
  } catch (error) {
    return res.send({success: false})
  }
}

const getAllApplicationsByUser = async (req, res) =>{
  //req: { upmail }
  const userApplicationsRef = await User.findOne({email: req.query.upmail}).select("applications")
  const userApplications = await Application.find({_id: {$in: userApplicationsRef.applications } })
  console.log(userApplications)
  res.send(userApplications)
}



export { addNewApplication, getAllApplicationsByUser } 