import { buildPixPayload } from './services/pix.js';
import QRCode from './services/qrCode.js';

const BuildPix = (price) => {
  const payload = buildPixPayload({
    pixKey: process.env.PIX_KEY,
    name: process.env.PIX_NAME,
    city: process.env.PIX_CITY,
    value: price,
    message: process.env.PIX_MESSAGE // Max of 15 characters
  })
  
  return QRCode(payload);
}

export const handler = async (event) => {
  try {
    const { price } = JSON.parse(event.body);

    if (!price || isNaN(price)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing price' }),
      };
    }

    const qrCode = BuildPix(price);

    return {
      statusCode: 200,
      body: JSON.stringify({ qrCode }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};