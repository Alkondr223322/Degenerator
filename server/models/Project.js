const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema(
    {  
        name: String,
        data: Object, // store your project JSON here
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  { timestamps: true }
)

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;