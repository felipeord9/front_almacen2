import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { config } from "../../config";

function ModalAddProducts({ product, openModal, setOpen, loadData }) {
  const unidadesMedida = ["UND", "MT", "KG", "LB"];
  const [info, setInfo] = useState({
    id: "",
    description: "",
    um: "",
    photo: "",
    conversion: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handlerChange = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const handlerChangePhoto = (e) => {
    const file = e.target.files[0];
    const nameFile = file.name.split(".");
    const extencion = nameFile[nameFile.length - 1];
    const newName = info.id || product.id;
    const full = newName + "." + extencion;
    const modifiedFile = new File([file], full, { type: file.type });

    setInfo({
      ...info,
      photo: full,
    });
    setSelectedFile(modifiedFile);
  };

  const handlerUpload = () => {
    const formData = new FormData();
    formData.append("photo", selectedFile);

    fetch(`${config.apiUrl}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    createProduct({
      ...info,
      id: parseInt(info.id),
    }).then((data) => {
      if (!data) {
        alert("El producto ya existe!");
      } else {
        handlerUpload();
        loadData();
      }
    });
    closeModal();
  };

  const handlerUpdate = (e) => {
    e.preventDefault();
    updateProduct(product.id, {
      ...product,
      photo: info.photo,
    }).then((data) => {
      handlerUpload();
      loadData();
    });
    closeModal();
  };

  const closeModal = () => {
    setOpen(!openModal);
    setInfo({
      id: "",
      description: "",
      um: "",
      photo: "",
      conversion: 1,
    });
  };

  return (
    <Modal show={openModal} onHide={closeModal} centered>
      <Modal.Header className="bg-primary text-light">
        <Modal.Title className="fs-5">
          {product ? "Actualizar" : "Crear Nuevo"} Producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          encType="multipart/form-data"
          onSubmit={product ? handlerUpdate : handlerSubmit}
        >
          <div className="d-flex flex-column">
            <label>Referencia</label>
            <input
              id="id"
              type="number"
              value={product ? product.id : info.id}
              className="form-control form-control-sm"
              min={1000}
              max={9999}
              onChange={handlerChange}
              required
              disabled={product ? true : false}
            />
          </div>
          <div className="d-flex flex-column">
            <label>Descripción</label>
            <input
              type="text"
              value={product ? product.description : info.description}
              className="form-control form-control-sm"
              onChange={(e) =>
                setInfo({
                  ...info,
                  description: e.target.value.toUpperCase(),
                })
              }
              required
              disabled={product ? true : false}
            />
          </div>
          <div className="d-flex flex-column">
            <label>U.M</label>
            <select
              id="um"
              className="form-select form-select-sm"
              value={product ? product.um : info.um}
              onChange={handlerChange}
              required
              disabled={product ? true : false}
            >
              <option value="" selected disabled>
                -- Seleccionar unidad de medida --
              </option>
              {unidadesMedida.map((elem) => (
                <option>{elem}</option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column">
            <label>Foto</label>
            <input
              type="file"
              accept=".jpg"
              className="form-control form-control-sm"
              onChange={handlerChangePhoto}
              required
              disabled={
                info.id.toString().length === 4 ||
                product?.id.toString().length === 4
                  ? false
                  : true
              }
            />
          </div>
          <hr />
          <div className="d-flex flex-row justify-content-end gap-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalAddProducts;
