import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function RemoveCartItem({ itemId, fetchCart }) {
  const handleDelete = (itemId) => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/carts/remove-from-cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productId: itemId,
      }),
    })
      .then((res) => {
        console.log("Response status: ", res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.message);

        if (data.message === "Item removed from cart successfully") {
          Swal.fire({
            title: "Item/items removed from the cart!",
            icon: "info",
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

  return (
    <div className="d-flex justify-content-center">
      <Button variant="danger" onClick={() => handleDelete(itemId)}>
        Remove
      </Button>
    </div>
  );
}
