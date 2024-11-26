import axios from "axios";

const instance = axios.create({
	baseURL: "https://iequip.vercel.app/api",
	withCredentials: true,
});

export default instance;
