import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ShowUserOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/orders/all-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "No order found") {
          Swal.fire({
            title: "Error!",
            icon: "error",
            text: "No orders found!",
          });
        } else {
          setOrders(data);
        }
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Orders</h2>
      <Accordion>
        {orders.map((order) => (
          <Accordion.Item eventKey={order._id} key={order._id}>
            <Accordion.Header>UserId: {order.userId}</Accordion.Header>
            {order.productsOrdered.map((item) => (
              <Accordion.Body key={item._id}>
                <h1>Item Name: {item.name} </h1>
                <h3>Price: {item.price}</h3>
                <h4>Quantity: {item.quantity}</h4>
              </Accordion.Body>
            ))}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
