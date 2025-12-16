import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import styles from './Favoritos.module.css';

import logoSalaCerta from '../../assets/sc.png';
import logoFliche from '../../assets/flxche.png';

export function Favoritos() {
  const navigate = useNavigate();

  const [salasFavoritas, setSalasFavoritas] = useState([
    { id: 1, nome: 'Sala 127 | Módulo 1' },
    { id: 2, nome: 'Sala 237 | Módulo 2' },
    { id: 3, nome: 'Sala 127 | Módulo 1' },
    { id: 4, nome: 'Sala 425 | Módulo 4' },
    { id: 5, nome: 'Sala 122 | Módulo 1' },
  ]);

  function handleRemover(id) {
    const novaLista = salasFavoritas.filter(sala => sala.id !== id);
    setSalasFavoritas(novaLista);
  }

  return (
    <div className={styles.container}>
      <img src={logoSalaCerta} alt="Logo" className={styles.headerLogo} />

      <div className={styles.saudacao}>
        <h1 className={styles.titulo}>Olá, Gustavo!</h1>
        <p className={styles.subtitulo}>Reveja suas salas favoritadas!</p>
      </div>

      <div className={styles.lista}>
        {salasFavoritas.length === 0 ? (
          <p style={{textAlign: 'center', color: '#999'}}>Nenhuma sala favorita.</p>
        ) : (
          salasFavoritas.map((sala) => (
            <div key={sala.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <Star size={24} color="#FFB300" fill="#FFB300" />
                <span className={styles.textoSala}>{sala.nome}</span>
              </div>
              
              <button 
                className={styles.btnDelete} 
                onClick={() => handleRemover(sala.id)}
                title="Remover favorito"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.areaBusca}>
        <p className={styles.textoBusca}>Deseja procurar por outra sala?</p>
        <button className={styles.btnEncontre} onClick={() => navigate('/busca')}>
          Encontre aqui
        </button>
      </div>

      <img src={logoFliche} alt="Fliche" className={styles.footerLogo} />
    </div>
  );
}