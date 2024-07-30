import { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";
import Swal from "sweetalert2";

export default function AddProduct({ handleClose, fetchData }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  function createProduct(e) {
    e.preventDefault();
    console.log(file);
    let token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("file", file); // Add file to formData

    fetch(`${import.meta.env.VITE_API_URL}/b4/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Do not set Content-Type here
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Product already exists") {
          Swal.fire({
            title: "Error on Adding product",
            icon: "error",
            text: "Product already exists",
          });
        } else if (data) {
          setName("");
          setDescription("");
          setPrice("");

          Swal.fire({
            title: "Success on Adding product",
            icon: "success",
            text: "Product Added Successfully.",
          });

          handleClose();
          fetchData();
          navigate("/products");
        } else {
          Swal.fire({
            title: "Error on Adding product",
            icon: "error",
            text: "Unsuccessful Product Creation",
          });
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        Swal.fire({
          title: "Error on Adding product",
          icon: "error",
          text: "An unexpected error occurred.",
        });
      });
  }

  return user.isAdmin === true && user.id !== null ? (
    <>
      <Form onSubmit={(e) => createProduct(e)}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="file"
            required
            onChange={(e) => setFile(e.target.files[0])} // Handle file input
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-3">
          Submit
        </Button>
      </Form>
    </>
  ) : (
    <Navigate to="/products" />
  );
}
