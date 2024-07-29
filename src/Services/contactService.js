import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contacts';

const ajoutContact = async (contactData) => {
    try {
        const response = await axios.post(`${API_URL}/contacts`, contactData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'ajout du contact');
    }
};

const getAllContacts = async () => {
    try {
        const response = await axios.get(`${API_URL}/contacts`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de tous les contacts');
    }
};
const markContactAsRead = async (contactId) => {
    try {
        const response = await axios.put(`${API_URL}/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la mise à jour du statut de lecture du contact');
    }
};

export { getAllContacts, ajoutContact ,markContactAsRead};

