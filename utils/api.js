import axios from "axios";

const instance = axios.create({
	baseURL: "https://i-equip.onrender.com/api",
	withCredentials: true,
});

export default instance;
