const getToken = () => {
    return localStorage.getItem('token');
};

const addToken = (token) => {
    localStorage.setItem('token', token);
};

const removeToken = () => {
    localStorage.removeItem('token');
};

export default {
    getToken,
    addToken,
    removeToken
};
