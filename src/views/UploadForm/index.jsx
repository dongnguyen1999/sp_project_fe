import { Form, Row, Col, Button, Dropdown, Fade } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import "react-datepicker/dist/react-datepicker.css";
import 'react-calendar/dist/Calendar.css';
import './style.css';
import { useForm } from 'react-hook-form';
import UploadFileSelect from './components/UploadFileSelect';
import axios from 'axios';
import NotificationModal from '../../components/NotificationModal';
import { useEffect, useRef, useState } from 'react';
import ProgressBarModal from '../../components/ProgressBarModal';
import moment from 'moment';
import { MD5 } from 'crypto-js';

function UploadForm(props) {
  const { register, handleSubmit } = useForm();
  const fileTypes = [
    {value: 'response-set', title: 'Response Set'},
    {value: 'marking-scheme', title: 'Marking Scheme'},
  ]
  let [fileTypeIndex, setFileTypeIndex] = useState(0);
  let [uploadProgress, setUploadProgress] = useState(0);
  let [fileSelected, setFileSelected] = useState(false);
  let [fileName, setFileName] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let [showNotification, setShowNotification] = useState(false);
  let [hashKey, setHashKey] = useState(null);
  let [notification, setNotification] = useState({
    error: false,
    title: 'Information Notification',
    message: 'Message',
  });
  const isLoadingRef = useRef(false);

  const handleChangeFile = (event) => {
    let selected = event.target.files.length > 0;
    setFileSelected(selected);
    if (selected) {
      setFileName(event.target.files[0].name);
    }
  }
  
  const submitFormHandler = async (data) => {
    let timestamp = moment().format("MM ddd, YYYY HH:mm:ss a");
    let hash = MD5(`${fileName} ${timestamp}`).toString();
    setHashKey(hash);
    let squad_name = data?.squad_name;
    if (fileTypeIndex === 0 && squad_name) {
      let isValidSquadName = await checkClassName(squad_name);
      if (!isValidSquadName) {
        setIsLoading(false);
        setNotification({
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
      hash: hash,
    }
    if (fileTypeIndex === 0 && !submitData.squad_name) {
      setNotification({
        error: true,
        title: 'Require squad name',
        body: 'Squad name is required! Please enter squad name!',
      });
      return;
    }
    if (!submitData.file) {
      setNotification({
        error: true,
        title: 'Require file',
        body: 'Please pick your xlsx file!',
      });
      return;
    }

    // console.log('submitData', submitData);
    setIsLoading(true);
    postUploadXlsx(submitData);
    
    await progressSequential([
      {time: 500, start:0, end:30},
      {time: 1000, start:30, end:70},
      {time: 800, start:70, end:90},
      {time: 200, start:90, end:100},
    ]);

    if (isLoadingRef.current) setShowNotification(true);
    setIsLoading(false);
    cleanUpdateProcess(hash);
  }

  const executeUploadProgress = async ({time, start=0, end=90}) => {
    const timer = ms => new Promise(res => setTimeout(res, ms))
    let nb_percent = end - start + 1;
    for (let i = start; i < end; i++) {
      setUploadProgress(i);
      await timer(time/nb_percent)
    }
    setUploadProgress(0);
  }

  const progressSequential = async (steps) => {
    for (let step of steps) {
      await executeUploadProgress(step);
    }
  }

  const checkClassName = (className) => {
    const url = `/api/upload-xlsx?squad_name=${className}`;
    return axios.get(url).then(response => {
      console.log(response);
      if (response.status === 200) {
        return response.data;
      } else {
        setNotification({
          error: true,
          title: 'Error',
          body: 'Internal server error!',
        });
      }
    }).catch(error => {
      setNotification({
        error: true,
        title: 'Error',
        body: `Error occurred: ${error}`,
      });
    });
  }

  const postUploadXlsx = (submitData) => {
    const url = '/api/upload-xlsx';
    const formData = new FormData();
    for (const [key, value] of Object.entries(submitData)) {
      console.log(`${key}: ${value}`);
      formData.append(key, value);
    }
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        crossdomain: true,
    }
    axios.post(url, formData, config).then(response => response.data).then(response => {
      console.log({response});
      if (response && response.errorCode === 0) {
        setNotification({
          error: false,
          title: 'Successfully',
          body: response.message,
        });
      } else {
        setNotification({
          error: true,
          title: 'Error',
          body: response.message,
        });
      }
    }).catch(error => {
      setNotification({
        error: true,
        title: 'Error from upload',
        body: `Error occurred: ${error}`,
      });
    });
  } 

  useEffect(() => {
    if (notification.error == true && !isLoading) {
      setShowNotification(true);
    }
  }, [notification]);

  const cancelUploadXlsx = async () => {
    console.log('send request cancel');
    const url = '/api/upload-xlsx';
    const submitData = {
      type: 0,
      hash: hashKey,
    }
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        crossdomain: true,
        data: submitData
    }
    axios.delete(url, config);
    setIsLoading(false);
  }

  const cleanUpdateProcess = (hash) => {
    console.log('send request clean');
    const url = '/api/upload-xlsx';
    const submitData = {
      type: 1,
      hash: hash,
    }
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        crossdomain: true,
        data: submitData
    }
    axios.delete(url, config);
  }

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading])

  return (
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
              <UploadFileSelect name="xlsx" ref={register} require fileSelected={fileSelected} fileName={fileName} handleChangeFile={handleChangeFile}/>
              <Container fluid>
                <Row className="mt-5">
                  <Col xs={6} className="d-flex justify-content-center align-items-center">
                    <Button variant="danger" type="reset" className="px0" onClick={() => {setFileSelected(false); setFileName('')}}>
                      Reset
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

        <ProgressBarModal  
          show={isLoading} 
          title='Uploading content'
          message={`Uploading ${fileTypes[fileTypeIndex].value} file...`}
          variant={'primary'}
          progress={uploadProgress}
          onCancel={cancelUploadXlsx}
        />

        <NotificationModal 
          show={showNotification} 
          title={notification.title} 
          body={notification.body}
          variant={notification.error ? 'danger': 'success'}
          onClose={() => setShowNotification(false)}
        />
        
      </Form>  
    </Container>
  )
}

export default UploadForm;