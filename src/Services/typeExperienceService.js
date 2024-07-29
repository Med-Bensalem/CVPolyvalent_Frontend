import axios from 'axios';

const API_URL = 'http://localhost:5000/api/typeExperiences'; // Mettez l'URL de votre API

// Ajouter un TypeExperience
const addTypeExperience = async (TypeExperienceData) => {
    try {
        const response = await axios.post(`${API_URL}/TypeExperience`, TypeExperienceData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du TypeExperience');
    }
};

// Obtenir tous les TypeExperiences
const getAllTypeExperiences = async () => {
    try {
        const response = await axios.get(`${API_URL}/TypeExperience`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les TypeExperiences');
    }
};

// Obtenir un TypeExperience par ID
const getTypeExperienceById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/TypeExperience/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération du TypeExperience');
    }
};

// Modifier un TypeExperience
const updateTypeExperience = async (id, TypeExperienceData) => {
    try {
        const response = await axios.put(`${API_URL}/TypeExperience/${id}`, TypeExperienceData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du Type Experience');
    }
};

// Supprimer un TypeExperience
const deleteTypeExperience = async (id) => {
    try {
        await axios.delete(`${API_URL}/TypeExperience/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la suppression du TypeExperience');
    }
};

export { addTypeExperience, getAllTypeExperiences, getTypeExperienceById, updateTypeExperience, deleteTypeExperience };
