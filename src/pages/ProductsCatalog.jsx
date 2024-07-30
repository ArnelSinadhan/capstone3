import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, CardGroup } from "react-bootstrap";
import ProductSearch from "../components/ProductSearch";
import UserView from "../components/UserView";
import UserContext from "../../UserContext";
import AdminView from "../components/AdminView";

export default function ProductsCatalog() {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);

  const fetchData = () => {
    let fetchUrl =
      user.isAdmin === true
        ? `${import.meta.env.VITE_API_URL}/b4/products/all`
        : `${import.meta.env.VITE_API_URL}/b4/products/active`;

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "No products found") {
          setProducts([]);
        } else {
          setProducts(data);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {user.isAdmin ? (
        <AdminView productData={products} fetchData={fetchData} />
      ) : (
        <>
          <div className="productPage">
            <Container>
              <Row>
                <Col>
                  <div className="cardsDiv mb-5">
                    <h2 className="text-center pt-5 mt-5 ">Our Products</h2>
                    <ProductSearch />

                    <CardGroup>
                      <UserView productData={products} />
                    </CardGroup>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      )}
    </>
  );
}
