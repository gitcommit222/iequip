import axios from "axios";

const instance = axios.create({
	baseURL: "http://47.129.42.133:5001/api",
	withCredentials: true,
});

export default instance;
