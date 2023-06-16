import React from "react";
import { ToggleButton, ToggleButtonGroup, Form } from "react-bootstrap";

const LabelledInputGroup = ({ children, label, name }) => (
  <Form.Group className="mb-3" controlId={`form${name}`}>
    <Form.Label>{label}</Form.Label>
    <br />
    {children}
  </Form.Group>
);

export const CheckOptions = ({ name, label, defaultValue, options, type }) => {
  return (
    <LabelledInputGroup name={name} label={label}>
      {options.map(({ name, icon }, idx) => {
        return (
          <Form.Check
            key={idx}
            type={type}
            name="Situation"
            id={name}
            value={name}
            label={`${icon ? icon + " " : ""}${name}`}
            defaultChecked={defaultValue === name}
          />
        );
      })}
    </LabelledInputGroup>
  );
};

const ToggleButtons = ({ label, name, defaultValue, options, type }) => {
  return (
    <LabelledInputGroup name={name} label={label}>
      <ToggleButtonGroup
        name={name}
        type={type || "radio"}
        defaultValue={defaultValue}
        className="mb-2"
      >
        {options.map(({ name, icon }, idx) => {
          return (
            <ToggleButton id={name} value={name} key={idx}>
              {[icon, name].join(" ")}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </LabelledInputGroup>
  );
};

export const OptionsInput = (props) => {
  const numOptions = props.options.length;
  if (numOptions > 5) return <CheckOptions {...props} />;
  return <ToggleButtons {...props} />;
};

export const SwitchInput = ({ label, name, compress, defaultChecked }) => {
  return (
    <>
      <Form.Check
        type="switch"
        label={label}
        name={name}
        defaultChecked={defaultChecked}
      />
      {!compress && <br />}
    </>
  );
};

export const FormInput = (props) => {
  switch (props.fieldType) {
    case "CheckOptions":
      return <CheckOptions {...props} />;
    case "Options":
      return <OptionsInput {...props} />;
    case "Switch":
      return <SwitchInput {...props} />;
    default:
      throw "FormInput 'fieldType' undefined";
  }
};

export const FloatInput = ({ name, label, placeholder, defaultValue }) => {
  return (
    <LabelledInputGroup name={name} label={label}>
      <Form.Control
        name={name}
        type="float"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </LabelledInputGroup>
  );
};

export const DateInput = ({ name, label, max, min, defaultValue }) => {
  return (
    <LabelledInputGroup name={name} label={label}>
      <Form.Control
        name={name}
        type="date"
        max={max}
        min={min}
        defaultValue={defaultValue}
      />
    </LabelledInputGroup>
  );
};
