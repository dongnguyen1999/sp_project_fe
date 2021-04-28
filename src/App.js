import { Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'

// import DemoForm from "./components/forms/DemoForm";
import WebMaster from './layouts/WebMaster';
import UploadForm from './views/UploadForm';

function App() {
  return (
    <WebMaster>
      <UploadForm />
    </WebMaster>
  );
}

export default App;
