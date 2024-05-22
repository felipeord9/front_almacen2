import ReactHTMLTableToExcel from "react-html-table-to-excel-3";
import LogoExcel from "../../assets/logo-xls.png"

function ButtonDownload({ table, sheet, fileName }) {
 return (
    <div className="d-flex align-items-end justify-content-center">
          <ReactHTMLTableToExcel
            id="movements-xls-button"
            className="d-flex flex-row align-items-center btn btn-success mt-3"
            table={table}
            filename={fileName}
            filetype="xls"
            sheet={sheet}
            format="xls"
          >
            <img src={LogoExcel} className="img-download" alt="" />
            <strong>Descargar</strong>
          </ReactHTMLTableToExcel>
        </div>
 )
}

export default ButtonDownload