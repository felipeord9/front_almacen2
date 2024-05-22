import { useContext } from "react";
import TableExistences from "../../components/TableExistences";
import ButtonDownload from "../../components/ButtonDownload";
import ButtonBack from "../../components/ButtonBack";
import Context from "../../context/cellarContext";

function Existencias() {
  const { cellar } = useContext(Context)

  const calculateExistence = () => {
    let result = [];
    let currentRef = null;
    let currentFlag = null;
    const { movements } = cellar;
    movements.sort((a, b) => a.product.id - b.product.id)
    const entradas = movements.filter(elem => elem.movementType === 'entrada' && !elem.deleted)
    const salidas = movements.filter(elem => elem.movementType === 'salida' && !elem.deleted)

    for (const entrada of entradas) {
      const ref = entrada.product.id;
      const flag = entrada.flag
      if (ref === currentRef && flag === currentFlag) {
        result[result.length - 1].movements.entradas.push(entrada);
      } else {
        result.push({
          ref,
          flag,
          description: entrada.product.description,
          movements: {
            entradas: [entrada],
            salidas: [],
          },
        });
        currentRef = ref;
        currentFlag = flag
      }
    }

    for (const salida of salidas) {
      for (let i = 0; i < result.length; i++) {
        currentRef = result[i].ref;
        currentFlag = result[i].flag
        const ref = salida.product.id;
        const flag = salida.flag

        if (ref === currentRef && flag === currentFlag) {
          result[i].movements.salidas.push(salida);
        } else {
          continue;
        }
      }
    }
    return result;
  };

  return (
    <div className="text-light pt-4">
      <div className="d-flex flex-row align-items-center justify-content-between mb-3">
        {/* <button
          className="btn btn-secondary"
          onClick={(e) => window.history.back()}
        >
          {"volver atras"}
        </button> */}
        <ButtonBack/>
        <ButtonDownload 
        table="table-existence"
        fileName="Existencias"
        sheet="existencias"
        />
        {/* <ReactHTMLTableToExcel
          id="existence-xls-button"
          className="btn btn-success"
          table="table-existence"
          filename="Existencias"
          filetype="xls"
          sheet="existencias"
        >
          Descargar
        </ReactHTMLTableToExcel> */}
      </div>
      <div className="fs-6 text-center text-dark">
        <h2><strong>EXISTENCIA EN BODEGA</strong></h2>
      </div>

      <TableExistences />
      {/* <div className="table-resposive">
        <table
          id="table-existence"
          className="table table-secondary table-striped text-center table-bordered"
          style={{ fontSize: 11 }}
        >
          <thead>
            <tr>
              <th>Ref.</th>
              <th>Descripcion</th>
              <th>Existencia</th>
              <th>Bandera</th>
              <th>U.M</th>
            </tr>
          </thead>
          <tbody>
            {cellar.movements
              ? calculateExistence().map((elemt) => (
                  <tr>
                    <td>{elemt.movements.entradas[0].product.id}</td>
                    <td>{elemt.movements.entradas[0].product.description}</td>
                    <td>
                      {elemt.movements.entradas.reduce(
                        (a, b) => a + b.amount,
                        0
                      ) -
                        elemt.movements.salidas.reduce(
                          (a, b) => a + b.amount,
                          0
                        )}
                    </td>
                    <td>{elemt.movements.entradas[0].flag}</td>
                    <td>{elemt.movements.entradas[0].product.um}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default Existencias;
