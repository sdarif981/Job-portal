import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, getSavedJobsByUser, postJob, saveJobForLater, unsaveJob, } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get( getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/save").post(isAuthenticated, saveJobForLater);
router.route("/getSavedJobs").get(isAuthenticated, getSavedJobsByUser);
router.route("/unsave").post(isAuthenticated, unsaveJob);
export default router;
