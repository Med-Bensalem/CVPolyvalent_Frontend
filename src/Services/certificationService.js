import axios from 'axios';

const API_URL = 'http://localhost:5000/api/certificats';

const addCertificationToUser = async (userId, certificationData) => {
    try {
        const response = await axios.post(`${API_URL}/users/${userId}/certificates`, certificationData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error adding certification to user');
    }
};

const getCertificatesByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/certificates`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error getting certificates of user');
    }
};

const updateCertification = async (userId, certificationId, certificationData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/certificates/${certificationId}`, certificationData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating certification');
    }
};

const deleteCertification = async (userId, certificationId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/certificates/${certificationId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting certification');
    }
};

export { addCertificationToUser, getCertificatesByUser, updateCertification, deleteCertification };
