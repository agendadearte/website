import { TextInputProps } from "./TextInput";
import { FromGroupLabel } from "./FormGroupLabel";

type SelectInputProps = TextInputProps & {
  options: { id: string; name: string }[];
};

export const SelectInput = (props: SelectInputProps) => {
  const id = `form-group-${props.name}-select`;
  const list = `form-group-${props.name}-options`;
  return (
    <div className="form-group mb-3">
      <FromGroupLabel id={id} label={props.label} />
      <input
        id={id}
        className="form-select"
        list={list}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
      />
      <datalist id={list}>
        {props.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </datalist>
    </div>
  );
};
