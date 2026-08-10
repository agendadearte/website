import "./button.scss";

type ButtonProps = {
  onClick: () => void;
  text: string;
  disabled?: boolean;
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="button button--primary"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};
