import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import ViewExcelModal from './ViewExcelModal';
import readXlsxFile from 'read-excel-file'
import '../style.css';

const UploadFileSelect = React.forwardRef((props, ref) => {
  const {onEditColumns} = props;
  let [fileSelected, setFileSelected] = useState(false);
  let [fileName, setFileName] = useState('');
  let [showViewModal, setShowViewModal] = useState(false);
  let [sheets, setSheets] = useState([]);
  let [data, setData] = useState([]);
  let [uploadFields, setUploadFields] = useState([]);

  const handleChangeFile = (event) => {
    let selected = event.target.files.length > 0;
    setFileSelected(selected);
    if (selected) {
      setFileName(event.target.files[0].name);
    }
    
    let fileObject = event.target.files[0];
    readXlsxFile(fileObject, { getSheets: true }).then((readSheets) => {
      let promisses = []
      for (let sheet of readSheets) {
        promisses.push(readXlsxFile(fileObject, { sheet: sheet.name }));
      }
      Promise.all(promisses).then(rows => {
        setUploadFields(rows.map(sheetData => sheetData[0]));
        onEditColumns(readSheets, rows.map(sheetData => sheetData[0]));
        setSheets(readSheets);
        setData(rows);
      })
    })
    setShowViewModal(true);
  }

  const handleCloseModal = (event) => {
    setShowViewModal(false);
    onEditColumns(sheets, uploadFields);
  };

  const handleChangeUploadFields = (sheetIndex, columns) => {
    let newUploadFields = [...uploadFields];
    newUploadFields[sheetIndex] = [...columns];
    setUploadFields(newUploadFields);
  } 

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">

      <CloudUploadIcon style={{fontSize: '8rem'}}/>

      <ViewExcelModal 
        show={showViewModal} 
        onClose={handleCloseModal} 
        onChange={handleChangeUploadFields} 
        sheets={sheets} 
        data={data} 
        fileName={fileName} 
        uploadFields={uploadFields}
      />

      {fileSelected &&
        <div>
            File selected: {fileName}
        </div>}

      <Form.Group className="d-flex flex-column justify-content-center align-items-center">
        <Form.Label className="upload-button" htmlFor="uploaded-file" role="buton">Click to select file</Form.Label>
        {fileSelected && (<Form.Label className="upload-button" onClick={() => setShowViewModal(true)}>Choose upload columns</Form.Label>)}
        <Form.Control id="uploaded-file" type="file" hidden ref={ref} {...props} onChange={handleChangeFile}/>
      </Form.Group>
    </div>
  );

});

export default UploadFileSelect;