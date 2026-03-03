import { useState, useMemo } from "react";
import {
  ChevronDown,
  Check,
  AlertCircle,
  MapPin,
  Footprints,
  Building2,
  Info,
  Layers
} from "lucide-react";
import styles from "./Home.module.css";

import logoSalaCerta from "../../assets/sc.png";
import logoFlxche from "../../assets/flxche.png";

import { useFaculdades } from "../../hooks/useFaculdades";
import { useReferencePoints } from "../../hooks/useReferencePoints";
import { useRoute } from "../../hooks/useRoute";
import { RouteViewer } from "../../components/location/RouteViewer";
import { Link } from "react-router-dom"; 
import { InstallPrompt } from "../../components/InstallPrompt/InstallPrompt"; 

export function Home() {
  const [faculdadeSel, setFaculdadeSel] = useState(null);
  const [origemSel, setOrigemSel] = useState(null);
  const [moduloSel, setModuloSel] = useState(null);
  const [destinoSel, setDestinoSel] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { faculdadesList, loading: loadingFaculdades } = useFaculdades();
  const { origens, destinos, loading: loadingPoints, error: pointsError } = useReferencePoints();
  const { route, stepsRoute, loading: loadingRoute, error: routeError, fetchRoute, clearRoute } = useRoute();

  const modulosDisponiveis = [
    "Módulo 1",
    "Módulo 2",
    "Módulo 3",
    "Módulo 4",
    "Administrativo",
    "Todos os Locais"
  ];

  const origensUnicas = Array.from(
    new Map(origens.filter(p => p.name).map(p => [p.name.trim().toLowerCase(), p.name.trim()])).values()
  );
  const destinosUnicos = Array.from(
    new Map(destinos.filter(p => p.name).map(p => [p.name.trim().toLowerCase(), p.name.trim()])).values()
  );

  const destinosFiltrados = useMemo(() => {
    if (!moduloSel || moduloSel === "Todos os Locais") return destinosUnicos;

    return destinosUnicos.filter(nome => {
      const n = nome.toLowerCase();
      
      if (moduloSel === "Administrativo") {
        return n.includes("reitoria") || n.includes("coordenaç");
      }
      if (moduloSel === "Módulo 1") {
        return n.includes("morfofuncional") || n.includes("habilidades") || n.includes("práticas cirúrgicas") || n.includes("simulação") || n.includes("labt") || n.includes("labcast") || n.includes("map") || n.match(/\bnap\b/) || (n.includes("anatomia") && !n.includes("veterinári")) || n.includes("peças úmidas") || n.includes("psicopedagógico") || n.includes("banheiro");
      }
      if (moduloSel === "Módulo 2") {
        return n.includes("tutorial") || n.includes("atendimento") || n.includes("metodologia") || (n.includes("biblioteca") && !n.includes("4"));
      }
      if (moduloSel === "Módulo 3") {
        if (n.includes("reitoria")) return false; 
        return n.includes("metodologia") || n.includes("informática 03") || n.includes("informática 3") || n.includes("informática iii") || n.includes("convivência") || n.includes("professores") || n.includes("aula 01") || n.includes("aula 02") || n.includes("aula 03") || n.includes("aula 04") || n.includes("banheiro");
      }
      if (moduloSel === "Módulo 4") {
        const isSalaMod4 = n.match(/\b10[1-9]\b/) || n.match(/\b11[0-8]\b/) || n.match(/\b12[1-9]\b/) || n.match(/\b40[1-9]\b/) || n.match(/\b41[0-3]\b/);
        return isSalaMod4 || n.includes("cantina") || n.includes("informática 01") || n.includes("informática 02") || n.includes("odontológica") || n.includes("odontologia") || n.includes("esterilização") || n.includes("servidor") || n.includes("redes") || n.includes("auditório") || n.includes("anatomofuncional") || n.includes("análises") || n.includes("expurgo") || n.includes("reagentes") || n.includes("tempo integral") || n.includes("civil") || n.includes("quadra") || n.includes("fisiologia") || n.includes("veterinário") || n.includes("química") || n.includes("estéril") || n.includes("biologia") || n.includes("dml") || n.includes("dietéticas") || n.includes("clínica") || (n.includes("biblioteca") && n.includes("4")) || n.includes("recepção") || n.includes("banheiro") || n.includes("multi disciplinar");
      }
      return false;
    });
  }, [destinosUnicos, moduloSel]);

  const destinosAgrupados = useMemo(() => {
    const grupos = {
      "Salas de Aula": [],
      "Laboratórios & Clínicas": [],
      "Administrativo & Apoio": [],
      "Outros Locais": []
    };

    destinosFiltrados.forEach(nome => {
      const nomeLower = nome.toLowerCase();
      
      if (nomeLower.includes("sala") || nomeLower.match(/\b1[0-2]\d\b/) || nomeLower.match(/\b4[0-1]\d\b/)) {
        grupos["Salas de Aula"].push(nome);
      } else if (nomeLower.includes("lab") || nomeLower.includes("informática") || nomeLower.includes("morfofuncional") || nomeLower.includes("habilidades") || nomeLower.includes("simulação") || nomeLower.includes("clínica") || nomeLower.includes("anatomia") || nomeLower.includes("dietéticas") || nomeLower.includes("fisiologia")) {
        grupos["Laboratórios & Clínicas"].push(nome);
      } else if (nomeLower.includes("coordenaç") || nomeLower.includes("diretoria") || nomeLower.includes("secretaria") || nomeLower.includes("atendimento") || nomeLower.includes("reitoria") || nomeLower.includes("recepção") || nomeLower.match(/\bnap\b/) || nomeLower.includes("map") || nomeLower.includes("psicopedagógico")) {
        grupos["Administrativo & Apoio"].push(nome);
      } else {
        grupos["Outros Locais"].push(nome);
      }
    });

    return Object.entries(grupos).filter(([_, itens]) => itens.length > 0);
  }, [destinosFiltrados]);

  function toggleDropdown(nome) {
    setActiveDropdown((prev) => (prev === nome ? null : nome));
  }

  function handleSelectFaculdade(item) {
    setFaculdadeSel(item);
    setOrigemSel(null);
    setModuloSel(null);
    setDestinoSel(null);
    setActiveDropdown(null);
    clearRoute();
  }

  function handleSelectOrigem(nome) {
    setOrigemSel(nome);
    setModuloSel(null);
    setDestinoSel(null);
    setActiveDropdown(null);
    clearRoute();
  }

  function handleSelectModulo(nome) {
    setModuloSel(nome);
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
    : (!faculdadeSel || !origemSel || !moduloSel || !destinoSel ? "Selecione a rota" : "Localizar Sala");

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

        {/* DROPDOWN MÓDULO */}
        {origemSel != null && (
          <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
            <div
              className={`${styles.dropdownTrigger} ${activeDropdown === "modulo" ? styles.active : ""}`}
              onClick={() => toggleDropdown("modulo")}
            >
              <div className={styles.triggerContent}>
                <Layers size={20} color={moduloSel ? "#111" : "#666"} />
                <span className={moduloSel ? styles.textoSelecionado : styles.textoTrigger}>
                  {moduloSel ? moduloSel : "Em qual módulo fica a sala?"}
                </span>
              </div>
              <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "modulo" ? styles.rotate : ""}`} />
            </div>

            {activeDropdown === "modulo" && (
              <div className={styles.dropdownLista} role="listbox">
                {modulosDisponiveis.map((mod, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={() => handleSelectModulo(mod)}>
                    <span>{mod}</span>
                    {moduloSel === mod && <Check size={18} color="#FFB300" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DROPDOWN DESTINO */}
        {moduloSel != null && (
          <div className={`${styles.dropdownContainer} ${styles.fadeIn}`}>
            <div
              className={`${styles.dropdownTrigger} ${activeDropdown === "destino" ? styles.active : ""}`}
              onClick={() => toggleDropdown("destino")}
            >
              <div className={styles.triggerContent}>
                <Footprints size={20} color={destinoSel ? "#111" : "#666"} />
                <span className={destinoSel ? styles.textoSelecionado : styles.textoTrigger}>
                  {destinoSel ? destinoSel : "Selecione a sala..."}
                </span>
              </div>
              <ChevronDown size={20} className={`${styles.chevron} ${activeDropdown === "destino" ? styles.rotate : ""}`} />
            </div>

            {activeDropdown === "destino" && (
              <div className={styles.dropdownLista} role="listbox">
                {destinosAgrupados.length === 0 && <div className={styles.dropdownItem}>Nenhuma sala cadastrada neste módulo</div>}
                
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
        disabled={!faculdadeSel || !origemSel || !moduloSel || !destinoSel || loadingRoute}
      >
        {textoBotao}
      </button>

      <div className={styles.infoBanner}>
        <Info size={24} />
        <div>
          <strong>Não encontrou sua sala? 🚧</strong>
          <p>Ainda estamos mapeando o campus! Novas rotas são adicionadas continuamente ao sistema.</p>
        </div>
      </div>

      {routeError && (
        <div className={styles.errorBox}>
          <AlertCircle size={20} />
          <span>{routeError}</span>
        </div>
      )}

      {!loadingRoute && !routeError && route && (
        <RouteViewer route={route} stepsRoute={stepsRoute} onClose={clearRoute} />
      )}

      <footer className={styles.footerContainer}>
        <img src={logoFlxche} alt="Flxche" className={styles.footerLogo} />
        <Link to="/privacidade" className={styles.footerLink}>Privacidade</Link>
      </footer>
      
      <InstallPrompt />
    </div>
  );
}