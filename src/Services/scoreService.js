import axios from 'axios';

const API_URL = 'http://localhost:5000/api/scores';


const addScore = async (scoreData) => {
    try {
        const response = await axios.post(`${API_URL}/scores`, scoreData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du score');
    }
};

// Obtenir tous les secteurs
const getAllScores = async () => {
    try {
        const response = await axios.get(`${API_URL}/scores`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les scores');
    }
};

export {addScore,getAllScores}