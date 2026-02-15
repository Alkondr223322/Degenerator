const express = require('express');
const { saveProject, getProjects, loadProject} = require('../controllers/project');

const router = express.Router();

router.post('/saveProject', saveProject);
router.post('/getProjects', getProjects);
router.post('/loadProject', loadProject);

module.exports = router;