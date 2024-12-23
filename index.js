const express = require("express");
const database = require("./database/database");
const dotenv = require("dotenv");
const cors = require('cors')
const { options } = require('./routes/userRoutes');
const app = express();


const corsOptions ={
  origin : true,
  credentials : true,
  optionSuccessStatus : 200
}

app.use(express.json())

app.use(cors(corsOptions))

dotenv.config();
database();

const PORT = process.env.PORT;

app.get("/Shirtify", (req, res) => {
  res.send("Test API is Working!....");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use('/api/user', require('./routes/userRoutes'));



module.exports = app;
