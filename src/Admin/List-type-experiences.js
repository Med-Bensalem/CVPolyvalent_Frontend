import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import ReactPaginate from "react-paginate";
import '../Template.css';
import {
    addTypeExperience,
    deleteTypeExperience,
    getAllTypeExperiences,
    updateTypeExperience
} from "../Services/typeExperienceService";
import {useEffect, useState} from "react";

const itemsPerPage = 5;
const ListTypeExperience = () => {
    const [typesExperiences, setTypeExperiences] = useState([]);
    const [titre, setTitre] = useState('');
    const [error, setError] = useState('');
    const [typeExperiencesToDelete, setTypeExperiencesToDelete] = useState(null);
    const [selectedTypeExperience, setSelectedTypeExperience] = useState(null);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const [typeExperienceDetails, setTypeExperienceDetails] = useState({
        titre: '',
    });

    const validate = () => {
        const errors = {};

        if (!titre) {
            errors.titre = 'Veuillez entrer un titre .';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };



    const fetchTypesExperience = async () => {
        try {
            const data = await getAllTypeExperiences();
            setTypeExperiences(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTypesExperience();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const typeExperienceData = {
                titre,

            };

            // Appel de la fonction addExperienceToUser avec les données de l'expérience
            await addTypeExperience(typeExperienceData);
            // Réinitialisation des champs du formulaire après soumission réussie
            setTitre('');

            document.getElementById('AddTypeExperience').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
            fetchTypesExperience();

        } catch (error) {
            setError(error.message);
        }
    };
    const handleDelete = async (typeExperienceId) => {
        try {
            await deleteTypeExperience(typeExperienceId);
            setTypeExperiences(prevTypesExperience => prevTypesExperience.filter(typeExperience => typeExperience._id !== typeExperienceId));
            setTypeExperiencesToDelete(null); // Réinitialiser formation à supprimer
            document.getElementById('TypeExperienceDelete').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error deleting secteur:', error);
        }
    };

    const handleSetTypeExperienceToDelete = (typeExperienceId) => {
        setTypeExperiencesToDelete(typeExperienceId);
    };

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(typesExperiences.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(typesExperiences.length / itemsPerPage));
    }, [itemOffset, typesExperiences]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % typesExperiences.length;
        setItemOffset(newOffset);
    };

    const handleEdit = (typeExperience) => {
        setSelectedTypeExperience(typeExperience);
        setTypeExperienceDetails({
            titre: typeExperience.titre,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateTypeExperience(selectedTypeExperience._id, typeExperienceDetails);
            // Mettre à jour la liste des formations avec les détails modifiés
            setTypeExperiences(prevTypesExperience => {
                const updatedTypeExperience = prevTypesExperience.map(experience => {
                    if (experience._id === selectedTypeExperience._id) {
                        return {
                            ...experience,
                            ...typeExperienceDetails
                        };
                    }
                    return experience;
                });
                return updatedTypeExperience;
            });
            document.getElementById('ModifierModalTypeExperience').classList.remove('show');
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
                                    <h1 className="mb-0 h2 fw-bold">Liste Type Experience </h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                Gestion Type Experience
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Liste Type Experiences

                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <a  className="btn btn-primary me-2" data-bs-toggle="modal"
                                       data-bs-target="#AddTypeExperience">Ajouter Type Experience</a>
                                </div>
                                <div className="modal fade" id="AddTypeExperience" tabIndex="-1" role="dialog"
                                     aria-labelledby="experienceLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title mb-0" id="newCatgoryLabel">Ajouter Type Experience</h4>
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
                                Désolé, aucune type experience etudes disponible pour le moment. Revenez bientôt !
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
                                        {currentItems.map((typeExperience, index) => (
                                            <tr key={typeExperience._id}>
                                                <td>

                                                    {typeExperience.titre}

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
                                                               onClick={() => handleEdit(typeExperience)}>
                                                                <i className="fe fe-edit-2 fs-6 mx-2"></i>
                                                                <span data-bs-toggle="modal"
                                                                      data-bs-target="#ModifierModalTypeExperience">Modifier</span>
                                                            </a>
                                                            <a className="dropdown-item " title="Delete"
                                                               onClick={() => handleSetTypeExperienceToDelete(typeExperience._id)}>
                                                                <i className="fe fe-trash-2 fs-6 mx-2"></i>
                                                                <span data-bs-toggle="modal"
                                                                      data-bs-target="#TypeExperienceDelete">Supprimer</span>
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
                    <div className="modal fade" id="TypeExperienceDelete">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmation de suppression</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Êtes-vous sûr de vouloir supprimer cette Type Experience ?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler
                                    </button>
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleDelete(typeExperiencesToDelete)}>Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal de modification */}
                    <div className="modal fade" id="ModifierModalTypeExperience" tabIndex="-1" role="dialog"
                         aria-labelledby="experienceLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title mb-0" id="newCatgoryLabel">Modifier une Type Experience</h4>
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
                                            <input type="text" name="titre" value={typeExperienceDetails.titre}
                                                   onChange={(e) => setTypeExperienceDetails({
                                                       ...typeExperienceDetails,
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

export default ListTypeExperience;
