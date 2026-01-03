import axios from 'axios';

export class SmileIdentityService {
    private static readonly PARTNER_ID = process.env.SMILE_PARTNER_ID;
    private static readonly API_KEY = process.env.SMILE_API_KEY;
    private static readonly BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://api.smileidentity.com/v1'
        : 'https://testapi.smileidentity.com/v1';

    static async verifyBVN(bvn: string, firstName: string, lastName: string, dob?: string) {
        try {
            // Note: This is a simplified implementation. Real integration requires timestamp, signature generation, etc.
            // For this prototype, we'll setup the structure.

            const payload = {
                partner_id: this.PARTNER_ID,
                country: 'NG',
                id_type: 'BVN',
                id_number: bvn,
                first_name: firstName,
                last_name: lastName,
                dob // Format: YYYY-MM-DD
            };

            const response = await axios.post(
                `${this.BASE_URL}/id_verification`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'smileid-partner-id': this.PARTNER_ID,
                        // 'smileid-request-signature': signature // Todo: Implement signature generation
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Smile Identity Error:', error);
            // Return a mock success for development if credentials aren't set
            if (!this.API_KEY) {
                console.warn('Mocking Smile Identity Success');
                return { ResultCode: '1012', Actions: { Verify_ID_Number: 'Approved' } };
            }
            throw new Error('Identity verification failed');
        }
    }
}
