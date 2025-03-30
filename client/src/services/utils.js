/**
 * Validate and format a number to Brazilian currency format
 * • nullable values are converted to zero
 * • NaN values are converted to zero
 * @param {string|number} number - The number to be formatted.
 * @returns {string} - The formatted currency string.
 * @example
 * ConvertToCurrency(1234.56) // "R$ 1.234,56"
 */
function ConvertToCurrency(number) {
    // Check if the number is a valid number
    if(isNaN(number)) {
        number = 0;
    }
    number == null ? 0 : isNaN(number) ? 0 : number = Number(number);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(number);
}

export { ConvertToCurrency }