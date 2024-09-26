import axios from 'axios';

const API_URL = 'http://localhost:5000/api/postules'; // Mettez l'URL de votre API

const createPostule = async (cvFile, lettreMotivationFile, userId, offreId, description,dateCreation,score) => {
    try {
        const formData = new FormData();
        formData.append('cv', cvFile);
        formData.append('lettreMotivation', lettreMotivationFile);
        formData.append('userId', userId);
        formData.append('offreId', offreId);
        formData.append('description', description);
        formData.append('dateCreation', dateCreation);
        formData.append('score', score);

        const response = await axios.post(`${API_URL}/postule`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la création de la candidature');
    }
};

const getPostulesByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/postules`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting postules of user');
    }
};

const getPostulesByOffer = async (offreId) => {
    try {
        const response = await axios.get(`${API_URL}/offres/${offreId}/postules`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting postules of offer');
    }
};




const updatePostuleStatus = async (postuleId, status) => {
    try {
        const response = await axios.put(`${API_URL}/postule/update-status`, {
            postuleId,
            status
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la mise à jour du statut de la candidature');
    }
};

const sendStatusChangeEmails = async (postuleIds) => {
    try {
        const response = await axios.post(`${API_URL}/postule/send-emails`, {
            postuleIds
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\'envoi des emails de notification');
    }
};


export {createPostule,getPostulesByUser,getPostulesByOffer,updatePostuleStatus,sendStatusChangeEmails} ;
