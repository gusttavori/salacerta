import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Check,
  AlertCircle,
  MapPin,
  Footprints,
  User,
} from "lucide-react";
import styles from "./Home.module.css";

import logoSalaCerta from "../../assets/sc.png";
import logoFlxche from "../../assets/flxche.png";
import { itemRepository } from "../../Repositories/steps";

const MOCK_FACULDADES = [
  { id: "unex", nome: "UNEX", temMapa: true },
  { id: "fainor", icon: "alert", nome: "FAINOR", temMapa: false },
];

const MOCK_PONTOS_ORIGEM = [
  { id: "portaria", nome: "Portaria Principal" },
  { id: "biblioteca", nome: "Biblioteca" },
  { id: "estacionamento", nome: "Estacionamento" },
];

const MOCK_PONTOS_DESTINO = [
  { id: "sala101", nome: "Sala 101 - Módulo 1" },
  { id: "lab_info", nome: "Laboratório de Informática" },
  { id: "coord", nome: "Coordenação" },
];

export function Home() {
  const navigate = useNavigate();
  // const location = useLocation();
  const [faculdadeSel, setFaculdadeSel] = useState(null);
  // const [origemSel, setOrigemSel] = useState(null);
  const [destinoSel, setDestinoSel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showToast, setShowToast] = useState(false);
  // const [text, setText] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await itemRepository.listarTodos();
        console.log(dados || []);
      } catch (error) {
        console.error(error);
      }
    }

    carregarDados();
  }, []);

  function toggleDropdown(nome) {
    setActiveDropdown((prev) => (prev === nome ? null : nome));
  }

  function triggerToast() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleSelectFaculdade(item) {
    setFaculdadeSel(item);
    // setOrigemSel(null);
    setDestinoSel(null);
    setActiveDropdown(null);

    if (item.temMapa === false) {
      triggerToast();
    }
  }

  function handleLocalizar() {
    if (faculdadeSel && faculdadeSel.temMapa && destinoSel) {
      console.log(destinoSel);
    } else if (faculdadeSel && !faculdadeSel.temMapa) {
      triggerToast();
    }
  }

  const nomeUsuario = localStorage.getItem("usuario_nome") || "Aluno";
  const textoBotao =
    faculdadeSel && !faculdadeSel.temMapa
      ? "Mapa Indisponível"
      : "Localizar Sala";

  // const isButtonDisabled =
  //   !faculdadeSel || (faculdadeSel.temMapa && (!origemSel || !destinoSel));

  const handleSearch = (event) => {
    setDestinoSel(event.target.value);
  };

  return (
    <div className={styles.container}>
      {showToast && (
        <div className={styles.alertToast}>
          <AlertCircle size={20} color="white" />
          <span>Mapa indisponível no momento.</span>
        </div>
      )}

      <div className={styles.header}>
        <div style={{ width: "24px" }}></div>

        <img
          src={logoSalaCerta}
          alt="Logo Sala Certa"
          className={styles.headerLogo}
        />

        <button
          className={styles.btnPerfil}
          onClick={() => navigate("/favoritos")}
          aria-label="Ir para Favoritos"
        >
          <User size={28} color="#333" />
        </button>
      </div>

      <div className={styles.textos}>
        <p className={styles.saudacao}>Olá, {nomeUsuario}!</p>
        <h2 className={styles.pergunta}>Onde você está?</h2>
      </div>

      <div className={styles.formContainer}>
        {/* DROPDOWN FACULDADE */}
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.dropdownTrigger} ${
              activeDropdown === "faculdade" ? styles.active : ""
            }`}
            onClick={() => toggleDropdown("faculdade")}
            aria-expanded={activeDropdown === "faculdade"}
          >
            <div className={styles.triggerContent}>
              {faculdadeSel ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className={styles.textoSelecionado}>
                    {faculdadeSel.nome}
                  </span>
                  {faculdadeSel.icon === "alert" && (
                    <AlertCircle
                      size={16}
                      color="#d32f2f"
                      aria-label="Alerta: Mapa indisponível"
                    />
                  )}
                </div>
              ) : (
                <span className={styles.textoTrigger}>
                  Selecione sua faculdade
                </span>
              )}
            </div>
            <ChevronDown
              size={20}
              className={`${styles.chevron} ${
                activeDropdown === "faculdade" ? styles.rotate : ""
              }`}
            />
          </div>

          {activeDropdown === "faculdade" && (
            <div className={styles.dropdownLista} role="listbox">
              {MOCK_FACULDADES.map((item) => (
                <div
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelectFaculdade(item)}
                  role="option"
                  aria-selected={faculdadeSel?.id === item.id}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {item.nome}
                    {item.icon === "alert" && (
                      <AlertCircle size={16} color="#d32f2f" />
                    )}
                  </div>
                  {faculdadeSel?.id === item.id && (
                    <Check size={16} color="#FFB300" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {faculdadeSel?.temMapa && (
          <>
            <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
              <div
                className={`${styles.dropdownTrigger} ${
                  activeDropdown === "destino" ? styles.active : ""
                }`}
                onClick={() => toggleDropdown("destino")}
                aria-expanded={activeDropdown === "destino"}
              >
                <Footprints size={20} color="#000" />
                <input
                  className={styles.inputDestino}
                  type="text"
                  placeholder="Qual sala você procura?"
                  onChange={(event) => handleSearch(event)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <button className={styles.btnLocalizar} onClick={handleLocalizar}>
        {textoBotao}
      </button>

      <img src={logoFlxche} alt="Flxche" className={styles.footerLogo} />
    </div>
  );
}
