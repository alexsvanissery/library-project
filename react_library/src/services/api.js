import axios from "axios";

const API=axios.create({
    baseURL: "https://library-project-xss6.onrender.com/api/",
});

export default API;