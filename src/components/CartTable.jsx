import { Button, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import RemoveCartItem from "./RemoveCartItem";
import ClearCart from "./ClearCart";
import shippingImg from "../assets/shipping.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CartTable({ cartProp, fetchCart }) {
  const { userId, cartItems, totalPrice } = cartProp;
  const [totalQuantity, setTotalQuantity] = useState(0);
  const navigate = useNavigate();

  function CartItemRow({ item, fetchCart }) {
    const { productId, name, price, quantity, subtotal } = item;
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
      fetch(
        "https://capstone2-dn1l.onrender.com/b4/carts/update-cart-quantity",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId,
            quantity: qty,
          }),
        }
      )
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
      <tr>
        <td>
          <Link to={`/products/${productId}`}>{name}</Link>
        </td>
        <td className="text-center">₱{price}</td>
        <td>
          <div className="plus-minus d-flex justify-content-center my-1">
            <Button onClick={minus} className="btn btn-dark">
              -
            </Button>
            <input
              type="number"
              value={qty}
              onChange={changedQty}
              className="form-control"
              style={{ width: "4rem", textAlign: "center" }}
            />
            <Button onClick={plus} className="btn btn-dark">
              +
            </Button>
          </div>
        </td>
        <td>
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
        </td>
        <td className="text-center">₱{subtotal}</td>
        <td>
          <RemoveCartItem itemId={productId} fetchCart={fetchCart} />
        </td>
      </tr>
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
    fetch("https://capstone2-dn1l.onrender.com/b4/orders/checkout", {
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
      {/* <h1 className="text-center py-4">Your Shopping Cart</h1>
      <Table striped bordered hover responsive className="cartTable">
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Edit</th>
            <th>Subtotal</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <CartItemRow
              key={item.productId || index}
              item={item}
              fetchCart={fetchCart}
            />
          ))}
          <tr>
            <td colSpan="3" className="text-center">
              <h5 className="pt-2" style={{ fontStyle: "italic" }}>
                Shop till you drop!
              </h5>
            </td>
            <td colSpan="3">
              <h3 className="text-center">Total: ₱{totalPrice}</h3>
            </td>
          </tr>
          <tr>
            <td colSpan="6">
              <div className="d-flex justify-content-between px-2">
                <Button variant="primary" onClick={handleCheckout}>
                  Check Out ({totalQuantity})
                </Button>
                <h5 style={{ fontStyle: "italic" }} className="pt-2">
                  <img
                    src={shippingImg}
                    alt="shipping Image"
                    className="img-fluid"
                    style={{ width: "100px", height: "auto" }}
                  />
                  Free shipping with min order of ₱3,000!
                </h5>
                <ClearCart user={userId} fetchCart={fetchCart} />
              </div>
            </td>
          </tr>
        </tbody>
      </Table> */}
    </>
  );
}
