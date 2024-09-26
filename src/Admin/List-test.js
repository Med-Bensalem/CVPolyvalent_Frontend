import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import React, {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {createTest, getTestsByUser} from "../Services/testService";
import ReactPaginate from "react-paginate";
import {Button, Modal} from "react-bootstrap";

const baseURL = 'http://localhost:5000/';
const itemsPerPage = 5;
const ListTests = () => {
    const [FileTest, setTestFile] = useState(null);
    const [titre, setTitre] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState('');
    const [tests, setTests] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentTest, setCurrentTest] = useState('');

    const fetchUser = async () => {

        const token = localStorage.getItem("token");
        setToken(token);

        if (token) {
            const user = jwtDecode(token);
            try {
                setUserId(user.userId);
                const fetchedTests = await getTestsByUser(user.userId);
                setTests(fetchedTests);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    };

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(tests.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(tests.length / itemsPerPage));
        fetchUser();
    }, [itemOffset, tests]);


    const validateForm = () => {
        const errors = {};
        if (!titre) {
            errors.titre = "Veuillez entrer un titre .";
        }
        if (!FileTest) {
            errors.FileTest = "Veuillez télécharger votre Test.";
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

            await createTest(userId,FileTest , titre);
            document.getElementById('AddTest').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);


        } catch (err) {
            setError('Une erreur est produite lors de la création de la candidature.');

        }
    }

    const handleShowModal = (test) => {
        setCurrentTest(baseURL+test);
        setShowModal(true);
    };

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % tests.length;
        setItemOffset(newOffset);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentTest('');
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
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Liste Tests </h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                Gestion Tests
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste Tests

                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <a className="btn btn-primary me-2" data-bs-toggle="modal"
                                       data-bs-target="#AddTest">Ajouter un Test</a>
                                </div>

                            </div>
                        </div>
                    </div>

                    {currentItems.length === 0 ? (
                        <div className="col-12 mb-2">
                            <div className="alert alert-info alert-dismissible fade show" role="alert">
                                Désolé, aucune Test disponible pour le moment. Revenez bientôt !
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="mb-0">Candidature pour le poste  </h4>
                                        </div>
                                        <div className="table-responsive overflow-y-hidden">
                                            <table className="table mb-0 text-nowrap table-hover table-centered">
                                                <thead className="table-light">
                                                <tr>
                                                    <th>Titre </th>
                                                    <th>Test</th>

                                                    <th>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems.map((test) => {

                                                    return (
                                                        <tr key={test.userId}>
                                                            <td>
                                                                <div className="d-flex align-items-center">

                                                                    <h5 className="mb-0">
                                                                        <a href="#" className="text-inherit">
                                                                            {test.title}
                                                                        </a>
                                                                    </h5>

                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href="#"
                                                                   onClick={() => handleShowModal(test.FileTest)}>
                                                                    <i className="bi bi-eye"></i> {/* Assuming you're using Bootstrap Icons */}
                                                                </a>
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
                                                                        <span
                                                                            className="dropdown-header">PARAMÈTRES</span>
                                                                        <a className="dropdown-item"
                                                                           >
                                                                            <i className="fe fe-edit dropdown-item-icon"></i>
                                                                            Modifier
                                                                        </a>
                                                                        <a className="dropdown-item"
                                                                           data-bs-toggle="modal"
                                                                           data-bs-target="#OffreDelete">
                                                                            <i className="fe fe-trash dropdown-item-icon"></i>
                                                                            Supprimer
                                                                        </a>
                                                                    </div>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                    );
                                                })}
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


                        </>
                    )}


                </section>
                <div className="modal fade" id="AddTest" tabIndex="-1" role="dialog" aria-labelledby="applyModal"
                     aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="mb-4">Ajouter un Test</h3>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form className="needs-validation" onSubmit={handleFormSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="message">Titre </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            placeholder="Titre"
                                            value={titre} onChange={(e) => setTitre(e.target.value)}
                                        />
                                        {validationErrors.titre && (
                                            <div className="text-danger">{validationErrors.titre}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lettreMotivationFile" className="form-label">
                                            Téléchargez votre Test
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="FileTest"
                                            onChange={(e) => setTestFile(e.target.files[0])}

                                        />
                                        {validationErrors.FileTest && (
                                            <div className="text-danger">{validationErrors.FileTest}</div>
                                        )}

                                    </div>


                                    <div>
                                        <button type="submit"
                                                className="btn btn-primary mx-2">Sauvegarder
                                        </button>
                                        <button type="button" className="btn btn-secondary"
                                                data-bs-dismiss="modal">Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe src={currentTest} width="100%" height="500px" title="FileTest"></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default ListTests;