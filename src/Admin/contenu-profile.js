// Template1.js
import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {completeProfile, getUserById, uploadImage} from "../Services/authService";
import moment from "moment";
import SuccessAlert from "../Alert/SuccessAlert";



const baseURL = 'http://localhost:5000';
const ContenuProfile = () => {
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

                <section className="container-fluid p-4">
                    <div className="col-lg-12 col-md-8 col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="mb-0">Détails personnels</h3>
                                <p className="mb-0">Modifiez vos informations personnelles .</p>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-start align-items-sm-center gap-4">
                                    {/* Use the constructed imagePath variable as the src attribute */}
                                    <img
                                        src={selectedImage ? URL.createObjectURL(selectedImage) : imagePath}
                                        alt="user-avatar"
                                        className="d-block rounded"
                                        height="100"
                                        width="100"
                                        id="uploadedAvatar"/>
                                    <div className="button-wrapper">
                                        <label htmlFor="upload" className="btn btn-primary me-2 mb-4"
                                               tabIndex="0">
                                            <span className="d-none d-sm-block">Télécharger une photo</span>
                                            <i className="bx bx-upload d-block d-sm-none"></i>
                                            <input
                                                type="file"
                                                id="upload"
                                                className="account-file-input"
                                                hidden
                                                accept="image/png, image/jpeg"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <hr className="my-5"/>
                                <div>
                                    <form className="row gx-3 needs-validation" noValidate onSubmit={handleSubmit}>
                                        {userRole.role === 'entreprise' ? (
                                            // If user role is admin, render div 1
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="fname">Nom Sociéte</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={userData.nom}
                                                    readOnly
                                                />
                                            </div>
                                        ) : (
                                            // If user role is not admin, render div 2
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="fname">Nom et prénom</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={userData.nom + " " + userData.prenom}
                                                    readOnly
                                                />
                                            </div>
                                        )}



                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="address" className="form-label">Adresse</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="address"
                                                name="adress"
                                                value={userDetails.adress}
                                                onChange={handleChange}
                                                placeholder="Addresse"
                                            />
                                        </div>
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="email" className="form-label">E-mail</label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={userData.email}
                                                readOnly
                                            />
                                            <div className="invalid-feedback">Please choose a date.</div>
                                        </div>
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="phoneNumber">Téléphone</label>
                                            <div className="input-group input-group-merge">
                                                <span className="input-group-text">(+216)</span>
                                                <input
                                                    type="text"
                                                    id="phoneNumber"
                                                    name="phone"
                                                    value={userDetails.phone}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="00 000 000"/>
                                            </div>
                                        </div>
                                        {userRole.role === 'candidat' && (
                                            <>
                                                <div className="mb-3 col-12 col-md-6">
                                                    <label htmlFor="dateOfBirth" className="form-label">Date de
                                                        naissance</label>
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        id="dateOfBirth"
                                                        name="dateOfBirth"
                                                        value={moment(userDetails.dateOfBirth).format('YYYY-MM-DD')}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="invalid-feedback">Please enter address.</div>
                                                </div>
                                                <div className="mb-3 col-12 col-md-6">
                                                    <label htmlFor="dateDispo" className="form-label">Date de
                                                        disponibilité</label>
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        id="dateDispo"
                                                        name="dateDispo"
                                                        value={moment(userDetails.dateDispo).format('YYYY-MM-DD')}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="invalid-feedback">Please choose state.</div>
                                                </div>
                                                <div className="mb-3 col-12 col-md-6">
                                                    <label htmlFor="genre" className="form-label">Genre</label>
                                                    <select id="genre" name="gender" className="select2 form-select"
                                                            value={userDetails.gender} onChange={handleChange}>
                                                        <option value="">Select Genre</option>
                                                        <option value="Homme">Homme</option>
                                                        <option value="Femme">Femme</option>
                                                    </select>
                                                    <div className="invalid-feedback">Please choose country.</div>
                                                </div>
                                                <div className="mb-3 col-12 col-md-6">
                                                    <label htmlFor="contrat" className="form-label">Contrat
                                                        souhaité</label>
                                                    <select id="contrat" name="contrat" className="select2 form-select"
                                                            value={userDetails.contrat} onChange={handleChange}>
                                                        <option value="">Select Contrat</option>
                                                        <option value="CDD">CDD</option>
                                                        <option value="CDI">CDI</option>
                                                        <option value="CIVP">CIVP</option>
                                                        <option value="Stage">Stage</option>
                                                        <option value="CTT">CTT</option>
                                                        <option value="CIE">CIE</option>
                                                        <option value="CAE">CAE</option>
                                                        <option value="CUI">CUI</option>
                                                    </select>
                                                    <div className="invalid-feedback">Please choose country.</div>
                                                </div>
                                                <div className="mb-3 col-12 col-md-6">
                                                    <label htmlFor="address" className="form-label">Poste désiré</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="poste"
                                                        name="poste"
                                                        value={userDetails.poste}
                                                        onChange={handleChange}
                                                        placeholder="Poste Désiré"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="col-12">
                                            <button className="btn btn-primary" type="submit">Modifier Profile</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {success && (
                        <SuccessAlert message="updated successfully" />
                    )}
                </section>


    );
};

export default ContenuProfile;
