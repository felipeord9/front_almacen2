import { useNavigate } from "react-router-dom";
import "./styles.css";

function Card({ nombre, redirect, image, ...events }) {
  const navigate = useNavigate();

  return !redirect ? (
    <div
      id={nombre}
      className="btn btn-primary col"
      onClick={(e) => {
        if (Object.entries(events).length > 0) {
          events.onClick(e);
        } else {
          navigate(redirect);
        }
      }}
    >
      <div className="card-body">
        <strong className="card-text">{nombre}</strong>
      </div>
    </div>
  ) : (
    <div
      id={nombre}
      className="col p-0 pb-2 pt-2"
      onClick={(e) => {
        if (Object.entries(events).length > 0) {
          events.onClick(e);
        } else {
          navigate(redirect);
        }
      }}
    >
      <div className="box border border-danger border-3">
        <div className="box-body text-center">
          <div className="box-body-img">
            <img src={image} alt="" />
          </div>
          <p className="mt-4 mb-0">{nombre}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
