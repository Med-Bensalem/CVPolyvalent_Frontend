import axios from 'axios';

const API_URL = 'http://localhost:5000/api/langues';

const addLanguageToUser = async (userId, languageData) => {
    try {
        const response = await axios.post(`${API_URL}/users/${userId}/languages`, languageData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error adding language to user');
    }
};

const getLanguagesByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/languages`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting languages of user');
    }
};

const updateLanguage = async (userId, languageId, languageData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/languages/${languageId}`, languageData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating language');
    }
};

const deleteLanguage = async (userId, languageId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/languages/${languageId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting language');
    }
};

export { addLanguageToUser, getLanguagesByUser, updateLanguage, deleteLanguage };
