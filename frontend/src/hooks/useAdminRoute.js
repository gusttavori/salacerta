import { useState, useEffect } from 'react';
import { images } from '../Repositories/images';
import { steps } from '../Repositories/steps';
import { rotas } from '../Repositories/rotas';

export function useAdminRoute() {
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [registeredRoutes, setRegisteredRoutes] = useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  const loadRoutes = async () => {
    setIsLoadingRoutes(true);
    try {
      const data = await rotas.listAll();
      setRegisteredRoutes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const url = await images.uploadImage(file);
      return url;
    } catch (error) {
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const searchSteps = async (term) => {
    if (!term || term.length <= 2) {
      setSearchResults([]);
      return;
    }
    try {
      const { data, error } = await steps.listByDescription(term);
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      setSearchResults([]);
    }
  };

  const clearSearch = () => setSearchResults([]);

  const createNewStep = async (stepData) => {
    try {
      const data = await steps.addNewStep(stepData);
      return data[0];
    } catch (error) {
      throw new Error("Erro ao salvar nova etapa.");
    }
  };

  const publishRoute = async (routeName, routeStepsIds, faculdadeId, origemId, destinoId) => {
    setIsPublishing(true);
    try {
      await rotas.addNewRoute({
        name: routeName,
        steps: routeStepsIds,
        faculdade: faculdadeId,
        origem_id: origemId,
        destino_id: destinoId
      });
      await loadRoutes();
      return true;
    } catch (error) {
      throw new Error("Erro ao publicar rota.");
    } finally {
      setIsPublishing(false);
    }
  };

  const updateRoute = async (id, routeName, routeStepsIds, faculdadeId, origemId, destinoId) => {
    setIsPublishing(true);
    try {
      await rotas.updateRoute(id, {
        name: routeName,
        steps: routeStepsIds,
        faculdade: faculdadeId,
        origem_id: origemId,
        destino_id: destinoId
      });
      await loadRoutes();
      return true;
    } catch (error) {
      throw new Error("Erro ao atualizar rota.");
    } finally {
      setIsPublishing(false);
    }
  };

  const deleteRoute = async (id) => {
    try {
      await rotas.deleteRoute(id);
      await loadRoutes();
    } catch (error) {
      throw new Error("Erro ao deletar rota.");
    }
  };

  const getStepsByIds = async (ids) => {
    try {
      return await steps.listByArrayIds(ids);
    } catch (error) {
      return [];
    }
  };

  return {
    isUploading,
    isPublishing,
    searchResults,
    registeredRoutes,
    isLoadingRoutes,
    uploadImage,
    searchSteps,
    clearSearch,
    createNewStep,
    publishRoute,
    updateRoute,
    deleteRoute,
    getStepsByIds
  };
}