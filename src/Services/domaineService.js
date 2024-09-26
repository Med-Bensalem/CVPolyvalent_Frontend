// services/secteurService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/domaines'; // Mettez l'URL de votre API

const addDomaine = async (domaineData) => {
    try {
        const response = await axios.post(`${API_URL}/domaines`, domaineData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du domaine');
    }
};

// Obtenir tous les domaines
const getAllDomaines = async () => {
    try {
        const response = await axios.get(`${API_URL}/domaines`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les domaines');
    }
};

// Obtenir un secteur par ID
const getDomaineById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/domaines/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération du domaine');
    }
};

// Modifier un secteur
const updateDomaine = async (id, domaineData) => {
    try {
        const response = await axios.put(`${API_URL}/domaines/${id}`, domaineData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du domaine');
    }
};

// Supprimer un secteur
const deleteDomaine = async (id) => {
    try {
        await axios.delete(`${API_URL}/domaines/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la suppression du domaine');
    }
};

export { addDomaine, getAllDomaines, getDomaineById, updateDomaine, deleteDomaine};
