const URL = process.env.NEXT_PUBLIC_URL;
/**
 * Function to call QRCode API endpoint
 * @param {number|string} price 
 * @returns 
 */
export default function RetrieveQrCode (price) {
    return fetch(`${URL}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Error when requesting QR Code ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        return data;
    }).catch((error) => {
        console.error('Error while retrieving QR Code:', error);
    });
}