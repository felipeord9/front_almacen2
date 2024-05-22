import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Context from "../../context/userContext";
import { config } from "../../config";
import Logo from "../../assets/logo-naranja.jpeg";
import LogoUsuario from "../../assets/usuario.png";
import "./styles.css";

function Login() {
  const [numId, setNumId] = useState(null);
  const [showError, setShowError] = useState(false);
  const { colaborator, setColaborator } = useContext(Context);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { value } = e.target;
    //value = parseInt(value);
    setNumId(value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetch(`${config.apiUrl}/colaborators/${parseInt(numId)}`)
      .then((res) => res.json())
      .then((res) => {
        /* if (res.data) { */
          setColaborator(res.data);
          navigate("/home");
        /* } else {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        } */
      })
      .catch((error) => {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      });
  };

  return !colaborator ? (
    <div className="d-flex align-items-center justify-content-center vh-100 p-2">
      <Navigate to="/login" />
      <div
        className="container-login d-flex align-items-center flex-row card overflow-hidden border-2 border-dark"
        style={{
          minHeight: 250,
          minWidth: 200,
          maxWidth: 800,
          background: "F0F0F0",
        }}
      >
        <div className="image-login w-100">
          <img src={Logo} alt="" className="w-100" />
        </div>
        <div className="d-flex flex-column align-items-center p-4 h-100 w-100">
          <img
            src={LogoUsuario}
            className="mb-4"
            alt="logo"
            style={{ width: 80 }}
          />
          <h1 className="fs-4 fw-bold" style={{ color: 'rgb(254, 127, 41)'}}>KARDEX LOGÍSTICA</h1>
          <form className="d-flex flex-column align-items-center text-center gap-0 w-100">
            <p className="fs-5 w-100 m-0">
              <strong>NÚMERO DE IDENTIFICACIÓN</strong>
            </p>
            <input
              className="input-login w-100 mb-3 ps-2 form-control"
              type="password"
              value={numId}
              min={0}
              placeholder="C.C"
              onChange={handleChange}
            />
            <button
              className="d-flex align-items-center btn w-50 text-light"
              type="submit"
              style={{ background: "#FE7F29" }}
              onClick={handleClick}
            >
              <strong className="w-100 m-0">INGRESAR</strong>
            </button>
            {showError ? (
              <p className="text-danger m-0 mt-1 p-0">
                No existe el colaborador
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/home" />
  );
}

export default Login;
