// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = async (password, email, nom, prenom, role, secteur) => {
    try {
        let approuver = role === 'candidat' ? true : false;

        let userData;
        if (role === 'candidat') {
            userData = { password, email, nom, prenom, role, approuver };
        } else if (role === 'entreprise') {
            userData = { password, email, nom, role, secteur, approuver };
        } else {
            console.error("Invalid role");
            return false;
        }
        const response = await axios.post(`${API_URL}/register`, userData);
        return true;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: "Network or server error" }; // Throwing a generic error message
        }
    }
};



const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; // Returning the full response data
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: "Network or server error" }; // Throwing a generic error message
        }
    }
};



const completeProfile = async (userId, profileData) => {
    try {
        await axios.put(`${API_URL}/user/${userId}`, profileData);
        return true;
    } catch (error) {
        console.error('Error completing profile:', error);
        return false;
    }
};

const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user details');
    }
};
const uploadImage = async (userId, imageData) => {
    try {
        const response = await axios.post(`${API_URL}/user/${userId}/upload-image`, imageData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};

const getUsersByRole = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/role/entreprise`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users by role:', error);
        throw new Error('Failed to fetch users by role');
    }
};
const getUsersApproved = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/approved`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users approuved:', error);
        throw new Error('Failed to fetch users approuved');
    }
};
const getUsersNotApproved = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/notApproved`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users Not Aprouved:', error);
        throw new Error('Failed to fetch users Not Aprouved');
    }
};

const userApproval = async (userId) => {
    try {
        await axios.put(`${API_URL}/user/${userId}/approve`);
        return true;
    } catch (error) {
        console.error('Error approving user:', error);
        return false;
    }
};
const userReject = async (userId) => {
    try {
        await axios.put(`${API_URL}/user/${userId}/reject`);
        return true;
    } catch (error) {
        console.error('Error rejecting user:', error);
        return false;
    }
};

 const logout = async () => {
    try {
        // Ajoutez ici votre logique de déconnexion, par exemple :
        // Effacer le token d'authentification stocké localement
        localStorage.removeItem('token');
        // Rediriger l'utilisateur vers la page de connexion
        // Par exemple : window.location.href = '/login';
    } catch (error) {
        console.error(error);
    }
};

const updateUserViews = async (userId) => {
    try {
        await axios.put(`${API_URL}/user/${userId}/views`);
        return true;
    } catch (error) {
        console.error('Error updating user views:', error);
        return false;
    }
};

const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/user/${userId}/change-password`, { currentPassword, newPassword });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: "Network or server error" }; // Throwing a generic error message
        }
    }
};


export { register, login ,completeProfile,getUserById,uploadImage,logout,getUsersByRole,getUsersNotApproved,getUsersApproved,userApproval,userReject,updateUserViews,changePassword};
