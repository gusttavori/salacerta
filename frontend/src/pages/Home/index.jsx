import { useState } from "react";
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
  
  // Agora guardam apenas o NOME (texto) selecionado
  const [origemSel, setOrigemSel] = useState(null);
  const [destinoSel, setDestinoSel] = useState(null);
  
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { faculdadesList, loading: loadingFaculdades } = useFaculdades();
  const { origens, destinos, loading: loadingPoints, error: pointsError } = useReferencePoints();
  
  const { route, stepsRoute, loading: loadingRoute, error: routeError, fetchRoute, clearRoute } = useRoute();

  // MÁGICA: Filtra os arrays para remover nomes duplicados.
  // Garante que "Portaria" apareça apenas 1x no dropdown para o aluno.
  const origensUnicas = Array.from(new Set(origens.map(p => p.name))).filter(Boolean);
  const destinosUnicos = Array.from(new Set(destinos.map(p => p.name))).filter(Boolean);

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
      // Agora envia o NOME da origem e do destino para a busca
      fetchRoute(faculdadeSel.id, origemSel, destinoSel);
    }
  }

  const textoBotao = loadingRoute 
    ? "Buscando trajeto..." 
    : (!faculdadeSel || !origemSel || !destinoSel ? "Selecione a rota" : "Localizar Sala");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ width: "24px" }}></div>
        <img src={logoSalaCerta} alt="Logo Sala Certa" className={styles.headerLogo} />
      </div>

      <div className={styles.textos}>
        <p className={styles.saudacao}>Olá!</p>
        <h2 className={styles.pergunta}>Onde deseja ir?</h2>
      </div>

      {pointsError && (
        <div style={{ display: "flex", gap: "8px", color: "#d32f2f", marginBottom: "16px", padding: "0 16px" }}>
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
            <div className={styles.triggerContent} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={20} color={faculdadeSel ? "#000" : "#666"} />
              {faculdadeSel ? (
                <span className={styles.textoSelecionado}>{faculdadeSel.name}</span>
              ) : (
                <span className={styles.textoTrigger}>
                  {loadingFaculdades ? "Carregando faculdades..." : "Selecione sua faculdade"}
                </span>
              )}
            </div>
            <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "faculdade" ? styles.rotate : ""}`} />
          </div>

          {activeDropdown === "faculdade" && !loadingFaculdades && (
            <div className={styles.dropdownLista} role="listbox">
              {faculdadesList.map((item) => (
                <div key={item.id} className={styles.dropdownItem} onClick={() => handleSelectFaculdade(item)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{item.name}</div>
                  {faculdadeSel?.id === item.id && <Check size={16} color="#FFB300" />}
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
              <div className={styles.triggerContent} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={20} color={origemSel ? "#000" : "#666"} />
                {origemSel ? (
                  <span className={styles.textoSelecionado}>{origemSel}</span>
                ) : (
                  <span className={styles.textoTrigger}>
                    {loadingPoints ? "Carregando locais..." : "Onde você está?"}
                  </span>
                )}
              </div>
              <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "origem" ? styles.rotate : ""}`} />
            </div>

            {activeDropdown === "origem" && !loadingPoints && (
              <div className={styles.dropdownLista} role="listbox">
                {origensUnicas.length === 0 && <div className={styles.dropdownItem}>Nenhuma origem cadastrada</div>}
                
                {origensUnicas.map((nome, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={() => handleSelectOrigem(nome)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{nome}</div>
                    {origemSel === nome && <Check size={16} color="#FFB300" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DROPDOWN DESTINO */}
        {origemSel != null && (
          <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
            <div
              className={`${styles.dropdownTrigger} ${activeDropdown === "destino" ? styles.active : ""}`}
              onClick={() => toggleDropdown("destino")}
            >
              <div className={styles.triggerContent} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Footprints size={20} color={destinoSel ? "#000" : "#666"} />
                {destinoSel ? (
                  <span className={styles.textoSelecionado}>{destinoSel}</span>
                ) : (
                  <span className={styles.textoTrigger}>Para onde quer ir?</span>
                )}
              </div>
              <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "destino" ? styles.rotate : ""}`} />
            </div>

            {activeDropdown === "destino" && (
              <div className={styles.dropdownLista} role="listbox">
                {destinosUnicos.length === 0 && <div className={styles.dropdownItem}>Nenhum destino cadastrado</div>}
                
                {destinosUnicos.map((nome, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={() => handleSelectDestino(nome)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{nome}</div>
                    {destinoSel === nome && <Check size={16} color="#FFB300" />}
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
        style={{ opacity: (!faculdadeSel || !origemSel || !destinoSel || loadingRoute) ? 0.6 : 1 }}
      >
        {textoBotao}
      </button>

      {routeError && (
        <div style={{ marginTop: '24px', backgroundColor: '#ffebee', color: '#d32f2f', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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