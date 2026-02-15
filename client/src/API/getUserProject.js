import axios from "axios";

const getUserProject = async (uID, projID) => {
  try {
    const response = await axios.post(
      `http://${process.env.REACT_APP_SERVER_PATH}/projects/loadProject`,
      { uID, projID }
    );

    console.log("Project received:", response.data);

    // The backend returned some JSON object representing your saved project
    const projJSON = response.data;

    // Convert JSON → string → File
    const fileContent = JSON.stringify(projJSON, null, 2);
    const projFile = new File([fileContent], projJSON.name || "project.json", {
      type: "application/json",
    });

    return projFile;

  } catch (error) {
    console.error("Error getting project:", error);
    alert("Error loading saved project");
    return null;
  }
};

export default getUserProject;
