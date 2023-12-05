import React, { useState, useEffect } from "react";
import { MainButton } from "../../ui/buttons";
import { FormSignIn } from "../../components/form-sign-in";
import { useRecoilState } from "recoil";
import { sesionIniciada } from "../../atoms/atoms";
import Css from "./index.module.css";
import { useRouter } from "next/navigation";
import { iniciarSesionCrearToken } from "../../api-hooks/api-hooks";
import { SpinnerWhite } from "../../components/spinner-white";
import { Layout } from "@/components/layout";
import Swal from "sweetalert2";
import { checkTokenValidoHook } from "@/api-hooks/api-hooks-mis-datos";

const SignIn = () => {
  //este state usa el atom userLogin que tiene los datos para iniciar sesion
  const [userLogin, setUserLogin] = useState({
    mail: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sesionActual, setSesionActual] = useRecoilState(sesionIniciada);
  const { push } = useRouter();

  const callbackSignIn = (respuesta: any) => {
    if (respuesta.error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: respuesta.error,
      });
      setIsLoading(false);
      push("/sign-in");
    } else {
      setIsLoading(false);
      checkTokenValidoHook((respuesta: any) => {
        if (respuesta.error) {
          //el checktokenvalid tiene dos atributos, si es valido o no el token
          //y si se termino el cheaque
          setSesionActual({ sesionOn: false, name: "" });
        } else {
          setSesionActual({ sesionOn: true, name: respuesta.name });
        }
      });
      setSesionActual({ sesionOn: true, name: respuesta.name });
      Swal.fire("OK", "Se ingresó correctamente a tu cuenta", "success");
      push("/");
    }
  };

  //este useEffect escucha los cambios del userLoginState
  //y cuando cambien se va a a ejecutar si existe un mail, la funcion
  //iniciarSesionCrearToken el cual crea un token para ese ususario
  //y de ahora en mas se usara ese token para identificarse
  useEffect(() => {
    if (userLogin.mail) {
      iniciarSesionCrearToken(
        userLogin.mail,
        userLogin.password,
        callbackSignIn
      );
    }
  }, [userLogin]);

  return (
    <Layout>
      <div className={Css.container}>
        <h3 className={Css.containerTitulo}>Inicio de Sesión</h3>
        {isLoading && <SpinnerWhite></SpinnerWhite>}
        <FormSignIn
          onLogin={setUserLogin}
          onSetLoading={setIsLoading}
          onIsLoading={isLoading}
          idInputUno="mail-input"
          nameInputUno="mail"
          typeInputUno="email"
          labelNameUno="E-MAIL"
          idInputDos="password-input"
          nameInputDos="password"
          typeInputDos="password"
          labelNameDos="CONTRASEÑA"
          buttonChildren="Enviar"
        ></FormSignIn>
        <div className={Css.containerOptions}>
          <MainButton
            disabled={isLoading}
            onClick={() => {
              push("/sign-up");
            }}
          >
            Crear una cuenta
          </MainButton>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
