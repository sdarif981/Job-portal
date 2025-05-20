// SavedJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { JOB_API_END_POINT } from "@/utils/constant";
import SavedJob from "./SavedJob";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getSavedJobs`, {
          withCredentials: true,
        });
        setSavedJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsave = (jobId) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <h2 className="text-2xl font-semibold mb-4">Your Saved Jobs</h2>
        {savedJobs.length === 0 ? (
          <p>No saved jobs found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <SavedJob key={job._id} job={job} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
