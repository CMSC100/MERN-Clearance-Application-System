import React, { useEffect, useState } from "react";
import './stepper.css';

export default function Stepper (props) {

    return (
        <div className="stepper">
            <div className="step">
                <span className={`step-num ${props.currentStep >= props.index ? "active" : ""}`}>{props.index+1}</span>
                <span className="step-name">{props.steps.title}</span>
                <div className="input-rounded step-element">{props.steps.element}</div>
            </div>
        </div>
    )
}