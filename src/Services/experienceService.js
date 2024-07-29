import axios from 'axios';

const API_URL = 'http://localhost:5000/api/experiences';

const addExperienceToUser = async (userId, experienceData) => {
    try {
        const response = await axios.post(`${API_URL}/users/${userId}/experiences`, experienceData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error adding experience to user');
    }
};

const getExperiencesByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/experiences`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting experiences of user');
    }
};

const updateExperience = async (userId, experienceId, experienceData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/experiences/${experienceId}`, experienceData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating experience');
    }
};

const deleteExperience = async (userId, experienceId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/experiences/${experienceId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting experience');
    }
};

export { addExperienceToUser, getExperiencesByUser, updateExperience, deleteExperience };
