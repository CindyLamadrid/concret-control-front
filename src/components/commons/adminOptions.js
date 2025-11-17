const AdminOptions = ({ value, setValue, onSearch, onNewOption,labelOption,onCancelOption }) => {
    return (
        <div>
            <input
                type="text"
                className="input"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            &nbsp;&nbsp;
            <input
                type="button"
                className="button"
               
                value="Buscar"
                onClick={() => onSearch()}
                disabled={!value}
            />
            &nbsp;&nbsp;
            <input
                type="button"
                className="button"
                value={labelOption}
                onClick={() => onNewOption () }
            />
              &nbsp;&nbsp;
            <input
                type="button"
                className="button"
                value="Cancelar"
                onClick={() => onCancelOption () }
            />



        </div>
    )
}
export default AdminOptions