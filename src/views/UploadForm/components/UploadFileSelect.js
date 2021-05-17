import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import '../style.css';

const UploadFileSelect = React.forwardRef((props, ref) => {
  let [fileSelected, setFileSelected] = useState(false);
  let [fileName, setFileName] = useState('');

  const handleChangeFile = (event) => {
    let selected = event.target.files.length > 0;
    setFileSelected(selected);
    if (selected) {
      setFileName(event.target.files[0].name);
    }
  }
    
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">

      <CloudUploadIcon style={{fontSize: '8rem'}}/>

      {/* <ViewExcelModal 
        show={showViewModal} 
        onClose={handleCloseModal} 
        onChange={handleChangeUploadFields} 
        sheets={sheets} 
        data={data} 
        fileName={fileName} 
        uploadFields={uploadFields}
      /> */}

      {fileSelected &&
        <div>
            File selected: {fileName}
        </div>}

      <Form.Group className="d-flex flex-column justify-content-center align-items-center">
        <Form.Label className="upload-button" htmlFor="uploaded-file" role="buton">Click to select file</Form.Label>
        {/* {fileSelected && (<Form.Label className="upload-button" onClick={() => setShowViewModal(true)}>Choose upload columns</Form.Label>)} */}
        <Form.Control id="uploaded-file" type="file" hidden ref={ref} {...props} onChange={handleChangeFile}/>
      </Form.Group>
    </div>
  );

});

export default UploadFileSelect;