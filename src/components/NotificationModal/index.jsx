import { Button, Modal, Tab, Tabs } from "react-bootstrap";


function NotificationModal(props) {
  const {show, onClose, variant, title, body} = props;
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className={`bg-${variant}`}>
          <Modal.Title 
            id="example-custom-modal-styling-title" 
            className={['light', 'white'].includes(variant) ? 'text-black': 'text-white'}
          >
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{body}</p>
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

export default NotificationModal;
