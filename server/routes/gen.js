const express = require('express');
const { genText, genImage, genMusic, genSpeech, genVideo} = require('../controllers/gen');
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // keeps file in memory
router.post('/genText', genText);
router.post('/genImage', genImage);
router.post('/genSpeech', genSpeech);
router.post('/genMusic', genMusic);
router.post('/genVideo', upload.single("baseImage"), genVideo);

module.exports = router;