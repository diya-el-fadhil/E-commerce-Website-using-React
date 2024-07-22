import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import LoginSignup from "./Pages/LoginSignup";
import Profile from "./Pages/Profile";

export const backend_url = 'http://localhost:4000';
export const currency = '₹';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Shop gender="all" />} />
            <Route path="/products" element={<ShopCategory category="product" />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
