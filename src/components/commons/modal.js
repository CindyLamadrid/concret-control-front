import Modal from "react-bootstrap/Modal";

const Notifications = ({ message, buttonArray, item }) => {
  const onClose = () => {
    if (buttonArray && buttonArray.length > 1) {
      buttonArray[buttonArray.length - 1].action(item);
    }
  };

  return (
    <div className="modal show modal-inline">
      <Modal.Dialog>
        <Modal.Header>
          <div className="subtitle center" style={{ flex: 1 }}>
            <b>&nbsp;</b>
          </div>
          <i
            className="fas fa-times"
            style={{ cursor: 'pointer', fontSize: '18px', color: '#666' }}
            onClick={onClose}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="center" style={{ padding: '20px 10px' }}>
            <p style={{ fontSize: '16px', color: '#333', margin: 0 }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#e67e22', marginRight: '10px', fontSize: '20px' }} />
              {message ? message : ""}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {buttonArray &&
            buttonArray.length > 0 &&
            buttonArray.map((x, index) => {
              return (
                <button
                  key={index}
                  className={x.className}
                  type="button"
                  disabled={x.disabled}
                  onClick={() => {
                    x.action(item);
                  }}
                >
                  {x.name}
                </button>
              );
            })}
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default Notifications;
