import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";

export default function CheckoutProduct() {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order details from the server or local storage
    fetch(`${import.meta.env.VITE_API_URL}/b4/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setOrderDetails(data);
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Failed to fetch order details. Please try again.",
          });
        }
      });
  }, []);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="checkout-page container mt-5">
      <h1 className="text-center">Order Confirmation</h1>
      <p className="text-center">
        Thank you for your purchase! Your order has been placed successfully.
      </p>

      <Table striped bordered hover responsive className="order-summary mt-4">
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.productsOrdered.map((item, index) => (
            <tr key={item.productId || index}>
              <td>
                <Link to={`/products/${item.productId}`}>{item.name}</Link>
              </td>
              <td className="text-center">₱{item.price}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">₱{item.subtotal}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-right">
              <strong>Total:</strong>
            </td>
            <td className="text-center">
              <strong>₱{orderDetails.totalPrice}</strong>
            </td>
          </tr>
        </tbody>
      </Table>

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
