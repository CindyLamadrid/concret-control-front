import Modal from "react-bootstrap/Modal";

const ModalHeader = ({ title, onClose }) => {
  return (
    <Modal.Header>
      <div className="subtitle center" style={{ flex: 1 }}>
        <b>{title}</b>
      </div>
      {onClose && (
        <i
          className="fas fa-times"
          style={{ cursor: 'pointer', fontSize: '18px', color: '#666', position: 'absolute', right: '15px', top: '15px' }}
          onClick={onClose}
        />
      )}
    </Modal.Header>
  );
};

export default ModalHeader;
