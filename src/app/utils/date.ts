import { formatDistanceToNow as fdtn } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDistanceToNow(date: Date) {
  return fdtn(date, { locale: ptBR, addSuffix: true });
}
