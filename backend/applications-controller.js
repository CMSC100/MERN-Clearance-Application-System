import mongoose from "mongoose";

const Application = mongoose.model("Application")
const User = mongoose.model("User")
 
const addNewApplication = async (req, res) => {
  try {
    const {upmail, submission_remark} = req.body

    const user = await User.findOne({email: upmail})

    const fullname = user.mname === "" ? `${user.fname} ${user.lname}` : `${user.fname} ${user.mname} ${user.lname}`



    const newApplication = new Application({
      student_name: fullname,
      status: "pending",
      step: 1,
      remarks: [],
      student_submission: [{
        submission_remark: submission_remark,
        submission_date: new Date(Date.now()),
        step_given: 1
      }]
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
  // console.log(userApplications)
  res.send(userApplications)
}

const getNotificationsByUser = async (req,res) =>{
  //req: { upmail }
  const userApplicationsRef =  await User.findOne({email: req.query.upmail}).select("applications")
  // const userNotifs = await Application.find({_id: {$in: userApplicationsRef.applications }})
  const allremarks = await Application.aggregate([
    {$match: {_id: {$in: userApplicationsRef.applications }}},
    {$unwind: '$remarks'},
    {$lookup : {
      from : 'users',
      localField : 'remarks.commenter',
      foreignField : '_id',
      as : 'commenteruser'
    }},
    {$project: {
      _id: 1, 
      'remarks.app_remarks': 1,
      'remarks.remark_date': 1, 
      'commenteruser.fname': 1,
      'commenteruser.lname': 1, 
      'remarks.step_given': 1, 
      'student_submission.submission_remark': 1
    }},
    {$sort: {'remarks.remark_date': 1}},
    {$limit: 10}
  ])
  console.log(allremarks)
  res.send(allremarks)
}

const getLatestApplicationByUser = async (req,res)=>{
  //req { upmail }
  const userApplicationsRef =  await User.findOne({email: req.query.upmail}).select("applications");
  const latestApplication = await Application.aggregate([
    {$match: {_id: {$in: userApplicationsRef.applications }}},
    {$lookup : {
      from : 'users',
      localField : 'remarks.commenter',
      foreignField : '_id',
      as : 'commenteruser'
    }},
    {$sort: {'student_submission.submission_date': -1}},
    {$limit:1}
  ]);
  res.send(latestApplication);
}

const addRemarkToApplicationById = async (req,res) => {
  //req{ _id, app_remarks, remark_date, commenter_email, step_given }
  try {
    const {_id , app_remarks, remark_date, commenter_email, step_given } = body
    const commenter_details = await User.findOne({email: commenter_email})

    const newremark = {
      app_remarks: app_remarks,
      remark_date: remark_date,
      commenter: commenter_details._id,
      step_given: step_given
    }

    const applicationToedit = await Application.updateOne({_id: _id}, {$push: {remarks: newremark}})

    if(applicationToedit._id){
      res.send({ success:true })
    }else{
      res.send({ success:false })
    }
  } catch (error) {
    res.send({ success:false })
  }
  
}

const getAllApplicationsPending = async (req, res) => {
  const userAllApplications = await Application.find({}).where("status").equals("pending")
//   const userAllApplications = await Application.aggregate([
//     {$match: {status: "pending"}},
//     {$lookup: {
//       from : 'users',
//       localField: '_id',
//       foreignField: {$in: 'applications'},
//       as: 'userdata'
//     }},
//     {$project: {
//       _id: 1, 
//       'userdata.name': 1,
//       status: 1,
//       'student_submission.submission_date': 1
//     }},
//   ])
//   res.send(userAllApplications)
  res.send(userAllApplications)
}

const getApplicationById = async (req, res) => {
  const userApplication = await Application.findOne({}).where("_id").equals(req.query.id)
  res.send(userApplication)
}


export { addNewApplication, getAllApplicationsByUser, getNotificationsByUser, getAllApplicationsPending, getApplicationById, getLatestApplicationByUser, addRemarkToApplicationById } 