// StepCard.js
import React from 'react';

const StepCard = ({ currentStep }) => {
    if (!currentStep) {
        return null; // Ne rien afficher si currentStep n'est pas défini
    }

    const { stepType } = currentStep;

    const renderCardContent = () => {
        switch (stepType) {
            case 'PENDING':
                return "Votre candidature est en attente de traitement.";
            case 'PRESELECTION':
                return "Vous avez été présélectionné pour cette étape.";
            case 'TEST':
                return "Vous devez passer un test pour cette candidature.";
            case 'INTERVIEW_PHONE':
                return "Vous avez un entretien téléphonique prévu.";
            case 'INTERVIEW_ONSITE':
                return (
                    <>
                        <span className="spacing">Vous êtes invité à un entretien sur site.</span>
                        <br/>
                        <span className="spacing">
                            <i className="fa fa-map-marker" aria-hidden="true"></i> {/* Address icon */}
                                                    Adresse : {currentStep.adress}
                        </span>

                        <br/>
                        <span className="spacing">
                            <i className="fa fa-calendar" aria-hidden="true"> </i> Date de l'entretien : {new Date(currentStep.dateEntretien).toLocaleDateString()}
                        </span>
                    </>
                );
            case 'INTERVIEW_ONLINE':
                return (
                    <>
                        <span className="spacing">Vous avez un entretien en ligne programmé.</span>
                        <br/>
                        <span className="spacing">
                            <i className="fa fa-link" aria-hidden="true"></i> Lien Meet : <a href={currentStep.meet} target="_blank"
                                                                   rel="noopener noreferrer">{currentStep.meet}</a>
                        </span>

                        <br/>
                        <span className="spacing">
                            <i className="fa fa-calendar" aria-hidden="true"></i> Date de l'entretien : {new Date(currentStep.dateEntretien).toLocaleDateString()}
                        </span>

                    </>
                );
            case 'ACCEPTED':
                return (
                    <>
                        <div>
                            <p>Félicitations, vous avez été accepté!</p>
                            <p className="mt-2">Veuillez télécharger le document requis :</p>

                            {/* Document Upload Input */}
                            <input
                                type="file"
                                accept=".pdf"
                                className="form-control mt-2"
                            />

                            {/* List of Required Documents */}
                            <ul className="mt-3">
                                {[
                                    {name: 'CV (Curriculum Vitae)', color: 'blue'},
                                    {name: 'Lettre de motivation', color: 'green'},
                                    {name: 'Certificat de travail', color: 'orange'},
                                    {name: 'Preuve d\'identité', color: 'purple'}
                                ].map((doc, index) => (
                                    <li key={index} style={{color: doc.color}}>
                                        {doc.name}
                                    </li>
                                ))}
                            </ul>



                        </div>
                    </>
                )
            case 'REJECTED':
                return "Désolé, votre candidature a été rejetée.";
            default:
                return <p className="card-text">No description available.</p>;
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                {renderCardContent()}
            </div>
        </div>
    );
};

export default StepCard;
