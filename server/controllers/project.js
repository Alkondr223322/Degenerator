const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require("../models/Project.js");



const saveProject = async (req, res, next) => {
    const { projObj, uID} = req.body;
    console.log(uID)
    try {
    if (!projObj || !projObj.projectName) {
      return res.status(400).json({ error: "Invalid project data" });
    }

    // 1. Save project in Project collection
    const newProject = new Project({
      name: projObj.projectName,
      data: projObj,
      owner: uID, // optional if your Project schema supports it
    });
    const savedProject = await newProject.save();
    console.log(savedProject)
    // 2. Update the User document to include project reference
    await User.findByIdAndUpdate(uID, {
      $push: {
        projects: {
          name: projObj.projectName,
          objID: savedProject._id,
        },
      },
    });

    res.json({
      message: "Project saved successfully",
      projectID: savedProject._id,
    });
  } catch (e) {
    console.log(e)
    next(e);
  }

}

const getProjects = async (req, res, next) => {
  const {uID} = req.body;
  try {
    const user = await User.findOne({ _id: uID });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ projects: user.projects });
  } catch (e) {
    next(e);
  }
}

const loadProject = async (req, res, next) => {
  const { uID, projID } = req.body;

  try {
    if (!uID || !projID) {
      return res.status(400).json({ error: "Missing uID or projID" });
    }

    // Look for a project owned by this specific user
    const project = await Project.findOne({ 
      _id: projID,
      owner: uID
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Return ONLY the data field, which is your stored project JSON
    res.json(project.data);

  } catch (e) {
    console.error("Error loading project:", e);
    next(e);
  }
};


module.exports = { saveProject, getProjects, loadProject};
