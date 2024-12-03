import axios from "axios";

const api_url = "http://localhost:3500";

const apiBase = axios.create({
  baseURL: api_url,
  responseType: "json",
});

const sendRequest = async ({ url, token, data, method = "GET" }) => {
  try {
    const response = await apiBase({
      url: url,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    const errors = error.response.data;
    return {
      status: errors.status,
      message: errors.message,
    };
  }
};

const getUser = async (id, token) => {
  try {
    const response = await sendRequest(`/user/get-user`, {
      method: "GET",
      token: token,
    });
    if (response.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("user session has expried. login again");
      window.location.replace("/login");
    } else {
      return response.user;
    }
  } catch (error) {
    console.log(error);
  }
};

const viewProfile = async (id, token) => {
  try {
    const response = await sendRequest("/user/view-profile", {
      method: "POST",
      token: token,
      body: { id },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cuisinehub");

  try {
    console.log(import.meta.env.VITE_CLOUDINARY_NAME);
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export { sendRequest, handleUpload };
