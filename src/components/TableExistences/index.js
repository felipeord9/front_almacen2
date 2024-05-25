import { useState, useEffect, useContext } from "react";
import Context from "../../context/cellarContext";
import { getCellarExistence } from "../../services/cellarService";
import "./styles.css"

function TableExistences({ getInfo, productId, getFunction }) {
  const [existences, setExistences] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { cellar } = useContext(Context);

  const getExistence = () => {
    getCellarExistence(cellar.id)
      .then(res => {
        setExistences(res)
        setSuggestions(res)
      })
  }

  useEffect(() => {
    getExistence()
    if (getFunction) getFunction(getExistence)
  }, []);

  useEffect(() => {
    const filterExistences = existences.filter(elemt => parseInt(elemt.id) === parseInt(productId))
    if(filterExistences.length > 0) {
      setSuggestions(filterExistences)
    } else {
      setSuggestions(existences)
    }
  }, [productId])

  const handleClick = (e) => {
    const {id} = e.target.parentNode
    const [newId, description, position, um] = id.split('@')
    
    getInfo({
      id: newId,
      description,
      position,
      um
    })
  }

  return (
    <div className="w-100 sizing rounded h-100">
      <div className="table-responsive w-100 h-100">
        <table
          id="table-existence"
          className="table table-light align-middle table-striped border-danger text-center table-bordered h-100 m-0 w-100 rounded"
          style={{ border: "#FE7F29 solid 2px" }}
        >
          <thead>
            <tr>
              <th>Ref.</th>
              <th>Descripcion</th>
              <th>Posición</th>
              <th>Existencia</th>
              <th>U.M</th>
              <th>Cliente</th>
              <th>Lote</th>
              <th>Vence</th>
            </tr>
          </thead>
          <tbody>
            {suggestions
              ? suggestions.map((elemt) => (
                elemt.total > 0 &&
                  <tr
                    id={`${elemt.id}@${elemt.description}@${elemt.position}@${elemt.um}@${elemt.client}`}
                    onClick={getInfo ? (e) => getInfo(elemt) : null} 
                  >
                    <td>{elemt.id}</td>
                    <td>{elemt.description}</td>
                    <td>{elemt.position}</td>
                    <td>{elemt.total}</td>
                    <td>{elemt.um}</td>
                    <td>{elemt.client}</td>
                    <td>{elemt.lote}</td>
                    <td>{elemt.fechaVencimiento && new Date(elemt.fechaVencimiento).toLocaleDateString()}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableExistences;
