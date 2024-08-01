import { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../../UserContext";

export default function ProductView() {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [isClickable, setIsClickable] = useState(false);

  const increment = () => {
    if (quantity < 10) {
      setQuantity((prevValue) => prevValue + 1);
    } else {
      Swal.fire({
        title: "Oops!",
        icon: "warning",
        text: "Alert: Maximum of 10pcs per product only.",
      });
    }
  };

  const decrement = () => {
    setQuantity((prevValue) => Math.max(prevValue - 1, 0)); // Prevent negative values
  };

  const handleChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  function addCart(productId) {
    fetch(`${import.meta.env.VITE_API_URL}/b4/carts/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.message);

        if (data.message === "Action Forbidden") {
          Swal.fire({
            title: "Admin Forbidden",
            icon: "error",
            text: "You are an Administrator you may not add a cart.",
          });
        } else if (
          data.message === "Items added to cart successfully" ||
          "Cart updated successfully"
        ) {
          Swal.fire({
            title: "Item added to cart successfully!",
            icon: "success",
            text: `Total items in cart: ${quantity}`,
          });

          navigate("/products");
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Something went wrong. Please try again. If the error persists, please consult with the Administrator.",
          });
        }
      });
  }

  useEffect(() => {
    console.log(productId);

    fetch(`${import.meta.env.VITE_API_URL}/b4/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setImage(data.image);
      });
  }, [productId]);

  useEffect(() => {
    if (quantity !== null && quantity !== 0 && quantity <= 10) {
      setIsClickable(true);
    } else {
      setIsClickable(false);
    }
  }, [quantity]);

  return (
    <Container className="mt-5 pt-5">
      <Row className="align-items-center">
        <Col lg={4}>
          <img
            src={`${import.meta.env.VITE_API_URL}/b4/products/images/${image}`}
            alt=""
            className="img-fluid card-img"
          />
        </Col>
        <Col lg={8} className="p-3">
          <h2 className="py-2">{name}</h2>
          <p>{description}</p>
          <h4>Price: </h4>
          <p>₱{price}</p>
          <h4>Quantity: </h4>
          <Container className="p-0 mb-3 quantityBox ">
            <Container className="quantityWrapper">
              <Button onClick={decrement} className="btnMinus">
                -
              </Button>
              <input
                type="text"
                value={quantity}
                onChange={handleChange}
                className="addToCartInput"
                style={{ width: "6rem", textAlign: "center" }}
              />
              <Button onClick={increment} className="btnPlus">
                +
              </Button>
            </Container>
          </Container>
          {user.id !== null && user.id !== undefined ? (
            isClickable ? (
              <div className="d-grid">
                <Button
                  size="lg"
                  variant="primary"
                  block="true"
                  onClick={() => addCart(productId)}>
                  Add to Cart
                </Button>
              </div>
            ) : (
              <div className="d-grid">
                <Button size="lg" variant="danger" block="true" disabled>
                  Add to Cart
                </Button>
              </div>
            )
          ) : (
            <Link className="btn btn-danger d-block" to="/login">
              Log in to add a cart
            </Link>
          )}
        </Col>
      </Row>
    </Container>
  );
}
