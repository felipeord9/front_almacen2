import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sweal from "sweetalert";
import Context from "../../context/userContext";
import Card from "../../components/Card";
import Graph from "../../components/Graph";
import ButtonDownload from "../../components/ButtonDownload";
import { config } from "../../config";
import "./styles.css";

function Home() {
  const { colaborator, setColaborator } = useContext(Context);
  const [cellars, setCellars] = useState([]);
  const [infoTable, setInfoTable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `${config.apiUrl}/cellars`;

    fetch(`${url}/total`)
      .then((res) => res.json())
      .then((res) => {
        setCellars(res.data);
      });

    fetch(`${url}/existence`)
      .then((res) => res.json())
      .then((res) => {
        setInfoTable(res.data);
      });
  }, []);

  const handlerClick = (e) => {
    setColaborator(null);
  };

  return (
    <div className="container d-flex flex-column h-100 w-100 pt-4 pb-4">
      <div className="d-flex flex-row justify-content-between align-items-center text-dark">
        <div>
          <strong>Bienvenid@!</strong>
          <div className="d-flex">
            <div>
              {colaborator.nombre}
              <strong> ({colaborator.cargo})</strong>
            </div>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handlerClick}>
          Salir
        </button>
      </div>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {cellars
            ? cellars.map((elemt, index) => (
                <div className="">
                  <div className="d-flex flex-column justify-content-evenly">
                    <Graph
                      capMax={elemt.warehouseCapacity}
                      capOcup={elemt.total}
                    />
                    <Card
                      nombre={elemt.nombre}
                      onClick={(e) => navigate(`/modulos/?bodega=${elemt.id}`)}
                    />
                  </div>
                </div>
              ))
            : null}
          <ButtonDownload
            table="table-existence"
            fileName="Existencia-Bodegas"
            sheet="existencias"
          />
        </div>
      </div>
      {/* <div>
        <btn className="btn btn-sm btn-success fw-bold w-100" onClick={(e) => navigate('/ver/productos')}>Ver Productos</btn>
      </div>
      <table id="table-existence" className="d-none" style={{ fontSize: 11 }}>
        <thead>
          <tr>
            <th>Ref.</th>
            <th>Description</th>
            <th>Existencia</th>
            <th>U.M.</th>
          </tr>
        </thead>
        <tbody>
          {infoTable.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.description}</td>
              <td>{item.total}</td>
              <td>{item.um}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default Home;
