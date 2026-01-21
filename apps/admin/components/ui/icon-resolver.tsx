import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { FC } from 'react';

interface IconResolverProps extends LucideProps {
  name: string;
}

/**
 * Resolve uma string (nome do ícone) para o componente Lucide correspondente.
 * Útil para ícones configurados dinamicamente no banco de dados.
 */
export const IconResolver: FC<IconResolverProps> = ({ name, ...props }) => {
  // @ts-expect-error - Acesso dinâmico aos ícones exportados
  const IconComponent = Icons[name] || Icons.Folder; // Fallback para Folder se não encontrado

  return <IconComponent {...props} />;
};
