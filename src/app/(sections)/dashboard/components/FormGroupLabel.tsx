type FromGroupLabelProps = {
  id: string;
  label: string;
};

export const FromGroupLabel = (props: FromGroupLabelProps) => (
  <label htmlFor={props.id} className="form-label">
    {props.label}
  </label>
);
