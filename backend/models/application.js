import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    student_name: {type: String, required: true},
    clearance_officer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    status: {type: String, enum: ["open", "pending", "returned", "closed", "cleared"], required: true},
    step: {type: Number, required: true},
    remarks: [{
        app_remark: {type: String, required: true},
        remark_date: {type: Date, required: true},
        commenter: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        step_given: {type: Number, required: true}
    }],
    student_submission: [{
        submission_remark: String,
        submission_date: Date,
        step_given: Number
    }]
})

mongoose.model("Application", ApplicationSchema)