import React, { useEffect, useState } from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { addOffre } from "../Services/offreService";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getAllTypeEmplois } from "../Services/typeEmploisService";
import { getAllNiveauEtudes } from "../Services/niveauEtudeService";
import { getAllTypeExperiences } from "../Services/typeExperienceService";

const AddJob = () => {
    const [titre, setTitre] = useState('');
    const [nbPoste, setNbPoste] = useState('');
    const [experience, setExperience] = useState('');
    const [remuneration, setRemuneration] = useState('');
    const [langue, setLangue] = useState('');
    const [dateExpiration, setDateExpiration] = useState('');
    const [description, setDescription] = useState('');
    const [exigences, setExigences] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [typeEmploi, setTypeEmploi] = useState(null);
    const [emplois, setEmplois] = useState([]);
    const [niveauEtude, setNiveauEtude] = useState(null);
    const [etudes, setEtudes] = useState([]);
    const [typeExperience, setTypeExperience] = useState(null);
    const [experiences, setExperiences] = useState([]);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                setUserId(user.userId);
                const emploisData = await getAllTypeEmplois();
                const formattedEmplois = emploisData.map(emploi => ({
                    value: emploi._id,
                    label: emploi.titre
                }));
                setEmplois(formattedEmplois);

                const etudesData = await getAllNiveauEtudes();
                const formattedEtudes = etudesData.map(etude => ({
                    value: etude._id,
                    label: etude.titre
                }));
                setEtudes(formattedEtudes);

                const experienceData = await getAllTypeExperiences();
                const formattedExperiences = experienceData.map(experience => ({
                    value: experience._id,
                    label: experience.titre
                }));
                setExperiences(formattedExperiences);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    };

    const validate = () => {
        const errors = {};
        if (!titre) {
            errors.titre = 'Veuillez entrer un titre.';
        }
        if (!nbPoste) {
            errors.nbPoste = 'Veuillez entrer le nombre de postes.';
        }
        if (!typeEmploi) {
            errors.typeEmploi = 'Veuillez sélectionner un type d\'emploi.';
        }
        if (!experience) {
            errors.experience = 'Veuillez entrer une expérience.';
        }
        if (!remuneration) {
            errors.remuneration = 'Veuillez entrer une rémunération.';
        }
        if (!langue) {
            errors.langue = 'Veuillez entrer une langue.';
        }
        if (!niveauEtude) {
            errors.niveauEtude = 'Veuillez sélectionner un niveau étude.';
        }

        if (!dateExpiration) {
            errors.dateExpiration = 'Veuillez entrer une date expiration.';
        }
        if (!description) {
            errors.description = 'Veuillez entrer une description.';
        }
        if (!exigences) {
            errors.exigences = 'Veuillez entrer des exigences.';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (setter, name) => (event) => {
        const { value } = event.target;
        setter(value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleSelectChange = (setter, fieldName) => (selectedOption) => {
        setter(selectedOption ? selectedOption.value : null);
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: ''
        }));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const dateCreation = new Date();
            const offreData = {
                titre,
                nbPoste,
                typeEmploi,
                experience,
                remuneration,
                langue,
                niveauEtude,
                dateExpiration,
                description,
                exigences,
                dateCreation
            };

            await addOffre(userId, offreData);
            setTitre('');
            setNbPoste('');
            setTypeEmploi(null);
            setExperience('');
            setRemuneration('');
            setLangue('');
            setNiveauEtude(null);
            setTypeExperience(null);
            setDateExpiration('');
            setDescription('');
            setExigences('');
            navigate("/offres");
        } catch (error) {
            console.error('Error adding offer:', error);
        }
    };

    return (
        <div id="db-wrapper">
            <Sidebar />
            <main id="page-content">
                <div className="header">
                    <Header />
                </div>
                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="border-bottom pb-3 mb-3">
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Ajouter Offre</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Gestion Offres</li>
                                            <li className="breadcrumb-item active" aria-current="page">Ajouter Offre</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h4 className="mb-4">Information de l'emploi</h4>
                                        <div className="row gx-3">
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="titre">Titre de poste</label>
                                                <input
                                                    type="text"
                                                    name="titre"
                                                    className={`form-control ${errors.titre ? 'is-invalid' : ''}`}
                                                    placeholder="Titre de l'emploi"
                                                    value={titre}
                                                    onChange={handleChange(setTitre, 'titre')}
                                                />
                                                {errors.titre && <div className="invalid-feedback">{errors.titre}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="nbPoste">Nombre Poste</label>
                                                <input
                                                    type="number"
                                                    name="nbPoste"
                                                    className={`form-control ${errors.nbPoste ? 'is-invalid' : ''}`}
                                                    placeholder="Nombre de poste"
                                                    value={nbPoste}
                                                    onChange={handleChange(setNbPoste, 'nbPoste')}
                                                />
                                                {errors.nbPoste &&
                                                    <div className="invalid-feedback">{errors.nbPoste}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="typeEmploi">Type d'emploi</label>
                                                <Select
                                                    name="typeEmploi"
                                                    options={emplois}
                                                    isSearchable
                                                    value={emplois.find(option => option.value === typeEmploi)}
                                                    onChange={handleSelectChange(setTypeEmploi, 'typeEmploi')}
                                                    placeholder="Sélectionner un type d'emploi"
                                                    className={errors.typeEmploi ? 'is-invalid' : ''}
                                                />
                                                {errors.typeEmploi &&
                                                    <div className="invalid-feedback">{errors.typeEmploi}</div>}
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="experience">Experience</label>
                                                <Select
                                                    name="experience"
                                                    options={experiences}
                                                    isSearchable
                                                    value={experiences.find(option => option.value === typeExperience)}
                                                    onChange={handleSelectChange(setExperience, 'experience')}
                                                    placeholder="Sélectionner un type d'expérience"
                                                    className={errors.experience ? 'is-invalid' : ''}
                                                />
                                                {errors.experience &&
                                                    <div className="invalid-feedback">{errors.experience}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="niveauEtude">Niveau Etude</label>
                                                <Select
                                                    name="niveauEtude"
                                                    options={etudes}
                                                    isSearchable
                                                    value={etudes.find(option => option.value === niveauEtude)}
                                                    onChange={handleSelectChange(setNiveauEtude, 'niveauEtude')}
                                                    placeholder="Sélectionner un niveau d'étude"
                                                    className={errors.niveauEtude ? 'is-invalid' : ''}
                                                />
                                                {errors.niveauEtude &&
                                                    <div className="invalid-feedback">{errors.niveauEtude}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label"
                                                       htmlFor="remuneration">Rémunération</label>
                                                <input
                                                    type="text"
                                                    name="remuneration"
                                                    className={`form-control ${errors.remuneration ? 'is-invalid' : ''}`}
                                                    placeholder="Rémunération"
                                                    value={remuneration}
                                                    onChange={handleChange(setRemuneration, 'remuneration')}
                                                />
                                                {errors.remuneration &&
                                                    <div className="invalid-feedback">{errors.remuneration}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="langue">Langue</label>
                                                <input
                                                    type="text"
                                                    name="langue"
                                                    className={`form-control ${errors.langue ? 'is-invalid' : ''}`}
                                                    placeholder="Langue"
                                                    value={langue}
                                                    onChange={handleChange(setLangue, 'langue')}
                                                />
                                                {errors.langue &&
                                                    <div className="invalid-feedback">{errors.langue}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor="dateExpiration">Date
                                                    d'expiration</label>
                                                <input
                                                    type="date"
                                                    name="dateExpiration"
                                                    className={`form-control ${errors.dateExpiration ? 'is-invalid' : ''}`}
                                                    placeholder="Date d'expiration"
                                                    value={dateExpiration}
                                                    onChange={handleChange(setDateExpiration, 'dateExpiration')}
                                                />
                                                {errors.dateExpiration &&
                                                    <div className="invalid-feedback">{errors.dateExpiration}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="row gx-3">
                                            <div className="col-md-12">
                                                <label htmlFor="description" className="form-label">Description de
                                                    l'emploi</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={description}
                                                    onChange={value => setDescription(value)}
                                                    className={errors.description ? 'is-invalid' : ''}
                                                />
                                                {errors.description &&
                                                    <div className="invalid-feedback">{errors.description}</div>}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="row gx-3">
                                            <div className="col-md-12">
                                                <label htmlFor="exigences" className="form-label">Exigences de l'emploi</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={exigences}
                                                    className={errors.exigences ? 'is-invalid' : ''}
                                                    onChange={value => setExigences(value)}
                                                />
                                                {errors.exigences && <div className="invalid-feedback">{errors.exigences}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <a href="#" className="btn btn-outline-primary me-2">Annuler</a>
                                    <button className="btn btn-primary" type="submit">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AddJob;
