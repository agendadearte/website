import { ChangeEvent } from "react";
import { FromGroupLabel } from "./FormGroupLabel";

export type TextAreaProps = {
  disabled?: boolean;
  name: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: string;
  value: string;
};

export const TextArea = ({ type = "text", ...props }: TextAreaProps) => {
  const id = `form-group-${props.name}-${type}`;
  return (
    <div className="form-group mb-3">
      <FromGroupLabel id={id} label={props.label} />
      <textarea
        id={id}
        rows={12}
        style={{ resize: "vertical" }}
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
