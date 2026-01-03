import axios from 'axios';

export class FlutterwaveService {
    private static readonly BASE_URL = 'https://api.flutterwave.com/v3';
    private static readonly SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

    static async initiatePayment(payload: {
        tx_ref: string;
        amount: string;
        currency: string;
        redirect_url: string;
        customer: {
            email: string;
            phonenumber: string;
            name: string;
        };
        customizations: {
            title: string;
            logo: string;
        };
    }) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/payments`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${this.SECRET_KEY}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Flutterwave Payment Error:', error);
            throw new Error('Payment initiation failed');
        }
    }

    static async verifyTransaction(transactionId: string) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/transactions/${transactionId}/verify`,
                {
                    headers: {
                        Authorization: `Bearer ${this.SECRET_KEY}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Flutterwave Verification Error:', error);
            throw new Error('Transaction verification failed');
        }
    }
}
