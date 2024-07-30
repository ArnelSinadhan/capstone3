import { Container, Row, Col, Form, Button } from "react-bootstrap";
import loginImg from "../assets/login.png";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  function handleLoginSubmit(e) {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/b4/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access !== undefined) {
          localStorage.setItem("token", data.access);
          retrieveUserDetails(data.access);

          setEmail("");
          setPassword("");

          Swal.fire({
            title: "Login Success!",
            icon: "success",
            text: "You are now logged in.",
          }).then(() => {
            navigate("/");
          });
        } else if (data.message === "Email and password do not match") {
          Swal.fire({
            title: "Login Failed",
            icon: "error",
            text: "Incorrect email or password.",
          });
        } else {
          Swal.fire({
            title: "User Not Found",
            icon: "error",
            text: `${email} does not exist.`,
          });
        }
      })
      .catch((error) => {
        console.error("There was an error with the login request:", error);
        Swal.fire({
          title: "Login Error",
          icon: "error",
          text: "There was an error processing your login. Please try again.",
        });
      });
  }

  function retrieveUserDetails(token) {
    fetch(`${import.meta.env.VITE_API_URL}/b4/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (
    <Container>
      <Row className="loginForm mt-5 p-5">
        <Col md={{ order: "first", span: 6 }} className="logInImg">
          <img src={loginImg} alt="eCommerce" className="img-fluid" />
        </Col>
        <Col md={6} xs={12} className="logInForm">
          <Form onSubmit={handleLoginSubmit} className="my-5">
            <h1 className="text-center">Log in</h1>
            <p>Enter your details</p>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {isActive ? (
              <Button variant="success" id="loginBtn" size="lg" type="submit">
                Login
              </Button>
            ) : (
              <Button variant="danger" id="loginBtn" size="lg" type="submit">
                Login
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
