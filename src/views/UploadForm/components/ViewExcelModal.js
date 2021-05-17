import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import '../style.css'
import ColumnList from "./ColumnList";


function ViewExcelModal(props) {
  const {show, onClose, onChange, sheets, data, fileName, uploadFields} = props;
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Uploaded Excel File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            File name: {fileName}
          </div>
          <Tabs defaultActiveKey={0} id="uncontrolled-tab-example">
            {(data.length == sheets.length) && data.map((sheetData, index) => (
              <Tab key={index} eventKey={index} title={sheets[index].name}>
                <ColumnList index={index} columns={sheetData[0]} uploadFields={uploadFields[index]} onChange={onChange}/>
              </Tab>
            ))}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewExcelModal;
