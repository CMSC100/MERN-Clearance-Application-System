import React, { useState } from "react";
import './stepper.css';

import Step from "./Step";

export default function Stepper (props) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex);
    }

    return (
        <div className="stepper">
            {props.steps.map((step,i) => (
                <div key={i} className={`step ${currentStep === i ? "active" : ""}`} onClick={() => handleStepClick(i)}>
                    <span className="step-num">{i+1}</span>
                    <span className="step-name">{step.title}</span>
                    {step.element && (
                        <div className="input-rounded step-element">{step.element}</div>
                    )}
                </div>
            ))}
        </div>
    )
}