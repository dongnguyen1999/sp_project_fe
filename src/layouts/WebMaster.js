import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';

function WebMaster(props) {
  const {children} = props;
  return (
    <div className="bg-light">
      <Header />
      <Container>
        {children}
      </Container>
      <Footer />
    </div>
  );
}

export default WebMaster;