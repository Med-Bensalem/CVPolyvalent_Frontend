// Template1.js
import React, {useEffect, useState} from 'react';
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getAllOffres, getOffreById} from "../Services/offreService";
import moment from "moment/moment";
import {getUserById} from "../Services/authService";
import {jwtDecode} from "jwt-decode";
import {createPostule} from "../Services/postuleService";
import {getTypeExperienceById} from "../Services/typeExperienceService";
import {getTypeEmploiById} from "../Services/typeEmploisService";
import {getNiveauEtudeById} from "../Services/niveauEtudeService";
import SuccessAlert from "../Alert/SuccessAlert";

const baseURL = 'http://localhost:5000';
const SingleJob = () => {
    const { id } = useParams();
    const [offre, setOffre] = useState('');
    const [userOffre, setUserOffre] = useState('');
    const [offres, setOffres] = useState([]);
    const [token, setToken] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [lettreMotivationFile, setLettreMotivationFile] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [userConnect, setUserConnect] = useState('');
    const navigate = useNavigate();
    const [titre, setTitre] = useState('');
    const [typeEmplois, setTypeEmplois] = useState('');
    const [niveauEtude, setNiveauEtude] = useState('');
    const [validationErrors, setValidationErrors] = useState({});



    const fetchOffres = async () => {

                 const fetchedOffre = await getOffreById(id);
                 setOffre(fetchedOffre);
                 const typeEmplois = await getTypeEmploiById(fetchedOffre.typeEmploi)
                 setTypeEmplois(typeEmplois)
                const niveauEtude = await getNiveauEtudeById(fetchedOffre.niveauEtude)
                setNiveauEtude(niveauEtude)
                const typeExperience = await getTypeExperienceById(fetchedOffre.experience)
                 setTitre(typeExperience.titre);
                const fetchedOffres = await getAllOffres();
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
                const limitedOffres = updatedOffres.slice(0, 3);
                setOffres(limitedOffres);
                const token = localStorage.getItem("token");
                setToken(token);
                const fetchedUser = await getUserById(fetchedOffre.userId);
                setUserOffre(fetchedUser)

                if (token) {
                    const user = jwtDecode(token);
                    try {
                        setUserId(user.userId);
                        const userConnect = await getUserById(user.userId);
                        setUserConnect(userConnect)

                    } catch (error) {
                        console.error('Error fetching user:', error);
                    }
                }





    };
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
        fetchOffres();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!cvFile) {
            errors.cvFile = "Veuillez télécharger votre CV.";
        }
        if (!lettreMotivationFile) {
            errors.lettreMotivationFile = "Veuillez télécharger votre lettre de motivation.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const CurrentDate = moment().format('YYYY-MM-DD');

            await createPostule(cvFile, lettreMotivationFile, userId, id, description,CurrentDate);
            setSuccessMessage('Candidature créée avec succès !');
            setError('');
            document.getElementById('applyModal').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
            setSuccessMessage(true)
            setTimeout(() => {
                navigate("/candidat-Suivie");
            }, 1000);

        } catch (err) {
            setError('Une erreur est produite lors de la création de la candidature.');
            setSuccessMessage('');
            console.error(err);
        }
    };

    const imagePath = userOffre.image ? baseURL + userOffre.image : "assets/images/avatar/avatar-1.jpg";
    return (
        <div>
            <Navbar/>
            <section className="py-lg-8 py-7">
                <div className="container my-lg-8">
                    <div className="row ">
                        <div className="offset-xl-2 col-xl-8 col-md-12">
                            <div className="d-xl-flex ">
                                <div className="mb-3 mb-md-0">
                                    <img
                                        src={imagePath}
                                        style={{width: '200px', marginTop: '30px'}}
                                        alt=""
                                    />
                                </div>
                                <div className="ms-xl-3 w-100 mt-3 mt-xl-0">
                                    <div className="d-flex justify-content-between mb-5">
                                        <div>
                                            <h1 className="mb-1 h2">{offre.titre}</h1>
                                            <div>
                                                <span>{userOffre.nom}</span>


                                            </div>
                                        </div>

                                    </div>
                                    <div>
                                        <div className="d-md-flex justify-content-between">
                                            <div className="mb-2 mb-md-0">
                                                <span className="me-2">
                                                    <i className="fe fe-briefcase"></i>
                                                    <span className="ms-1">{titre} </span>
                                                </span>
                                                <span className="me-2">
                                                    <i className="fe fe-dollar-sign"></i>
                                                    <span className="ms-1">{offre.remuneration}</span>
                                                </span>
                                                <span className="me-2">
                                                    <i className="fe fe-map-pin"></i>
                                                    <span className="ms-1">{userOffre.adress}</span>
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
                            <hr className="my-4"/>
                            <div>
                                <table className="w-md-40">
                                    <tr>
                                        <td className="ps-0 pb-0">
                                            <span className="text-dark fw-semibold">Postes vacants:</span>
                                        </td>
                                        <td className="ps-0 pb-0"><span>{offre.nbPoste}</span></td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0 pb-0">
                                            <span className="text-dark fw-semibold">Type d'emploi:</span>
                                        </td>
                                        <td className="ps-0 pb-0"><span>{typeEmplois.titre}</span></td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0 pb-0">
                                            <span className="text-dark fw-semibold">Langue:</span>
                                        </td>
                                        <td className="ps-0 pb-0"><span>{offre.langue}</span></td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0 pb-0">
                                            <span className="text-dark fw-semibold">Niveau d'étude :</span>
                                        </td>
                                        <td className="ps-0 pb-0"><span>{niveauEtude.titre}</span></td>
                                    </tr>


                                </table>
                            </div>
                            <div className="mt-6">
                                <h1 className="mb-3 fs-3">Description de l'emploi</h1>
                                <p dangerouslySetInnerHTML={{__html: offre.description}}/>
                            </div>
                            <div className="mt-6">
                                <h2 className="mb-3 fs-3">Exigences de l'emploi</h2>
                                <p dangerouslySetInnerHTML={{__html: offre.exigences}}/>
                            </div>
                            <div>
                                <h2 className="mb-3 fs-3">Date d'expiration</h2>
                                <p>{moment(offre.dateExpiration).format('YYYY-MM-DD')}</p>
                            </div>

                            <div className="mt-5 d-grid">


                                {token === null ? (
                                    // Si le token est null, affichez le lien vers la page de connexion
                                    <a href="/login" className="btn btn-primary">Postuler Maintenant</a>
                                ) : (
                                    // Sinon, affichez le lien qui déclenche le modal
                                    <a href="#" className="btn btn-primary" data-bs-toggle="modal"
                                       data-bs-target="#applyModal">Postuler Maintenant</a>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="offset-xl-2 col-xl-8 col-md-12">
                            <div className="mt-8">
                                <h2 className="mb-4">Emplois Similaires</h2>
                                {offres.map((offre, index) => (
                                    <div className="card card-bordered mb-3 card-hover cursor-pointer" key={index}>
                                        <div className="card-body">
                                            <div className="d-xl-flex">

                                                <img src={offre.userImage} alt="user"
                                                     style={{height: '80px', width: '80px', marginTop: '20px'}}/>

                                                <div className="ms-xl-3 w-100 mt-3 mt-xl-1">
                                                    <div className="d-flex justify-content-between mb-5">
                                                        <div>
                                                            <h3 className="mb-1 fs-4">
                                                                <Link to={`/single-job/${offre._id}`}
                                                                      className="text-inherit">
                                                                    <h3 className="mb-1 fs-4">{offre.titre}</h3>
                                                                </Link>

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

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>


                <div className="modal fade" id="applyModal" tabIndex="-1" role="dialog" aria-labelledby="applyModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="mb-4">Postuler</h3>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {successMessage && (
                                    <div className="alert alert-success">{successMessage}</div>
                                )}
                                <form className="needs-validation" noValidate onSubmit={handleFormSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="fname">
                                            Nom
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" id="fname" className="form-control" placeholder="Nom"
                                               value={userConnect.nom} readOnly/>
                                        <div className="invalid-feedback">Please enter first name</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="lname">
                                            Prénom
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" id="lname" className="form-control" placeholder="Prénom"
                                               value={userConnect.prenom} readOnly/>
                                        <div className="invalid-feedback">Please enter last name</div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="email">
                                            Adresse E-mail
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input type="email" id="email" className="form-control"
                                               value={userConnect.email} readOnly/>
                                        <div className="invalid-feedback">Please enter an email</div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="cvFile" className="form-label">
                                            Téléchargez votre CV
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="cvFile"
                                            onChange={(e) => setCvFile(e.target.files[0])}
                                        />
                                        {validationErrors.cvFile && (
                                            <div className="text-danger">{validationErrors.cvFile}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lettreMotivationFile" className="form-label">
                                            Téléchargez votre lettre de motivation
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="lettreMotivationFile"
                                            onChange={(e) => setLettreMotivationFile(e.target.files[0])}
                                        />
                                        {validationErrors.lettreMotivationFile && (
                                            <div className="text-danger">{validationErrors.lettreMotivationFile}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="message">Pourquoi Choisir Geeks</label>
                                        <textarea className="form-control" rows="4" placeholder="Ecrire ici ...."
                                                  id="message"
                                                  value={description} onChange={(e) => setDescription(e.target.value)}
                                                  required></textarea>
                                        <div className="invalid-feedback">Please enter message</div>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary" type="submit">Envoyer une Demande</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            {successMessage && (
                <SuccessAlert message="Candidature envoyer avec succès" />
            )}
        </div>

    );
};

export default SingleJob;
