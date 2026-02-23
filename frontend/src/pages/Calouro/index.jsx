import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Calouro.module.css";

// Importe as logos
import logoSalaCerta from "../../assets/sc.png";
import logoFlxche from "../../assets/flxche.png";

export function Calouro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  function handleEntrar(e) {
    e.preventDefault();
    if (nome.trim()) {
      localStorage.setItem("usuario_nome", nome);
      navigate("/busca");
    }
  }

  return (
    <div className={styles.container}>
      <img
        src={logoSalaCerta}
        alt="Logo Sala Certa"
        className={styles.headerLogo}
      />

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Calouro?</h1>
          <p className={styles.subtitulo}>Descubra onde será sua aula.</p>

          <form className={styles.form} onSubmit={handleEntrar}>
            <input
              type="text"
              placeholder="Nome Completo"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <button type="submit" className={styles.btnEntrar}>
              Entrar
            </button>
          </form>
        </div>

        {/* <div className={styles.areaCadastro}>
          <span className={styles.textoCadastro}>
            Deseja salvar suas salas?
          </span>
          <span
            className={styles.linkCadastro}
            onClick={() => navigate("/cadastro")}
          >
            Cadastre-se
          </span>
        </div> */}
      </div>
      <img src={logoFlxche} alt="Flxche" className={styles.footerLogo} />
    </div>
  );
}
