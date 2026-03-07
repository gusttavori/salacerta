import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import styles from "./Institucional.module.css";

export function Contato() {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        <ArrowLeft size={20} /> Voltar para o início
      </Link>

      <div className={styles.content}>
        <h1 className={styles.title}>Fale Conosco</h1>
        
        <p className={styles.text}>
          Tem alguma dúvida, encontrou algum problema em uma de nossas rotas ou quer sugerir o mapeamento de um novo local no campus? Nossa equipe está pronta para te ouvir!
        </p>
        
        <p className={styles.text}>
          O Sala Certa está em constante evolução, e o feedback dos alunos e professores é a nossa principal ferramenta de melhoria.
        </p>

        <div className={styles.contactBox}>
          <Mail size={32} color="#ffb300" style={{ marginBottom: "8px" }} />
          <p className={styles.text} style={{ marginBottom: "0" }}>Envie um e-mail diretamente para nossa equipe:</p>
          <a href="mailto:contato@flxche.com" className={styles.contactEmail}>
            contato@flxche.com
          </a>
        </div>

        <p className={styles.text} style={{ marginTop: "24px", fontSize: "0.9rem", textAlign: "center" }}>
          *Nosso tempo de resposta costuma ser de até 48 horas úteis.
        </p>
      </div>
    </div>
  );
}