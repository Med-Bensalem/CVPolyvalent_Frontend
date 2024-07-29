// services/secteurService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/secteurs'; // Mettez l'URL de votre API

// Ajouter un secteur
const addSecteur = async (secteurData) => {
    try {
        const response = await axios.post(`${API_URL}/secteurs`, secteurData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du secteur');
    }
};

// Obtenir tous les secteurs
const getAllSecteurs = async () => {
    try {
        const response = await axios.get(`${API_URL}/secteurs`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les secteurs');
    }
};

// Obtenir un secteur par ID
const getSecteurById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/secteurs/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération du secteur');
    }
};

// Modifier un secteur
const updateSecteur = async (id, secteurData) => {
    try {
        const response = await axios.put(`${API_URL}/secteurs/${id}`, secteurData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du secteur');
    }
};

// Supprimer un secteur
const deleteSecteur = async (id) => {
    try {
        await axios.delete(`${API_URL}/secteurs/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la suppression du secteur');
    }
};

// Rechercher des secteurs par titre
const searchSecteurs = async (titre) => {
    try {
        console.log(titre)
        const response = await axios.get(`${API_URL}/secteurs/bytitre/${titre}`)
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la recherche des secteurs');
    }
};

export { addSecteur, getAllSecteurs, getSecteurById, updateSecteur, deleteSecteur ,searchSecteurs};
