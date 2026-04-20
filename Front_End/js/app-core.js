const BASE_URL = "http://localhost:8080/api/v1";

const apiRequest = async (url, method, data = null) => {
    const token = localStorage.getItem("token");
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        }
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(BASE_URL + url, options);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};