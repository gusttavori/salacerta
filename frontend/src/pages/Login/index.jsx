import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../../hooks/useAuth"; 

import logoSalaCerta from "../../assets/sc.png";
import logoFlxche from "../../assets/flxche.png";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const response = await login(codigo);

    if (response.success) {
      navigate("/admin"); 
    } else {
      setError(response.message);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <img src={logoSalaCerta} alt="Logo" className={styles.headerLogo} />

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Acesso Restrito</h1>
          <p className={styles.subtitulo}>Insira o código de acesso para continuar.</p>

          <form className={styles.form} onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Código de Acesso"
              className={styles.input}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              disabled={isLoading}
              style={{ textAlign: "center", letterSpacing: "2px", fontSize: "18px" }}
            />

            {error && (
              <p style={{ color: "#d32f2f", fontSize: "14px", marginTop: "-8px", marginBottom: "8px", textAlign: "center" }}>
                {error}
              </p>
            )}

            <button 
              type="submit" 
              className={styles.btnEntrar}
              disabled={isLoading || !codigo}
              style={{ opacity: (isLoading || !codigo) ? 0.7 : 1, marginTop: "16px" }}
            >
              {isLoading ? "Validando..." : "Acessar Painel"}
            </button>
          </form>
        </div>
      </div>

      <img
        src={logoFlxche}
        alt="Produzido por Flxche"
        className={styles.footerLogo}
      />
    </div>
  );
}