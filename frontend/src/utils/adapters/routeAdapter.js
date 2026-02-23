// src/utils/adapters/routeAdapter.js

export function routeAdapter(apiResponse) {
  if (!apiResponse) return null;
  
  return {
    id: apiResponse.rota_id || apiResponse.id,
    steps: apiResponse.imagens || apiResponse.passos || [],
  };
}

export function referencePointsAdapter(apiResponse) {
  if (!Array.isArray(apiResponse)) return [];
  
  return apiResponse.map(item => ({
    id: item.id_ponto || item.id,
    name: item.nome_ponto || item.nome || item.descricao,
  }));
}