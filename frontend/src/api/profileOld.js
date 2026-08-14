import axios from "axios";

const BASE_URL = 'http://localhost:8000/api';

class ApiClient {
    constructor() {
    this.baseUrl = BASE_URL;
    }
    async request(endpoint, options = {}) {
        
        const { method = 'GET', body } = options;
        const headers = {};
        if (body) {
            headers['Content-Type'] = "multipart/form-data";
        }
        axios.interceptors.request.use(config => {

            config.headers.Authorization =
                `Bearer ${token}`;

            return config;
        });

        let url = `${this.baseUrl}${endpoint}`;
        const config = { method, headers };
        let response = await axios({
            method,
            url,
            ...config,
            data: body
        });
        const data = await response.data;
        
       if (!response.ok) {
            throw new Error("Request failed");
        }
        return data;

    }
    UpdateProfile(formData) {
        return this.request('/profile/edit/', {
        method: 'POST',
        body: formData,
        });
    }
    getUserData(username) {
        console.log('GetUserDataExcuted')
        return this.request(`/profile/${username}`, {
            method: 'GET',
            body: { username },
        });
    }
    async CheckUserName(username) {
        try {
            const response = await axios.get(
            "/check_username",
            {
                username: username,
            }
            );
            
            console.log(`response${response.data.available}`);
            return true;
            // Username is there and not unique
        }
        catch (error) {
            console.log(error.response.data);
            return false;
        }
    }


}



const api = new ApiClient();
export default api;