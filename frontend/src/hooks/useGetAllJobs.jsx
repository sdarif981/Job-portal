import { setLoading } from '@/redux/authSlice'
import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ✅ useGetAllJobs.js
const useGetAllJobs = (customQuery = null) => {
  const dispatch = useDispatch();
  const searchedQuery = useSelector(store => store.job.searchedQuery);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const keyword = customQuery !== null ? customQuery : searchedQuery;
        const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${keyword}`, {
          withCredentials: true
        });
        if (res.data.success) {
          console.log("Fetched jobs for query:", keyword, res.data.jobs);
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllJobs();
  }, [customQuery ?? searchedQuery]);
};


export default useGetAllJobs