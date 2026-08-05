import { ChangeEvent } from "react";
import { FromGroupLabel } from "./FormGroupLabel";

export type TextInputProps = {
  disabled?: boolean;
  name: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  value: string;
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
      />
    </div>
  );
};
