import React, { useState } from 'react';
import StepperHeader from './StepperHeader';
import ConditionPart from './ConditionPart';
import ProcessPart from './ProcessPart';
import CloturePart from './CloturePart';

const STEPS = {
    CONDITION: 'condition-part',
    PROCESS: 'process-part',
    CLOTURE: 'cloture-part'
};

const Stepper = () => {
    const [activeStep, setActiveStep] = useState(STEPS.CONDITION);

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleNextStepProcess = () => {
        handleStepChange(STEPS.PROCESS);
    };

    const handleNextStepCloture = () => {
        handleStepChange(STEPS.CLOTURE);
    };

    return (
        <div className="bs-stepper">
            <StepperHeader activeStep={activeStep} onStepChange={handleStepChange} />
            <div className="bs-stepper-content">
                {activeStep === STEPS.CONDITION && <ConditionPart onNextStep={handleNextStepProcess} onAfterStep={handleNextStepCloture}/>}
                {activeStep === STEPS.PROCESS && <ProcessPart onNextStep={handleNextStepCloture} />}
                {activeStep === STEPS.CLOTURE && <CloturePart />}
            </div>
        </div>
    );
};

export default Stepper;
