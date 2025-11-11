export const onHandlerNumber = (event) => {
    console.log(event.key)
    if (!/[0-9]/.test(event.key) &&
        event.key !== 'Backspace' &&
        event.key !== 'Delete' &&
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight'
    ) {
        event.preventDefault();
    }
}

export default onHandlerNumber