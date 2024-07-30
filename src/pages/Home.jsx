import { Carousel, Col, Container, Row } from "react-bootstrap";
import FeaturedProducts from "../components/FeaturedProducts";
import CarouselImg from "../assets/banner1.png";
import CarouselImg2 from "../assets/banner2.png";
import CarouselImg3 from "../assets/banner3.png";

export default function Home() {
  return (
    <>
      <Container fluid className="mt-5 pt-3">
        <Carousel interval={1000}>
          <Carousel.Item>
            <img src={CarouselImg} alt="" className="img-fluid" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={CarouselImg2} alt="" className="img-fluid" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={CarouselImg3} alt="" className="img-fluid" />
          </Carousel.Item>
        </Carousel>
      </Container>
      <Container>
        <Row>
          <FeaturedProducts />
        </Row>
      </Container>
    </>
  );
}
