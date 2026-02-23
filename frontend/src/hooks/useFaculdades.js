import { useState, useEffect } from 'react';
import { faculdades } from '../Repositories/faculdades';

export function useFaculdades() {
  const [faculdadesList, setFaculdadesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFaculdades() {
      try {
        setLoading(true);
        const data = await faculdades.listAll();
        
        const formatados = data.map(item => ({
          id: item.id,
          name: item.name || item.nome
        }));
        
        setFaculdadesList(formatados);
      } catch (err) {
        setError('Erro ao carregar faculdades.');
      } finally {
        setLoading(false);
      }
    }
    fetchFaculdades();
  }, []);

  return { faculdadesList, loading, error };
}