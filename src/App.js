import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Movimientos from "./pages/Movimientos";
import Existencias from "./pages/Existencias";
import Modules from "./pages/Modules";
import VerProductos from "./pages/VerProductos";
import Inactivity from "./components/Inactivity"
import { UserContextProvider } from "./context/userContext";
import { CellarContextProvider } from "./context/cellarContext";
import "./App.css"

function App() {
  const limitCounter = 90;
  const limitInactive = 15;
  const [counter, setCounter] = useState(0);
  const [inactiveCounter, setInactiveCounter] = useState(limitInactive);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.location.pathname !== "/login") {
        setCounter((prevCount) => prevCount + 1);
      }
      if (counter >= limitCounter) {
        setInactiveCounter((prev) => prev - 1);
      }
      if (inactiveCounter <= 1) {
        window.location.replace("/login");
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [counter, inactiveCounter]);

  const handlerEvent = (e) => {
    if (inactiveCounter >= limitInactive) {
      setCounter(0);
    }
  };

  return (
    <UserContextProvider>
      <CellarContextProvider>
        {counter >= limitCounter && (
          <Inactivity
            inactiveCounter={inactiveCounter}
            setCounter={setCounter}
            setInactiveCounter={setInactiveCounter}
            limitInactive={limitInactive}
          />
        )}
        <Router>
          <div 
            className="container"
            onMouseMove={handlerEvent}
            onClick={handlerEvent}
            onKeyDown={handlerEvent}
            onTouchMove={handlerEvent}
          >
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<PrivateRoute component={Home} />} />
              <Route path="/modulos" element={<PrivateRoute component={Modules} />} />
              <Route
                path="/registro"
                element={<PrivateRoute component={Registro} />}
              />
              <Route
                path="/movimientos"
                element={<PrivateRoute component={Movimientos} />}
              />
              <Route
                path="/existencias"
                element={<PrivateRoute component={Existencias} />}
              />
              {/* <Route
                path="/ver/productos"
                element={<PrivateRoute component={VerProductos} />}
              /> */}
            </Routes>
          </div>
        </Router>
      </CellarContextProvider>
    </UserContextProvider>
  );
}

export default App;
