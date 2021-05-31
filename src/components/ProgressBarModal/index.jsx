import { Button, Modal, ProgressBar } from "react-bootstrap";


function ProgressBarModal(props) {
  const {show, variant, title, message, progress, onCancel} = props;
  return (
    <>
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className={`bg-${variant}`}>
          <Modal.Title 
            id="example-custom-modal-styling-title" 
            className={['light', 'white'].includes(variant) ? 'text-black': 'text-white'}
          >
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
          <ProgressBar now={progress} label={`${progress}%`} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProgressBarModal;
