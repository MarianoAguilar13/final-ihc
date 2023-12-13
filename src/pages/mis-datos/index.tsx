import React, { useState, useEffect } from "react";
import Css from "./index.module.css";
import { FormEditMisDatos } from "../../components/form-edit-mis-datos";
import { useRouter } from "next/navigation";
import {
  checkNewPasswordsHook,
  editarMisDatosHook,
} from "../../api-hooks/api-hooks-mis-datos";
import { checkTokenValidoHook } from "../../api-hooks/api-hooks-mis-datos";
import { SpinnerWhite } from "../../components/spinner-white";
import { Layout } from "@/components/layout";
import Swal from "sweetalert2";

const MisDatos = () => {
  const [misDatos, setMisDatos] = useState({
    name: "",
    password: "",
    newPassword: "",
    newPasswordRepetido: "",
  });
  const { push } = useRouter();
  const resultCheckNewsPass = checkNewPasswordsHook(misDatos);
  const [isLoading, setIsLoading] = useState(false);

  const [checkToken, setCheckToken] = useState({
    valido: false,
    terminoElChequeo: false,
  });
  const [inicializar, setInicializar] = useState(true);

  const callbackCheckToken = (respuesta: any) => {
    if (respuesta.error) {
      //el checktokenvalid tiene dos atributos, si es valido o no el token
      //y si se termino el cheaque
      setCheckToken({ valido: false, terminoElChequeo: true });
    } else {
      setCheckToken({ valido: true, terminoElChequeo: true });
    }
  };

  //este estado de inicializar lo cree para que solo se ejecute una vez el
  //chequeo del tengo de la api
  useEffect(() => {
    checkTokenValidoHook(callbackCheckToken);
  }, [inicializar]);

  //cada vez que cambia el stado del chequeo se ejecuta
  useEffect(() => {
    //si el chequeo termino entonces entro en el if
    if (checkToken.terminoElChequeo) {
      //si fue valido no hay problema, pero sino fue valido, entonces
      //te notificara que no estas conectado y que vayas al sign-in
      if (checkToken.valido) {
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No esta conectado a alguna cuenta, por favor inicie sesión para acceder a esta opción",
        });
        push("/sign-in");
      }
    }
  }, [checkToken]);

  //este callback se va a ejecutar cuando termine el fetch de
  //la api de editarMisDatos
  const callbackEditarMisDatos = (respuesta: any) => {
    if (respuesta.error) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: respuesta.error,
      });
      push("/mis-datos");
    } else {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: respuesta.aviso,
      });
      push("/");
    }
  };

  //escucha los cambios de mis datos, los cuales ocurren cuando se envian
  //los datos del form
  useEffect(() => {
    if (misDatos.name || misDatos.newPassword) {
      if (resultCheckNewsPass) {
        //el crear cuenta nos permite envia los datos del state userCreateData
        //y con esos datos intenta crear la cuenta, despendiendo lo que devuelva la api
        //es lo que ejecutara el callback
        editarMisDatosHook(
          misDatos.name,
          misDatos.password,
          misDatos.newPassword,
          callbackEditarMisDatos
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Las contraseñas ingresadas no coinciden, por favor ingrese los datos nuevamente",
        });
      }
    }
  }, [misDatos]);

  return (
    <Layout>
      <div className={Css.container}>
        <h3 className={Css.containerTitulo}>Mis Datos</h3>
        <h3 className={Css.containerSubTitulo}>
          Si desea cambiar la contraseña ingrese la nueva contraseña y repítala,
          si solo desea cambiar el nombre, deje vacío nueva contraseña.
        </h3>
        {isLoading && <SpinnerWhite></SpinnerWhite>}
        <FormEditMisDatos
          nameValue={true}
          onEdit={setMisDatos}
          onSetLoading={setIsLoading}
          onIsLoading={isLoading}
          idInputUno="name-input"
          nameInputUno="name"
          typeInputUno="name"
          labelNameUno="NOMBRE (Al menos 4 letras):"
          idInputDos="password-input"
          nameInputDos="password"
          typeInputDos="password"
          labelNameDos="CONTRASEÑA (Al menos 8 caracteres):"
          idInputTres="new-password-input"
          nameInputTres="newPassword"
          typeInputTres="password"
          labelNameTres="NUEVA CONTRASEÑA (Al menos 8 caracteres):"
          idInputCuatro="new-password-repetido-input"
          nameInputCuatro="newPasswordRepetido"
          typeInputCuatro="password"
          labelNameCuatro="REPETIR NUEVA CONTRASEÑA (Al menos 8 caracteres):"
          buttonChildren="Enviar"
        ></FormEditMisDatos>
      </div>
    </Layout>
  );
};

export default MisDatos;
