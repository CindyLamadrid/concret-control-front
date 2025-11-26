const Back = ({ onBack, className }) => {
  return (
    <button
      type="button"
      className={`back secondary ${className}`}
      onClick={() => onBack()}
    >
      <i className="fas fa-arrow-alt-circle-left  " onClick={() => onBack()} />{" "}
      <span>Atrás</span>
    </button>
  );
};
export default Back;
