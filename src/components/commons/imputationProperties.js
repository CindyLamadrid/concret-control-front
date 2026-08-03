import Charges from "../Inputscontract/charges";

const ImputationProperties = ({ show, currentItem, onClose, onSave }) => {
  return (
    <Charges
      show={show}
      onClose={onClose}
      onHandleSaveContracts={onSave}
      currentItem={currentItem}
    />
  );
};

export default ImputationProperties;
