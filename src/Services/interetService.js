import axios from 'axios';

const API_URL = 'http://localhost:5000/api/interests'; // Mettez l'URL de votre API

// Ajouter un interet à un utilisateur
const addInterestToUser = async (userId, interestData) => {
    try {
        const response = await axios.post(`${API_URL}/users/${userId}/interests`, interestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error adding interest to user');
    }
};

const getInterestById = async (interestId) => {
    try {
        const response = await axios.get(`${API_URL}/interests/${interestId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting interest by ID');
    }
};

// Obtenir les interets d'un utilisateur
const getInterestsByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/interests`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting interests of user');
    }
};

// Mettre à jour un interet
const updateInterest = async (userId, interestId, interestData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/interests/${interestId}`, interestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating interest');
    }
};

// Supprimer un interet
const deleteInterest = async (userId, interestId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/interests/${interestId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting interest');
    }
};

export { addInterestToUser, getInterestsByUser, updateInterest, deleteInterest,getInterestById };
