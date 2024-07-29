// RegisterPage.js

import React, {useEffect, useState} from 'react';
import NavbarPage from "../layouts/Navbar";
import FooterPage from "../layouts/Footer";
import {
    getAllOffres,
    rechercheParExperience,
    rechercheParNiveauEtude,
    rechercheParTypeEmploi
} from "../Services/offreService";
import {getUserById} from "../Services/authService";
import {useNavigate} from 'react-router-dom';
import moment from "moment";
import {getAllTypeExperiences, getTypeExperienceById} from "../Services/typeExperienceService";
import ReactPaginate from "react-paginate";
import {getAllTypeEmplois} from "../Services/typeEmploisService";
import {getAllNiveauEtudes} from "../Services/niveauEtudeService";

const itemsPerPage = 5;
const ListJobsPage = () => {
    const [offres, setOffres] = useState([]);
    const navigate = useNavigate();
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [nombreOffre, setNombreOffre] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [emplois, setEmplois] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [etudes, setEtudes] = useState([]);
    const [selectedEmplois, setSelectedEmplois] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [selectedEtude, setSelectedEtude] = useState([]);

    const handleClick = (id) => {
        navigate(`/single-job/${id}`);
    };

    const handleCheckboxChange = async (event, emploiValue) => {
        const isChecked = event.target.checked;
        let newSelectedEmplois = [...selectedEmplois];

        if (isChecked) {
            newSelectedEmplois.push(emploiValue);
        } else {
            newSelectedEmplois = newSelectedEmplois.filter(value => value !== emploiValue);
        }

        setSelectedEmplois(newSelectedEmplois);

        if (newSelectedEmplois.length === 0) {
            // Fetch all job offers directly
            await fetchOffres();
        } else {
            // Rechercher les offres par types d'emploi sélectionnés
            const results = await Promise.all(newSelectedEmplois.map(type => rechercheParTypeEmploi(type)));

            // Fetch additional details for each offer
            const detailedResults = await Promise.all(results.flat().map(async (offre) => {

                // Fetch user details and other processing for each offer
                const user = await getUserById(offre.userId);
                const typeExperience = await getTypeExperienceById(offre.experience);

                return {
                    ...offre,
                    adresse: user.adress,
                    nom: user.nom,
                    userImage: `http://localhost:5000${user.image}`,
                    titreTypeExperience: typeExperience.titre
                };
            }));

            // Set all merged results with additional details in the state
            setOffres(detailedResults);
        }
    };

    const handleCheckboxChangeExperience = async (event, expValue) => {
        const isChecked = event.target.checked;
        let newSelectedExperience = [...selectedExperience];

        if (isChecked) {
            newSelectedExperience.push(expValue);
        } else {
            newSelectedExperience = newSelectedExperience.filter(value => value !== expValue);
        }

        setSelectedExperience(newSelectedExperience);

        if (newSelectedExperience.length === 0) {
            // Fetch all job offers directly
            await fetchOffres();
        } else {
            // Rechercher les offres par types d'emploi sélectionnés
            const results = await Promise.all(newSelectedExperience.map(type => rechercheParExperience(type)));

            // Fetch additional details for each offer
            const detailedResults = await Promise.all(results.flat().map(async (offre) => {

                // Fetch user details and other processing for each offer
                const user = await getUserById(offre.userId);
                const typeExperience = await getTypeExperienceById(offre.experience);

                return {
                    ...offre,
                    adresse: user.adress,
                    nom: user.nom,
                    userImage: `http://localhost:5000${user.image}`,
                    titreTypeExperience: typeExperience.titre
                };
            }));

            // Set all merged results with additional details in the state
            setOffres(detailedResults);
        }
    };


    const handleCheckboxChangeEtude = async (event, etudeValue) => {
        const isChecked = event.target.checked;
        let newSelectedEtude = [...selectedEtude];

        if (isChecked) {
            newSelectedEtude.push(etudeValue);
        } else {
            newSelectedEtude = newSelectedEtude.filter(value => value !== etudeValue);
        }

        setSelectedEtude(newSelectedEtude);

        if (newSelectedEtude.length === 0) {
            // Fetch all job offers directly
            await fetchOffres();
        } else {
            // Rechercher les offres par types d'emploi sélectionnés
            const results = await Promise.all(newSelectedEtude.map(type => rechercheParNiveauEtude(type)));

            // Fetch additional details for each offer
            const detailedResults = await Promise.all(results.flat().map(async (offre) => {

                // Fetch user details and other processing for each offer
                const user = await getUserById(offre.userId);
                const typeExperience = await getTypeExperienceById(offre.experience);

                return {
                    ...offre,
                    adresse: user.adress,
                    nom: user.nom,
                    userImage: `http://localhost:5000${user.image}`,
                    titreTypeExperience: typeExperience.titre
                };
            }));

            // Set all merged results with additional details in the state
            setOffres(detailedResults);
        }
    };

    const handleClearData = () => {
        setSelectedEmplois([]);
        setSelectedExperience([]);
        setSelectedEtude([]);
        fetchOffres();
    };






    // Function to fetch offres
    const fetchOffres = async () => {
        try {
            const fetchedOffres = await getAllOffres();
            setNombreOffre(fetchedOffres.length)
            // Map through fetched offres and fetch user's email for each offre
            const updatedOffres = await Promise.all(
                fetchedOffres.map(async (offre) => {
                    const user = await getUserById(offre.userId);
                    const typeExperience = await getTypeExperienceById(offre.experience)
                    return {
                        ...offre,
                        adresse: user.adress ,
                        nom:user.nom,
                        userImage: `http://localhost:5000${user.image}`,
                        titreTypeExperience: typeExperience.titre
                    };
                })
            );
            setOffres(updatedOffres);
            const emploisData = await getAllTypeEmplois();
            const formattedEmplois = emploisData.map(emploi => ({
                value: emploi._id,
                label: emploi.titre
            }));
            const experienceData = await getAllTypeExperiences();
            const formattedExperiences = experienceData.map(experience => ({
                value: experience._id,
                label: experience.titre
            }));
            setExperiences(formattedExperiences);
            const etudesData = await getAllNiveauEtudes();
            const formattedEtudes = etudesData.map(etude => ({
                value: etude._id,
                label: etude.titre
            }));
            setEtudes(formattedEtudes);
            setEmplois(formattedEmplois);

        } catch (error) {
            console.error('Error fetching offres:', error);
        }
    };

    // Fetch offres on component mount
    useEffect(() => {
        fetchOffres();
    }, []);

    const getDifference = (date) => {
        const currentDate = moment();
        const creationDate = moment(date);
        const diffMinutes = currentDate.diff(creationDate, 'minutes');
        const diffHours = currentDate.diff(creationDate, 'hours');
        const diffDays = currentDate.diff(creationDate, 'days');
        const diffWeeks = currentDate.diff(creationDate, 'weeks');
        const diffMonths = currentDate.diff(creationDate, 'months');
        const diffYears = currentDate.diff(creationDate, 'years');

        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays < 7) {
            return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else if (diffWeeks < 4) {
            return `${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
        } else if (diffMonths < 12) {
            return `${diffMonths} mois`;
        } else {
            return `${diffYears} an${diffYears > 1 ? 's' : ''}`;
        }
    };

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(offres.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(offres.length / itemsPerPage));
    }, [itemOffset, offres]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % offres.length;
        setItemOffset(newOffset);
    };

    return (
        <div>
            <NavbarPage/>
            <main>
                <section className="py-7 ">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-10 col-12">
                                <div className="mb-4 text-center">
                                    <h1 className="fw-bold mb-4" style={{marginLeft: '50%'}}>
                                        <span className="text-primary">{nombreOffre}</span> Offres d'emploi
                                    </h1>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-8 bg-white">
                    <div className="container">
                    <div className="row">
                        <div className="col-md-4 col-xl-3">
                                <div className="card border mb-6 mb-md-0 shadow-none">
                                    <div className="card-header">
                                        <h4 className="mb-0 fs-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-filter me-2" viewBox="0 0 16 16">
                                                <path
                                                    d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                                            </svg>
                                            Tous les filtres
                                        </h4>
                                    </div>

                                    <div className="card-body border-top py-3">
                                        <a
                                            className="fs-5 text-dark fw-semibold"
                                            data-bs-toggle="collapse"
                                            href="#collapseExampleThree"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="collapseExampleThree">
                                            Type Emplois
                                            <span className="float-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                 fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                                <path fillRule="evenodd"
                                                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </span>
                                        </a>
                                        <div className="collapse" id="collapseExampleThree">
                                            <div className="mt-3">
                                                {emplois.map((emploi) => (
                                                    <div className="form-check mb-2" key={emploi.value}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={emploi.value}
                                                            id={`flexCheck${emploi.value}`}
                                                            onChange={(event) => handleCheckboxChange(event, emploi.value)}
                                                        />
                                                        <label className="form-check-label"
                                                               htmlFor={`flexCheck${emploi.value}`}>
                                                            {emploi.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body border-top py-3">
                                        <a
                                            className="fs-5 text-dark fw-semibold"
                                            data-bs-toggle="collapse"
                                            href="#collapseExampleSecond"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="collapseExampleSecond">
                                            Experience
                                            <span className="float-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                 fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                                <path fillRule="evenodd"
                                                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </span>
                                        </a>
                                        <div className="collapse " id="collapseExampleSecond">
                                            <div className="mt-3">
                                                {experiences.map((experience) => (
                                                    <div className="form-check mb-2" key={experience.value}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={experience.value}
                                                            id={`flexCheck${experience.value}`}
                                                            onChange={(event) => handleCheckboxChangeExperience(event, experience.value)}
                                                        />
                                                        <label className="form-check-label"
                                                               htmlFor={`flexCheck${experience.value}`}>
                                                            {experience.label}
                                                        </label>
                                                    </div>
                                                ))}


                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body border-top py-3">
                                        <a
                                            className="fs-5 text-dark fw-semibold"
                                            data-bs-toggle="collapse"
                                            href="#collapseExampleFourth"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="collapseExampleFourth">
                                            Education
                                            <span className="float-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                 fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                                <path fillRule="evenodd"
                                                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </span>
                                        </a>
                                        <div className="collapse " id="collapseExampleFourth">
                                            <div className="mt-3">
                                                {etudes.map((etude) => (
                                                    <div className="form-check mb-2" key={etude.value}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={etude.value}
                                                            id={`flexCheck${etude.value}`}
                                                            onChange={(event) => handleCheckboxChangeEtude(event, etude.value)}
                                                        />
                                                        <label className="form-check-label"
                                                               htmlFor={`flexCheck${etude.value}`}>
                                                            {etude.label}
                                                        </label>
                                                    </div>
                                                ))}


                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body pb-3 pt-0 d-grid">
                                        <a  className="btn btn-outline-secondary" onClick={handleClearData}> Clear Filters</a>
                                    </div>
                                </div>
                            </div>

                        <div className="col-xl-9 col-md-8 mb-6 mb-md-0">
                            <div className="row align-items-center mb-4">
                                <div className="col">
                                    <p className="mb-0">Dernières Offres d'emploi</p>
                                </div>

                            </div>

                            {currentItems.map((offre, index) => (

                                <div className="card card-bordered mb-3 card-hover cursor-pointer" key={offre._id}>
                                    <div className="card-body">
                                        <div className="d-xl-flex">

                                            <img src={offre.userImage} alt="user"
                                                 style={{height: '80px', width: '80px', marginTop: '20px'}}/>


                                            <div className="ms-xl-3 w-100 mt-3 mt-xl-1">
                                                <div className="d-flex justify-content-between mb-5">
                                                    <div>
                                                        <h3 className="mb-1 fs-4">
                                                            <div key={offre._id} className="text-inherit"
                                                                 onClick={() => handleClick(offre._id)}>
                                                                <h3 className="mb-1 fs-4">{offre.titre}</h3>
                                                            </div>

                                                        </h3>

                                                        <div>
                                                            <span>{offre.nom}</span>


                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="d-md-flex justify-content-between">
                                                    <div className="mb-2 mb-md-0">
                                                    <span className="me-2">
                                                        <i className="fe fe-briefcase"></i>
                                                        <span className="ms-1">{offre.titreTypeExperience} </span>
                                                    </span>
                                                        <span className="me-2">
                                                        <i className="fe fe-dollar-sign"></i>
                                                        <span className="ms-1">{offre.remuneration}</span>
                                                    </span>
                                                        <span className="me-2">
                                                        <i className="fe fe-map-pin"></i>
                                                        <span className="ms-1">{offre.adresse}</span>
                                                    </span>
                                                    </div>
                                                    <div>
                                                        <i className="fe fe-clock mx-2"></i>
                                                        <span>{getDifference(offre.dateCreation)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            ))}
                            <div className="pagination-container">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="suivant >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}
                                    pageCount={pageCount}
                                    previousLabel="< précédent"
                                    renderOnZeroPageCount={null}
                                    containerClassName="pagination"
                                    activeClassName="active"
                                />
                            </div>
                        </div>
                    </div>

                    </div>

                </section>

            </main>
            <FooterPage/>
        </div>

    );
};

export default ListJobsPage;
