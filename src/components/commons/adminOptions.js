const AdminOptions = ({
  value,
  setValue,
  hideCancelOption,
  onSearch,
  onNewOption,
  labelOption,
  onCancelOption,
}) => {
  return (
    <div>
      <input
        type="text"
        className="input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      ></input>
      &nbsp;&nbsp;
      <button
        type="button"
        className="primary"
        onClick={() => onSearch()}
        disabled={!value}
      >
        <i className="fas fa-search icon-view-detail-primary" /> {"Buscar"}
      </button>
      &nbsp;&nbsp;
      <button type="button" className="secondary" onClick={() => onNewOption()}>
        <i className="fas fa-plus icon-view-detail" /> {labelOption}
      </button>
      &nbsp;&nbsp;
      <button
        type="button"
        className="secondary"
        onClick={() => onCancelOption()}
        hidden={hideCancelOption}
      >
        {" "}
        <i className="fas fa-times-circle icon-view-detail" /> {"Cancelar"}
      </button>
    </div>
  );
};
export default AdminOptions;
