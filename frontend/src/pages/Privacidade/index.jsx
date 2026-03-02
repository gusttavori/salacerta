import styles from "./Privacidade.module.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Privacidade() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={24} /> Voltar
      </button>

      <main className={styles.content}>
        <h1>Política de Privacidade</h1>
        <p>A sua privacidade é importante para nós. É política do <strong>Sala Certa</strong> respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site.</p>

        <section>
          <h2>1. Coleta de Informações</h2>
          <p>O Sala Certa é uma ferramenta de auxílio à localização indoor universitária em Vitória da Conquista. Não solicitamos informações pessoais identificáveis para o funcionamento do mapa.</p>
        </section>

        <section>
          <h2>2. Google AdSense e Cookies</h2>
          <p>Utilizamos o Google AdSense para veicular anúncios. O Google utiliza cookies para exibir anúncios baseados em suas visitas anteriores. O ID do editor associado a este site é: <strong>pub-3191999436048820</strong>.</p>
          <p>Você pode optar por desativar a publicidade personalizada visitando as Configurações de anúncios do Google.</p>
        </section>

        <section>
          <h2>3. Segurança</h2>
          <p>Empregamos medidas de segurança para proteger os dados técnicos coletados anônimamente para fins de melhoria de UX/UI.</p>
        </section>
      </main>
    </div>
  );
}