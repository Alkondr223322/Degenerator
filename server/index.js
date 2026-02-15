const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const genRoutes = require('./routes/gen')
const projectRoutes = require('./routes/project')
const cors = require('cors')
const mailBox = require('./middlewares/mail')
//console.log(mailBox)


const app = express();
const PORT = process.env.PORT || 3000;
// const HOSTNAME = '192.168.0.182';
const HOSTNAME = 'localhost';

app.set('mailBox',mailBox)
app.use(cors())
// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json({ limit: '50mb' }));

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

// Define generation routes
app.use('/gen', genRoutes);

// Define project routes
app.use('/projects', projectRoutes);

//app.post('/auth/login', ()=>{console.log("sjdhshdsdj")})

// Start the server
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});