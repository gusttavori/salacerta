import { useNavigate } from "react-router-dom";
import { MapPinned, Search, ArrowLeft } from "lucide-react";
import styles from "./RouteNotFound.module.css";
import logoSalaCerta from "../../assets/sc1.png";

const RouteNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logoSalaCerta} alt="Logo" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <div className={styles.iconWrapper}>
          <MapPinned size={80} className={styles.icon} />
          <div className={styles.iconOverlay}>
            <Search size={30} />
          </div>
        </div>

        <h1 className={styles.title}>Ops! Rota não encontrada</h1>
        <p className={styles.description}>
          Não conseguimos localizar o trajeto para esta sala. Ela pode ter sido
          removida ou o link está incorreto.
        </p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/busca")}
          >
            Tentar nova busca
          </button>

          <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Precisa de ajuda? Procure a secretaria do seu módulo.</p>
      </footer>
    </div>
  );
};

export default RouteNotFound;
