// RegisterPage.js
import React, {useEffect, useState} from 'react';
import {register} from "../Services/authService";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import SuccessAlert from "../Alert/SuccessAlert";
import {getAllSecteurs} from "../Services/secteurService";


const RegisterPage = () => {
    const [secteurActiviteVisible, setSecteurActiviteVisible] = useState(false);
    const [prenomVisible, setPrenomVisible] = useState(true);
    const [nomLabel, setNomLabel] = useState("Nom ");
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const [success, setSuccess] = useState(false);
    const [secteurs ,setSecteurs] = useState();

    const [formData, setFormData] = useState({
        password: '',
        email: '',
        nom: '',
        prenom: '',
        role: 'candidat',// Par défaut, le rôle est défini sur "candidat"
        secteur: ''

    });

    useEffect(() => {
        const fetchSecteurs = async () => {
            try {
                const secteursData = await getAllSecteurs();
                // Mapper les données pour les adapter au format attendu par react-select
                const formattedSecteurs = secteursData.map(secteur => ({
                    value: secteur._id,
                    label: secteur.titre
                }));
                setSecteurs(formattedSecteurs);
            } catch (error) {
                console.error('Erreur lors du chargement des secteurs', error);
            }
        };

        fetchSecteurs();
    }, []);




    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        // Validation logic for each field
        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est requis";
            valid = false;
        }

        if (!formData.prenom.trim() && formData.role === 'candidat') {
            newErrors.prenom = "Le prénom est requis";
            valid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'adresse email est requise";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Veuillez saisir une adresse email valide";
            valid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = "Le mot de passe est requis";
            valid = false;
        }

        if (formData.role === 'entreprise' && !formData.secteur) {
            newErrors.secteur = "Le secteur d'activité est requis";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleEntrepriseClick = () => {
        setSecteurActiviteVisible(true);
        setPrenomVisible(false);
        setNomLabel("Nom de l'entreprise ");
        // Mettre à jour le rôle
        setFormData({...formData, role: 'entreprise'});
    };

    const handleCandidatClick = () => {
        setSecteurActiviteVisible(false);
        setPrenomVisible(true);
        setNomLabel("Nom ");
        // Mettre à jour le rôle
        setFormData({...formData, role: 'candidat'});
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const { password, email, nom, prenom, role, secteur } = formData;
                const success = await register(password, email, nom, prenom, role, secteur);
                setSuccess(true)
                setTimeout(() => {
                    navigate('/login');
                }, 1000);

            } catch (error) {
                setBackendError(error.message);
            }
        }
    };
    return (
        <main>
            <section className="container d-flex flex-column vh-100">
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <a href=""><img src="assets/images/brand/logo/logo-icon.svg" className="mb-4" alt="logo"/></a>
                                    <h1 className="mb-1 fw-bold">Inscription</h1>
                                    <span>
                                    Vous avez déjà un compte?
                                    <a href="/login" className="ms-1">Login</a>
                                </span>
                                </div>

                                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                    {backendError && <div className="alert alert-danger">{backendError}</div>}
                                    <input type="hidden" name="role" value={formData.role}/>
                                    <div className="col-md-12 row">
                                        <div className="col-md-6">
                                            <div className="card card-hover bg-light ">
                                                <div className="d-flex justify-content-between align-items-center p-3">
                                                    <div className="d-flex">
                                                        <div className="ms-6">
                                                            <h4 className="mb-1" onClick={handleEntrepriseClick}>
                                                                Entreprise
                                                            </h4>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card card-hover bg-light">
                                                <div className="d-flex justify-content-between align-items-center p-3">
                                                    <div className="d-flex">
                                                        <div className="ms-6">
                                                            <h4 className="mb-1" onClick={handleCandidatClick}>
                                                                Candidat
                                                            </h4>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="nom" className="form-label">{nomLabel}<span
                                                    className="red-asterisk">*</span></label>
                                                <input type="text" id="nom" className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                                                       name="nom"
                                                       placeholder={nomLabel === "Nom " ? "Nom" : "Nom de l'entreprise"}
                                                       onChange={handleChange} required/>
                                                {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                                            </div>
                                        </div>
                                        {prenomVisible && (
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="prenom" className="form-label">Prénom <span
                                                        className="red-asterisk">*</span></label>
                                                    <input type="text" id="prenom" className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                                                           name="prenom"
                                                           placeholder="Prénom" onChange={handleChange} required/>
                                                    {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                                                </div>
                                            </div>
                                        )}
                                        {secteurActiviteVisible && (
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    <label htmlFor="secteurActivite" className="form-label">Secteur
                                                        Activité <span className="red-asterisk">*</span></label>
                                                    <Select
                                                        options={secteurs}
                                                        onChange={(selectedOption) => setFormData({
                                                            ...formData,
                                                            secteur: selectedOption ? selectedOption.value : ''
                                                        })}
                                                        value={secteurs.find(option => option.value === formData.secteur)}
                                                        isSearchable
                                                    />
                                                    {errors.secteur &&
                                                        <div className="invalid-feedback">{errors.secteur}</div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Adresse E-mail<span
                                            className="red-asterisk">*</span></label>
                                        <input type="email" id="email"
                                               className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                               name="email"
                                               placeholder="Adresse E-mail" onChange={handleChange} required/>
                                        {errors.prenom && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Mot de Passe <span
                                            className="red-asterisk">*</span></label>
                                        <input type="password" id="password"
                                               className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                               name="password"
                                               placeholder="**************" onChange={handleChange} required/>
                                        {errors.prenom && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    <div>

                                        <div className="d-grid">
                                            <button type="submit" className="btn btn-primary">S'inscrire</button>
                                        </div>
                                    </div>

                                </form>
                                {success && (
                                    <SuccessAlert message="Compte cree avec succès" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );

};

export default RegisterPage;
