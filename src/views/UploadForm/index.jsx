import { Form, Row, Col, Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'

// https://github.com/Hacker0x01/react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style.css';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import UploadFileSelect from './components/UploadFileSelect';
import axios from 'axios';

function UploadForm(props) {
  const { register, handleSubmit, control } = useForm();
  let [uploadFields, setUploadFields] = useState(null);
  
  const submitFormHandler = (data) => {
    let submitData = {...data, upload_fields: JSON.stringify(uploadFields)}
    const url = 'http://localhost:8000/api/upload-xlsx';
    const formData = new FormData();
    for (const [key, value] of Object.entries(submitData)) {
      console.log(`${key}: ${value}`);
      if (key == 'xlsx') {
        formData.append('xlsx',value[0]);
      }
      else formData.append(key ,value);
    }
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        // crossdomain: false,
    }
    axios.post(url, formData, config);
  }

  const onEditColumns = (sheets, columsData) => {
    let uploadObject = {}
    sheets.map((sheet, index) => {
      uploadObject[sheet.name] = columsData[index];
    })  
    setUploadFields(uploadObject);
  }

  let currentDate = new Date();

  console.log('upload obj', uploadFields);

  return (
    <Form className="d-block mx-auto mt-4" onSubmit={handleSubmit(submitFormHandler)}>
      <h1 className="form-title">Enhance tool: Upload files</h1>
      <Container className="bg-white p-5">
        <Row>

          <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center">
            <UploadFileSelect name="xlsx" ref={register} onEditColumns={onEditColumns}/>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Squad Name:</Form.Label>
              <Form.Control type="text" name="squad_name" ref={register}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Test Set:</Form.Label>
              <Form.Control as="select" custom name="test_set" ref={register}>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Upload Date:</Form.Label>
              {/* <Form.Control type="date" custom /> */}
              {/* <DatePicker /> */}

              <Controller
                name="upload_date"
                control={control}
                defaultValue={currentDate}
                render={({ onChange, value }) => <div className="d-flex justify-content-center align-items-center">
                  <Calendar onClickDay={onChange} value={value} />
                </div>}
              />

            </Form.Group>

            <Container fluid>
              <Row className="mt-5">
                <Col xs={6} className="d-flex justify-content-center align-items-center">
                  <Button variant="danger" type="reset" className="px0">
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
    </Form>
  )
}

export default UploadForm;