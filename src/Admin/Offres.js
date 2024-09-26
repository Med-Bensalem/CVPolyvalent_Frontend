import React, { useEffect, useState } from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import { jwtDecode } from "jwt-decode";
import { deleteOffre, getOffresByUser } from "../Services/offreService";
import { getWorkflowByOffreId } from "../Services/workflowService"; // Importe les fonctions API appropriées
import { useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import '../Template.css';
import moment from "moment";
import {getStepsByWorkflowId} from "../Services/stepService";

const itemsPerPage = 5;

const Offres = () => {
    const [offres, setOffres] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [userId, setUserId] = useState(null);
    const [offreToDelete, setOffreToDelete] = useState(null);
    const [disabledButtons, setDisabledButtons] = useState({}); // Stocker l'état des boutons désactivés pour chaque offre
    const navigate = useNavigate();

    const handleClickCandidat = (id) => {
        navigate(`/Entreprise-Suivie/${id}`);
    };

    const handleClickProcess = async (id) => {
        navigate(`/Process/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/edit-job/${id}`);
    };

    const fetchOffres = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            setUserId(user.userId);
            try {
                const fetchedOffres = await getOffresByUser(user.userId);
                setOffres(fetchedOffres);
            } catch (error) {
                console.error('Error fetching offres:', error);
            }
        }
    };

    useEffect(() => {
        fetchOffres();
    }, []);

    const checkWorkflowAndSteps = async (offreId) => {
        try {
            const workflow = await getWorkflowByOffreId(offreId);
            if (workflow) {
                const steps = await getStepsByWorkflowId(workflow._id);
                return steps && steps.length > 2;
            }
            return false;
        } catch (error) {
            console.error('Error checking workflow and steps:', error);
            return false;
        }
    };

    useEffect(() => {
        offres.forEach(async (offre) => {
            const hasSteps = await checkWorkflowAndSteps(offre._id);
            setDisabledButtons((prev) => ({
                ...prev,
                [offre._id]: !hasSteps, // Désactiver les boutons si aucune étape n'est trouvée
            }));
        });
    }, [offres]);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(offres.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(offres.length / itemsPerPage));
    }, [itemOffset, offres]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % offres.length;
        setItemOffset(newOffset);
    };

    const handleDelete = async (offreId) => {
        try {
            await deleteOffre(userId, offreId);
            setOffres(prevOffres => prevOffres.filter(offre => offre._id !== offreId));
            setOffreToDelete(null);
            document.getElementById('OffreDelete').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error deleting offre:', error);
        }
    };

    const handleSetOffreToDelete = (offreId) => {
        setOffreToDelete(offreId);
    };

    return (
        <div id="db-wrapper">
            <Sidebar />
            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>
                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div
                                className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Liste Offres</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Gestion offres
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste offres</li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <a href="/Add-Job" className="btn btn-primary me-2">Ajouter un Offre</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {offres.length === 0 ? (
                        <div className="col-12 mb-2">
                            <div className="alert alert-info alert-dismissible fade show" role="alert">
                                Désolé, aucune offre disponible pour le moment. Revenez bientôt !
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="table-responsive overflow-y-hidden">
                                            <table className="table mb-0 text-nowrap table-hover table-centered">
                                                <thead>
                                                <tr>
                                                    <th>Titre Offre</th>
                                                    <th>Date Création</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                    <th></th>
                                                    <th>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems.map((offre) => (
                                                    <tr key={offre._id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-3">
                                                                    <div className="text-inherit">
                                                                        <h3 className="mb-1 fs-4">{offre.titre}</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{moment(offre.dateCreation).format('DD/MM/YYYY')}</td>

                                                        <td>
                                                            {new Date(offre.dateExpiration) < new Date() ? (
                                                                <span className="badge bg-danger">Expiré</span>
                                                            ) : (
                                                                <span className="badge bg-info-soft">En cours</span>
                                                            )}
                                                        </td>
                                                        {disabledButtons[offre._id] ? (
                                                            // Si le workflow n'existe pas ou n'a pas d'étapes
                                                            <>
                                                                <td>
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-secondary me-2"
                                                                            disabled
                                                                        >
                                                                            Gestion candidatures
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleClickProcess(offre._id)} // Fonction pour ajouter un processus
                                                                            className="btn btn-primary me-2"
                                                                        >
                                                                            Ajouter Process
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            // Si le workflow et les étapes existent
                                                            <>
                                                                <td>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleClickCandidat(offre._id)}
                                                                            className="btn btn-primary me-2"
                                                                        >
                                                                            Gestion candidatures
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleClickProcess(offre._id)}
                                                                            className="btn btn-primary me-2"
                                                                        >
                                                                            Modifier Process
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        <td>
                                                            <div className="dropdown dropstart">
                                                                <a className="btn-icon btn btn-ghost btn-sm rounded-circle"
                                                                   href="#" role="button" id="Dropdown1"
                                                                   data-bs-toggle="dropdown" aria-haspopup="true"
                                                                   aria-expanded="false">
                                                                    <i className="fe fe-more-vertical"></i>
                                                                </a>
                                                                <div className="dropdown-menu"
                                                                     aria-labelledby="Dropdown1">
                                                                    <span className="dropdown-header">PARAMÈTRES</span>
                                                                    <a className="dropdown-item"
                                                                       onClick={() => handleEdit(offre._id)}>
                                                                        <i className="fe fe-edit dropdown-item-icon"></i>
                                                                        Modifier
                                                                    </a>
                                                                    <a className="dropdown-item"
                                                                       onClick={() => handleSetOffreToDelete(offre._id)}
                                                                       data-bs-toggle="modal"
                                                                       data-bs-target="#OffreDelete">
                                                                        <i className="fe fe-trash dropdown-item-icon"></i>
                                                                        Supprimer
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="suivant >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={pageCount}
                                previousLabel="< précédent"
                                renderOnZeroPageCount={null}
                                containerClassName="pagination"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                activeClassName="active"
                            />
                        </div>
                    )}
                </section>
                <div className="modal fade" id="OffreDelete">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmation de suppression</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Êtes-vous sûr de vouloir supprimer cette Offre ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler
                                </button>
                                <button type="button" className="btn btn-danger"
                                        onClick={() => handleDelete(offreToDelete)}>Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Offres;
