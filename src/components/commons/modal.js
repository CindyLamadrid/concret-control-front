import Modal from "react-bootstrap/Modal";

const Notifications = ({ message, buttonArray, item }) => {
  return (
    <div className="modal show modal-inline">
      <Modal.Dialog>
        <Modal.Header>
          <div className="subtitle center">
            <b>&nbsp;</b>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="center">
            <p className="mandatory">{message ? message : ""}</p>
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
