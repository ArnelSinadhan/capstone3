import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function DisableProduct({ product, isActive, fetchData }) {
  const disableProduct = (productId) => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/products/${productId}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Product archived successfully") {
          Swal.fire({
            title: "Success!",
            icon: "success",
            text: "Product Disabled successfully",
          });
          fetchData();
        }
      });
  };

  const enableProduct = (productId) => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/products/${productId}/activate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Product activated successfully") {
          Swal.fire({
            title: "Success!",
            icon: "success",
            text: "Product Enable successfully",
          });
          fetchData();
        }
      });
  };
  return (
    <>
      {isActive ? (
        <Button
          variant="danger"
          size="sm"
          className="mx-3"
          onClick={() => disableProduct(product)}>
          Disable
        </Button>
      ) : (
        <Button
          variant="success"
          size="sm"
          className="mx-3"
          onClick={() => enableProduct(product)}>
          Enable
        </Button>
      )}
    </>
  );
}
