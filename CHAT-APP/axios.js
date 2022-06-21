import axios from "axios";

const instance = axios.create({
    // baseURL:"https://mighty-fortress-54471.herokuapp.com"
    baseURL:"http://localhost:3000"
});
export default instance;