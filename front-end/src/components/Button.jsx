const Button = ({ title, containerStyle, iconRight, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`inline-flex justify-center items-center text-base ${containerStyle}`}
    >
      {title}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default Button;
