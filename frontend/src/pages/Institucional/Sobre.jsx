import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./Institucional.module.css";

export function Sobre() {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        <ArrowLeft size={20} /> Voltar para o início
      </Link>

      <div className={styles.content}>
        <h1 className={styles.title}>Sobre o Sala Certa</h1>
        
        <p className={styles.text}>
          O Sala Certa nasceu de uma necessidade real: facilitar a locomoção de milhares de estudantes, professores e visitantes dentro do complexo ambiente universitário.
        </p>
        
        <p className={styles.text}>
          Muitas vezes, encontrar um laboratório específico, um auditório ou até mesmo a sala de aula correta no primeiro dia de semestre pode ser um desafio. Nosso objetivo é eliminar essa frustração, oferecendo um sistema de navegação digital rápido, intuitivo e com imagens passo a passo.
        </p>

        <h2 className={styles.subtitle}>Nossa Missão</h2>
        <p className={styles.text}>
          Democratizar a acessibilidade espacial no campus. Acreditamos que a tecnologia deve servir para simplificar a vida acadêmica, permitindo que os alunos foquem no que realmente importa: seus estudos e vivências.
        </p>

        <h2 className={styles.subtitle}>Desenvolvimento</h2>
        <p className={styles.text}>
          Este projeto é orgulhosamente idealizado, desenvolvido e mantido pela <strong>FLXCHE</strong>, uma startup focada em criar soluções tecnológicas modernas e escaláveis.
        </p>
      </div>
    </div>
  );
}