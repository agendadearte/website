import "./button.scss";

type ButtonProps = {
  onClick: () => void;
  text: string;
};

export const Button = (props: ButtonProps) => {
  const { onClick, text } = props;
  return (
    <button className="button button--primary" onClick={onClick}>
      {text}
    </button>
  );
};
