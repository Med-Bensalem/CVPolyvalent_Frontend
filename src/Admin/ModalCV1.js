import React, { useEffect, useState } from 'react';
import './ModelCV.css';
import {jwtDecode} from 'jwt-decode';
import { getExperiencesByUser } from '../Services/experienceService';
import { getFormationsByUser } from '../Services/formationService';
import { getCompetencesByUser } from '../Services/competenceService';
import { getCertificatesByUser } from '../Services/certificationService';
import { getLanguagesByUser } from '../Services/langueService';
import { getInterestsByUser } from '../Services/interetService';
import { getUserById } from '../Services/authService';

const baseURL = 'http://localhost:5000';

const ModelCV1 = () => {
    const [experiences, setExperiences] = useState([]);
    const [formations, setFormations] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [interests, setInterests] = useState([]);
    const [user, setUser] = useState({});
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatDateRange = (startDateString, endDateString) => {
        const startDate = new Date(startDateString);

        const formattedStartDate = startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        return `${formattedStartDate}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const user = jwtDecode(token);
                try {
                    const fetchedExperiences = await getExperiencesByUser(user.userId);
                    setExperiences(fetchedExperiences);
                    const fetchedLangues = await getLanguagesByUser(user.userId);
                    setLanguages(fetchedLangues);
                    const fetchedInteret = await getInterestsByUser(user.userId);
                    setInterests(fetchedInteret);
                    const fetchedFormations = await getFormationsByUser(user.userId);
                    setFormations(fetchedFormations);
                    const fetchedCompetences = await getCompetencesByUser(user.userId);
                    setCompetences(fetchedCompetences);
                    const fetchedCertificates = await getCertificatesByUser(user.userId);
                    setCertificates(fetchedCertificates);
                    const userResponse = await getUserById(user.userId);
                    setUser(userResponse);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données utilisateur :', error);
                }
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
        };
        img.src = baseURL + user.image;
    }, [user.image]);

    const imagePath = baseURL + user.image;

    return (
        <div className="containermodelcv1">
            <header className="headermodelcv1">
                <div className="row">
                    <div className="column">
                        <img src={imagePath} alt="Votre Nom" className="profile-img" />
                        <h1 className="">{user.nom} {user.prenom}</h1>
                    </div>
                    <div className="column">
                        <div className="contact-info">
                            <p><i className="fas fa-map-marker-alt mx-2 vert-text"></i>{user.adress}</p>
                            <p><i className="fas fa-envelope mx-2 vert-text"></i>{user.email}</p>
                            <p><i className="fas fa-phone mx-2 vert-text"></i>{user.phone}</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className="section">
                <h2 className="section-title">Expérience Professionnelle</h2>
                {experiences.map((experience) => (
                    <div className="section-content" key={experience._id}>
                        <h4>{experience.titre}</h4>
                        <p>
                            <span
                                className="vert-text">{formatDateRange(experience.dateDebut)} - {experience.disponibilite ? ' Présent' : formatDateRange(experience.dateFin)}</span>, {experience.nomEntreprise}
                        </p>
                        <p style={{marginLeft: '20px'}} dangerouslySetInnerHTML={{__html: experience.description}}/>
                    </div>
                ))}
            </div>
            <div className="section">
                <h2 className="section-title">Éducation</h2>
                {formations.map((formation) => (
                    <div className="section-content" key={formation._id}>
                        <h4>{formation.diplome}</h4>
                        <p>
                            <span className="vert-text">{formatDateRange(formation.dateDebut)} - {formation.enCours ? ' Présent' : formatDateRange(formation.dateFin)}</span> {formation.etablissement}
                        </p>
                    </div>
                ))}
            </div>
            <div className="section skill">
                <h2 className="section-title">Compétences</h2>
                <ul>
                    {competences.map((competence) => (
                        <li key={competence._id}>{competence.nom}</li>
                    ))}
                </ul>
            </div>
            <div className="section skill">
                <h2 className="section-title">Langues</h2>
                <ul>
                    {languages.map((langue) => (
                        <li key={langue._id}>{langue.nom}</li>
                    ))}
                </ul>
            </div>
            <div className="section skill">
                <h2 className="section-title">Intérêts</h2>
                <ul>
                    {interests.map((interet) => (
                        <li key={interet._id}>{interet.nom}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ModelCV1;
