import QRCode from 'qrcode';

/**
 * Generate a Pix QRCode with the given payload
 * @param {string} payload - The payload to encode in the QR code
 */
export default function GenerateQrCode (payload){
  QRCode.toDataURL(payload, { type: 'image/png' }, (err, url) => {
    if (err) throw err;
    console.log('QR Code generated as Data URL:', url);
    return url;
  });
}