import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User } from 'lucide-react'; 
import styles from './Rota.module.css';

const DESTINO_ID = 'sala101'; 
import logoSalaCerta from '../../assets/sc1.png';
import logoFlxche from '../../assets/flxche.png';

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?q=80&w=1000&auto=format&fit=crop"; 

const ROTA_PASSOS = [
  { id: 1, foto: PLACEHOLDER_IMG, instrucao: "Siga à esquerda, subindo em direção ao módulo." },
  { id: 2, foto: PLACEHOLDER_IMG, instrucao: "Passe pela catraca e vire à direita no corredor." },
  { id: 3, foto: PLACEHOLDER_IMG, instrucao: "Sua sala é a terceira porta à esquerda: Sala 101." }
];

export function Rota() {
  const navigate = useNavigate();
  
  const [passoAtual, setPassoAtual] = useState(0);
  const [showChegouAlert, setShowChegouAlert] = useState(false);
  const [showSalvarAlert, setShowSalvarAlert] = useState(false);

  const isAuthenticated = localStorage.getItem('usuario_logado') === 'true'; 

  const totalPassos = ROTA_PASSOS.length;
  const isUltimoPasso = passoAtual === totalPassos - 1;

  useEffect(() => {
    let timer;
    if (isUltimoPasso) {
      timer = setTimeout(() => {
        setShowChegouAlert(true);
      }, 10000); 
    }
  
    return () => clearTimeout(timer);
  }, [isUltimoPasso]);
  
  function handleChegouSim() {
    setShowChegouAlert(false);

    if (isAuthenticated) {
      alert(`Destino (${DESTINO_ID}) salvo com sucesso nos favoritos!`); 
      navigate('/favoritos');
    } else {
      setShowSalvarAlert(true);
    }
  }

  function handleChegouNao() {
    setShowChegouAlert(false);
    navigate('/busca', { state: { keepSelection: true, destinationId: DESTINO_ID } });
  }

  function handleSalvarSim() {
    setShowSalvarAlert(false);
    navigate('/cadastro');
  }

  function handleSalvarNao() {
    setShowSalvarAlert(false);
  }

  function handleProximo() {
    if (passoAtual < totalPassos - 1) {
      setPassoAtual(passoAtual + 1);
    }
  }

  function handleAnterior() {
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1);
      setShowChegouAlert(false);
    }
  }

  function handleVoltar() {
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      
      {showChegouAlert && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitulo}>Você chegou até sua sala ({ROTA_PASSOS[totalPassos-1].instrucao.split(': ')[1]})?</h2>
            <div className={styles.modalBotoes}>
              <button className={`${styles.btnModal} ${styles.btnAmarelo}`} onClick={handleChegouSim}>
                Sim
              </button>
              <button className={`${styles.btnModal} ${styles.btnPreto}`} onClick={handleChegouNao}>
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {showSalvarAlert && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitulo}>Deseja salvar esta sala como favorita?</h2>
            
            <div className={styles.modalBotoes}>
              <button className={`${styles.btnModal} ${styles.btnAmarelo}`} onClick={handleSalvarSim}>
                Sim
              </button>
              <button className={`${styles.btnModal} ${styles.btnPreto}`} onClick={handleSalvarNao}>
                Não
              </button>
            </div>

            <p className={styles.modalSubtitulo}>
              Ao salvar como favorito, você pode acessar o trajeto novamente pelo seu perfil.
            </p>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <button className={styles.btnVoltar} onClick={handleVoltar} aria-label="Voltar para a tela anterior">
          <ChevronLeft size={24} />
          Voltar
        </button>
        
        <img src={logoSalaCerta} alt="Logo Sala Certa" className={styles.headerLogo} />
        
        <button 
          onClick={() => navigate('/favoritos')}
          className={styles.btnPerfil}
          aria-label="Ir para Favoritos"
        >
          <User size={24} />
        </button>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.imageWrapper}>
          <img 
            src={ROTA_PASSOS[passoAtual].foto}
            alt={`Passo ${passoAtual + 1}: ${ROTA_PASSOS[passoAtual].instrucao}`} 
            className={styles.imagemPasso} 
          />

          {passoAtual > 0 && (
            <button className={`${styles.btnNav} ${styles.btnAnterior}`} onClick={handleAnterior} aria-label="Passo anterior">
              <ChevronLeft size={28} />
            </button>
          )}

          {passoAtual < totalPassos - 1 && (
            <button className={`${styles.btnNav} ${styles.btnProximo}`} onClick={handleProximo} aria-label="Próximo passo">
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        <div className={styles.instrucaoBox}>
          <p className={styles.instrucaoTexto}>
            {ROTA_PASSOS[passoAtual].instrucao}
          </p>
        </div>
      </div>

      <div className={styles.paginacao}>
        {ROTA_PASSOS.map((_, index) => (
          <div 
            key={index}
            className={`${styles.dot} ${index === passoAtual ? styles.active : ''}`}
            role="status"
            aria-current={index === passoAtual ? 'step' : undefined}
          />
        ))}
      </div>

      <img src={logoFlxche} alt="Flxche" className={styles.footerLogo} />
    </div>
  );
}