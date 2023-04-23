import axios from "axios";

const login = async (email, password) => {
  try {
    const response = await axios.post("/api/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

const register = async (name, lastname, email, password) => {
  try {
    const response = await axios.post("/api/register", {
      name,
      lastname,
      email,
      password,
    });
    return response;
  } catch (error) {
    throw new Error("Register failed");
  }
};


export default {
  login,
  register,
};
