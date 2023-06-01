import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    status: {type: String, enum: ["open", "pending", "closed", "cleared"], required: true},
    step: {type: Number, required: true},
    remarks: [{
        app_remark: {type: String, required: true},
        remark_date: {type: Date, required: true},
        commenter: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
        step_given: {type: Number, required: true}
    }],
    student_submission: {
        submission_remark: String,
        submission_date: Date,
        step_given: Number
    }
})

mongoose.model("application", ApplicationSchema)