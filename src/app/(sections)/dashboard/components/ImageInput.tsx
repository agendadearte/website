import { TextInput, TextInputProps } from "./TextInput";

export const ImageInput = (props: TextInputProps) => (
  <TextInput {...props} multiple type="file" />
);
