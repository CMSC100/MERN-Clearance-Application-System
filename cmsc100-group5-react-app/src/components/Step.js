import React, { useState } from "react";

export default function Step (props) {
    return (
        <div className={"step-block" + (props.selected ? " selected" : '')}>
            <div className={"circle-wrapper"} onClick={() => {props.updateStep(props.index)}}>
                <div className="circle">
                    {props.index+1}
                </div>
            </div>
            <span>{props.label}</span>
        </div>
    )
}