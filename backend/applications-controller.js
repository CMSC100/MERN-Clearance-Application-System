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
      step: 2,
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
      'remarks.app_remark': 1,
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
  console.log(latestApplication);
  res.send(latestApplication);
}

const addSubmissionToApplicationById = async (req, res) => {
  try {
    const { applicationID, submission_date,
      submission_remark, step_given } = req.body

    const newsubmission = {
      submission_remark: submission_remark,
      submission_date: submission_date,
      step_given: step_given
    }

    console.log(newsubmission)

    const applicationToedit = await Application.updateOne({_id: applicationID}, {$push: {student_submission: newsubmission}})

    if(applicationToedit._id){
      res.send({ success:true })
    }else{
      res.send({ success:false })
    }
  } catch (error) {
    res.send({ success:false })
  }
}

const addRemarkToApplicationById = async (req,res) => {
  //req{ _id, app_remarks, remark_date, commenter_email, step_given }
  try {
    const {applicationID , app_remarks, remark_date, commenter_email, step_given } = req.body
    const commenter_details = await User.findOne({email: commenter_email})

    const newremark = {
      app_remark: app_remarks,
      remark_date: remark_date,
      commenter: commenter_details._id,
      step_given: step_given
    }

    console.log(newremark)

    const applicationToedit = await Application.updateOne({_id: applicationID}, {$push: {remarks: newremark}})

    if(applicationToedit._id){
      res.send({ success:true })
    }else{
      res.send({ success:false })
    }
  } catch (error) {
    res.send({ success:false })
  }
  
}

const approvebyAdviser = async (req, res) => {
  try {
    console.log(req.body.applicationID)
    const application = await Application.updateOne({_id: req.body.applicationID}, {step: 3})
    console.log(application)
    if(application.matchedCount > 0) {
      res.send({success: true})
    } else {
      res.send({success: false})
    }
  } catch (error) {
    res.send({success: false})
  }
}

const approvebyClearance = async (req, res) => {
  try {
    const clearance_approver = await User.findOne({email: req.body.email})
    const application = await Application.updateOne({_id: req.body.applicationID}, {step: 4, clearance_officer: clearance_approver._id, status: "cleared"})
    if(application.matchedCount > 0) {
      res.send({success: true})
    } else {
      res.send({success: false})
    }
  } catch (error) {
    res.send({success: false})
  }
}

const getAllApplicationsPending = async (req, res) => {
  const adviser = await User.findOne({email: req.query.email})
  const userAllApplications = await User.aggregate([
    {
      $match: {
        adviser: adviser._id
      }
    },
    {
      $lookup: {
        from: "applications",
        localField: "applications",
        foreignField: "_id",
        as: "matchedApplications"
      }
    },
    {
      $unwind: "$matchedApplications"
    },
    {
      $match: {
        "matchedApplications.step": 2
      }
    },
    {
      $project: {
        _id: "$matchedApplications._id",
        student_name: "$matchedApplications.student_name",
        status: "$matchedApplications.status",
        step: "$matchedApplications.step",
        remarks: "$matchedApplications.remarks",
        student_submission: "$matchedApplications.student_submission"
      }
    }
  ])
  console.log(userAllApplications)
  res.send(userAllApplications)
}

const getAllApplicationsClearance = async (req, res) => {
  const userAllApplications = await Application.find({step: 3})
  res.send(userAllApplications)
}

const getApplicationById = async (req, res) => {
  const userApplication = await Application.findOne({}).where("_id").equals(req.query.id)
  res.send(userApplication)
}

const getApplicationStep = async (req, res) => {
  const userApplicationsRef = await User.findOne({email: req.query.email}).select("applications")
  const userApplications = await Application.find({_id: {$in: userApplicationsRef.applications } })
  res.send(userApplications[userApplications.length - 1])
}


export { addNewApplication, getAllApplicationsByUser, getNotificationsByUser, getAllApplicationsPending, getApplicationById, getLatestApplicationByUser, addRemarkToApplicationById, approvebyAdviser, getAllApplicationsClearance, approvebyClearance, getApplicationStep, addSubmissionToApplicationById } 