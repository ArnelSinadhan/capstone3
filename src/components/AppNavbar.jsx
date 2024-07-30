import { Nav, Navbar, Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../UserContext";

export default function AppNavbar() {
  const { user, unsetUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    unsetUser();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="navBar" fixed="top">
      <Container>
        <Navbar.Brand className="navBrand text-warning" as={NavLink} to="/">
          ShopEase
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/products">
              Products
            </Nav.Link>
            {user.id !== null && user.id !== undefined ? (
              user.isAdmin ? (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/profile"
                    className="navLink px-2 px-lg-3">
                    Hi {user.firstName}
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    onClick={handleLogout}
                    className="navLink ps-2 ps-lg-3">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/profile"
                    className="navLink px-2 px-lg-3">
                    Hi {user.firstName}
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/cart"
                    className="navLink px-2 px-lg-3">
                    Shopping Cart
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    onClick={handleLogout}
                    className="navLink ps-2 ps-lg-3">
                    Logout
                  </Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  className="navLink px-2 px-lg-3">
                  Login
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/register"
                  className="navLink ps-2 ps-lg-3">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
