import axios from 'axios';

const API_URL = 'http://localhost:5000/api/formations';

const addFormationToUser = async (userId, formationData) => {
    try {
        const response = await axios.post(`${API_URL}/users/${userId}/formations`, formationData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error adding formation to user');
    }
};

const getFormationsByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/formations`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting formations of user');
    }
};

const updateFormation = async (userId, formationId, formationData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/formations/${formationId}`, formationData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating formation');
    }
};

const deleteFormation = async (userId, formationId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/formations/${formationId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting formation');
    }
};

export { addFormationToUser, getFormationsByUser, updateFormation, deleteFormation };
