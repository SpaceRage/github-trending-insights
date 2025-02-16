import axios from "axios";

const API_URL = "http://localhost:8000/trending";

export const fetchTrendingRepos = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data);
    return response.data.trending_repos;
  } catch (error) {
    console.error("Error fetching trending repos:", error);
    throw error;
  }
};
