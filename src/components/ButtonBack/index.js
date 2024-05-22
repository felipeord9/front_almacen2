function ButtonBack() {
  return (
      <button
        className="btn btn-secondary"
        onClick={(e) => window.history.back()}
      >
        {"< Atrás"}
      </button>
  );
}

export default ButtonBack;
