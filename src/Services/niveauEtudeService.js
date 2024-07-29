// services/niveauEtudeService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/niveauEtudes'; // Mettez l'URL de votre API

// Ajouter un niveauEtude
const addNiveauEtude = async (niveauEtudeData) => {
    try {
        const response = await axios.post(`${API_URL}/niveauEtudes`, niveauEtudeData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du niveauEtude');
    }
};

// Obtenir tous les niveauEtudes
const getAllNiveauEtudes = async () => {
    try {
        const response = await axios.get(`${API_URL}/niveauEtudes`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les niveauEtudes');
    }
};

// Obtenir un niveauEtude par ID
const getNiveauEtudeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/niveauEtudes/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération du niveauEtude');
    }
};

// Modifier un niveauEtude
const updateNiveauEtude = async (id, niveauEtudeData) => {
    try {
        const response = await axios.put(`${API_URL}/niveauEtudes/${id}`, niveauEtudeData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du niveauEtude');
    }
};

// Supprimer un niveauEtude
const deleteNiveauEtude = async (id) => {
    try {
        await axios.delete(`${API_URL}/niveauEtudes/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la suppression du niveauEtude');
    }
};

export { addNiveauEtude, getAllNiveauEtudes, getNiveauEtudeById, updateNiveauEtude, deleteNiveauEtude };
