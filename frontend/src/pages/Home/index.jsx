import { useState, useMemo } from "react";
import {
  ChevronDown,
  Check,
  AlertCircle,
  MapPin,
  Footprints,
  Building2 
} from "lucide-react";
import styles from "./Home.module.css";

import logoSalaCerta from "../../assets/sc.png";
import logoFlxche from "../../assets/flxche.png";

import { useFaculdades } from "../../hooks/useFaculdades";
import { useReferencePoints } from "../../hooks/useReferencePoints";
import { useRoute } from "../../hooks/useRoute";
import { RouteViewer } from "../../components/location/RouteViewer";

export function Home() {
  const [faculdadeSel, setFaculdadeSel] = useState(null);
  const [origemSel, setOrigemSel] = useState(null);
  const [destinoSel, setDestinoSel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { faculdadesList, loading: loadingFaculdades } = useFaculdades();
  const { origens, destinos, loading: loadingPoints, error: pointsError } = useReferencePoints();
  const { route, stepsRoute, loading: loadingRoute, error: routeError, fetchRoute, clearRoute } = useRoute();

  const origensUnicas = Array.from(
    new Map(origens.filter(p => p.name).map(p => [p.name.trim().toLowerCase(), p.name.trim()])).values()
  );
  const destinosUnicos = Array.from(
    new Map(destinos.filter(p => p.name).map(p => [p.name.trim().toLowerCase(), p.name.trim()])).values()
  );

  // --- MÁGICA UX/UI: AGRUPAMENTO DINÂMICO DE SALAS ---
  // Essa função lê o nome do destino e o encaixa em uma categoria visual
  const destinosAgrupados = useMemo(() => {
    const grupos = {
      "Salas de Aula": [],
      "Laboratórios": [],
      "Administrativo": [],
      "Outros Locais": []
    };

    destinosUnicos.forEach(nome => {
      const nomeLower = nome.toLowerCase();
      if (nomeLower.includes("sala")) {
        grupos["Salas de Aula"].push(nome);
      } else if (nomeLower.includes("lab") || nomeLower.includes("informática")) {
        grupos["Laboratórios"].push(nome);
      } else if (nomeLower.includes("coordenação") || nomeLower.includes("diretoria") || nomeLower.includes("secretaria") || nomeLower.includes("atendimento")) {
        grupos["Administrativo"].push(nome);
      } else {
        grupos["Outros Locais"].push(nome);
      }
    });

    // Remove categorias que ficaram vazias para não sujar a tela
    return Object.entries(grupos).filter(([_, itens]) => itens.length > 0);
  }, [destinosUnicos]);

  function toggleDropdown(nome) {
    setActiveDropdown((prev) => (prev === nome ? null : nome));
  }

  function handleSelectFaculdade(item) {
    setFaculdadeSel(item);
    setOrigemSel(null);
    setDestinoSel(null);
    setActiveDropdown(null);
    clearRoute();
  }

  function handleSelectOrigem(nome) {
    setOrigemSel(nome);
    setDestinoSel(null);
    setActiveDropdown(null);
    clearRoute();
  }

  function handleSelectDestino(nome) {
    setDestinoSel(nome);
    setActiveDropdown(null);
    clearRoute();
  }

  async function handleLocalizar() {
    if (faculdadeSel && origemSel && destinoSel) {
      fetchRoute(faculdadeSel.id, origemSel, destinoSel);
    }
  }

  const textoBotao = loadingRoute 
    ? "Buscando trajeto..." 
    : (!faculdadeSel || !origemSel || !destinoSel ? "Selecione a rota" : "Localizar Sala");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logoSalaCerta} alt="Logo Sala Certa" className={styles.headerLogo} />
      </div>

      <div className={styles.textos}>
        <p className={styles.saudacao}>Olá!</p>
        <h2 className={styles.pergunta}>Onde deseja ir?</h2>
      </div>

      {pointsError && (
        <div className={styles.errorToast}>
          <AlertCircle size={20} />
          <span>{pointsError}</span>
        </div>
      )}

      <div className={styles.formContainer}>
        
        {/* DROPDOWN FACULDADE */}
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.dropdownTrigger} ${activeDropdown === "faculdade" ? styles.active : ""}`}
            onClick={() => toggleDropdown("faculdade")}
          >
            <div className={styles.triggerContent}>
              <Building2 size={20} color={faculdadeSel ? "#111" : "#666"} />
              <span className={faculdadeSel ? styles.textoSelecionado : styles.textoTrigger}>
                {faculdadeSel ? faculdadeSel.name : (loadingFaculdades ? "Carregando..." : "Selecione sua faculdade")}
              </span>
            </div>
            <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "faculdade" ? styles.rotate : ""}`} />
          </div>

          {activeDropdown === "faculdade" && !loadingFaculdades && (
            <div className={styles.dropdownLista} role="listbox">
              {faculdadesList.map((item) => (
                <div key={item.id} className={styles.dropdownItem} onClick={() => handleSelectFaculdade(item)}>
                  <span>{item.name}</span>
                  {faculdadeSel?.id === item.id && <Check size={18} color="#FFB300" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DROPDOWN ORIGEM */}
        {faculdadeSel != null && (
          <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
            <div
              className={`${styles.dropdownTrigger} ${activeDropdown === "origem" ? styles.active : ""}`}
              onClick={() => toggleDropdown("origem")}
            >
              <div className={styles.triggerContent}>
                <MapPin size={20} color={origemSel ? "#111" : "#666"} />
                <span className={origemSel ? styles.textoSelecionado : styles.textoTrigger}>
                  {origemSel ? origemSel : (loadingPoints ? "Carregando locais..." : "Onde você está?")}
                </span>
              </div>
              <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "origem" ? styles.rotate : ""}`} />
            </div>

            {activeDropdown === "origem" && !loadingPoints && (
              <div className={styles.dropdownLista} role="listbox">
                {origensUnicas.length === 0 && <div className={styles.dropdownItem}>Nenhuma origem cadastrada</div>}
                
                {origensUnicas.map((nome, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={() => handleSelectOrigem(nome)}>
                    <span>{nome}</span>
                    {origemSel === nome && <Check size={18} color="#FFB300" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DROPDOWN DESTINO (AGORA COM CATEGORIAS) */}
        {origemSel != null && (
          <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
            <div
              className={`${styles.dropdownTrigger} ${activeDropdown === "destino" ? styles.active : ""}`}
              onClick={() => toggleDropdown("destino")}
            >
              <div className={styles.triggerContent}>
                <Footprints size={20} color={destinoSel ? "#111" : "#666"} />
                <span className={destinoSel ? styles.textoSelecionado : styles.textoTrigger}>
                  {destinoSel ? destinoSel : "Para onde quer ir?"}
                </span>
              </div>
              <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "destino" ? styles.rotate : ""}`} />
            </div>

            {activeDropdown === "destino" && (
              <div className={styles.dropdownLista} role="listbox">
                {destinosAgrupados.length === 0 && <div className={styles.dropdownItem}>Nenhum destino cadastrado</div>}
                
                {/* Renderização Agrupada */}
                {destinosAgrupados.map(([categoria, salas]) => (
                  <div key={categoria}>
                    <div className={styles.categoryHeader}>{categoria}</div>
                    {salas.map((nome, index) => (
                      <div key={index} className={styles.dropdownItem} onClick={() => handleSelectDestino(nome)}>
                        <span>{nome}</span>
                        {destinoSel === nome && <Check size={18} color="#FFB300" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button 
        className={styles.btnLocalizar} 
        onClick={handleLocalizar}
        disabled={!faculdadeSel || !origemSel || !destinoSel || loadingRoute}
      >
        {textoBotao}
      </button>

      {routeError && (
        <div className={styles.errorBox}>
          <AlertCircle size={20} />
          <span>{routeError}</span>
        </div>
      )}

      {!loadingRoute && !routeError && route && (
        <RouteViewer route={route} stepsRoute={stepsRoute} onClose={clearRoute} />
      )}

      <img src={logoFlxche} alt="Flxche" className={styles.footerLogo} />
    </div>
  );
}