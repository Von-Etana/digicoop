import axios from 'axios';

export class TermiiService {
    private static readonly BASE_URL = 'https://api.ng.termii.com/api';
    private static readonly API_KEY = process.env.TERMII_API_KEY;
    private static readonly SENDER_ID = process.env.TERMII_SENDER_ID || 'DigiCoop';

    static async sendSMS(to: string, message: string) {
        try {
            const payload = {
                to,
                from: this.SENDER_ID,
                sms: message,
                type: 'plain',
                channel: 'generic', // or 'dnd'
                api_key: this.API_KEY,
            };

            const response = await axios.post(`${this.BASE_URL}/sms/send`, payload);
            return response.data;
        } catch (error) {
            console.error('Termii SMS Error:', error);
            // Fallback for dev
            if (!this.API_KEY) {
                console.log(`[DEV ONLY] SMS to ${to}: ${message}`);
                return { message_id: 'mock-id' };
            }
            throw new Error('Failed to send SMS');
        }
    }

    static async sendToken(to: string) {
        try {
            const payload = {
                api_key: this.API_KEY,
                message_type: 'NUMERIC',
                to,
                from: this.SENDER_ID,
                channel: 'generic',
                pin_attempts: 3,
                pin_time_to_live: 5,
                pin_length: 6,
                pin_placeholder: '< 1234 >'
            };
            const response = await axios.post(`${this.BASE_URL}/sms/otp/send`, payload);
            return response.data;
        } catch (error) {
            console.error('Termii Token Error:', error);
            throw new Error('Failed to send OTP');
        }
    }

    static async verifyToken(pinId: string, pin: string) {
        try {
            const payload = {
                api_key: this.API_KEY,
                pin_id: pinId,
                pin
            };
            const response = await axios.post(`${this.BASE_URL}/sms/otp/verify`, payload);
            return response.data;
        } catch (error) {
            console.error('Termii Verify Error:', error);
            throw new Error('Failed to verify OTP');
        }
    }
}
