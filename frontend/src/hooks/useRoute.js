import { useState, useCallback } from 'react';
import { rotas } from '../Repositories/rotas';
import { steps } from '../Repositories/steps';

export function useRoute() {
  const [route, setRoute] = useState(null);
  const [stepsRoute, setStepsRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoute = useCallback(async (faculdadeId, origemId, destinoId) => {
    if (!faculdadeId || !origemId || !destinoId) return;

    setLoading(true);
    setError(null);
    setRoute(null);
    setStepsRoute([]);

    try {
      const routeData = await rotas.findByPath(faculdadeId, origemId, destinoId);
      
      if (!routeData) {
        setError("Nenhuma rota encontrada para este trajeto.");
        return;
      }

      setRoute(routeData);

      if (routeData.steps && routeData.steps.length > 0) {
        const stepsData = await steps.listByArrayIds(routeData.steps);
        setStepsRoute(stepsData || []);
      }

    } catch (err) {
      console.error(err);
      setError("Erro ao buscar a rota. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setStepsRoute([]);
    setError(null);
  }, []);

  return { route, stepsRoute, loading, error, fetchRoute, clearRoute };
}