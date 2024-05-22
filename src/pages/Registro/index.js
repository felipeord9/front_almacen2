import { useState , useContext } from "react";
import Context from "../../context/cellarContext";
import MovementForm from "../../components/MovementForm";
import TableExistences from "../../components/TableExistences";
import ButtonBack from "../../components/ButtonBack";
import LogoLangostino from "../../assets/logo-gran-langostino.png";
import "./styles.css";

function Registro() {
  const [showEntrada, setShowEntrada] = useState(true);
  const [showSalida, setShowSalida] = useState(false);
  const [infoMovement, setInfoMovement] = useState(null);
  const [productId, setProductId] = useState(null);
  const [funcion, setFuncion] = useState(null);
  const { cellar } = useContext(Context);

  const showComponent = (component) => {
    setShowEntrada(component === 1);
    setShowSalida(component === 2);
  };

  const getFunctionExistence = (functi) => {
    setFuncion(() => functi);
  };

  const ejecutarFunctionExistence = () => {
    if (funcion) {
      funcion();
    }
  };

  const [status, setStatus] = useState('')

  return (
    <div className="pt-4">
      <ButtonBack />
      <div className="fs-6 w-100">
        <div className="d-flex justify-content-center">
          <img src={LogoLangostino} alt="" style={{ width: "200px" }} />
        </div>
        <div className="fs-6 text-center text-dark">
          <h2>
            <strong>REGISTRO DE MOVIMIENTO</strong>
          </h2>
        </div>
        <div className="d-flex flex-row justify-content-between align-items-center text-center text-light w-100 mb-2 rounded-pill overflow-hidden">
          <div
            className={
              showEntrada
                ? "w-75 p-2 bg-success btn-reg"
                : "w-25 p-2 bg-success btn-reg"
            }
            onClick={(e) => (showComponent(1),setStatus('Entrada'))}
            style={{ whiteSpace: "nowrap" }}
            /* style={showEntrada ? {background: "#FE7F29"} : null} */
          >
            ENTRADA
          </div>
          <div
            className={
              showSalida
                ? "w-75 p-2 btn-reg bg-danger"
                : "w-25 p-2 btn-reg bg-danger"
            }
            onClick={(e) => (showComponent(2),setStatus('Salida'))}
            style={{ background: "#FE7F29", whiteSpace: "nowrap" }}
          >
            SALIDA
          </div>
        </div>
        {showEntrada && <MovementForm typeForm={"entrada"} />}
        {showSalida && (
          <div className="reverse d-flex flex-row gap-1" style={{ height: "63vh" }}>
            <MovementForm
              typeForm={"salida"}
              infoMovement={infoMovement}
              setInfoMovement={setInfoMovement}
              getProductId={setProductId}
              status={status}
              getFunctionExistence={ejecutarFunctionExistence}
            />
            <TableExistences
              getInfo={setInfoMovement}
              productId={productId}
              getFunction={getFunctionExistence}
            />
          </div>
        )}
      </div>
      {/* {JSON.stringify(cellar)} */}
    </div>
  );
}

export default Registro;
