// Template2.js
import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {
    addCertificationToUser,
    deleteCertification,
    getCertificatesByUser,
    updateCertification
} from "../../Services/certificationService";
import moment from "moment";

const formatDate = (dateString) => {
    const options = { month: "long", year: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("fr-FR", options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const Certificat = () => {
    const [certificat, setCertificat] = useState('');
    const [reference, setReference] = useState('');
    const [dateEmission, setDateEmission] = useState('');
    const [dateExpiration, setDateExpiration] = useState('');
    const [error, setError] = useState('');
    const [certificats, setCertificats] = useState([]);
    const [userId, setUserId] = useState(null);
    const [certifToDelete, setCertifToDelete] = useState(null);
    const [selectedCertif, setSelectedCertif] = useState(null);
    const [certifDetails, setCertifDetails] = useState({
        certificat: '',
        reference: '',
        dateEmission: '',
        dateExpiration: '',

    });

    const fetchCertifs = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedExperiences = await getCertificatesByUser(user.userId);
                setCertificats(fetchedExperiences);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        }
    };
    useEffect(() => {
        fetchCertifs();
    }, []);
    const handleDelete = async (certificationId) => {
        try {
            await deleteCertification(userId, certificationId);
            setCertificats(prevCertifs => prevCertifs.filter(certif => certif._id !== certificationId));
            setCertifToDelete(null); // Réinitialiser formation à supprimer
            document.getElementById('CertifDelete').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };
    const handleSetCertifToDelete = (certificationId) => {
        setCertifToDelete(certificationId);
    };
    const handleEdit = (certif) => {
        setSelectedCertif(certif);
        setCertifDetails({
            certificat: certif.certificat,
            reference: certif.reference,
            dateEmission: certif.dateEmission,
            dateExpiration: certif.dateExpiration,

        });
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateCertification(userId, selectedCertif._id, certifDetails);
            // Mettre à jour la liste des formations avec les détails modifiés
            setCertificats(prevCertifs => {
                const updatedCertifs = prevCertifs.map(certif => {
                    if (certif._id === selectedCertif._id) {
                        return {
                            ...certif,
                            ...certifDetails
                        };
                    }
                    return certif;
                });
                return updatedCertifs;
            });
            document.getElementById('CertificatModal').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error updating formation:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const formationData = {
                certificat,
                reference,
                dateEmission,
                dateExpiration,
            };

            // Appel de la fonction addFormationToUser avec les données de la formation
            await addCertificationToUser(userId, formationData);

            // Réinitialiser les champs après succès
            setCertificat('');
            setReference('');
            setDateEmission('');
            setDateExpiration('');

            document.getElementById('Certificat').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);

            fetchCertifs();

        } catch (error) {
            console.error(error.message);
            // Gérer les erreurs
        }
    };

    const validate = () => {
        const errors = {};

        if (!certificat.trim()) {
            errors.certificat = 'Veuillez entrer un certificat.';
        }
        if (!reference.trim()) {
            errors.reference = 'Veuillez entrer un reference.';
        }

        if (!dateEmission) {
            errors.dateEmission = 'Veuillez sélectionner une date emission.';
        }
        if (!dateExpiration) {
            errors.dateExpiration = 'Veuillez sélectionner une date expiration.';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div className="card-body">
            <div className="bg-light rounded p-2 cardStyle">
                <div className="row">
                    <div className="col-11">
                        <h4>Certificats</h4>
                    </div>
                    <div className="col-1">
                        <a className="btn btn-outline-primary btn-sm btnCard"
                           data-bs-toggle="modal"
                           data-bs-target="#Certificat">
                            Ajouter
                        </a>
                    </div>
                    {/* Modal Ajout de certificat */}
                    <div className="modal fade" id="Certificat" tabIndex="-1" role="dialog"
                         aria-labelledby="CertificatLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title mb-0" id="newCatgoryLabel">Ajouter une certificat</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Certificat
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" name="certificat" value={certificat}
                                                   onChange={(e) => setCertificat(e.target.value)}
                                                   className={`form-control ${error.certificat ? 'is-invalid' : ''}`}
                                                   placeholder="Certificat"/>

                                            {error.certificat && <div className="invalid-feedback">{error.certificat}</div>}
                                        </div>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Réference
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" name="reference" value={reference}
                                                   onChange={(e) => setReference(e.target.value)}
                                                   className={`form-control ${error.reference ? 'is-invalid' : ''}`}
                                                   placeholder="Référence"/>

                                            {error.reference && <div className="invalid-feedback">{error.reference}</div>}
                                        </div>

                                        <div className="row">
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="birth">Date d'émission</label>
                                                <span className="text-danger">*</span>
                                                <input type="date" id="dateEmission" name="dateEmission"
                                                       value={dateEmission}
                                                       onChange={(e) => setDateEmission(e.target.value)}
                                                       className={`form-control ${error.dateEmission ? 'is-invalid' : ''}`}
                                                />
                                                {error.dateEmission && <div className="invalid-feedback">{error.dateEmission}</div>}
                                            </div>
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="birth">Date d'expiration</label>

                                                <input type="date" id="dateExpiration" name="dateExpiration"
                                                       value={dateExpiration}
                                                       onChange={(e) => setDateExpiration(e.target.value)}
                                                       className={`form-control ${error.dateExpiration ? 'is-invalid' : ''}`}
                                                />
                                                {error.dateExpiration && <div className="invalid-feedback">{error.dateExpiration}</div>}

                                            </div>
                                        </div>


                                        <div>
                                            <button type="submit" className="btn btn-primary mx-2">Enregistrer</button>
                                            <button type="button" className="btn btn-secondary"
                                                    data-bs-dismiss="modal">Annuler
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <br/>
                {/* Liste des certificats */}
                <div className="list-group list-group-flush border-top-0" id="certificatList">
                    {certificats.map((certificat, index) => (
                        <div key={certificat._id}>
                            <div className="list-group-item rounded px-3 text-nowrap mb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className="mb-0 text-truncate">
                                        <span className="align-middle">{certificat.certificat}</span>
                                    </h5>
                                    <div>
                                        <a  className="me-1 text-inherit" data-bs-toggle="modal"
                                           data-bs-target="#CertificatModal" data-bs-placement="top" title="Edit"
                                           onClick={() => handleEdit(certificat)}>
                                            <i className="fe fe-edit fs-6"></i>
                                        </a>
                                        <a  className="me-1 text-inherit" data-bs-toggle="tooltip"
                                           data-placement="top" title="Delete"
                                           onClick={() => handleSetCertifToDelete(certificat._id)}>
                                            <i className="fe fe-trash-2 fs-6" data-bs-toggle="modal"
                                               data-bs-target="#CertifDelete"></i>
                                        </a>
                                        <a  className="text-inherit" aria-expanded="true"
                                           data-bs-toggle="collapse" data-bs-target={`#collapseCertif${index}`}
                                           aria-controls={`collapseCertif${index}`}>
                                            <span className="chevron-arrow"><i
                                                className="fe fe-chevron-down"></i></span>
                                        </a>
                                    </div>
                                </div>
                                <div id={`collapseCertif${index}`} className="collapse" aria-labelledby="certificat"
                                     data-bs-parent="#certificatList">
                                    <div className="p-md-4 p-2">
                                        <span className="blue-text">{formatDate(certificat.dateEmission)}</span><br/>
                                        <span className="black-text">{certificat.reference}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de confirmation de suppression */}
            <div className="modal fade" id="CertifDelete">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation de suppression</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Êtes-vous sûr de vouloir supprimer cette Certificat ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" className="btn btn-danger"
                                    onClick={() => handleDelete(certifToDelete)}>Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal de modication de certificat */}
            <div className="modal fade" id="CertificatModal" tabIndex="-1" role="dialog"
                 aria-labelledby="CertificatLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title mb-0" id="newCatgoryLabel">Modifier une certificat</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="needs-validation" noValidate onSubmit={handleUpdate}>
                                <div className="mb-3 mb-2">
                                    <label className="form-label" htmlFor="title">
                                        Certificat
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" name="certificat" value={certifDetails.certificat}
                                           onChange={(e) => setCertifDetails({
                                               ...certifDetails,
                                               certificat: e.target.value
                                           })} className="form-control"
                                           placeholder="Certificat"/>

                                    <div className="invalid-feedback">Please enter category.</div>
                                </div>
                                <div className="mb-3 mb-2">
                                    <label className="form-label" htmlFor="title">
                                        Réference
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" name="reference" value={certifDetails.reference}
                                           onChange={(e) => setCertifDetails({
                                               ...certifDetails,
                                               reference: e.target.value
                                           })} className="form-control"
                                           placeholder="Référence"/>

                                    <div className="invalid-feedback">Please enter category.</div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-12 col-md-6">
                                        <label className="form-label" htmlFor="birth">Date d'émission</label>
                                        <span className="text-danger">*</span>
                                        <input type="date" id="dateEmission" name="dateEmission"
                                               value={moment(certifDetails.dateEmission).format('YYYY-MM-DD')}
                                               onChange={(e) => setCertifDetails({
                                                   ...certifDetails,
                                                   dateEmission: e.target.value
                                               })}
                                               className="form-control"/>
                                    </div>
                                    <div className="mb-3 col-12 col-md-6">
                                        <label className="form-label" htmlFor="birth">Date d'expiration</label>

                                        <input type="date" id="dateExpiration" name="dateExpiration"
                                               value={moment(certifDetails.dateExpiration).format('YYYY-MM-DD')}
                                               onChange={(e) => setCertifDetails({ ...certifDetails, dateExpiration: e.target.value })}
                                               className="form-control"/>

                                    </div>
                                </div>


                                <div>
                                    <button type="submit" className="btn btn-primary mx-2">Enregistrer</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificat;
