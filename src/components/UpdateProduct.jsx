import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function UpdateProduct({ product, fetchData }) {
  const [productId, setProductId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const openModal = (productId) => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProductId(data._id);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
      });

    setShowModal(true);
  };

  function closeEdit() {
    setShowModal(false);
    setName("");
    setDescription("");
    setPrice(0);
  }
  const editProduct = (e, productId) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/b4/products/${productId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Product updated successfully") {
          Swal.fire({
            title: "Success!",
            icon: "success",
            text: "Product updated successfully",
          });

          closeEdit();
          fetchData();
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Error updating product",
          });
          closeEdit();
          fetchData();
        }
      });
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className="mx-3"
        onClick={() => openModal(product)}>
        Update
      </Button>
      {/* Modal */}

      <Modal show={showModal} onHide={closeEdit} size="lg" centered>
        <Form onSubmit={(e) => editProduct(e, productId)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
