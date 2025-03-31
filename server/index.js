import { BuildPix } from './services/qrCode.js';

/**
 * Default handler function for lambda calls
 * @param {*} event 
 * @returns 
 */
export const handler = async (event) => {
  try {
    console.log(event?.body)
    const jsonBody = JSON.parse(event?.body);
    const price = jsonBody?.price ?? 0;

    if (!price || isNaN(price)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing price' }),
      };
    }

    const qrCode = await BuildPix(price);
    const response = {
      statusCode: 200,
      body: JSON.stringify({ qrCode }),
    };
    console.log(`Response: ${JSON.stringify(response)}`);
    return {
      statusCode: 200,
      body: response,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};