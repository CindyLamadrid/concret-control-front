import ReactSelect from 'react-select'

const AdminSelectOptions = ({
  options,
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
     <ReactSelect placeholder={labelOption} isClearable className="react-select-container display-inline-block w-40" value={value} options={options} onChange={(event) => setValue(event)}/>
     
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
export default AdminSelectOptions;
