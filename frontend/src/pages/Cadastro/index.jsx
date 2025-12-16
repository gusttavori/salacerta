import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cadastro.module.css';

import logoSalaCerta from '../../assets/sc.png';
import logoFlxche from '../../assets/flxche.png';

import { CustomSelect } from '../../components/CustomSelect';

export function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    curso: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados para envio ao backend:', formData);

    alert('Cadastro realizado com sucesso! Faça login.');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <img
        src={logoSalaCerta}
        alt="Logo Sala Certa"
        className={styles.headerLogo}
      />

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Cadastre-se</h1>
          <p className={styles.subtitulo}>
            Junte-se a nós! É rápido e fácil.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              className={styles.input}
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <CustomSelect
              placeholder="Curso"
              value={formData.curso}
              onChange={(value) =>
                setFormData({ ...formData, curso: value })
              }
              options={[
                { value: 'sistemas', label: 'Sistemas de Informação' },
                { value: 'direito', label: 'Direito' },
                { value: 'medicina', label: 'Medicina' },
                { value: 'engenharia', label: 'Engenharia Civil' },
                { value: 'psicologia', label: 'Psicologia' },
                { value: 'outros', label: 'Outros' }
              ]}
            />

            <input
              type="password"
              name="senha"
              placeholder="Senha"
              className={styles.input}
              value={formData.senha}
              onChange={handleChange}
              required
            />

            <button type="submit" className={styles.btnCadastrar}>
              Cadastrar
            </button>
          </form>

          <p className={styles.loginLinkText}>
            Já possui uma conta?{' '}
            <span
              className={styles.loginLink}
              onClick={() => navigate('/login')}
            >
              Faça login
            </span>
          </p>
        </div>
      </div>

      <img
        src={logoFlxche}
        alt="Logo Flxche"
        className={styles.footerLogo}
      />
    </div>
  );
}
