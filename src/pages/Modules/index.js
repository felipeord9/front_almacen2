import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Context from "../../context/cellarContext";
import { config } from "../../config";
import Card from "../../components/Card";
import ButtonBack from "../../components/ButtonBack";
import LogoExistencia from "../../assets/notas.png";
import LogoGenerar from "../../assets/direcciones.png";
import LogoConsultar from "../../assets/consulta.png"
import LogoLangostino from "../../assets/logo-gran-langostino.png"

function Modules() {
  const { cellar, setCellar } = useContext(Context);
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    fetch(`${config.apiUrl}/cellars/${query.get("bodega")}`)
      .then((res) => res.json())
      .then((res) => setCellar(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center h-100 w-100 pt-4">
      <div className="d-flex flex-row justify-content-between align-items-center text-light">
        {/* <button className="btn btn-secondary" onClick={(e) => window.history.back()}>
          volver atras
        </button> */}
        <ButtonBack />
      </div>
      {
        cellar ? (
      <div className="bg-danger mt-5 rounded-5" style={{background: "#FE7F29"}}>
        <h2 className="text-center text-light p-2 m-0">{cellar.nombre}</h2>
      </div>

        ) : null
      }
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <div className="row w-100 gap-4">
          <Card
            nombre="Generar Movimiento"
            image={LogoGenerar}
            redirect="/registro"
          />
          <Card
            nombre="Consultar Movimientos"
            image={LogoConsultar}
            redirect="/movimientos"
          />
          <Card
            nombre="Reporte de Existencias"
            image={LogoExistencia}
            redirect="/existencias"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center w-100 mb-4">
        <img src={LogoLangostino} alt="" style={{width: "250px"}}/>
      </div>
    </div>
  );
}

export default Modules;
