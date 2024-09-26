import React, {useEffect, useState} from 'react';
import Joyride from 'react-joyride';
import { Tooltip } from 'react-tooltip';
import {jwtDecode} from 'jwt-decode';

const steps = [
    {
        target: '.my-first-step',
        content: 'Étape 1 : Cette étape implique la définition et la vérification des conditions requises pour qu\'un candidat soit éligible pour le poste.',
        placement: 'bottom',
        disableBeacon: true

    },
    {
        target: '.my-second-step',
        content: 'Étape 2 : cette étape, vous pouvez créer et configurer le processus de recrutement',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '.my-third-step',
        content: 'Étape 3 : Dans cette phase, les conditions finales sont examinées et le processus de recrutement est terminé. ',
        placement: 'bottom',
        disableBeacon: true

    }
];

const StepperHeader = ({ activeStep, onStepChange }) => {
    const [run, setRun] = useState(false); // Joyride should run or not
    const [userId, setUserId] = useState(null); // Store the decoded userId

    useEffect(() => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to extract userId
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.userId); // Assume 'userId' is the key in the payload
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            // Use a unique key for each user
            const joyrideKey = `joyrideSeen_${userId}`;
            const joyrideSeen = localStorage.getItem(joyrideKey);
            if (!joyrideSeen) {
                setRun(true); // Run joyride if it hasn't been seen for this user
            }
        }
    }, [userId]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = ["finished", "skipped"];
        if (finishedStatuses.includes(status)) {
            const joyrideKey = `joyrideSeen_${userId}`;
            localStorage.setItem(joyrideKey, "true"); // Save joyride as seen for this user
            setRun(false); // Stop Joyride
        }
    };

    return (
        <div>

            <Joyride
                steps={steps}
                run={run}
                continuous={true}
                callback={handleJoyrideCallback}
                scrollToFirstStep={true}
                showSkipButton={true}
                locale={{
                    back: 'Retour',
                    close: 'Fermer',
                    last: 'Terminer',
                    next: 'Suivant',
                    skip: 'Passer',
                }}
                styles={{
                    options: {
                        zIndex: 10000,
                        primaryColor: '#754ffe', // Couleur principale
                    },
                }}
            />



            {/* Stepper Header */}
            <div className="bs-stepper-header" role="tablist">
                <div
                    className={`step ${activeStep === 'condition-part' ? 'active' : ''}`}
                    onClick={() => onStepChange('condition-part')}
                >
                    <button
                        type="button"
                        className="step-trigger d-block my-first-step"
                        role="tab"
                        data-tooltip-content="Étape 1 : Préselection"
                    >
                        <div className="bs-stepper-circle d-block step-line">1</div>
                        <div className="bs-stepper-label">Préselection</div>
                    </button>
                </div>
                <div className="line"></div>
                <div
                    className={`step ${activeStep === 'process-part' ? 'active' : ''}`}
                    onClick={() => onStepChange('process-part')}
                >
                    <button
                        type="button"
                        className="step-trigger d-block my-second-step"
                        role="tab"
                        data-tooltip-content="Étape 2 : Processus"
                    >
                        <div className="bs-stepper-circle d-block">2</div>
                        <div className="bs-stepper-label">Processus</div>
                    </button>
                </div>
                <div className="line"></div>
                <div
                    className={`step ${activeStep === 'cloture-part' ? 'active' : ''}`}
                    onClick={() => onStepChange('cloture-part')}
                >
                    <button
                        type="button"
                        className="step-trigger d-block my-third-step"
                        role="tab"
                        data-tooltip-content="Étape 3 : Clôture"
                    >
                        <div className="bs-stepper-circle d-block">3</div>
                        <div className="bs-stepper-label">Clôture</div>
                    </button>
                </div>
            </div>

            {/* Tooltips */}
            <Tooltip id="preselection-tooltip" place="top" />
            <Tooltip id="process-tooltip" place="top" />
            <Tooltip id="cloture-tooltip" place="top" />
        </div>
    );
};

export default StepperHeader;
