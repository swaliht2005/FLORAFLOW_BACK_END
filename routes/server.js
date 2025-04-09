
const express = require('express');
const  {authRouter}  = require('./authRoutes'); // Correct import

const router = express.Router();

router.use('/user', authRouter); // Routes will be `/api/user/register`



module.exports = { apiRouter: router }; 
