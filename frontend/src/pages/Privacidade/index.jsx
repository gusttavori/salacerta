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
        <p>A sua privacidade é de extrema importância para nós. Esta política descreve como o <strong>Sala Certa</strong>, desenvolvido e mantido pela FLXCHE, coleta, usa, protege e trata as informações dos usuários em nossa plataforma.</p>

        <section>
          <h2>1. Coleta e Uso de Informações</h2>
          <p>O Sala Certa atua como uma plataforma de auxílio à localização indoor no ambiente universitário. Para utilizar os recursos básicos de roteamento e visualização de mapas, não exigimos a criação de contas ou o fornecimento de dados pessoais identificáveis (como nome, CPF ou endereço).</p>
          <p>Coletamos automaticamente apenas dados técnicos e anônimos (como tipo de dispositivo, navegador, sistema operacional e páginas visitadas) com a finalidade exclusiva de melhorar a usabilidade (UX/UI), aprimorar o desempenho do aplicativo e analisar estatísticas de tráfego.</p>
        </section>

        <section>
          <h2>2. Cookies e Tecnologias de Rastreamento</h2>
          <p>Utilizamos "cookies" (pequenos arquivos de texto salvos no seu dispositivo) para armazenar suas preferências, otimizar sua experiência de navegação e fornecer conteúdos publicitários relevantes. Você é livre para recusar nossos cookies ajustando as configurações do seu navegador, embora isso possa afetar o funcionamento de alguns recursos do site.</p>
        </section>

        <section>
          <h2>3. Google AdSense e Publicidade de Terceiros</h2>
          <p>Nosso site utiliza o <strong>Google AdSense</strong> (ID do editor: pub-3191999436048820) para veicular anúncios, o que ajuda a manter a plataforma gratuita. O Google e seus parceiros usam cookies para exibir anúncios baseados nas suas visitas anteriores a este ou a outros sites na internet.</p>
          <ul>
            <li><strong>O Cookie DART:</strong> O Google, como fornecedor de terceiros, utiliza o cookie DART para veicular anúncios aos nossos usuários com base nas visitas feitas ao Sala Certa e a outros sites na Internet.</li>
            <li><strong>Como desativar:</strong> Os usuários podem optar por desativar a publicidade personalizada e o uso do cookie DART acessando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Configurações de anúncios do Google</a>. Alternativamente, você pode acessar o site <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a> para desativar o uso de cookies de publicidade personalizada de terceiros.</li>
          </ul>
        </section>

        <section>
          <h2>4. Links para Sites Externos</h2>
          <p>Nosso aplicativo pode conter links para sites externos (incluindo anúncios) que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e as práticas de sites de terceiros e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
        </section>

        <section>
          <h2>5. Segurança dos Dados</h2>
          <p>Empregamos práticas e medidas de segurança padrão da indústria para proteger as informações técnicas e anônimas coletadas contra acesso não autorizado, alteração, divulgação ou destruição.</p>
        </section>

        <section>
          <h2>6. Consentimento e Alterações</h2>
          <p>O uso contínuo do nosso aplicativo será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. O Sala Certa reserva-se o direito de atualizar esta política de privacidade periodicamente. Recomendamos que os usuários revisem esta página com frequência para se manterem informados sobre como estamos protegendo suas informações.</p>
        </section>

        <section>
          <h2>7. Contato</h2>
          <p>Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, sinta-se à vontade para entrar em contato conosco através do e-mail: <strong>flxchecompany@gmail.com</strong>.</p>
          <p><em>Esta política é efetiva a partir de março de 2026.</em></p>
        </section>
      </main>
    </div>
  );
}