const axios = require("axios");

const http = () => {
    
  const instance = axios.create({
    baseURL: "",
    timeout: 3000,
  });

  const post = async (url, body, options) => {
    try {
      const response = await instance.post(url, body, options);
      console.log("BODY:", response.data)
      return response;
    } catch (err) {
      console.log(err.response);
      return err.response;
    }
  };
  const get = async (url, body, options) => {
    try {
      const response = await instance.get(url, body, options);
      return response;
    } catch (err) {
      console.log(err.response);
      return err.response;
    }
  };
  return { post, get, _instance: instance };
};

module.exports = http();
