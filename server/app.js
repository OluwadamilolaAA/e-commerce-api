const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");;
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./src/config/db");
const authRoute = require("./src/modules/auth/auth.route");
const userRoute = require("./src/modules/user/user.route");
const productRoute = require("./src/modules/products/product.route");
const reviewRoute = require("./src/modules/reviews/review.route");
const orderRoute = require("./src/modules/orders/order.route")
const notFound = require("./src/middleware/not_found");
const errorHandler = require("./src/middleware/error_handler");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.static("./public"));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())

app.get("/", (req, res) => {
    res.send("Welcome to the E-commerce API");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/review", reviewRoute);
app.use("/api/orders", orderRoute)

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
})