import { Container } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import Carts from "../components/Carts";
import UserContext from "../../UserContext";

export default function CartView() {
  const { user } = useContext(UserContext);
  const [cartProducts, setCartProducts] = useState([]);

  const fetchCart = () => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/carts/get-cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Cart not Found") {
          setCartProducts([]);
        } else {
          setCartProducts(data);
        }
      });
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <div className="cartPage">
      <Container>
        <Carts cartData={cartProducts} fetchCart={fetchCart} />
      </Container>
    </div>
  );
}
