import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Css from "./index.module.css";
import { useRecoilState } from "recoil";
import {
  userLogin,
  userCreate,
  misDatos,
  checkToken,
  sesionIniciada,
} from "../../atoms/atoms";
import Swal from "sweetalert2";
import { checkTokenValidoHook } from "@/api-hooks/api-hooks-mis-datos";
import { myData } from "@/api-hooks/api-hooks";

function Header() {
  const [userCreateData, setUserCreateData] = useRecoilState(userCreate);
  const [misDatosData, setMisDatosData] = useRecoilState(misDatos);
  const [userLoginState, setUserLoginState] = useRecoilState(userLogin);
  const [checkTokenValid, setCheckTokenValid] = useRecoilState(checkToken);
  const [sesionActual, setSesionActual] = useRecoilState(sesionIniciada);
  const { push } = useRouter();

  const cerrarSesion = () => {
    setMisDatosData({
      name: "",
      password: "",
      newPassword: "",
      newPasswordRepetido: "",
    });
    setUserCreateData({
      mail: "",
      password: "",
      name: "",
      passwordRepetida: "",
    });
    setUserLoginState({ mail: "", password: "" });
    setCheckTokenValid({
      valido: false,
      terminoElChequeo: false,
    });
  };

  const callbackCheckToken = (respuesta: any) => {
    if (respuesta.error) {
      //el checktokenvalid tiene dos atributos, si es valido o no el token
      //y si se termino el cheaque
      setSesionActual({ sesionOn: false, name: "" });
    } else {
      myData((respuesta: any) => {
        if (respuesta) {
          console.log("respuesta de mydata: ", myData);
        }
        setSesionActual({ sesionOn: true, name: respuesta.name });
      });
    }
  };

  //este estado de inicializar lo cree para que solo se ejecute una vez el
  //chequeo del tengo de la api
  useEffect(() => {
    checkTokenValidoHook(callbackCheckToken);
  }, []);

  //este state lo utilizo para saber si aprete el boton para cerrar
  //o abrir la ventana, dependiendo si es true o false
  const [openWindow, setOpenWindow] = useState(false);

  const desplegarVentana = () => {
    setOpenWindow(true);
  };

  const cerrarVentana = () => {
    setOpenWindow(false);
  };

  return (
    <div className={Css.header}>
      <div className={Css.headerVisible}>
        <div className={Css.headerVisibleLogoContainer}>
          <img
            onClick={() => {
              push("/");
            }}
            className={Css.headerVisibleLogoContainerLogo}
            src="https://res.cloudinary.com/druokk1hc/image/upload/v1666023904/huella_iyr42s.png"
            alt="Icono mascotas"
          />
          <a
            //con esta funcion chequeo si existe un token en el localstorage
            // si existe entonces puedo entrar a mis datos y sino voy a signin
            onClick={() => {
              push("/");
            }}
            className={Css.headerLinksLink}
          >
            Inicio
          </a>
        </div>
        <div className={Css.headerLinks}>
          <a
            //con esta funcion chequeo si existe un token en el localstorage
            // si existe entonces puedo entrar a mis datos y sino voy a signin
            onClick={() => {
              if (localStorage.getItem("Token")) {
                push("/mis-datos");
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "No has iniciado sesión, te redirigimos al login",
                });
                push("/sign-in");
              }
            }}
            className={Css.headerLinksLink}
          >
            Mis Datos
          </a>
          <a
            onClick={() => {
              if (localStorage.getItem("Token")) {
                push("/mis-pets-perdidas");
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "No has iniciado sesión, te redirigimos al login",
                });
                push("/sign-in");
              }
            }}
            className={Css.headerLinksLink}
          >
            Mis mascotas perdidas
          </a>
          <a
            onClick={() => {
              if (localStorage.getItem("Token")) {
                push("/cargar-pet-perdida");
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "No has iniciado sesión, te redirigimos al login",
                });
                push("/sign-in");
              }
            }}
            className={Css.headerLinksLink}
          >
            Cargar mascota perdida
          </a>
          {sesionActual.sesionOn ? (
            <a
              onClick={() => {
                localStorage.setItem("Token", "");
                Swal.fire("OK", "Se ha cerrado sesión", "success");
                console.log("este es el token:", localStorage.getItem("Token"));
                cerrarSesion();
                push("/");
                //para reloguear la pag
                window.location.replace("/");
              }}
              className={Css.headerLinksLink}
              style={{ color: "#800040", fontSize: "18px" }}
            >
              {sesionActual.sesionOn ? `Cerrar sesión` : "Cerrar sesión"}
              <p className={Css.nameCuenta}>{sesionActual.name}</p>
            </a>
          ) : (
            <a
              onClick={() => {
                Swal.fire("OK", "Se lo redireccionará al login", "success");
                push("/sign-in");
              }}
              className={Css.headerLinksLink}
              style={{ color: "#006380" }}
            >
              Iniciar sesión
            </a>
          )}
        </div>
        <div className={Css.headerVisibleBotonDesplegarContainer}>
          <button
            onClick={desplegarVentana}
            className={Css.headerVisibleBotonDesplegar}
          >
            <div className={Css.headerVisibleBotonDesplegarBarras}></div>
            <div className={Css.headerVisibleBotonDesplegarBarras}></div>
            <div className={Css.headerVisibleBotonDesplegarBarras}></div>
          </button>
        </div>
      </div>
      <div
        className={Css.ventanaLinks}
        style={{ display: openWindow ? "flex" : "none" }}
      >
        <button onClick={cerrarVentana} className={Css.ventanaLinksBotonCerrar}>
          x
        </button>
        <a
          onClick={() => {
            if (localStorage.getItem("Token")) {
              cerrarVentana();
              push("/mis-datos");
            } else {
              cerrarVentana();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No has iniciado sesión, te redirigimos al login",
              });
              push("/sign-in");
            }
          }}
          className={Css.ventanaLinksLink + " " + Css.linkUno}
        >
          Mis Datos
        </a>
        <a
          onClick={() => {
            if (localStorage.getItem("Token")) {
              cerrarVentana();
              push("/mis-pets-perdidas");
            } else {
              cerrarVentana();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No has iniciado sesión, te redirigimos al login",
              });
              push("/sign-in");
            }
          }}
          className={Css.ventanaLinksLink + " " + Css.linkDos}
        >
          Mis mascotas perdidas
        </a>
        <a
          onClick={() => {
            if (localStorage.getItem("Token")) {
              cerrarVentana();
              push("/cargar-pet-perdida");
            } else {
              cerrarVentana();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No has iniciado sesión, te redirigimos al login",
              });
              push("/sign-in");
            }
          }}
          className={Css.ventanaLinksLink + " " + Css.linkTres}
        >
          Cargar mascota perdida
        </a>
        {sesionActual.sesionOn ? (
          <a
            onClick={() => {
              localStorage.setItem("Token", "");
              Swal.fire("OK", "Se ha cerrado sesión", "success");
              console.log("este es el token:", localStorage.getItem("Token"));
              cerrarSesion();
              push("/");
              //para reloguear la pag
              window.location.replace("/");
            }}
            className={Css.ventanaLinksLink + " " + Css.linkCuatro}
            style={{ color: "#800040" }}
          >
            {sesionActual.sesionOn ? `Cerrar sesión` : "Cerrar sesión"}
            <p>{sesionActual.name}</p>
          </a>
        ) : (
          <a
            onClick={() => {
              Swal.fire("OK", "Se lo redireccionará al login", "success");
              push("/sign-in");
            }}
            className={Css.ventanaLinksLink + " " + Css.linkCuatro}
            style={{ color: "#006380" }}
          >
            Iniciar sesión
          </a>
        )}
      </div>
    </div>
  );
}

export { Header };
