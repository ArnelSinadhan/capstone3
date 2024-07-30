import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { UserProvider } from "../UserContext";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import ProductsCatalog from "./pages/ProductsCatalog";
import ProductView from "./pages/ProductView";
import CartView from "./pages/CartView";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import { Link } from "react-router-dom";
import ShopNowImg from "./assets/shopNow.png";
import CheckoutProduct from "./pages/CheckoutProduct";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    firstName: null,
  });

  function unsetUser() {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: null,
      firstName: null,
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/b4/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data._id) {
            setUser({
              id: data._id,
              isAdmin: data.isAdmin,
              firstName: data.firstName,
            });
          } else {
            setUser({
              id: null,
              isAdmin: null,
              firstName: null,
            });
          }
        })
        .catch(() => {
          setUser({
            id: null,
            isAdmin: null,
            firstName: null,
          });
        });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsCatalog />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/checkout" element={<CheckoutProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
