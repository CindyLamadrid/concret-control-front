const Back = ({onBack,className}) => {
    return (
        <div className={className} onClick={() =>onBack()}>
            <i
                className='fas fa-arrow-alt-circle-left  '
                onClick={() => onBack()}
            />
            <div className='container-label-back'>
                <span className='back-label'>Atrás</span>
            </div>
        </div>
    )

}
export default Back