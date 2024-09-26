import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getAllRegions } from '../Services/regionService';
import { getAllNiveauEtudes } from '../Services/niveauEtudeService';
import { getAllGenres } from '../Services/genreService';
import { getAllScores } from '../Services/scoreService';
import {getConditionByOffer, updateCondition} from '../Services/conditionService';

const ConditionPart = ({ onNextStep ,onAfterStep}) => {
    const { offreId } = useParams(); // Récupérez offreId depuis l'URL
    const [regions, setRegions] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [genres, setGenres] = useState([]);
    const [scores, setScores] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedScore, setSelectedScore] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [condition, setCondition] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [regionsData, niveauxData, genresData, scoresData] = await Promise.all([
                    getAllRegions(),
                    getAllNiveauEtudes(),
                    getAllGenres(),
                    getAllScores()
                ]);

                setRegions(regionsData.map(region => ({ value: region.label, label: region.label })));
                setNiveaux(niveauxData.map(niveau => ({ value: niveau.titre, label: niveau.titre })));
                setGenres(genresData.map(genre => ({ value: genre.label, label: genre.label })));
                setScores(scoresData.map(score => ({ value: score.label, label: score.label })));
            } catch (error) {
                console.error('Erreur lors du chargement des données', error);
            }
        };

        fetchData();
        fetchCondition();
    }, []);

    const fetchCondition = async () => {
        try {
            const condArray = await getConditionByOffer(offreId); // Fetch the conditions array
            console.log(condArray); // Log to see the structure

            if (condArray && condArray.length > 0) {
                const cond = condArray[0]; // Access the first object in the array
                setCondition(cond); // Set state with the first object
            } else {
                console.log('No condition data found');
            }
        } catch (error) {
            console.error('Error fetching condition:', error);
        }
    };

    const handleSave = async () => {
        const data = {
            genre: selectedGenre ? selectedGenre.value : null,
            niveauxacadem: selectedNiveau ? selectedNiveau.value : null,
            lieu: selectedRegion ? selectedRegion.value : null,
            score: selectedScore ? selectedScore.value : null,
        };

        try {
            await updateCondition(offreId, data);
            setShowModal(true);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la condition:', error);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    const handleNextStep = () => {
        if (typeof onNextStep === 'function') {
            onNextStep();
        } else {
            console.error('onNextStep n\'est pas une fonction');
        }
        handleCloseModal();
    };

    const handleAfterStep = () => {
        if (typeof onAfterStep === 'function') {
            onAfterStep();
        } else {
            console.error('onNextStep n\'est pas une fonction');
        }
        handleCloseModal();
    };

    const handleStayOnStep = () => {
        handleCloseModal();
        fetchCondition();
    };

    const handleSelectChange = (setter) => (selectedOption) => {
        setter(selectedOption);
    };

    return (
        <section className="condition-part">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5>Conditions de l'offre d'emploi</h5>
                        <p>Voici les principales conditions à remplir pour postuler à cette offre :
                        </p>
                    </div>
                </div>
                {condition ? (
                    <div className="condtitle text-center">
                        <ul className="list-inline">
                            {condition.niveauxacadem !== null && (
                                <li className="list-inline-item text-dark fw-semibold lh-1 fs-4 me-6 mb-4 mb-md-0">
                            <span className="icon-shape icon-xs rounded-circle bg-light-cond text-center me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check text-cond" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                            </span>
                            <span className="align-middle">Niveau Académique : <span className="text-primary">{condition.niveauxacadem} </span></span>
                        </li>
                        )}
                        {condition.genre !== null && (
                            <li className="list-inline-item text-dark fw-semibold lh-1 fs-4 me-6 mb-4 mb-md-0">
                                <span className="icon-shape icon-xs rounded-circle bg-light-cond text-center me-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check text-cond" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                    </svg>
                                </span>
                                <span className="align-middle">Genre : <span className="text-primary">{condition.genre}</span> </span>
                            </li>
                        )}
                        {condition.lieu !== null && (
                        <li className="list-inline-item text-dark fw-semibold lh-1 fs-4 me-6 mb-4 mb-md-0">
                            <span className="icon-shape icon-xs rounded-circle bg-light-cond text-center me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check text-cond" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                            </span>
                            <span >Région : <span className="text-primary">{condition.lieu}</span>  </span>
                        </li>
                        )}
                        {condition.score !== null && (
                            <li className="list-inline-item text-dark fw-semibold lh-1 fs-4 me-6 mb-4 mb-md-0">
                                <span className="icon-shape icon-xs rounded-circle bg-light-cond text-center me-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check text-cond" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                    </svg>
                                </span>
                                <span className="align-middle">Score : <span className="text-primary">{condition.score}</span></span>
                            </li>
                        )}
                    </ul>
                </div>
                ) : (
                    <p>Loading conditions...</p>
                )}
                <div className="card-body">
                    <form>
                        <div className="container">
                            <div className="row mb-3">
                                {/* Niveau Académique */}
                                <div className="col-md-6">
                                    <label htmlFor="niveaux" className="form-label">Niveau Académique</label>
                                    <Select
                                        options={niveaux}
                                        value={selectedNiveau}
                                        onChange={handleSelectChange(setSelectedNiveau)}
                                        placeholder="Sélectionnez un niveau"
                                    />
                                </div>

                                {/* Genre (Sexe) */}
                                <div className="col-md-6">
                                    <label htmlFor="sexe" className="form-label">Genre (Sexe)</label>
                                    <Select
                                        options={genres}
                                        value={selectedGenre}
                                        onChange={handleSelectChange(setSelectedGenre)}
                                        placeholder="Sélectionnez un genre"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                {/* Lieu de Travail (Région) */}
                                <div className="col-md-6">
                                    <label htmlFor="lieuTravail" className="form-label">Lieu de Travail (Région)</label>
                                    <Select
                                        options={regions}
                                        value={selectedRegion}
                                        onChange={handleSelectChange(setSelectedRegion)}
                                        placeholder="Sélectionnez une région"
                                    />
                                </div>

                                {/* Score */}
                                <div className="col-md-6">
                                    <label htmlFor="score" className="form-label">Score</label>
                                    <Select
                                        options={scores}
                                        value={selectedScore}
                                        onChange={handleSelectChange(setSelectedScore)}
                                        placeholder="Sélectionnez un score"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="card-footer text-end">
                    <button className="btn btn-primary" onClick={handleSave}>
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* Modal de confirmation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous passer à l'étape suivante ou rester sur cette étape ?
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleStayOnStep}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleNextStep}>
                        Étape suivante
                    </Button>
                    <Button variant="primary" onClick={handleAfterStep}>
                        Étape Cloture
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default ConditionPart;
