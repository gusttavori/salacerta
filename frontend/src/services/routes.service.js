import { api } from './api';
import { routeAdapter } from '../utils/adapters/routeAdapter';

export async function getRoute(originId, destinationId) {
  const { data } = await api.get(`/rotas`, {
    params: { origem: originId, destino: destinationId }
  });
  return routeAdapter(data);
}