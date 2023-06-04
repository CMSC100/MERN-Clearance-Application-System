import { signUp, login, checkIfLoggedIn } from "./auth-controller.js";
import { getUser, getStudentAccounts, getStudentAccountByStudno, approveAccount, rejectAccount, getAdviser } from "./account-controller.js";
import { getAllApplicationsByUser, addNewApplication, getNotificationsByUser, getAllApplicationsPending, getApplicationById } from "./applications-controller.js";

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
}

export default setUpRoutes;