import { Form, FormControl, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";


function Header(props) {
    return (
      <header>
        <Navbar bg="white" expand="lg">
          <Navbar.Brand href="#home">SP - WAD - Enhance Tool</Navbar.Brand>
        </Navbar>
      </header>
    );
}

export default Header;