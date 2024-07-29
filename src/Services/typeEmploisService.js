// services/TypeEmploiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/typeEmplois'; // Mettez l'URL de votre API

// Ajouter un TypeEmploi
const addTypeEmploi = async (TypeEmploiData) => {
    try {
        const response = await axios.post(`${API_URL}/TypeEmplois`, TypeEmploiData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du TypeEmploi');
    }
};

// Obtenir tous les TypeEmplois
const getAllTypeEmplois = async () => {
    try {
        const response = await axios.get(`${API_URL}/TypeEmplois`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les TypeEmplois');
    }
};

// Obtenir un TypeEmploi par ID
const getTypeEmploiById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/TypeEmplois/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération du TypeEmploi');
    }
};

// Modifier un TypeEmploi
const updateTypeEmploi = async (id, TypeEmploiData) => {
    try {
        const response = await axios.put(`${API_URL}/TypeEmplois/${id}`, TypeEmploiData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du TypeEmploi');
    }
};

// Supprimer un TypeEmploi
const deleteTypeEmploi = async (id) => {
    try {
        await axios.delete(`${API_URL}/TypeEmplois/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la suppression du TypeEmploi');
    }
};

export { addTypeEmploi, getAllTypeEmplois, getTypeEmploiById, updateTypeEmploi, deleteTypeEmploi };
