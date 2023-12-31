import express, { Router } from "express";
import serverless from "serverless-http";
import {defaultRoutes} from "../routes/talent/main.ts";
// import { routePaths } from "../config/constants";
import helmet from "helmet";
import cors from "cors";
import path from "path";

// Create an instance of the Express app
const app = express();
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// Create a router to handle routes
const router = Router();

// Define a route that responds with a JSON object when a GET request is made to the root path
router.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});
router.get("/run", (req, res) => {
  res.json("Server running...");
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);
defaultRoutes.forEach((route) => {
  router.use(`/.netlify/functions/api${routePaths.baseURL}`, route.route);
  // app.use(`/.netlify/functions/api${routePaths.baseURL}`, routes);
});

// Export the app and the serverless function
export default app;
export const handler = serverless(app);
