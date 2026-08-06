import { ChangeEvent } from "react";
import { FromGroupLabel } from "./FormGroupLabel";

export type TextInputProps = {
  label: string;
  type?: string;
  disabled?: boolean;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
  multiple?: boolean;
};

export const TextInput = ({ type = "text", ...props }: TextInputProps) => {
  const id = `form-group-${props.name}-${type}`;
  return (
    <div className="form-group mb-3">
      <FromGroupLabel id={id} label={props.label} />
      <input
        id={id}
        type={type}
        className="form-control"
        disabled={props.disabled}
        name={props.name}
        onChange={props.onChange}
        placeholder={props.placeholder}
        value={props.value}
        multiple={props.multiple}
      />
    </div>
  );
};
