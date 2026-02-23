import { useState, useEffect, useCallback } from 'react';
import { steps } from '../Repositories/steps';

export function useReferencePoints() {
  const [origens, setOrigens] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transformamos em um callback para poder chamar de fora
  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await steps.listAll();
      
      const formatados = data.map(item => ({
        id: item.id,
        name: item.name || "",
        is_origem: item.is_origem || false
      }));

      const listaOrigens = formatados.filter(p => p.is_origem === true && p.name.trim() !== "");
      const listaDestinos = formatados.filter(p => p.is_origem === false && p.name.trim() !== "");

      setOrigens(listaOrigens);
      setDestinos(listaDestinos);
    } catch (err) {
      setError('Erro ao carregar os locais do mapa.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // NOVO: Retornando o fetchPoints
  return { origens, destinos, loading, error, fetchPoints }; 
}