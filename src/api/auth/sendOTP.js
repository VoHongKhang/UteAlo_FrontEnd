import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

const SendOTP = {
    sendOTP: async (emailParams) => {
        const email = emailParams.email;
        const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
        await axios
            .post(`${BASE_URL}/v1/auth/sendOTP`, { email },config)
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
    },
};
export default SendOTP;
