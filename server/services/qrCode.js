import QRCode from 'qrcode';

/**
 * Generate a Pix QRCode with the given payload. Used Promise return to avoid cascading async await without the need.
 * @param {string} payload - The payload to encode in the QR code
 */
function GenerateQrCode (payload){
  return Promise.resolve(QRCode.toDataURL(payload));
}

/**
 * Function to build the payload for the QR code generation and keep the main function clean
 * @param {string|number} price 
 * @returns 
 */
export function BuildPix(price) {
  const payload = buildPixPayload({
    pixKey: process.env.PIX_KEY,
    name: process.env.PIX_NAME,
    city: process.env.PIX_CITY,
    value: price,
    message: process.env.PIX_MESSAGE // Max of 15 characters
  })
  return GenerateQrCode(payload);
}