const express = require("express");
const database = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(fileUpload());

app.use(express.json());

app.use(cors(corsOptions));

app.use(express.static("public"));

dotenv.config();
database();

const PORT = process.env.PORT;

app.get("/Shirtify", (req, res) => {
  res.send("Test API is Working!....");
});



app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/review', require('./routes/review&ratingRoutes'))
app.use('/api/favourites', require('./routes/favouritesRoutes'))
app.use('/api/order', require('./routes/orderRoutes'))
app.use('/api/khalti',  require('./routes/paymentRoutes'));

app.post("/khalti-api", async (req, res) => {
  try {
      const payload = req.body;
      const khaltiResponse = await axios.post("https://a.khalti.com/api/v2/epayment/initiate/", payload, {
          headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          },
      });

      if (khaltiResponse.data) {
          res.send({
              success: true,
              data: khaltiResponse.data
          });
      } else {
          res.send({
              success: false,
              message: "Error in initiating"
          });
      }
  } catch (error) {
      console.error("Error initiating Khalti payment:", error.response ? error.response.data : error.message);
      res.status(500).send({
          success: false,
          message: "Error in initiating",
          error: error.message
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
