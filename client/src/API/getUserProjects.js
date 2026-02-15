import axios from "axios";

const getUserProjects = async (uID) => {
  try {
    const response = await axios.post(
      `http://${process.env.REACT_APP_SERVER_PATH}/projects/getProjects`,
      { uID }
    );

    console.log("Projects received:", response.data);

    // response.data should contain the array of project objects
    return response.data;
  } catch (error) {
    console.error("Error getting projects:", error);
    alert("Error loading saved projects");
    return [];
  }
};

export default getUserProjects;
