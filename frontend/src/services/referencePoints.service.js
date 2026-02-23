import { api } from './api';
import { referencePointsAdapter } from '../utils/adapters/routeAdapter';

export async function getReferencePoints() {
  const { data } = await api.get('/pontos-referencia');
  return referencePointsAdapter(data);
}