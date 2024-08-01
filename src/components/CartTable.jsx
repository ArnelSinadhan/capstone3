import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import RemoveCartItem from "./RemoveCartItem";
import ClearCart from "./ClearCart";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CartTable({ cartProp, fetchCart }) {
  const { userId, cartItems, totalPrice } = cartProp;
  const [totalQuantity, setTotalQuantity] = useState(0);
  const navigate = useNavigate();

  function CartItemRow({ item, fetchCart }) {
    const { productId, name, price, quantity, subtotal, image } = item;
    const [qty, setQty] = useState(quantity);
    const [isFunctional, setIsFunctional] = useState(false);

    const plus = () => {
      if (qty < 10) {
        setQty((prevValue) => prevValue + 1);
      } else {
        Swal.fire({
          title: "Oops!",
          icon: "warning",
          text: "Alert: Maximum of 10pcs per product only.",
        });
        setQty(quantity);
      }
    };

    const minus = () => {
      setQty((prevValue) => Math.max(prevValue - 1, 1));
    };

    const changedQty = (event) => {
      const newQty = parseInt(event.target.value, 10);
      if (!isNaN(newQty) && newQty >= 0) {
        setQty(newQty);
      }
    };

    const updateCartQuantity = (productId) => {
      fetch(`${import.meta.env.VITE_API_URL}/b4/carts/update-cart-quantity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId,
          quantity: qty,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Item quantity updated successfully") {
            Swal.fire({
              title: "Item quantity updated successfully!",
              icon: "success",
              text: `Updated quantity in cart: ${qty}`,
            });
            fetchCart();
          } else {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Something went wrong. Please try again. If the error persists, please consult with the Administrator.",
            });
            fetchCart();
          }
        });
    };

    useEffect(() => {
      if (qty !== quantity && qty !== 0 && qty <= 10) {
        setIsFunctional(true);
      } else {
        setIsFunctional(false);
      }
    }, [qty]);

    return (
      <>
        <Container>
          <Row>
            <Col className="shoppingCart my-3">
              <Row className="justify-content-center align-items-center">
                <Col
                  lg={3}
                  className="d-flex flex-column justify-content-center align-items-center my-3">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/b4/products/images/${image}`}
                    alt="product Images"
                    className="img-fluid "
                    width={150}
                    height={150}
                  />
                  <Link to={`/products/${productId}`}>{name}</Link>
                  <p className="text-center">₱{price}</p>
                </Col>
                <Col
                  lg={3}
                  className=" d-flex justify-content-center align-items-center my-3">
                  <Container className="p-0 quantityBox ">
                    <Container className="quantityWrapper">
                      <Button onClick={minus} className="btnMinus">
                        -
                      </Button>
                      <input
                        type="text"
                        value={qty}
                        onChange={changedQty}
                        className="addToCartInput"
                        style={{
                          width: "6rem",
                          textAlign: "center",
                          backgroundColor: "transparent",
                        }}
                      />
                      <Button onClick={plus} className="btnPlus">
                        +
                      </Button>
                    </Container>
                  </Container>
                </Col>
                <Col lg={3} className="my-3">
                  {isFunctional ? (
                    <div className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        onClick={() => updateCartQuantity(productId)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Button variant="danger" disabled>
                        Save
                      </Button>
                    </div>
                  )}
                </Col>
                <Col
                  lg={3}
                  className="d-lg-flex  justify-content-center align-items-center gap-4 my-3">
                  <p className="text-center m-0">₱{subtotal}</p>
                  <RemoveCartItem itemId={productId} fetchCart={fetchCart} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  useEffect(() => {
    if (cartProp) {
      const totalQty = cartProp.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      setTotalQuantity(totalQty);
    }
  }, [cartProp]);

  const handleCheckout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Ordered successfully") {
          Swal.fire({
            title: "Checkout Successful!",
            icon: "success",
            text: "Your order has been placed.",
          });
          navigate("/checkout");
        } else if (data.error === "No items to checkout") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "No items found in cart please go to products and add some items!",
          });
          navigate("/products");
        } else {
          Swal.fire({
            title: "error",
            icon: "error",
            text: "Something went wrong!",
          });
        }
      });
  };
  return (
    <>
      <h1 className="pt-5 mt-5">Your Shopping Cart</h1>

      {cartItems.map((item, index) => (
        <CartItemRow
          key={item.productId || index}
          item={item}
          fetchCart={fetchCart}
        />
      ))}
      <div className="d-lg-flex  justify-content-between">
        <h3>Total: ₱{totalPrice}</h3>
        <div className="d-xs-grid">
          <Button
            onClick={handleCheckout}
            className="mx-4 checkOutBtn p-2 px-4">
            Check Out ({totalQuantity})
          </Button>
          <ClearCart user={userId} fetchCart={fetchCart} />
        </div>
      </div>
    </>
  );
}
