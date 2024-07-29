import React, {useEffect, useState} from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import {jwtDecode} from "jwt-decode";
import {deleteOffre, getOffresByUser} from "../Services/offreService";
import {useNavigate} from "react-router-dom";
import ReactPaginate from 'react-paginate';
import '../Template.css'; // Assurez-vous d'ajouter du style pour la pagination si nécessaire

const itemsPerPage = 5;

const Offres = () => {
    const [offres, setOffres] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [userId, setUserId] = useState(null);
    const [offreToDelete, setOffreToDelete] = useState(null);
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/Entreprise-Suivie/${id}`);
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
                console.error('Error fetching experiences:', error);
            }
        }
    };

    useEffect(() => {
        fetchOffres();
    }, []);

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
                    <Header />
                </div>
                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Liste Offres</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Gestion offres</li>
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
                                                    <th>Nombre de Poste</th>

                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems.map((offre) => (
                                                    <tr key={offre._id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-3">
                                                                    <div className="text-inherit" onClick={() => handleClick(offre._id)}>
                                                                        <h3 className="mb-1 fs-4">{offre.titre}</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{offre.nbPoste}</td>

                                                        <td>
                                                            {new Date(offre.dateExpiration) < new Date() ? (
                                                                <span className="badge bg-danger">Expiré</span>
                                                            ) : (
                                                                <span className="badge bg-info-soft">En cours</span>
                                                            )}
                                                        </td>
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
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Êtes-vous sûr de vouloir supprimer cette Offre ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDelete(offreToDelete)}>Supprimer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Offres;
