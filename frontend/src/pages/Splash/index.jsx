import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Splash.module.css";

import videoSalaCerta from "../../assets/SalaCerta.mp4";
import logoFlxche from "../../assets/flxche.png";

export function Splash() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.8; 
    }

    const timer = setTimeout(() => {
      navigate("/busca");
    }, 4000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.logoContainer}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <video
          ref={videoRef}
          src={videoSalaCerta}
          className={styles.logo}
          autoPlay
          muted
          playsInline
        />
      </motion.div>

      <motion.div
        className={styles.footer}
        // Adicionamos um 'scale: 0.9' inicial
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        // Ela cresce para o tamanho normal
        animate={{ opacity: 1, y: 0, scale: 1 }}
        // Diminuí o delay (de 0.4 para 0.3) para aparecer mais rápido.
        // O ease "backOut" dá um efeito sutil de "pulo" ao terminar.
        transition={{ delay: 0.3, duration: 0.7, ease: "backOut" }}
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