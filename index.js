const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/db'); 
const {apiRouter} = require('./routes/server');
const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

connectMongoDB(); 
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
