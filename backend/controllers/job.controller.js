import { Job } from "../models/job.model.js";
import SavedJob from "../models/savedJob.model.js";

// admin post krega job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Somethin is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// student k liye
export const getAllJobs = async (req, res) => {
  try {
    let keyword = req.query.keyword;

    // Sanitize keyword
    if (!keyword || keyword.trim() === '' || keyword.trim() === '""') {
      keyword = null;
    }

    let query = {};

    if (keyword) {
      query = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      message: "Server error while fetching jobs.",
      success: false,
    });
  }
};


// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// controllers/savedJob.controller.js

// controllers/savedJob.controller.js

export const saveJobForLater = async (req, res) => {
  try {
    const userId = req.id; // from middleware (token)
    const { jobId } = req.body; // sent from frontend

    // Validate input
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    // Check if this job is already saved by the user
    const alreadySaved = await SavedJob.findOne({ userId, jobId });
    if (alreadySaved) {
      return res.status(409).json({
        message: "Job already saved.",
        success: false,
      });
    }

    // Save the job
    const savedJob = await SavedJob.create({ userId, jobId });

    return res.status(201).json({
      message: "Job saved successfully.",
      savedJob,
      success: true,
    });
  } catch (error) {
    console.error("Error saving job:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

// Get all jobs saved by a user
// GET /api/job/saved
export const getSavedJobsByUser = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware

    const savedJobs = await SavedJob.find({ userId }).populate({
      path: "jobId",
      populate: {
        path: "company",
      },
    });

    const jobs = savedJobs.map((entry) => entry.jobId); // extract job details

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const unsaveJob = async (req, res) => {
  try {
    const userId = req.id; // From auth middleware (user token)
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    // Remove the saved job document for this user and job
    const deleted = await SavedJob.findOneAndDelete({ userId, jobId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job unsaved successfully.",
    });
  } catch (error) {
    console.error("Error unsaving job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
