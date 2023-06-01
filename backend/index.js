import express from "express"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"

import "./models/user.js";
import setUpRoutes from "./routes.js";

//connect to mongoose
await mongoose.connect("mongodb://127.0.0.1:27017/cmsc100-project")
  .catch((err) => {console.log(err)})

//init server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type,X-Requested-With,Cookie");
  res.setHeader("Access-Control-Allow-Credentials","true");
  next();
});

setUpRoutes(app);

// start server
app.listen(3001, () => { console.log("API listening to port 3001 ")});