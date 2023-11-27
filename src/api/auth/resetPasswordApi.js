import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

const ResetPasswordApi = {
    resetPassword: async (token,formData) => {
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };
        await axios
            .put(`${BASE_URL}/v1/user/reset-password?token=${token}`, formData, config)
            .then((res) => {
                if (res.data.success) {
                    return res.data;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err);
            });
    }
}
export default ResetPasswordApi;
