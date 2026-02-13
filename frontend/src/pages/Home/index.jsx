import { useEffect, useState } from "react";
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
import { rotas } from "../../Repositories/rotas";
import { faculdades } from "../../Repositories/faculdades";

const MOCK_FACULDADES = [
  { id: "unex", nome: "UNEX", temMapa: true },
  { id: "fainor", icon: "alert", nome: "FAINOR", temMapa: false },
];

export function Home() {
  // const location = useLocation();
  // const [origemSel, setOrigemSel] = useState(null);
  // const [text, setText] = useState("");
  const navigate = useNavigate();
  const [faculdadeSel, setFaculdadeSel] = useState(null);
  const [destinoSel, setDestinoSel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [universitys, setUniversityes] = useState([]);

  useEffect(() => {
    const getUniversitys = async () => {
      const data = await faculdades.listAll();
      setUniversityes(data);
      setFaculdadeSel({ id: 1, name: "Unex" });
    };
    getUniversitys();
  }, []);

  function toggleDropdown(nome) {
    setActiveDropdown((prev) => (prev === nome ? null : nome));
  }

  function handleSelectFaculdade(item) {
    setFaculdadeSel(item);
    setDestinoSel(null);
    setActiveDropdown(null);
  }

  async function handleLocalizar() {
    if (faculdadeSel != null && destinoSel) {
      navigate(`/results/${destinoSel}`);
    }
  }

  const nomeUsuario = localStorage.getItem("usuario_nome") || "Aluno";
  const textoBotao =
    faculdadeSel == null ? "Mapa Indisponível" : "Localizar Sala";

  const handleSearch = (event) => {
    setDestinoSel(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ width: "24px" }}></div>

        <img
          src={logoSalaCerta}
          alt="Logo Sala Certa"
          className={styles.headerLogo}
        />
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
                    {faculdadeSel.name}
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
              {universitys.map((item) => (
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
                    {item.name}
                  </div>
                  {faculdadeSel?.id === item.id && (
                    <Check size={16} color="#FFB300" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {faculdadeSel != null && (
          <>
            <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
              <div
                className={`${styles.dropdownTrigger}`}
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
