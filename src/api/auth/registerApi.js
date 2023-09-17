import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

//register
const RegisterApi = {
    register: async (formData) => {
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };
        await axios
            .post(`${BASE_URL}/v1/auth/register`, formData, config)
            .then((res) => {
                if (res.data.success) {
                    return res.data;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err.response.data.message);
            });
    }
}
export default RegisterApi;