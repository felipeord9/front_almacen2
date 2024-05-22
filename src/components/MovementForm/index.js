import { useState, useEffect, useContext, useRef } from "react";
import sweal from "sweetalert";
import CellarContext from "../../context/cellarContext";
import UserContext from "../../context/userContext";
import { getAllProducts2, getOneProduct } from "../../services/productService";
import { createMovement } from "../../services/movementService";
import { getAllPositions } from "../../services/positionService";
import { config } from "../../config";
import "./styles.css";

function MovementForm({ typeForm, status, getProductId, ...props }) {
  const { colaborator } = useContext(UserContext);
  const { cellar, setCellar } = useContext(CellarContext);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [positions, setPositions] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState({
    searchRef: "",
    searchDesc: "",
    amount: "",
    position: "",
    note: "",
    client:'',
  });
  const selectPositionRef = useRef();
  const selectClientRef = useRef();
  const ref = useRef();

  useEffect(() => {
    getAllProducts2().then((res) => {
      setProducts(res);
      setSuggestions(res);
    });
    getAllPositions().then((data) => setPositions(data));
  }, []);

  const getMovements = () => {
    const data = fetch(`${config.apiUrl}/cellars/${cellar.id}`)
      .then((res) => res.json())
      .then((res) => {
        setCellar(res.data);
        return res.data;
      });
    return data;
  };

  useEffect(() => {
    async function setData() {
      const { infoMovement } = props;

      if (infoMovement) {
        let result = await getOneProduct(infoMovement.id);
        if (result) {
          setProduct(result);
        }
        setSearch({
          ...search,
          searchRef: infoMovement.id,
          position: infoMovement.position,
        });
      }
    }
    setData();
  }, [props.infoMovement]);

  const cleanForm = () => {
    if (props.setInfoMovement) {
      props.setInfoMovement(null);
    }
    setProduct(null);
    selectPositionRef.current.selectedIndex = 0;
    selectClientRef.current.selectedIndex = 0;
    setSearch({
      searchRef: "",
      searchDesc: null,
      amount: "",
      position: null,
      note: "",
    });
    setProductoSeleccionado(null)
  };

  const[move,setMove]= useState('')

  const findById = (e) => {
    const { value } = e.target;
    const item = products.find((elem) => parseInt(elem.item.codigo) === parseInt(value));
    if (status==='Salida') {
      /* props.getProductId(value); */
      getProductId(value)
    }
    if (item && search) {
      setProductoSeleccionado(item);
      setSuggestions(products);
      search.searchDesc = "";
      search.position = "";
      setProduct(null);
    } else {
      setProductoSeleccionado(null);
      if(status==='Salida'){
        props.setInfoMovement(null);
      }
        search.searchDesc = "";
        search.position = "";
        search.client="";
        setProduct(null);
        setSuggestions(products);
        
      /* cleanForm(); */
    }
  };

  const handleFindRef = async (e) => {
    let { value } = e.target;
    value = parseInt(value);
    if (props.getProductId) {
      props.getProductId(value);
    }
    let result = await getOneProduct(value);
    if (result) {
      setSuggestions([result]);
      setProduct(result);
    } else {
      if (props.setInfoMovement) {
        props.setInfoMovement(null);
      }
      if (search) {
        search.searchDesc = "";
        search.position = "";
        setProduct(null);
        setSuggestions(products);
      } else {
        cleanForm();
      }
    }
  };

  const handleFindDesc = (e) => {
    const { value } = e.target;
    let select = document.getElementById("select-products");
    select.value = select.options[0].value;
    let result = products.filter((product) =>
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(result);
    setProduct(null);
    search.searchRef = "";
  };

  const handleChange = (e) => {
    let { value, name } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSelectProduct = async (e) => {
    const { value } = e.target;
    const ref = value.split(" ")[0];
    const result = await getOneProduct(ref);
    setProduct(result);
    setSearch({
      ...search,
      searchRef: parseInt(ref),
    });
    setSuggestions([result]);
  };

  const handleSelectFlag = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      position: value,
    });
  };

  const handleSelectClient = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      client: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const movementType = e.target.name;
    if ((productoSeleccionado || props.infoMovement ) && search.amount && search.position) {
      const body = {
        productId: productoSeleccionado ? productoSeleccionado.item.codigo : search.searchRef,
        colaboratorId: colaborator.id,
        cellarId: cellar.id,
        amount: parseInt(search.amount),
        movementType,
        note: search.note,
        positionId: props.infoMovement ? props.infoMovement.position_id : search.position,
        client : props.infoMovement ? props.infoMovement.client : search.client,
        createdAt: new Date(),
      };

      if (movementType === "salida") {
        const { movements } = await getMovements();
        const filMov = movements.filter(
          (elem) =>
            elem.product.id === product.id &&
            elem.position.name === search.position &&
            elem.deleted === false
        );

        const amountEntradas = filMov
          .filter(
            (elem) =>
              elem.movementType === "entrada" &&
              elem.position.name === search.position
          )
          .reduce((a, b) => a + b.amount, 0);
        const amountSalidas = filMov
          .filter(
            (elem) =>
              elem.movementType === "salida" &&
              elem.position.name === search.position
          )
          .reduce((a, b) => a + b.amount, 0);

        if (amountEntradas - amountSalidas >= search.amount) {
          sweal({
            title: "ESTAS SEGURO?",
            text: ` Vas a retirar ${search.amount}${product.um} de ${product.description}`,
            buttons: ["Cancelar", "Si, continuar"],
          }).then(async (deleted) => {
            if (deleted) {
              const { movements } = await getMovements();
              const filMov = movements.filter(
                (elem) =>
                  elem.product.id === product.id &&
                  elem.position.name === search.position &&
                  elem.deleted === false
              );

              const amountEntradas = filMov
                .filter(
                  (elem) =>
                    elem.movementType === "entrada" &&
                    elem.position.name === search.position
                )
                .reduce((a, b) => a + b.amount, 0);
              const amountSalidas = filMov
                .filter(
                  (elem) =>
                    elem.movementType === "salida" &&
                    elem.position.name === search.position
                )
                .reduce((a, b) => a + b.amount, 0);

              if (amountEntradas - amountSalidas >= search.amount) {
                createMovement(body).then(() => {
                  sweal({
                    text: "Se ha registrado la salida exitosamente!",
                    icon: "success",
                  });
                });
                cleanForm();
                props.getFunctionExistence();
                getMovements();
              } else {
                sweal({
                  title: "¡ATENCIÓN!",
                  text: "No hay la cantidad suficiente para hacer el movimiento",
                  icon: "warning",
                  button: "Cerrar",
                  dangerMode: true,
                  timer: 3000,
                });
                props.getFunctionExistence();
              }
            }
          });
        } else {
          sweal({
            title: "¡ATENCION!",
            text: "No hay la cantidad suficiente para hacer el movimiento",
            icon: "warning",
            button: "Cerrar",
            dangerMode: true,
            timer: 3000,
          });
          props.getFunctionExistence();
        }
      } else {
        sweal({
          title: "ESTAS SEGURO?",
          text: `Vas a **AGREGAR** ${search.amount}${productoSeleccionado?.item.um} de ${productoSeleccionado?.item.descripcion} - ${search.position}`,
          confirmButtonText: "Aceptar",
          buttons: ["Cancelar", "Si, continuar"],
          dangerMode: true,
          html: true,
        }).then((deleted) => {
          if (deleted) {
            createMovement(body).then((res) => {
              sweal({
                text: "Se ha registrado la entrada exitosamente!",
                icon: "success",
              });
            })
            .catch(()=>{
              sweal({
                text: "Hubo un error al momento de hacer el registro, vuelve a intentarlo. si el problema persiste comunícate con el área de sistemas para darte una oportuna y rápida solución.",
                icon: "error",
              });
            })
            getMovements();
            cleanForm();
          }
        });
      }
    } else {
      sweal({
        title: "ATENCION",
        text: "Te hace falta llenar algunos campos",
        icon: "warning",
        button: "cerrar",
        dangerMode: true,
        timer: 3000,
      });
    }
  };

  const handlerChangeSuggestions = (e) => {
    const { value } = e.target;
    setProductoSeleccionado(null);
    if (value !== "") {
      const filter = products.filter((elem) =>
        elem.item.descripcion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filter);
    } else {
      setSuggestions(products);
    }
    ref.current.selectedIndex = 0;
    setSearch({
      ...search,
      idProducto: "",
      description: value,
    });
  };

  return (
    <form className="d-flex flex-column gap-2 w-100" style={{ fontSize: 13 }}>
      <div className="d-flex align-items-start card bg-light p-4">
        <p className="m-0">
          <strong>DATOS DEL PRODUCTO</strong>
        </p>
        <div className="row row-cols-sm-1 row-cols-sm-2">
          <div className="d-flex flex-column justify-content-start">
            <label>Código de producto</label>
            <input
              id="Referencia"
              name="searchRef"
              type="number"
              className="form-control"
              value={
                productoSeleccionado
                  ? parseInt(productoSeleccionado.item.codigo)
                  : search.searchRef/* props?.infoMovement?.id */
              }              
              onChange={(e) => {
                handleChange(e);
                /* handleFindRef(e); */
                findById(e);
              }}
            />
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>Descripción de producto</label>
            <div className="combobox-container">
              <input
                name="searchDesc"
                type="search"
                autoComplete="off"
                placeholder="Selecciona un producto"
                className={
                  typeForm === "salida"
                    ? "form-control"
                    : "container-input form-control"
                }
                value={
                  productoSeleccionado
                    ? productoSeleccionado?.item.descripcion
                    : /* search.description */props.infoMovement ?
                    props?.infoMovement?.description : search.searchDesc
                }
                /* value={
                  product
                    ? product.description
                    : props.infoMovement
                    ? props.infoMovement.description
                    : search.searchDesc
                } */
                onChange={(e) => {
                  /* handleFindDesc(e);
                  handleChange(e); */
                  findById(e)
                  handlerChangeSuggestions(e)
                }}
                disabled={typeForm === "salida" ? true : false}
              />
              <select
                ref={ref}
                id="select-products"
                className={
                  typeForm === "salida"
                    ? "d-none"
                    : "w-100 h-100 container-select form-select"
                }
                onChange={findById}
              >
                <option id={0} name="product" disabled selected>
                  -- SELECCIONAR UN PRODUCTO --
                </option>
                {suggestions.map((product, index) => (
                  <option id={product.id} name="product">
                    {product.item.codigo + " - " + product.item.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>Posición</label>
            <div className="combobox-container">
              <select
                id="select-positions"
                ref={selectPositionRef}
                className="w-100 h-100 container-select form-select"
                onChange={handleSelectFlag}
                /* value={
                  search.position
                    ? search.position
                    : props.infoMovement
                    ? props.infoMovement.position_id
                    : null
                } */
                value={props.infoMovement ? props?.infoMovement?.position_id : search.client}
                disabled={typeForm === "salida" && true}
              >
                <option id={0} name="position" value='' disabled selected>
                  -- SELECCIONAR POSICIÓN --
                </option>
                {positions?.map((position, index) => (
                  <option
                    id={position.id}
                    value={position.id}
                    name="position"
                  >
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>U.M.</label>
            <input
                type="text"
                /* value={productoSeleccionado?.item.um || ""} */
                value={productoSeleccionado ? productoSeleccionado?.item?.um : props.infoMovement ? props?.infoMovement?.um : search.amount}
                className="form-control form-control-sm"
                disabled
                required
              />
            {/* <input
              type="text"
              value={
                product
                  ? product["um"]
                  : props.infoMovement
                  ? props.infoMovement.um
                  : ""
              }
              className="form-control"
              disabled
            /> */}
          </div>
          {/* <div className="d-flex flex-column justify-content-start w-100">
            <label>Fecha de vencimiento</label>
            <input
              name="dueDate"
              type="date"
              value={
                props.infoMovement ? props.infoMovement.dueDate : search.dueDate
              }
              className="form-control"
              disabled={typeForm === "salida" ? true : false}
              onChange={handleChange}
            />
          </div> */}
          <div className="d-flex flex-column justify-content-start">
            <label>Cantidad</label>
            <input
              name="amount"
              type="number"
              value={search.amount}
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>Cliente</label>
            <div className="combobox-container">
              <select
                id="select-positions"
                ref={selectClientRef}
                className="w-100 h-100 container-select form-select"
                onChange={handleSelectClient}
                /* value={
                  search.position
                    ? search.position
                    : props.infoMovement
                    ? props.infoMovement.position
                    : null
                } */
                value={props.infoMovement ? props?.infoMovement?.client : search.client}
                disabled={typeForm === "salida" && true}
              >
                <option id={0} name="position" value='' disabled selected>
                  -- SELECCIONAR CLIENTE --
                </option>
                <option value='AGENCIAS' >AGENCIAS</option>
                <option value='ALM EXITO' >ALM ÉXITO</option>
                <option value='ALVARO CUBILLOS' >ALVARO CUBILLOS</option>
                <option value='ARA' >ARA</option>
                <option value='CARIBE' >CARIBE</option>
                <option value='CARVEL' >CARVEL</option>
                <option value='CENCOSUD' >CENCOSUD</option>
                <option value='COMFANDI' >COMFANDI</option>
                <option value='CYV' >CYV</option>
                <option value='LA GRAN COLOMBIA' >LA GRAN COLOMBIA</option>
                <option value='LA MONTAÑA' >LA MONTAÑA</option>
                <option value='LA RECETTA' >LA RECETTA</option>
                <option value='LA SIRENITA' >LA SIRENITA</option>
                <option value='MAKRO' >MAKRO</option>
                <option value='MARTINEZ MARTELO' >MARTINEZ MARTELO</option>
                <option value='MERCA Z' >MERCA Z</option>
                <option value='MERCAMIO' >MERCAMIO</option>
                <option value='MERCAR' >MERCAR</option>
                <option value='MERCAUNIÓN' >MERCAUNIÓN</option>
                <option value='OLIMPICA' >OLIMPICA</option>
                <option value='PERLAMAR' >PERLAMAR</option>
                <option value='PRICESMART' >PRICESMART</option>
                <option value='SODEXO' >SODEXO</option>
                <option value='SU PAPÁ' >SU PAPÁ</option>
                <option value='SURTIFAMILIAR' >SURTIFAMILIAR</option>
                <option value='SURTIPLAZA' >SURTIPLAZA</option>
                <option value='VILLAMARIA' >VILLAMARIA</option>
              </select>
            </div>
          </div>
          <div className="input-group mt-2">
            <span class="input-group-text">Nota</span>
            <textarea
              name="note"
              class="form-control"
              aria-label="With textarea"
              value={search.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-evenly">
        <button
          name={typeForm}
          className={
            typeForm === "entrada"
              ? "btn btn-success w-100"
              : "btn btn-danger text-light w-100"
          }
          //style={typeForm === "salida" ? { background: "#FE7F29"} : null}
          onClick={handleClick}
        >
          REGISTRAR {typeForm.toUpperCase()}
        </button>
      </div>
      {/* {JSON.stringify(props.infoMovement)}
      {JSON.stringify(productoSeleccionado)} */}
      {JSON.stringify(move)}
    </form>
  );
}

export default MovementForm;
