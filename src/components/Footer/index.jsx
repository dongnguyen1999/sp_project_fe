import { Col, Container, Row } from "react-bootstrap";
import './style.css'

function Footer(props) {
    return (
      <footer color="blue" className="font-small pt-4 mt-4">
        <div className="footer-copyright text-center py-3 bg-white">
          <Container fluid>
            &copy; {new Date().getFullYear()} Copyright
          </Container>
        </div>
      </footer>
    );
}

export default Footer;