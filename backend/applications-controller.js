import mongoose from "mongoose";

const Application = mongoose.model("Application")
const User = mongoose.model("User")
 
const addNewApplication = async (req, res) => {
  try {
    const {upmail, submission_remark} = req.body

    const newapplication = new Application({
      status: "pending",
      step: 1,
      remarks: [],
      student_submission: {
        submission_remark: submission_remark,
        submission_date: new Date(Date.now()),
        step_given: 1
      }
    })

    const user = await User.findOne({email: upmail})
    user.applications.push(newapplication)
    user.save();


    return res.send({success: true })
  } catch (error) {
    return res.send({success: false})
  }
}

const getAllApplicationsByUser = async (req, res) =>{
  //req: { upmail }
  const currentUser = await User.find({email: upmail}).applications
  res.send(currentUser)
}

export { addNewApplication, getAllApplicationsByUser } 