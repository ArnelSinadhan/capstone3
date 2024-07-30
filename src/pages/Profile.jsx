import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import IconImg from "../assets/icon.png";
import Swal from "sweetalert2";

export default function Profile() {
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/b4/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (typeof data !== undefined) {
          setDetails(data);
        } else if (data.error === "User not found") {
          Swal.fire({
            title: "User Not Found",
            icon: "error",
            text: "User not found, please check if you're logged in or contact the administrator.",
          });
        } else {
          Swal.fire({
            title: "Profile Error",
            icon: "error",
            text: "Something went wrong, kindly contact us for assistance.",
          });
        }
      });
  }, []);

  return (
    <>
      <Container className="profile">
        <Row className="my-5">
          <Col md={6} className="icon">
            <img src={IconImg} alt="icon" className="img-fluid" />
          </Col>
          <Col md={6} xs={12} className="text-center info">
            <h1>Profile</h1>
            <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
            <hr />
            <h4>Contacts</h4>
            <p>Email: {details.email}</p>
            <p>Mobile No: {details.mobileNo}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
