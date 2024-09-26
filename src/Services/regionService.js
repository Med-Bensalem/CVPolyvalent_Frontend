import axios from 'axios';

const API_URL = 'http://localhost:5000/api/regions';


const addRegion = async (regionData) => {
    try {
        const response = await axios.post(`${API_URL}/regions`, regionData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du region');
    }
};

// Obtenir tous les secteurs
const getAllRegions = async () => {
    try {
        const response = await axios.get(`${API_URL}/regions`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les regions');
    }
};

export {addRegion,getAllRegions}