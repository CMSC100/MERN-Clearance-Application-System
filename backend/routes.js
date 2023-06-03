import { signUp, login, checkIfLoggedIn } from "./auth-controller.js";
import { getUser, getStudentAccounts, getStudentAccountByStudno } from "./account-controller.js";
import { getAllApplicationsByUser, addNewApplication } from "./applications-controller.js";

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
}

export default setUpRoutes;