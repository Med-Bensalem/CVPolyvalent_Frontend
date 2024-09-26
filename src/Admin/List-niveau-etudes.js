import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import React, {useEffect, useState} from "react";
import {addNiveauEtude, deleteNiveauEtude, getAllNiveauEtudes, updateNiveauEtude} from "../Services/niveauEtudeService";
import ReactPaginate from "react-paginate";

const itemsPerPage = 5;
const ListTypeEmplois = () => {
    const [etudes, setEtudes] = useState([]);
    const [titre, setTitre] = useState('');
    const [error, setError] = useState('');
    const [niveauEtudeToDelete, setEtudeToDelete] = useState(null);
    const [selectedEtude, setSelectedEtude] = useState(null);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [etudeDetails, setEtudeDetails] = useState({
        titre: '',
    });

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(etudes.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(etudes.length / itemsPerPage));
    }, [itemOffset, etudes]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % etudes.length;
        setItemOffset(newOffset);
    };

    const validate = () => {
        const errors = {};

        if (!titre) {
            errors.titre = 'Veuillez entrer un titre .';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };



    const fetchNiveauEtudes = async () => {
        try {
            const data = await getAllNiveauEtudes();
            setEtudes(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNiveauEtudes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const etudeData = {
                titre,

            };

            // Appel de la fonction addExperienceToUser avec les données de l'expérience
            await addNiveauEtude(etudeData);
            // Réinitialisation des champs du formulaire après soumission réussie
            setTitre('');

            document.getElementById('AddEtude').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
            fetchNiveauEtudes();

        } catch (error) {
            setError(error.message);
        }
    };
    const handleDelete = async (etudeId) => {
        try {
            await deleteNiveauEtude(etudeId);
            setEtudes(prevEtudes => prevEtudes.filter(etude => etude._id !== etudeId));
            setEtudeToDelete(null); // Réinitialiser formation à supprimer
            document.getElementById('etudeDelete').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error deleting niveau:', error);
        }
    };

    const handleSetEtudeToDelete = (etudeId) => {
        setEtudeToDelete(etudeId);
    };

    const handleEdit = (etude) => {
        setSelectedEtude(etude);
        setEtudeDetails({
            titre: etude.titre,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateNiveauEtude(selectedEtude._id, etudeDetails);
            // Mettre à jour la liste des formations avec les détails modifiés
            setEtudes(prevEtudes => {
                const updatedEtude = prevEtudes.map(etude => {
                    if (etude._id === selectedEtude._id) {
                        return {
                            ...etude,
                            ...etudeDetails
                        };
                    }
                    return etude;
                });
                return updatedEtude;
            });
            document.getElementById('ModifierEtude').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error updating formation:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Réinitialiser le message d'erreur lorsque l'utilisateur commence à saisir dans le champ
        setError(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));

        // Mettre à jour l'état correspondant au champ
        switch (name) {
            case 'titre':
                setTitre(value);
                break;
            default:
                break;
        }
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
                                    <h1 className="mb-0 h2 fw-bold">Liste Niveau Etudes </h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                Gestion Niveau Etudes
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste Niveau Etudes

                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <a  className="btn btn-primary me-2" data-bs-toggle="modal"
                                       data-bs-target="#AddEtude">Ajouter Etude </a>
                                </div>
                                <div className="modal fade" id="AddEtude" tabIndex="-1" role="dialog"
                                     aria-labelledby="experienceLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title mb-0" id="newCatgoryLabel">Ajouter Niveau Etude</h4>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                                    <div className="mb-3 mb-2">
                                                        <label className="form-label" htmlFor="title">
                                                            Titre
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="titre" value={titre}
                                                               onChange={handleChange}
                                                               className={`form-control ${error.titre ? 'is-invalid' : ''}`}
                                                               placeholder="Titre"/>

                                                        {error.titre && <div className="invalid-feedback">{error.titre}</div>}
                                                    </div>

                                                    <div>
                                                        <button type="submit"
                                                                className="btn btn-primary mx-2">Enregistrer
                                                        </button>
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">Fermer
                                                        </button>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {currentItems.length === 0 ? (
                        <div className="col-12 mb-2">
                            <div className="alert alert-info alert-dismissible fade show" role="alert">
                                Désolé, aucune niveaux etudes disponible pour le moment. Revenez bientôt !
                            </div>
                        </div>
                    ) : (
                        <>


                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive overflow-y-hidden">
                                    <table className="table mb-0 text-nowrap table-hover table-centered">
                                        <thead className="">
                                        <tr>
                                            <th>Titre</th>

                                            <th>Actions</th>


                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentItems.map((etude, index) => (
                                            <tr key={etude._id}>
                                                <td>

                                                    {etude.titre}

                                                </td>


                                                <td>
                                                    <div className="dropdown dropstart">
                                                        <a
                                                            className="btn-icon btn btn-ghost btn-sm rounded-circle"
                                                            href="#"
                                                            role="button"
                                                            id="Dropdown1"
                                                            data-bs-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false">
                                                            <i className="fe fe-more-vertical"></i>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="Dropdown1">
                                                            <span className="dropdown-header">Paramètres</span>


                                                            <a className="dropdown-item "
                                                               onClick={() => handleEdit(etude)}>
                                                                <i className="fe fe-edit-2 fs-6 mx-2"></i>
                                                                <span data-bs-toggle="modal"
                                                                      data-bs-target="#ModifierEtude">Modifier</span>
                                                            </a>
                                                            <a className="dropdown-item " title="Delete"
                                                               onClick={() => handleSetEtudeToDelete(etude._id)}>
                                                                <i className="fe fe-trash-2 fs-6 mx-2"></i>
                                                                <span data-bs-toggle="modal"
                                                                      data-bs-target="#etudeDelete">Supprimer</span>
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
                        </>
                    )}


                    {/* Modal de confirmation de suppression */}
                    <div className="modal fade" id="etudeDelete">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmation de suppression</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Êtes-vous sûr de vouloir supprimer cette Niveau Etude   ?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler
                                    </button>
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleDelete(niveauEtudeToDelete)}>Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal de modification */}
                    <div className="modal fade" id="ModifierEtude" tabIndex="-1" role="dialog"
                         aria-labelledby="experienceLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title mb-0" id="newCatgoryLabel">Modifier un Niveau Etude </h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className="needs-validation" noValidate onSubmit={handleUpdate}>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Titre
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" name="titre" value={etudeDetails.titre}
                                                   onChange={(e) => setEtudeDetails({
                                                       ...etudeDetails,
                                                       titre: e.target.value
                                                   })} className="form-control"
                                                   placeholder="Titre"/>
                                            {error.titre && <div className="invalid-feedback">{error.titre}</div>}

                                        </div>


                                        <div>
                                            <button type="submit" className="btn btn-primary mx-2">Modifier</button>
                                            <button type="button" className="btn btn-secondary"
                                                    data-bs-dismiss="modal">Fermer
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ListTypeEmplois;
