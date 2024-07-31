import { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ productProp }) {
  const { _id, name, description, price, image } = productProp;

  return (
    <Col xs={12} lg={3} className="my-3">
      <Card className=" mx-2 h-100 ">
        <Card.Img
          src={`${import.meta.env.VITE_API_URL}/images/${image}`}
          className="previewCardImg"
        />
        <Card.Body>
          <Card.Title>
            <Link to={`/products/${_id}`} className="cardTitle">
              {name}
            </Link>
          </Card.Title>
          <Card.Text className="cardText">{description}</Card.Text>
          <h6>₱{price}</h6>
        </Card.Body>
        <Card.Footer>
          <Link className="btn btnDetails d-block" to={`/products/${_id}`}>
            Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
