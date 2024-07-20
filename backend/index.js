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

// Detailed logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://your-mongo-db-connection-string", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User model
const User = mongoose.model("User", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Product model
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Middleware to fetch user from token
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ errors: "No token provided" });
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Invalid token" });
  }
};

// Image Storage Engine for file uploads
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Serve static files for images
app.use('/images', express.static('upload/images'));

// API Routes
app.get("/", (req, res) => {
  res.send("Root");
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  let success = false;
  let user = await User.findOne({ email: req.body.email });
  if (user && req.body.password === user.password) {
    const data = { user: { id: user.id } };
    success = true;
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success, token });
  } else {
    res.status(400).json({ success, errors: "Invalid email/password" });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  let success = false;
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).json({ success, errors: "Email already exists" });
  }

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: Array(300).fill(0),
  });

  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  success = true;
  res.json({ success, token });
});

// Get all products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});

// Get new collections
app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find({});
    const arr = products.slice(-8);
    res.json(arr);
  } catch (error) {
    console.error('Error fetching new collections:', error);
    res.status(500).send('Server Error');
  }
});

// Get popular products in women
app.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const arr = products.slice(0, 4);
    res.json(arr);
  } catch (error) {
    console.error('Error fetching popular women products:', error);
    res.status(500).send('Server Error');
  }
});

// Get related products
app.post("/relatedproducts", async (req, res) => {
  try {
    const { category } = req.body;
    const products = await Product.find({ category });
    const arr = products.slice(0, 4);
    res.json(arr);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).send('Server Error');
  }
});

// Add product (admin)
app.post("/addproduct", async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const product = new Product({ ...req.body, id });
    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Server Error');
  }
});

// Remove product (admin)
app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).send('Server Error');
  }
});

// Upload image
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
  });
});

// Get user profile
app.get('/profile', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send("Server Error");
  }
});

// Update user profile
app.post('/profile/update', fetchUser, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send("Server Error");
  }
});

// Start server
app.listen(port, (error) => {
  if (!error) console.log(`Server running on port ${port}`);
  else console.log("Error : ", error);
});
