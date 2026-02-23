import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Buscando sua rota...</p>
    </div>
  );
};

export default Loading;
