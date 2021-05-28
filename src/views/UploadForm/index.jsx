import { Form, Row, Col, Button, Dropdown, Fade } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import "react-datepicker/dist/react-datepicker.css";
import 'react-calendar/dist/Calendar.css';
import './style.css';
import { useForm } from 'react-hook-form';
import UploadFileSelect from './components/UploadFileSelect';
import axios from 'axios';
import NotificationModal from '../../components/NotificationModal';
import { useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';

function UploadForm(props) {
  const { register, handleSubmit } = useForm();
  const fileTypes = [
    {value: 'response-set', title: 'Response Set'},
    {value: 'marking-scheme', title: 'Marking Scheme'},
  ]
  let [fileTypeIndex, setFileTypeIndex] = useState(0);
  let [showNotification, setShowNotification] = useState({
    isLoading: false,
    willShow: false,
    error: false,
    title: 'Information Notification',
    message: 'Message',
  });
  
  const submitFormHandler = async (data) => {
    console.log(data);
    setShowNotification({willShow: false, isLoading: true});
    let squad_name = data?.squad_name;
    if (fileTypeIndex === 0 && squad_name) {
      let isValidSquadName = await checkClassName(squad_name);
      if (!isValidSquadName) {
        setShowNotification({
          willShow: true,
          isLoading: false,
          error: true,
          title: 'Existed squad name',
          body: 'This squad name is exist! Please enter another name!',
        });
        return;
      }
    }
    let submitData = {
      file: data.xlsx[0],
      squad_name: data?.squad_name,
      file_type: fileTypes[fileTypeIndex].value,
    }
    if (fileTypeIndex === 0 && !submitData.squad_name) {
      setShowNotification({
        willShow: true,
        isLoading: false,
        error: true,
        title: 'Require squad name',
        body: 'Squad name is required! Please enter squad name!',
      });
      return;
    }
    if (!submitData.file) {
      setShowNotification({
        willShow: true,
        isLoading: false,
        error: true,
        title: 'Require file',
        body: 'Please pick your xlsx file!',
      });
      return;
    }
    const url = '/api/upload-xlsx';
    const formData = new FormData();
    for (const [key, value] of Object.entries(submitData)) {
      console.log(`${key}: ${value}`);
      if (key === 'xlsx') {
        formData.append('xlsx',value[0]);
      }
      else formData.append(key ,value);
    }
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        crossdomain: true,
    }
    setTimeout(() => {
      postUploadXlsx(url, formData, config);
    }, 1000); //Just for test time; DO NOT delay before send request on release
  }

  const checkClassName = (className) => {
    const url = `/api/upload-xlsx?squad_name=${className}`;
    return axios.get(url).then(response => {
      if (response.status === 200) {
        return response.data;
      } else {
        setShowNotification({
          willShow: true,
          isLoading: false,
          error: true,
          title: 'Error',
          body: 'Internal server error!',
        });
      }
    }).catch(error => {
      setShowNotification({
        willShow: true,
        isLoading: false,
        error: true,
        title: 'Error',
        body: `Error occurred: ${error}`,
      });
    });
  }

  const postUploadXlsx = (url, formData, config) => {
    axios.post(url, formData, config).then(response => response.data).then(response => {
      console.log(response);
      if (response && response.errorCode === 0) {
        setShowNotification({
          willShow: true,
          isLoading: false,
          error: false,
          title: 'Successfully',
          body: response.message,
        });
      } else {
        setShowNotification({
          willShow: true,
          isLoading: false,
          error: true,
          title: 'Error',
          body: response.message,
        });
      }
    }).catch(error => {
      setShowNotification({
        willShow: true,
        isLoading: false,
        error: true,
        title: 'Error',
        body: `Error occurred: ${error}`,
      });
    });
  } 

  return (
    <LoadingOverlay
        active={showNotification.isLoading}
        spinner
        text='Uploading content'
        >
      <Container className="pt-4 pb-4">
        <Form className="d-block mx-auto" onSubmit={handleSubmit(submitFormHandler)}>
          <h1 className="form-title">Enhance tool: Upload files</h1>
          <Container className="bg-white p-5 d-flex justify-content-center" style={{height: 750}}>
            <Row className="d-flex justify-content-center align-items-center" style={{width: 700}}>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Upload file type:</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle className="w-100 font-weight-bold" variant="primary" id="dropdown-basic">
                      {
                        fileTypes[fileTypeIndex].title
                      }
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item onClick={() => setFileTypeIndex(0)} >Response Set</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFileTypeIndex(1)} >Marking Scheme</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Fade in={fileTypes[fileTypeIndex].value === 'response-set'}>
                  <Form.Group>
                    <Form.Label>Squad Name:</Form.Label>
                    <Form.Control type="text" name="squad_name" ref={register}/>
                  </Form.Group>  
                </Fade>
                <UploadFileSelect name="xlsx" ref={register} require />
                <Container fluid>
                  <Row className="mt-5">
                    <Col xs={6} className="d-flex justify-content-center align-items-center">
                      <Button variant="danger" type="reset" className="px0" onClick={() => checkClassName('dong')}>
                        Cancel
                      </Button>
                    </Col>
                    <Col xs={6} className="d-flex justify-content-center align-items-center">
                      <Button variant="primary" type="submit" className="px0">
                        Upload
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>

          <NotificationModal 
            show={showNotification.willShow} 
            title={showNotification.title} 
            body={showNotification.body}
            variant={showNotification.error ? 'danger': 'success'}
            onClose={() => setShowNotification({...showNotification, isLoading: false, willShow: false})}
          />
          
        </Form>  
      </Container>
    </LoadingOverlay>
  )
}

export default UploadForm;