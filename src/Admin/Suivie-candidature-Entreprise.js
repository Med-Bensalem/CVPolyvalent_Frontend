import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import {useNavigate, useParams} from 'react-router-dom';
import {getPostulesByOffer} from '../Services/postuleService';
import { getUserById } from '../Services/authService';
import {getOffreById} from "../Services/offreService";
import ReactPaginate from "react-paginate";
import Kanban from "../Kanban/KanBan";

const baseURL = 'http://localhost:5000/';
const itemsPerPage = 5;

const SuivieEntreprise = () => {
    const { id } = useParams();
    const [offres, setOffres] = useState([]);
    const [offre, setOffre] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCV, setCurrentCV] = useState('');
    const [currentLettre, setCurrentLettre] = useState('');
    const [showLettreModal, setShowLettreModal] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const navigate = useNavigate();
    const [showKanban, setShowKanban] = useState(false); // State to manage Kanban visibility

    const toggleKanban = () => {
        setShowKanban((prevShowKanban) => !prevShowKanban);
    };


    const fetchOffres = async () => {
        try {
            const fetchedPostules = await getPostulesByOffer(id);
            const offre = await getOffreById(id);
            setOffre(offre);
            const offresDetails = await Promise.all(
                fetchedPostules.map(async (postule) => {
                    const offreUserDetails = await getUserById(postule.userId);
                    const cvUrl = baseURL + postule.cv.replace(/\\/g, '/');
                    const lettre = baseURL + postule.lettreMotivation.replace(/\\/g, '/');
                    return { ...postule, offreUserDetails ,cvUrl,lettre };
                })
            );
            setOffres(offresDetails);

        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    };

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(offres.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(offres.length / itemsPerPage));
        fetchOffres();
    }, [id,itemOffset, offres]);

    const handleShowLettreModal = (lettre) => {
        setCurrentLettre(lettre);
        setShowLettreModal(true);
    };

    const handleCloseLettreModal = () => {
        setShowLettreModal(false);
        setCurrentLettre('');
    };


    const handleShowModal = (cv) => {
        setCurrentCV(cv);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCV('');
    };



    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % offres.length;
        setItemOffset(newOffset);
    };

    const handleClick = (id) => {
        navigate(`/about/${id}`);
    };




    return (
        <div id="db-wrapper">
            <Sidebar/>
            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>
                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div
                                className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-3 mb-md-0">
                                    <h1 className="mb-1 h2 fw-bold">Suivie Candidature</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="admin-dashboard.html">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#">Suivie candidature</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Toute
                                                Candidature
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                {/* Button to toggle Kanban visibility */}
                                <button className="btn btn-primary" onClick={toggleKanban}>
                                    {showKanban ? 'Hide Kanban' : 'Show Kanban'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {showKanban ? (
                        // Display Kanban component when showKanban is true
                        <div>
                            <Kanban/>

                        </div>
                    ) : (
                        // Display the rest of the content when showKanban is false
                        <>
                        {currentItems.length === 0 ? (
                                <div className="col-12 mb-2">
                                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                                        Désolé, aucune candidature disponible pour le moment. Revenez bientôt !
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h4 className="mb-0">Candidature pour le poste {offre.titre}</h4>
                                            </div>
                                            <div className="table-responsive overflow-y-hidden">
                                                <table className="table mb-0 text-nowrap table-hover table-centered">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>Nom</th>
                                                        <th>CV</th>
                                                        <th>Lettre de motivation</th>
                                                        <th>Portfolio</th>
                                                        <th>Score</th>
                                                        <th>État</th>

                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {currentItems.map((postule) => (
                                                        <tr key={postule.userId}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <h5 className="mb-0">
                                                                        <a href="#" className="text-inherit">
                                                                            {postule.offreUserDetails.nom} {postule.offreUserDetails.prenom}
                                                                        </a>
                                                                    </h5>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href="#"
                                                                   onClick={() => handleShowModal(postule.cvUrl)}>
                                                                    <i className="bi bi-eye"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a href="#"
                                                                   onClick={() => handleShowLettreModal(postule.lettre)}>
                                                                    <i className="bi bi-eye"
                                                                       style={{marginLeft: '60px'}}></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a
                                                                    onClick={() => handleClick(postule.offreUserDetails._id)}
                                                                    className="text-body text-primary-hover ms-3 texttooltip">
                                                                    <i className="fe fe-link fs-5"></i>
                                                                </a>
                                                            </td>
                                                            <td>{postule.score}</td>
                                                            <td>
                                                                {postule.etat ? (
                                                                    <span className="badge bg-success">Accepté</span>
                                                                ) : (
                                                                    <span className="badge bg-info-soft">En cours</span>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
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
                        </>
                    )}
                </section>
            </main>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>CV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe src={currentCV} width="100%" height="500px" title="CV"></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showLettreModal} onHide={handleCloseLettreModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Lettre de Motivation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe src={currentLettre} width="100%" height="500px" title="Lettre de Motivation"></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLettreModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default SuivieEntreprise;
