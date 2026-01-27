export const onHandlerNumber = (event) => {

    if (!/[0-9]/.test(event.key) &&
        event.key !== 'Backspace' &&
        event.key !== 'Delete' &&
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight' 
      

    ) {
        event.preventDefault();
    }
}

export const onHandlerDecimal = (event) => {

 if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(event.key)) {
            return true; // Allow the key
        }

        // Allow numbers (0-9)
        if (/\d/.test(event.key)) {
            return true; // Allow the number
        }

        // Allow a single decimal point
        if (event.key === '.') {
            // Prevent if a decimal point already exists
            if (event.target.value.includes('.')) {
                event.preventDefault();
                return false;
            }
            return true; // Allow the decimal point
        }

        // Prevent all other keys
        event.preventDefault();
        return false;
}



export const  onHandlerEmail=(email) =>{
   return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
}


export default onHandlerNumber