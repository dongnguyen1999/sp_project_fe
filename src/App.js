import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'

// import DemoForm from "./components/forms/DemoForm";
import WebMaster from './layouts/WebMaster';
import UploadForm from './views/UploadForm';

function App() {
  useEffect(() => {
    document.title = "SP-WAD- Enhance Tool"
  }, []);
  return (
    <WebMaster>
      <UploadForm />
    </WebMaster>
  );
}

export default App;
