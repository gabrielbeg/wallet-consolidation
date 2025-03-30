const URL = process.env.NEXT_PUBLIC_URL;
export default function RetrieveQrCode (price) {
    fetch(`${URL}/api/generate-qr-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error generating QR code: ' + response.statusText);
        }
        return response;
    });
}