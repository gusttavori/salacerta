import { useState, useRef } from "react";
import { Search, Plus, X, Trash2, Edit2, UploadCloud, ChevronRight, ImagePlus } from "lucide-react";
import styles from "./Admin.module.css";
import { StepsModel } from "../../Repositories/steps";
import { useAdminRoute } from "../../hooks/useAdminRoute";
import { useFaculdades } from "../../hooks/useFaculdades";
import { useReferencePoints } from "../../hooks/useReferencePoints";

interface StepWithId extends StepsModel {
  id: string;
}

// Interface para o carrossel de fotos em lote
interface BatchStep {
  tempId: string;
  file: File;
  previewUrl: string;
  name: string;
  description: string;
  is_origem: boolean;
}

const Admin = () => {
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  const [routeName, setRouteName] = useState("");
  const [faculdadeId, setFaculdadeId] = useState("");
  const [origemNome, setOrigemNome] = useState("");
  const [destinoNome, setDestinoNome] = useState("");

  const [stepsList, setStepsList] = useState<StepWithId[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado do Lote de Fotos (Carrossel)
  const [batchSteps, setBatchSteps] = useState<BatchStep[]>([]);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { faculdadesList } = useFaculdades();
  const { origens, destinos, fetchPoints } = useReferencePoints(); 
  const { 
    isPublishing, 
    searchResults,
    registeredRoutes,
    uploadImage, 
    searchSteps, 
    clearSearch, 
    createNewStep, 
    publishRoute,
    updateRoute,
    deleteRoute,
    getStepsByIds
  } = useAdminRoute();

  const origensUnicas = Array.from(new Set(origens.map(p => p.name))).filter(Boolean) as string[];
  const destinosUnicos = Array.from(new Set(destinos.map(p => p.name))).filter(Boolean) as string[];

  // --- LÓGICA DO LOTE (CARROSSEL) ---
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const newBatch = files.map(file => ({
      tempId: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      name: "",
      description: "",
      is_origem: false
    }));

    setBatchSteps(prev => [...prev, ...newBatch]);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reseta o input
  };

  const updateBatchStep = (tempId: string, field: keyof BatchStep, value: any) => {
    setBatchSteps(prev => prev.map(step => 
      step.tempId === tempId ? { ...step, [field]: value } : step
    ));
  };

  const removeBatchStep = (tempId: string) => {
    setBatchSteps(prev => prev.filter(step => step.tempId !== tempId));
  };

  const handleSaveBatch = async () => {
    // Validação
    const hasEmptyDescription = batchSteps.some(step => !step.description.trim());
    if (hasEmptyDescription) {
      alert("Por favor, preencha a instrução de todas as fotos no carrossel antes de salvar.");
      return;
    }

    setIsUploadingBatch(true);
    try {
      const savedSteps: StepWithId[] = [];

      for (const bStep of batchSteps) {
        const url = await uploadImage(bStep.file);
        if (!url) throw new Error("Erro ao fazer upload de uma das imagens.");

        const newStepData = {
          name: bStep.name,
          description: bStep.description,
          image: url,
          is_origem: bStep.is_origem
        };

        const createdStep = await createNewStep(newStepData);
        savedSteps.push({ ...newStepData, id: createdStep.id });

        // Atualiza os seletores principais se o usuário definiu nomes nos cards
        if (bStep.name && bStep.name.trim() !== "") {
          if (bStep.is_origem) setOrigemNome(bStep.name);
          else setDestinoNome(bStep.name);
        }
      }

      await fetchPoints();
      setStepsList(prev => [...prev, ...savedSteps]);
      setBatchSteps([]); // Limpa o carrossel após salvar
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploadingBatch(false);
    }
  };
  // ----------------------------------

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchSteps(value);
  };

  const handleAddExistingStep = (step: StepWithId) => {
    setStepsList([...stepsList, step]);
    setShowSearch(false);
    setSearchTerm("");
    clearSearch();
  };

  const handleRemoveStep = (indexToRemove: number) => {
    setStepsList(stepsList.filter((_, index) => index !== indexToRemove));
  };

  const handleClearForm = () => {
    if (window.confirm("Deseja realmente limpar tudo? O progresso não salvo será perdido.")) {
      setEditingRouteId(null);
      setRouteName("");
      setFaculdadeId("");
      setOrigemNome("");
      setDestinoNome("");
      setStepsList([]);
      setBatchSteps([]);
    }
  };

  const handleSaveRoute = async () => {
    if (!faculdadeId || !origemNome || !destinoNome) {
      alert("Selecione a Faculdade, a Origem e o Destino para cadastrar a rota corretamente!");
      return;
    }
    if (stepsList.length === 0) {
      alert("Adicione pelo menos uma etapa (foto) à rota antes de publicar.");
      return;
    }

    try {
      const routeStepsIds = stepsList.map(step => step.id);
      
      if (editingRouteId) {
        await updateRoute(editingRouteId, routeName, routeStepsIds, faculdadeId, origemNome, destinoNome);
        alert("Rota atualizada com sucesso!");
      } else {
        await publishRoute(routeName, routeStepsIds, faculdadeId, origemNome, destinoNome);
        alert("Rota publicada com sucesso!");
      }
      
      setEditingRouteId(null);
      setRouteName("");
      setFaculdadeId("");
      setOrigemNome("");
      setDestinoNome("");
      setStepsList([]);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEditRoute = async (route: any) => {
    setEditingRouteId(route.id);
    setRouteName(route.name || "");
    setFaculdadeId(route.faculdade?.toString() || "");
    setOrigemNome(route.origem_id?.toString() || "");
    setDestinoNome(route.destino_id?.toString() || "");

    const stepsData = await getStepsByIds(route.steps || []);
    setStepsList(stepsData);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRoute = async (id: string) => {
    if (window.confirm("Tem certeza que deseja apagar esta rota permanentemente?")) {
      try {
        await deleteRoute(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerTitleContainer}>
        <h1 className={styles.title}>Criação de Rotas</h1>
        <p className={styles.subtitle}>Siga o passo a passo para mapear um novo trajeto no campus.</p>
      </div>

      {editingRouteId && (
        <div className={styles.editingAlert}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit2 size={20} />
            <span>Editando a rota <strong>#{editingRouteId}</strong></span>
          </div>
          <button onClick={handleClearForm} className={styles.btnCancelEdit}>Cancelar Edição</button>
        </div>
      )}

      {/* --- PASSO 1: CONFIGURAÇÃO --- */}
      <section className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.stepNumber}>1</div>
          <h3 className={styles.sectionTitle}>Detalhes do Trajeto</h3>
        </div>
        
        <div className={styles.gridContainer}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Campus / Unidade</label>
            <select className={styles.input} value={faculdadeId} onChange={(e) => setFaculdadeId(e.target.value)}>
              <option value="">Selecione...</option>
              {faculdadesList?.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>De onde sai? (Origem)</label>
            <select className={styles.input} value={origemNome} onChange={(e) => setOrigemNome(e.target.value)}>
              <option value="">Ex: Portaria Principal...</option>
              {origensUnicas.map(nome => <option key={nome} value={nome}>{nome}</option>)}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Para onde vai? (Destino)</label>
            <select className={styles.input} value={destinoNome} onChange={(e) => setDestinoNome(e.target.value)}>
              <option value="">Ex: Sala 402...</option>
              {destinosUnicos.map(nome => <option key={nome} value={nome}>{nome}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
          <label className={styles.label}>Nome opcional para controle interno</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Ex: Rota Noturna Portaria > Bloco B"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
        </div>
      </section>

      {/* --- PASSO 2: ETAPAS / FOTOS --- */}
      <section className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.stepNumber}>2</div>
          <h3 className={styles.sectionTitle}>Mapeamento (Fotos)</h3>
        </div>
        
        <div className={styles.actionButtons}>
          <button className={styles.btnSecondary} onClick={() => setShowSearch(true)}>
            <Search size={18} /> Reutilizar Foto
          </button>
          
          <input 
            type="file" 
            multiple 
            accept="image/*,.heic,.heif" 
            ref={fileInputRef}
            onChange={handleMultipleFilesChange}
            style={{ display: 'none' }}
          />
          <button className={styles.btnPrimary} onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={18} /> Adicionar Fotos (Lote)
          </button>
        </div>

        {/* MODAL DE BUSCA */}
        {showSearch && (
          <div className={styles.searchBox}>
            <div className={styles.searchHeader}>
              <h4>Buscar foto já cadastrada</h4>
              <button onClick={() => { setShowSearch(false); clearSearch(); }} className={styles.btnClose}>
                <X size={20} />
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="Digite 'Corredor', 'Escada', 'Portaria'..."
              value={searchTerm}
              onChange={handleSearchInput}
              autoFocus
            />
            <div className={styles.searchResults}>
              {searchResults.map((step: any) => (
                <div key={step.id} className={styles.searchItem} onClick={() => handleAddExistingStep(step)}>
                  <img src={step.image} alt="" className={styles.miniImg} />
                  <div className={styles.searchItemInfo}>
                    <span className={styles.searchItemTitle}>{step.name || "Sem título de local"}</span>
                    <span className={styles.searchItemDesc}>{step.description}</span>
                  </div>
                  <Plus size={18} color="#FFB300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* O CARROSSEL MÁGICO DE PREENCHIMENTO */}
        {batchSteps.length > 0 && (
          <div className={styles.batchArea}>
            <div className={styles.batchHeader}>
              <h4>Completar {batchSteps.length} nova(s) foto(s)</h4>
              <p>Preencha as instruções de cada foto e clique em salvar para processar todas.</p>
            </div>
            
            <div className={styles.carouselContainer}>
              {batchSteps.map((bStep, index) => (
                <div key={bStep.tempId} className={styles.carouselCard}>
                  <button className={styles.btnRemoveBatch} onClick={() => removeBatchStep(bStep.tempId)}>
                    <X size={16} />
                  </button>
                  <div className={styles.carouselBadge}>{index + 1}</div>
                  
                  <img src={bStep.previewUrl} alt="Preview" className={styles.carouselImg} />
                  
                  <div className={styles.carouselInputs}>
                    <input
                      className={styles.inputSmall}
                      type="text"
                      placeholder="Instrução exata (Obrigatório)*"
                      value={bStep.description}
                      onChange={(e) => updateBatchStep(bStep.tempId, "description", e.target.value)}
                    />
                    <input
                      className={styles.inputSmall}
                      type="text"
                      placeholder="Nome da Sala (Opcional)"
                      value={bStep.name}
                      onChange={(e) => updateBatchStep(bStep.tempId, "name", e.target.value)}
                    />
                    
                    {bStep.name.trim() !== "" && (
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={bStep.is_origem}
                          onChange={(e) => updateBatchStep(bStep.tempId, "is_origem", e.target.checked)}
                        />
                        É a Origem?
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className={styles.btnSaveBatch} 
              onClick={handleSaveBatch}
              disabled={isUploadingBatch}
            >
              {isUploadingBatch ? "Fazendo Upload... Aguarde" : <><UploadCloud size={20} /> Salvar {batchSteps.length} foto(s) na rota</>}
            </button>
          </div>
        )}

        {/* LISTA DE FOTOS JÁ ADICIONADAS */}
        {stepsList.length > 0 && (
          <div className={styles.stepsTimeline}>
            {stepsList.map((step, index) => (
              <div key={`${step.id}-${index}`} className={styles.timelineItem}>
                <div className={styles.timelineConnector}>
                  <div className={styles.timelineDot}>{index + 1}</div>
                  {index < stepsList.length - 1 && <div className={styles.timelineLine}></div>}
                </div>
                
                <div className={styles.timelineCard}>
                  <img src={step.image} alt={`Passo ${index + 1}`} className={styles.timelineImg} />
                  <div className={styles.timelineContent}>
                    {step.name && <span className={styles.timelineName}>{step.name}</span>}
                    <span className={styles.timelineDesc}>{step.description}</span>
                  </div>
                  <button className={styles.btnDeleteStep} onClick={() => handleRemoveStep(index)} title="Remover da rota">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {stepsList.length === 0 && !showSearch && batchSteps.length === 0 && (
          <div className={styles.emptyState}>
            Nenhuma foto adicionada à rota ainda.
          </div>
        )}
      </section>

      {/* BOTÃO FINALIZAR */}
      <div className={styles.publishContainer}>
        <button
          className={styles.btnPublishFinal}
          onClick={handleSaveRoute}
          disabled={stepsList.length === 0 || !faculdadeId || !origemNome || !destinoNome || isPublishing || batchSteps.length > 0}
        >
          {isPublishing ? "PUBLICANDO..." : (editingRouteId ? "SALVAR EDIÇÃO" : "PUBLICAR ROTA COMPLETA")}
        </button>
      </div>

      {/* --- LISTA DE ROTAS CADASTRADAS --- */}
      <section className={styles.cardSection} style={{ marginTop: '40px' }}>
        <h3 className={styles.sectionTitle}>Rotas no Sistema ({registeredRoutes.length})</h3>
        <p className={styles.subtitle} style={{ marginBottom: '24px' }}>Gerencie as rotas que já estão disponíveis para os alunos.</p>
        
        {registeredRoutes.length === 0 && <p style={{ color: '#888' }}>Nenhuma rota encontrada.</p>}

        <div className={styles.routesGrid}>
          {registeredRoutes.map((r: any) => (
            <div key={r.id} className={styles.routeCard}>
              <div className={styles.routeCardInfo}>
                <h4>{r.name || `Rota ${r.id} (Sem Nome)`}</h4>
                <div className={styles.routePath}>
                  <span>{r.origem_id || "Indefinido"}</span>
                  <ChevronRight size={14} color="#aaa" />
                  <span>{r.destino_id || "Indefinido"}</span>
                </div>
              </div>
              <div className={styles.routeCardActions}>
                <button className={styles.btnIconEdit} onClick={() => handleEditRoute(r)} title="Editar"><Edit2 size={18} /></button>
                <button className={styles.btnIconDelete} onClick={() => handleDeleteRoute(r.id)} title="Excluir"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;