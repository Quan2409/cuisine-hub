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

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cuisinehub");

  const isVideo = file.type.startsWith("video/");
  const endpoint = isVideo
    ? `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/video/upload`
    : `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/image/upload`;

  try {
    const response = await axios.post(endpoint, formData);
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export { sendRequest, handleUpload };
