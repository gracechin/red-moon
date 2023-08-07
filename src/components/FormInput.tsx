import React from "react";
import { ToggleButton, ToggleButtonGroup, Form } from "react-bootstrap";
import { FormCheckType } from "react-bootstrap/esm/FormCheck";

type LabelProp = string;
type NameProp = string;
type IconProp = string;

enum FieldTypes {
  CheckOptions = "CheckOptions",
  Text = "Text",
  Options = "Options",
  Switch = "Switch",
}
type BasicFormFieldInputProps = {
  fieldType: FieldTypes;
  label: LabelProp;
  name: NameProp;
};

type LabelledInputGroupProps = {
  children: React.ReactNode;
  label: LabelProp;
  name: NameProp;
};

const LabelledInputGroup: React.FC<LabelledInputGroupProps> = ({
  children,
  label,
  name,
}) => (
  <Form.Group className="mb-3" controlId={`form${name}`}>
    <Form.Label>{label}</Form.Label>
    <br />
    {children}
  </Form.Group>
);

interface OptionProps {
  name: NameProp;
  icon: IconProp;
}

type CheckOptionsProps = BasicFormFieldInputProps & {
  defaultValue: string;
  options: OptionProps[];
  type?: FormCheckType;
};

export const getFieldOptionValue = (
  fieldName: string,
  optName: string
): string => fieldName + optName;

const getOptionLabel = (opt: OptionProps): string =>
  [opt.icon, opt.name].join(" ");

export const CheckOptions: React.FC<CheckOptionsProps> = ({
  name,
  label,
  defaultValue,
  options,
  type,
}) => {
  return (
    <LabelledInputGroup name={name} label={label}>
      {options.map((opt, idx) => {
        const optId = getFieldOptionValue(name, opt.name);
        return (
          <Form.Check
            key={idx}
            type={type}
            name={name}
            id={optId}
            value={optId}
            label={getOptionLabel(opt)}
            defaultChecked={defaultValue === optId}
          />
        );
      })}
    </LabelledInputGroup>
  );
};

type ToggleRadioButtonsProps = BasicFormFieldInputProps & {
  defaultValue: string;
  options: OptionProps[];
};

const ToggleRadioButtons: React.FC<ToggleRadioButtonsProps> = ({
  label,
  name,
  defaultValue,
  options,
}) => {
  return (
    <LabelledInputGroup name={name} label={label}>
      <ToggleButtonGroup
        name={name}
        type="radio"
        defaultValue={defaultValue}
        className="mb-2"
      >
        {options.map((opt, idx) => {
          const optId = getFieldOptionValue(name, opt.name);
          return (
            <ToggleButton id={optId} value={optId} key={idx}>
              {getOptionLabel(opt)}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </LabelledInputGroup>
  );
};

export const OptionsInput = (
  props: CheckOptionsProps | ToggleRadioButtonsProps
) => {
  const numOptions = props.options.length;
  if (numOptions > 5) return <CheckOptions {...props} />;
  return <ToggleRadioButtons {...props} />;
};

type SwitchInputProps = BasicFormFieldInputProps & {
  compress?: boolean;
  defaultChecked?: boolean;
  onChange: () => {};
};

export const SwitchInput: React.FC<SwitchInputProps> = ({
  label,
  name,
  compress,
  defaultChecked,
  onChange,
}) => {
  return (
    <>
      <Form.Check
        type="switch"
        label={label}
        name={name}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      {!compress && <br />}
    </>
  );
};

type TextProps = BasicFormFieldInputProps & {
  errorMsg?: string;
  rows?: number;
  onChange?: () => {};
  placeholder?: string;
  disabled?: boolean;
  defaultValue: string;
};

export const Text: React.FC<TextProps> = ({
  errorMsg,
  rows,
  onChange,
  placeholder,
  name,
  disabled,
  defaultValue,
}) => {
  const isError = errorMsg && errorMsg.length > 0;
  return (
    <>
      <Form.Control
        name={name}
        as="textarea"
        className={isError ? "error" : undefined}
        rows={rows || 3}
        type="text"
        onChange={onChange || (() => {})}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
      />
      {isError && <div className="errorMsg">{errorMsg}</div>}
      <br />
    </>
  );
};

export const TextInput = (props: TextProps) => {
  return (
    <LabelledInputGroup name={props.name} label={props.label}>
      <Text {...props} />{" "}
    </LabelledInputGroup>
  );
};

type FormInputProps = CheckOptionsProps | SwitchInputProps | TextProps;

export const FormInput = (props: any) => {
  switch (props.fieldType) {
    case FieldTypes.CheckOptions:
      return <CheckOptions {...props} />;
    case FieldTypes.Options:
      return <OptionsInput {...props} />;
    case FieldTypes.Switch:
      return <SwitchInput {...props} />;
    case FieldTypes.Text:
      return <TextInput {...props} />;
    default:
      throw "FormInput 'fieldType' undefined";
  }
};

type FloatInputProps = BasicFormFieldInputProps & {
  placeholder: string | undefined;
  defaultValue: number | string | undefined;
};

export const FloatInput: React.FC<FloatInputProps> = ({
  name,
  label,
  placeholder,
  defaultValue,
}) => {
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

type DateInputProps = BasicFormFieldInputProps & {
  max: number;
  min: number;
  defaultValue: number;
};

export const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  max,
  min,
  defaultValue,
}) => {
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
