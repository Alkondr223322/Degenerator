import axios from "axios";

const projectSave = async (projObj, uID) => {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_PATH}/projects/saveProject`,
        { projObj, uID }
      );
      console.log("Project saved:", response.data);
      alert('Project saved successfully')
    } catch (error) {
      console.error("Error saving project:", error);
      alert('Error saving project')
    }
  };

  
export default projectSave;