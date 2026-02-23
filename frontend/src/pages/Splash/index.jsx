import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Splash.module.css";

// 1. Importação atualizada (renomeei a variável para fazer sentido semanticamente)
import videoSalaCerta from "../../assets/SalaCerta.mp4";
import logoFlxche from "../../assets/flxche.png";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/busca");
    }, 8000); // 8 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.logoContainer}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <video
          src={videoSalaCerta}
          className={styles.logo}
          autoPlay
          muted
          playsInline
          loop
        />
      </motion.div>

      <motion.div
        className={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <img
          src={logoFlxche}
          alt="Produzido por Flxche"
          className={styles.logoFlxche}
        />
      </motion.div>
    </div>
  );
}
