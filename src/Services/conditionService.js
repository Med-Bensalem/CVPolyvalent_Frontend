import axios from 'axios';

const API_URL = 'http://localhost:5000/api/conditions';

const updateCondition = async (offreId, conditionData) => {
    try {
        const response = await axios.put(`${API_URL}/conditions/${offreId}`, conditionData);
        return response.data;
    } catch (error) {
        console.error('Error updating condition:', error.response?.data || error.message);
        throw new Error('Error updating condition');
    }
};

const getConditionByOffer = async (offreId) => {
    try {
        const response = await axios.get(`${API_URL}/conditions/offer/${offreId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting conditions by offer:', error.response?.data || error.message);
        throw new Error('Error getting conditions by offer');
    }
};

export { updateCondition,getConditionByOffer}