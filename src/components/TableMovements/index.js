import { useContext } from "react";
import sweal from "sweetalert";
import Swal from "sweetalert2"
import Context from "../../context/userContext";
import { updateMovement } from "../../services/movementService";
import { config } from "../../config";
import LogoEliminar from "../../assets/eliminar.png";
import "./styles.css";

function TableMovements({ filterMovements, option }) {
  const { colaborator } = useContext(Context);

  const getTotalAmount = (productId, movement, movementType) => {
    return filterMovements
      .filter(
        (item) =>
          item.product.id === parseInt(productId) &&
          !item.deleted &&
          item.movementType === movementType &&
          item.flag === movement.flag &&
          item.dueDate === movement.dueDate
      )
      .reduce((total, item) => total + item.amount, 0);
  };

  const handleClick = (e) => {
    const { id } = e.target;
    const [movementId, productId] = id.split("-");

    const movement = filterMovements.find(
      (item) => item.id === parseInt(movementId)
    );

    if (movement.movementType === "entrada") {
      const totalEntradas = getTotalAmount(productId, movement, "entrada");
      const totalSalidas = getTotalAmount(productId, movement, "salida");

      if (totalEntradas - movement.amount < totalSalidas) {
        return sweal({
          title: "¡UPSS!",
          text: "Ya hay movimientos de salida de este producto que superan la cantidad e impiden eliminar este registro",
          icon: "error",
          timer: 5000,
        });
      }
    }
    Swal.fire({
      text: "Ingrese la contraseña",
      input: 'password',
      confirmButtonText: "Continuar"
    })
    .then(({value}) => {
      if(value !== config.deletedPassword) {
        return sweal({
          text: "Contrasena Incorrecta",
          icon: "error",
          button: "OK",
          timer: 2000,
          dangerMode: true
        });
      }
      sweal({
        title: "¡CUIDADO!",
        text: "ESTÁ SEGURO QUE DESEA ELIMINAR ESTE MOVIMIENTO?",
        icon: "warning",
        content: {
          element: "input",
          attributes: {
            placeholder:
              "Ingrese aquí la razon para eliminar el movimiento (OBLIGATORIO)",
          },
        },
        buttons: ["Cancelar", "Si, eliminar"],
        dangerMode: true,
      }).then((comment) => {
        if (comment) {
          const changes = {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: colaborator.nombre,
            removalReason: comment,
          };
          updateMovement(movementId, changes).then((res) => {
            sweal({
              text: "¡El movimiento se ha eliminado exitosamente!",
              icon: "success",
              timer: 3000,
            });
          });
          sweal.close();
          window.history.back();
        } else {
          sweal({
            title: "CAMPOS REQUERIDOS",
            text: "La razón de la eliminación es obligatoria",
            icon: "warning",
            timer: 3000,
          });
        }
      });
    })
  };

  return (
    <table
      className="table p-0 mb-0 table-secondary table-striped align-middle border-danger"
      style={{ border: "0px 0px 0px 0px", borderColor: "#FE7F29" }}
    >
      <thead>
        <tr className="table-body">
          <th>Ref.</th>
          <th>Descripcion</th>
          <th>U.M</th>
          <th>Cantidad</th>
          <th>Colaborador</th>
          <th>Posición</th>
          <th>Cliente</th>
          <th>Creacion</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(filterMovements).length > 0
          ? filterMovements
              .filter((elem) => elem.movementType === option && !elem.deleted)
              .map((elem, index) => (
                <tr key={index}>
                  <td>{elem.product?.id}</td>
                  <td>{elem.product?.description}</td>
                  <td>{elem.product?.um}</td>
                  <td>{elem?.amount}</td>
                  <td>{elem.colaborator?.nombre}</td>
                  <td style={{ whiteSpace:'nowrap'}}>{elem?.position.name}</td>
                  <td>{elem?.client}</td>
                  <td>{new Date(elem?.createdAt).toLocaleString("en-US")}</td>
                  <td className="fs-6">
                    <button
                      id={`${elem.id}-${elem?.product.id}`}
                      className="btn btn-danger btn-options"
                      onClick={handleClick}
                    >
                      <img
                        id={`${elem.id}-${elem?.product.id}`}
                        src={LogoEliminar}
                        className="img-options"
                        alt="eliminar"
                      />
                    </button>
                  </td>
                </tr>
              ))
          : null}
      </tbody>
    </table>
  );
}

export default TableMovements;
