import Modal from "react-bootstrap/Modal";

const Notifications = ({ message, buttonArray, item }) => {
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Body>
          <div className="center">{message ? message : ""}</div>
          <div className="right">
          <br/>
            {buttonArray &&
              buttonArray.length > 0 &&
              buttonArray.map((x, index) => {
                return (
                  <button
                    className={`${
                      index === 0 ? x.className :  `${x.className} mg-5`
                    }`}
                    type="button"
                   
                    disabled={x.disabled}
                    onClick={() => {
                      x.action(item);
                    }}
                  >{x.name}</button>
                );
              })}
           
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default Notifications;
