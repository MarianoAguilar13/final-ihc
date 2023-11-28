const API_BASE_URL = "https://app-mascotas-backend.onrender.com";

export async function checkTokenValidoHook(callback: any) {
  const token = "bearer " + localStorage.getItem("Token");
  const fetchApi = fetch(API_BASE_URL + "/auth/token/check", {
    method: "GET",
    //necesita este header para que funcione
    headers: {
      Authorization: token,
      "content-type": "application/json",
    },
  });

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    callback(resultado);
  } catch (r) {
    callback(r);
  }
}

export const checkNewPasswordsHook = (misDatosData: any) => {
  if (misDatosData.newPassword == misDatosData.newPasswordRepetido) {
    return true;
  } else {
    return false;
  }
};

export async function editarMisDatosHook(
  name: string,
  password: string,
  newPassword: string,
  callback: any
) {
  const token = "bearer " + localStorage.getItem("Token");
  //si existe un email en el state va a hacer el fetch-post
  const fetchApi = fetch(API_BASE_URL + "/me", {
    method: "PATCH",
    headers: {
      Authorization: token,
      "content-type": "application/json",
    },

    body: JSON.stringify({
      name,
      password,
      newPassword,
    }),
  });

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    callback(resultado);
  } catch (r: any) {
    alert(r.error);
  }
}
