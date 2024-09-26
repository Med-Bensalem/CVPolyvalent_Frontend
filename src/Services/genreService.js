import axios from 'axios';

const API_URL = 'http://localhost:5000/api/genres';


const addGenre = async (genreData) => {
    try {
        const response = await axios.post(`${API_URL}/genres`, genreData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du region');
    }
};

// Obtenir tous les secteurs
const getAllGenres = async () => {
    try {
        const response = await axios.get(`${API_URL}/genres`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les genres');
    }
};

export {addGenre,getAllGenres}