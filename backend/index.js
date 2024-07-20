const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://diyaelfadhilph:diyaelfadhil@cluster0.eksxjnx.mongodb.net/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Image Storage Engine for Multer
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
  });
});

// Route for Images folder
app.use('/images', express.static('upload/images'));

// Middleware to Fetch User from Token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// User Schema
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

// Root API Route for Testing
app.get("/", (req, res) => {
  res.send("Root");
});

// Login Endpoint
app.post('/login', async (req, res) => {
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      success = true;
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success, token });
    } else {
      return res.status(400).json({ success: success, errors: "Please try with correct email/password" });
    }
  } else {
    return res.status(400).json({ success: success, errors: "Please try with correct email/password" });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: success, errors: "Existing user found with this email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  });
  await user.save();
  const data = { user: { id: user.id } };
  const token = jwt.sign(data, 'secret_ecom');
  success = true;
  res.json({ success, token });
});

// Get All Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// Get Latest Products
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(-8);
  res.send(arr);
});

// Get Popular Women Products
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let arr = products.slice(0, 4);
  res.send(arr);
});

// Get Related Products
app.post("/relatedproducts", async (req, res) => {
  const { category } = req.body;
  const products = await Product.find({ category });
  const arr = products.slice(0, 4);
  res.send(arr);
});

// Add Product to Cart
app.post('/addtocart', fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

// Remove Product from Cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

// Get Cart Data
app.post('/getcart', fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Add Product
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;
  const product = new Product({
    id: id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price
  });
  await product.save();
  res.json({ success: true, name: req.body.name });
});

// Remove Product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// Get User Profile
app.get('/profile', fetchuser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Start Express Server
app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
