import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import Context from "../../context/userContext";


function PrivateRoute ({ component: Component, ...rest }) {
  const { colaborator } = useContext(Context);
  
  return colaborator ? <Component {...rest} /> : <Navigate to="/login" />
}

export default PrivateRoute;