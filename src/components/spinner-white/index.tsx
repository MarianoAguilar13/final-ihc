import Css from "./index.module.css";

export const SpinnerWhite = () => {
  return (
    <div className={Css.spinnerContainer}>
      <h3 className={Css.cargando}>Cargando...</h3>
      <div className={Css.spinner}></div>
    </div>
  );
};
