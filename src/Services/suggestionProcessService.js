const axios = require('axios');

const API_URL = 'http://localhost:5000/api'; // Base URL of your API

// Obtenir les étapes par id_domaine
const getStepsByDomaine = async (idDomaine) => {
    try {
        const response = await axios.get(`${API_URL}/suggestions/steps/${idDomaine}`);
        return response.data; // Return the steps data
    } catch (error) {
        console.error('Error getting steps by domaine:', error.response?.data || error.message);
        throw new Error('Error getting steps');
    }
};

// Ajouter une suggestion de processus
const addSuggestionProcess = async (idDomaine, steps) => {
    try {
        const response = await axios.post(`${API_URL}/suggestions/process`, {
            id_domaine: idDomaine,
            steps: steps
        });
        return response.data; // Return the added suggestion process
    } catch (error) {
        console.error('Error adding suggestion process:', error.response?.data || error.message);
        throw new Error('Error adding suggestion process');
    }
};

module.exports = { getStepsByDomaine, addSuggestionProcess };
