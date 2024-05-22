import { useState, useEffect, useContext, useRef } from "react";
import sweal from "sweetalert";
import TableMovements from "../../components/TableMovements";
import ButtonDownload from "../../components/ButtonDownload";
import ButtonBack from "../../components/ButtonBack";
import Context from "../../context/cellarContext";
import "./styles.css";

function Movimientos() {
  const { cellar } = useContext(Context);
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState({});
  const [filterMovements, setFilterMovements] = useState([]);
  const parentRef = useRef(null);

  useEffect(() => {
    setFilterMovements(cellar.movements);
  }, [cellar.movements]);

  useEffect(() => {
    // Calcula y establece la altura de las tablas hijas al montar el componente
    const parentHeight = parentRef?.current?.offsetHeight;
    const childTables = document.querySelectorAll('.child-table');

    childTables.forEach(table => {
      if(search && parentHeight) {
        table.style.height = `${parentHeight - 110}px`;
      } else {
        table.style.height = `${parentHeight - 40}px`;
      }
    });
  }, [filterMovements]);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const filMov = cellar?.movements.filter(
      (elem) => parseInt(search) === elem.product.id && !elem.deleted
    );

    if (filMov.length > 0) {
      const amountEntradas = filMov
        .filter((elem) => elem.movementType === "entrada")
        .reduce((a, b) => a + b.amount, 0);
      const amountSalidas = filMov
        .filter((elem) => elem.movementType === "salida")
        .reduce((a, b) => a + b.amount, 0);
      setAmount({
        amountEntradas,
        amountSalidas,
      });
      setFilterMovements(filMov);
    } else {
      sweal({
        text: "No se encontraron entradas ni salidas del producto",
        icon: "warning",
        timer: 3000,
      });
      setFilterMovements(cellar.movements);
      setAmount({});
      setSearch("");
    }
  };

  return (
    <div className="d-flex flex-column pt-4 pb-4 h-100">
      <div className="d-flex flex-row align-items-center justify-content-between mb-3">
        {/* <button
          className="btn btn-secondary h-100"
          onClick={(e) => window.history.back()}
        >
          {"volver atras"}
        </button> */}
        <ButtonBack />
        <ButtonDownload
          fileName={"Movimientos"}
          table={"table-downloaded"}
          sheet={"movimientos"}
        />
        {/* <div className="d-flex align-items-center h-100">
          <ReactHTMLTableToExcel
            id="movements-xls-button"
            className="d-flex flex-row align-items-center btn btn-success"
            table="table-downloaded"
            filename="Movimientos"
            filetype="xls"
            sheet="movimientos"
            format="xls"
          >
            <img src={LogoExcel} className="img-download" alt="" />
            <strong>Descargar</strong>
          </ReactHTMLTableToExcel>
        </div> */}
      </div>

      <form class="d-flex mb-3" role="search">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Buscar por referencia del producto"
          aria-label="Search"
          value={search}
          onChange={handleChange}
        />
        <button
          class="btn btn-outline-success"
          type="submit"
          onClick={handleClick}
        >
          Buscar
        </button>
      </form>

      <div ref={parentRef} className="cont-table">
        <table
          id="table-movements"
          className="table table-secondary table-bordered text-center border-danger m-0"
          style={{ fontSize: 10, border: "#FE7F29 solid 2px" }}
        >
          <thead>
            <tr>
              <th>ENTRADAS</th>
              <th>SALIDAS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-0">
                <div className="child-table table-responsive inner-table">
                  <TableMovements
                    filterMovements={filterMovements}
                    option="entrada"
                  />
                </div>
              </td>
              <td className="p-0">
                <div className="child-table table-responsive inner-table">
                  <TableMovements
                    filterMovements={filterMovements}
                    option="salida"
                  />
                </div>
              </td>
            </tr>
            {Object.entries(amount).length > 0 ? (
              <>
                <tr>
                  <td>{amount.amountEntradas}</td>
                  <td>{amount.amountSalidas}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>DIFERENCIA: </strong>
                    {amount.amountEntradas - amount.amountSalidas}
                  </td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>
      <table
        id="table-downloaded"
        className="d-none table table-dark table-bordered text-center"
        style={{ fontSize: 11 }}
      >
        <thead>
          <tr>
            <th>Ref.</th>
            <th>Descripcion</th>
            <th>U.M</th>
            <th>Cantidad</th>
            <th>Colaborador</th>
            <th>Movimiento</th>
            <th>Posición</th>
            <th>Fecha Creacion</th>
            <th>Estado</th>
            <th>Nota</th>
            <th>Eliminado Por</th>
            <th>Fecha Eliminacion</th>
            <th>Motivo de Eliminacion</th>
          </tr>
        </thead>
        {/* <tbody>
          {Object.entries(filterMovements).length > 0
            && filterMovements.map((elem) => (
                <tr>
                  <td>{elem.product.id}</td>
                  <td>{elem.product.description}</td>
                  <td>{elem.product.um}</td>
                  <td>{elem.amount}</td>
                  <td>{elem.colaborator.nombre}</td>
                  <td>{elem.movementType}</td>
                  <td>{elem.position.name}</td>
                  <td>{new Date(elem.createdAt).toLocaleString("en-US")}</td>
                  <td>{elem.deleted ? "ELIMINADO" : "ACTIVO"}</td>
                  <td>{elem.note}</td>
                  <td>{elem.deletedBy}</td>
                  <td>
                    {elem.deletedAt
                      ? new Date(elem.deletedAt).toLocaleString("en-US")
                      : ""}
                  </td>
                  <td>{elem.removalReason}</td>
                </tr>
              ))}
          {filterMovements.amount ? (
            <>
              <tr>
                <td colSpan={2}>{filterMovements.amount.amountEntradas}</td>
                <td colSpan={2}>{filterMovements.amount.amountSalidas}</td>
                <td colSpan={3}>
                  <strong>DIFERENCIA: </strong>
                  {filterMovements.amount.amountEntradas -
                    filterMovements.amount.amountSalidas}
                </td>
              </tr>
            </>
          ) : null}
        </tbody> */}
      </table>
      {/* </div> */}
    </div>
  );
}

export default Movimientos;
