import { useState } from "react";
import { Search, Plus, X, Trash2, Edit2 } from "lucide-react";
import styles from "./Admin.module.css";
import { StepsModel } from "../../Repositories/steps";
import { useAdminRoute } from "../../hooks/useAdminRoute";
import { useFaculdades } from "../../hooks/useFaculdades";
import { useReferencePoints } from "../../hooks/useReferencePoints";

interface StepWithId extends StepsModel {
  id: string;
}

const Admin = () => {
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  const [routeName, setRouteName] = useState("");
  const [faculdadeId, setFaculdadeId] = useState("");
  const [origemId, setOrigemId] = useState("");
  const [destinoId, setDestinoId] = useState("");

  const [stepsList, setStepsList] = useState<StepWithId[]>([]);
  const [creatingStep, setCreatingStep] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<StepsModel>({
    name: "",
    description: "",
    image: "",
    is_origem: false,
  });

  const { faculdadesList } = useFaculdades();
  const { origens, destinos, fetchPoints } = useReferencePoints(); 
  const { 
    isUploading, 
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
    }
  };

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

  const handleCreatingStep = async () => {
    if (!formData.description || !formData.image) {
      alert("Preencha a Instrução e coloque a Imagem da etapa!");
      return;
    }

    try {
      const newStep = await createNewStep(formData);
      const newStepComplete: StepWithId = { ...formData, id: newStep.id };

      setStepsList([...stepsList, newStepComplete]);

      if (formData.name && formData.name.trim() !== "") {
        await fetchPoints(); 
        
        if (formData.is_origem) {
          setOrigemId(newStep.id); 
        } else {
          setDestinoId(newStep.id); 
        }
      }

      setFormData({ name: "", description: "", image: "", is_origem: false });
      setCreatingStep(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRemoveStep = (indexToRemove: number) => {
    setStepsList(stepsList.filter((_, index) => index !== indexToRemove));
  };

  const handleClearForm = () => {
    setEditingRouteId(null);
    setRouteName("");
    setFaculdadeId("");
    setOrigemId("");
    setDestinoId("");
    setStepsList([]);
  };

  const handleSaveRoute = async () => {
    if (!faculdadeId || !origemId || !destinoId) {
      alert("Selecione a Faculdade, Origem e Destino para cadastrar a rota corretamente!");
      return;
    }

    try {
      const routeStepsIds = stepsList.map(step => step.id);
      
      if (editingRouteId) {
        await updateRoute(editingRouteId, routeName, routeStepsIds, faculdadeId, origemId, destinoId);
        alert("Rota atualizada com sucesso!");
      } else {
        await publishRoute(routeName, routeStepsIds, faculdadeId, origemId, destinoId);
        alert("Rota publicada com sucesso!");
      }
      
      handleClearForm();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEditRoute = async (route: any) => {
    setEditingRouteId(route.id);
    setRouteName(route.name || "");
    setFaculdadeId(route.faculdade?.toString() || "");
    setOrigemId(route.origem_id?.toString() || "");
    setDestinoId(route.destino_id?.toString() || "");

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

  const getPointName = (id: string, isOrigem: boolean) => {
    if (!id) return "N/A";
    const list = isOrigem ? origens : destinos;
    const pt = list.find(p => p.id?.toString() === id.toString());
    return pt ? pt.name : `ID: ${id}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel do Administrador</h1>

      {editingRouteId && (
        <div style={{ backgroundColor: '#FFB300', color: '#000', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Editando Rota #{editingRouteId}</span>
          <button onClick={handleClearForm} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X Cancelar</button>
        </div>
      )}

      <section className={styles.routeSection} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', color: '#333' }}>1. Configuração da Rota</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label className={styles.label}>Faculdade</label>
            <select className={styles.input} value={faculdadeId} onChange={(e) => setFaculdadeId(e.target.value)}>
              <option value="">Selecione a unidade...</option>
              {faculdadesList?.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
            </select>
          </div>

          <div>
            <label className={styles.label}>Origem (Ponto de Partida)</label>
            <select className={styles.input} value={origemId} onChange={(e) => setOrigemId(e.target.value)}>
              <option value="">Selecione de onde a rota sai...</option>
              {origens?.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
            </select>
          </div>

          <div>
            <label className={styles.label}>Destino (Sala)</label>
            <select className={styles.input} value={destinoId} onChange={(e) => setDestinoId(e.target.value)}>
              <option value="">Selecione para onde a rota vai...</option>
              {destinos?.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
            </select>
          </div>
        </div>

        <label className={styles.label}>Nome Interno da Rota (Opcional)</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Ex: Portaria para Sala 127..."
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />
      </section>

      <section className={styles.stepsSection}>
        <header className={styles.header}>
          <h3>2. Etapas ({stepsList.length})</h3>
          <div className={styles.headerActions}>
            {!creatingStep && !showSearch && (
              <>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={18} /> Buscar Existente
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setCreatingStep(true)}
                >
                  <Plus size={18} /> Nova Etapa
                </button>
              </>
            )}
          </div>
        </header>

        {showSearch && (
          <div className={styles.searchBox}>
            <div className={styles.searchHeader}>
              <h4>Buscar Etapa no Banco</h4>
              <button onClick={() => { setShowSearch(false); clearSearch(); }} className={styles.btnClose}>
                <X size={20} />
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="Busque pelo nome ou instrução..."
              value={searchTerm}
              onChange={handleSearchInput}
              autoFocus
            />
            <div className={styles.searchResults}>
              {searchResults.map((step: any) => (
                <div key={step.id} className={styles.searchItem} onClick={() => handleAddExistingStep(step)}>
                  <img src={step.image} alt="" className={styles.miniImg} />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{step.name}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>{step.description}</span>
                  </div>
                  <Plus size={16} color="#FFB300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {creatingStep && (
          <div className={styles.stepForm}>
            <h4>Nova Etapa</h4>

            <div className={styles.imageUploadSection}>
              <label className={styles.label}>Foto do Local</label>
              <div className={styles.imagePreviewContainerLarge}>
                {isUploading ? (
                  <div className={styles.uploadPlaceholder}>
                    Processando imagem...
                  </div>
                ) : formData.image ? (
                  <img src={formData.image} alt="Preview" className={styles.imagePreviewLarge} />
                ) : (
                  <div className={styles.uploadPlaceholder}>Nenhuma imagem selecionada</div>
                )}
              </div>
              <input type="file" onChange={handleFileChange} accept="image/*,.heic,.heif" disabled={isUploading} />
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
              <label className={styles.label}>
                Nome do Local <span style={{ color: '#888', fontWeight: 'normal' }}>(Preencha APENAS se for Origem ou Destino final)</span>
              </label>
              <input
                className={styles.input}
                name="name"
                type="text"
                placeholder="Ex: Portaria, Sala 402..."
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>

            {formData.name && formData.name.trim() !== "" && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', padding: '12px', backgroundColor: '#fffdf5', border: '1px solid #ffb300', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  id="is_origem"
                  checked={formData.is_origem || false}
                  onChange={(e) => setFormData({ ...formData, is_origem: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#ffb300' }}
                />
                <label htmlFor="is_origem" style={{ cursor: 'pointer', margin: 0, color: '#333', fontSize: '14px' }}>
                  Este local é um <strong>Ponto de Partida (Origem)</strong>?
                </label>
              </div>
            )}

            <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
              <label className={styles.label}>Instrução de Rota (Exibido na Foto)</label>
              <input
                className={styles.input}
                name="description"
                type="text"
                placeholder="Ex: Vire à direita na portaria descendo em direção à cantina..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formButtons} style={{ marginTop: '24px' }}>
              <button 
                className={styles.btnSave} 
                onClick={handleCreatingStep} 
                disabled={isUploading || !formData.image || !formData.description}
                style={{ opacity: (isUploading || !formData.image || !formData.description) ? 0.6 : 1 }}
              >
                Salvar Etapa
              </button>
              <button className={styles.btnCancel} onClick={() => setCreatingStep(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <ul className={styles.stepsList}>
          {stepsList.map((step, index) => (
            <li key={`${step.id}-${index}`} className={styles.stepItem}>
              <span className={styles.badge}>{index + 1}</span>
              <div className={styles.imageContainer}>
                <img src={step.image} alt={`Passo ${index + 1}`} className={styles.previewImgLarge} />
              </div>
              <div className={styles.stepContent} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#FFB300', marginBottom: '4px' }}>
                  {step.name}
                </span>
                <span className={styles.stepDescription} style={{ fontSize: '14px', color: '#555' }}>
                  {step.description}
                </span>
              </div>
              <button className={styles.btnDelete} onClick={() => handleRemoveStep(index)}>
                <Trash2 size={20} color="#ff4444" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          className={styles.btnPublish}
          onClick={handleSaveRoute}
          disabled={stepsList.length === 0 || !faculdadeId || !origemId || !destinoId || isPublishing}
          style={{ opacity: (stepsList.length === 0 || !faculdadeId || !origemId || !destinoId || isPublishing) ? 0.6 : 1, width: '100%', padding: '16px', fontSize: '1.1rem', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', backgroundColor: '#111', marginTop: '10px' }}
        >
          {isPublishing ? "SALVANDO..." : (editingRouteId ? "ATUALIZAR ROTA" : "PUBLICAR NOVA ROTA")}
        </button>
        {editingRouteId && (
          <button className={styles.btnCancel} style={{ marginTop: '10px', padding: '0 24px', borderRadius: '12px' }} onClick={handleClearForm}>
            Cancelar
          </button>
        )}
      </div>

      <section className={styles.routeSection} style={{ marginTop: '48px', borderTop: '2px solid #eee', paddingTop: '32px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '20px', color: '#111' }}>Rotas Cadastradas no Sistema ({registeredRoutes.length})</h3>
        
        {registeredRoutes.length === 0 && <p style={{ color: '#666' }}>Nenhuma rota cadastrada ainda.</p>}

        <ul className={styles.stepsList}>
          {registeredRoutes.map((r: any) => (
            <li key={r.id} className={styles.stepItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#111' }}>
                  {r.name || `Rota #${r.id} (Sem Nome)`}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  <strong>Origem:</strong> {getPointName(r.origem_id, true)} <br/>
                  <strong>Destino:</strong> {getPointName(r.destino_id, false)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={styles.btnSecondary} 
                  style={{ padding: '8px 12px' }} 
                  onClick={() => handleEditRoute(r)}
                >
                  <Edit2 size={18} /> Editar
                </button>
                <button 
                  className={styles.btnDelete} 
                  style={{ padding: '8px 12px' }} 
                  onClick={() => handleDeleteRoute(r.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};

export default Admin;