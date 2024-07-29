import React, { useEffect, useState } from 'react';
import NavbarPage from '../layouts/Navbar';
import FooterPage from '../layouts/Footer';
import { useParams } from 'react-router-dom';
import {getUserById, updateUserViews} from '../Services/authService';
import { getExperiencesByUser } from '../Services/experienceService';
import { getFormationsByUser } from '../Services/formationService';
import { getCompetencesByUser } from '../Services/competenceService';
import { getLanguagesByUser } from '../Services/langueService';
import { getInterestsByUser } from '../Services/interetService';

const baseURL = 'http://localhost:5000';

const About = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [experiences, setExperiences] = useState([]);
    const [formations, setFormations] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [langues, setLangues] = useState([]);
    const [interets, setInterets] = useState([]);
    const [viewCount, setViewCount] = useState(0);

    const formatDateRange = (startDateString, endDateString) => {
        const startDate = new Date(startDateString);
        const formattedStartDate = startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        return `${formattedStartDate}`;
    };

    const fetchOffres = async () => {
        try {
            const user = await getUserById(id);
            setUser(user);
            const experiences = await getExperiencesByUser(id);
            setExperiences(experiences);
            const formations = await getFormationsByUser(id);
            setFormations(formations);
            const competences = await getCompetencesByUser(id);
            setCompetences(competences);
            const langues = await getLanguagesByUser(id);
            setLangues(langues);
            const interets = await getInterestsByUser(id);
            setInterets(interets);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    };

    useEffect(() => {
        fetchOffres();
        return () => {
            updateUserViews(id, viewCount + 1);
        };
    }, [id]);

    const imagePath = user.image ? baseURL + user.image : 'assets/images/avatar/avatar-1.jpg';

    return (
        <div>
            <NavbarPage />
            <section className="p-lg-5 py-7">
                <div className="container">
                    <div className="col-xl-10" style={{ marginLeft: '70px' }}>
                        <div className="row">
                            <div className="col-lg-8 col-12">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <img src={imagePath} className="avatar-xl rounded-circle" alt="" />
                                            <div className="ms-4">
                                                <h3 className="mb-1">{user.nom} {user.prenom}</h3>
                                                <h6 className="mb-1">{user.poste}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="card">
                                        <div className="card-header"><h4 className="mb-0">Experiences</h4></div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-flush list-timeline-activity">
                                                {experiences.map((experience, index) => (
                                                    <li className="list-group-item px-0 pt-0 border-0 mb-4" key={index}>
                                                        <div className="row">
                                                            <div className="col-auto">
                                                                <div className="icon-shape icon-md rounded-circle bg-primary text-white position-relative z-1">
                                                                    <i className="fa fa-history"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col ms-n2 mt-1">
                                                                <h4 className="mb-2">{experience.titre}</h4>
                                                                <h6 className="mb-0">{formatDateRange(experience.dateDebut)} - {experience.disponibilite ? ' Présent' : formatDateRange(experience.dateFin)} , {experience.nomEntreprise}</h6>
                                                                <span dangerouslySetInnerHTML={{ __html: experience.description }} />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="card">
                                        <div className="card-header"><h4 className="mb-0">Formations</h4></div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-flush list-timeline-activity">
                                                {formations.map((formation, index) => (
                                                    <li className="list-group-item px-0 pt-0 border-0 mb-4" key={index}>
                                                        <div className="row">
                                                            <div className="col-auto">
                                                                <div className="icon-shape icon-md rounded-circle bg-primary text-white position-relative z-1">
                                                                    <i className="fe fe-file"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col ms-n2 mt-1">
                                                                <h4 className="mb-2">{formation.diplome}</h4>
                                                                <h5 className="mb-0">{formation.etablissement}</h5>
                                                                <span className="fs-6">{formatDateRange(formation.dateDebut)} - {formation.enCours ? ' Présent' : formatDateRange(formation.dateFin)}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card mt-4 mt-lg-0">
                                    <div className="card-body border-bottom">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h4 className="mb-0">Contact</h4>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="fe fe-mail fs-4"></i>
                                                <span className="ms-2">{user.email}</span>
                                            </div>
                                            <div className="d-flex align-items-center ">
                                                <i className="fe fe-phone fs-4"></i>
                                                <span className="ms-2">{user.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h4 className="mb-0">Adresse</h4>
                                        </div>
                                        <div>
                                            <i className="fe fe-map-pin fs-4"></i>
                                            <span className="ms-2">{user.adress}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mt-4 mt-lg-20">
                                    <div className="card-body border-bottom">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h4 className="mb-0">Compétences</h4>
                                        </div>
                                        <div>
                                            <div >
                                                {competences.map((competence, index) => (
                                                    <a className="btn btn-secondary bg-primary text-white btn-sm mx-2" key={index} style={{marginTop:'10px'}}>
                                                        <span >{competence.nom}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <h4 className="mb-0">Langue</h4>
                                        </div>
                                        <div>
                                            {langues.map((langue, index) => (
                                                <a className="btn btn-secondary bg-primary text-white btn-sm mx-2" key={index} style={{marginTop:'10px'}}>
                                                    <span>{langue.nom}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="card-body border-bottom">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h4 className="mb-0">Intérêt</h4>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center">
                                                {interets.map((interet, index) => (
                                                    <a className="btn btn-secondary bg-primary text-white btn-sm mx-2" key={index} style={{marginTop:'10px'}}>
                                                        <span>{interet.nom}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FooterPage />
        </div>
    );
};

export default About;
