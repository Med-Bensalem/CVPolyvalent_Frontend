// Template1.js
import React, {useEffect, useState} from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import {jwtDecode} from "jwt-decode";
import {completeProfile, getUserById, uploadImage} from "../Services/authService";
import moment from "moment";
import SuccessAlert from "../Alert/SuccessAlert";
import ContenuProfile from "./contenu-profile";



const baseURL = 'http://localhost:5000';
const Profile = () => {
    const [userRole, setUserRole] = useState({});
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState({
        nom: '',
        prenom: '',
        email: ''
    });
    const [userDetails, setUserDetails] = useState({
        adress: '',
        dateOfBirth: '',
        dateDispo: '',
        gender: '',
        phone: '',
        image: '',
        contrat: '',
        poste:''
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const user = jwtDecode(token);

                try {
                    const userResponse = await getUserById(user.userId);
                    setUserRole(userResponse)
                    setUserData({
                        nom: userResponse.nom,
                        prenom: userResponse.prenom,
                        email: userResponse.email
                    });
                    setUserDetails({
                        adress: userResponse.adress || '',
                        dateOfBirth: userResponse.dateOfBirth || '',
                        dateDispo: userResponse.dateDispo || '',
                        gender: userResponse.gender || '',
                        phone: userResponse.phone || '',
                        image: userResponse.image || '',
                        contrat: userResponse.contrat || '',
                        poste: userResponse.poste || ''
                    });
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    // Handle error if necessary
                }
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            const userId = user.userId;
            try {
                if (selectedImage) {
                    const imageData = new FormData();
                    imageData.append('image', selectedImage);
                    await uploadImage(userId, imageData);
                }
                await completeProfile(userId, userDetails);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } catch (error) {
                console.error('Error updating profile:', error);
                // Handle error if necessary
            }
        }
    };

    // Construct the image source based on userDetails.image and whether it's empty or not
    const imagePath = userDetails.image ? baseURL + userDetails.image : "assets/images/avatar/avatar-1.jpg";

    return (
        <div id="db-wrapper" >
            <Sidebar/>

            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>

                <ContenuProfile/>
            </main>
        </div>
    );
};

export default Profile;
