import { signUp, login, checkIfLoggedIn } from "./auth-controller.js";
import { getUser, getStudentAccounts, getStudentAccountByStudno, approveAccount, rejectAccount, getAdviser, getApproverAccounts, deleteApprover, getApproverAccountByEmail, editApprover, getAdviserAccounts, assignAdviser, getClearanceOfficer } from "./account-controller.js";
import { getAllApplicationsByUser, addNewApplication, getNotificationsByUser, getAllApplicationsPending, getApplicationById, getLatestApplicationByUser, addRemarkToApplicationById, approvebyAdviser, getAllApplicationsClearance, approvebyClearance, getApplicationStep, addSubmissionToApplicationById, getClearanceOfficerByApplicationId, closeApplication, getAllRemarks, getAllSubmissions } from "./applications-controller.js";

const setUpRoutes = (app) => {
  app.get("/", (req, res) => { res.send("API Home") });
  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);
  app.get("/get-user", getUser)
  app.get("/get-student-accounts", getStudentAccounts)
  app.get("/get-applications-by-user", getAllApplicationsByUser)
  app.post("/add-application", addNewApplication)
  app.get("/get-student-account-by-studno", getStudentAccountByStudno)
  app.post("/approve-student-account", approveAccount);
  app.post("/reject-student-account", rejectAccount);
  app.get("/get-notifications-by-user", getNotificationsByUser)
  app.get("/get-all-applications-pending", getAllApplicationsPending)
  app.get("/get-application-by-id", getApplicationById)
  app.get("/get-adviser", getAdviser)
  app.get("/get-clearance-officer", getClearanceOfficer)
  app.get("/get-latest-application-by-user", getLatestApplicationByUser)
  app.post("/add-remark-by-application-id", addRemarkToApplicationById)
  app.get("/get-approver-accounts", getApproverAccounts)
  app.post("/delete-approver-account", deleteApprover);
  app.get("/get-approver-account-by-email", getApproverAccountByEmail)
  app.post("/edit-approver", editApprover)
  app.get("/get-adviser-accounts", getAdviserAccounts)
  app.post("/assign-adviser", assignAdviser)
  app.post("/approve-by-adviser", approvebyAdviser)
  app.get("/get-all-applications-clearance", getAllApplicationsClearance)
  app.post("/approve-by-clearance", approvebyClearance)
  app.get("/get-application-step", getApplicationStep)
  app.post("/add-submission-by-application-id", addSubmissionToApplicationById)
  app.get("/get-clearance-officer-by-application-id", getClearanceOfficerByApplicationId)
  app.post("/close-application", closeApplication)
  app.get("/get-all-remarks", getAllRemarks)
  app.get("/get-all-submissions", getAllSubmissions)
  // app.post("/update-step", updateStep)
}

export default setUpRoutes;