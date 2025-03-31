/**
 * Function to build a PIX payload for payment requests.
 * The payload is built according to the specifications of the Brazilian Central Bank.
 * @param {string} pixKey - The pix key to be used in the payload
 * @param {string} name - The name of the merchant
 * @param {string} city - The city of the merchant
 * @param {string|number} value - The value to be paid
 * @param {string} message - The message to be sent with the payment 
 * @returns 
 */
function buildPixPayload({ pixKey, name, city, value, message }) {
  const merchantAccountInfo = addField('00', "BR.GOV.BCB.PIX") + addField('01', pixKey);

  const prePayload =
    addField('00', '01') + // 01 Fixed
    addField('26', merchantAccountInfo) + // Merchant Account Info
    addField('52', '0000') + // Merchant Category Code - Not declared
    addField('53', '986') + // Currency (986 = BRL)
    addField('54', Number(value).toFixed(2)) + // Amount
    addField('58', 'BR') + // Country
    addField('59', name) + // Merchant Name
    addField('60', city) + // Merchant City
    addField('62', addField('05', message)) + // Additional Data
    '6304' // CRC16 placeholder
  const crc = computeCRC16(prePayload)
  return prePayload + crc
}

/**
 * This function facilitates the addition of fields to the payload.
 * It takes care of the size and format of the fields.
 * @param {*} id 
 * @param {*} value 
 * @returns 
 */
function addField(id, value) {
  const size = value.length.toString().padStart(2, '0')
  return `${id}${size}${value}`
}

/**
 * @param {String} input 
 * @returns a CRC16 checksum in hexadecimal format
 */
function computeCRC16(input) {
  const polynomial = 0x1021;
  let value = 0xFFFF;

  for (let i = 0; i < input.length; i++) {
      value ^= input.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
      if (value & 0x8000) {
          value = (value << 1) ^ polynomial;
      } else {
          value <<= 1;
      }
      value &= 0xFFFF; // Trim to 16 bits
      }
  }

  return value.toString(16).toUpperCase().padStart(4, '0');
}

export { buildPixPayload };