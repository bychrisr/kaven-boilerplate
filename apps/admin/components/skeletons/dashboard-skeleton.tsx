import { cn } from '@/lib/utils';

/**
 * Dashboard Skeleton Component
 * 
 * Skeleton loader para a página do dashboard que mantém consistência
 * com o tema Dark Glassmorphism. Usa cores sutis e animação pulse
 * para criar uma transição suave entre loading e conteúdo real.
 * 
 * Design Principles:
 * - Usa bg-white/5 (dark mode) ou bg-gray-200/50 (light mode) para manter sutileza
 * - Animação pulse nativa do Tailwind para feedback visual
 * - Estrutura visual idêntica ao conteúdo real para evitar layout shift
 * - Bordas e sombras consistentes com cards reais
 * 
 * @see /docs/design-system/components.md - Skeleton Loaders
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Metrics Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "relative overflow-hidden rounded-2xl p-6 shadow-xl border",
              "bg-card border-border/50",
              "animate-pulse"
            )}
          >
            {/* Icon placeholder */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/5" />
              <div className="h-4 w-32 bg-white/5 rounded" />
            </div>

            {/* Value and trend placeholder */}
            <div className="space-y-3">
              <div className="h-8 w-24 bg-white/5 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
            </div>

            {/* Mini chart placeholder */}
            <div className="absolute bottom-6 right-6 w-24 h-12 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Donut Chart Skeleton */}
        <div
          className={cn(
            "rounded-2xl p-6 shadow-xl border lg:col-span-1",
            "bg-card border-border/50",
            "animate-pulse"
          )}
        >
          {/* Header */}
          <div className="mb-6 space-y-2">
            <div className="h-5 w-40 bg-white/5 rounded" />
            <div className="h-3 w-56 bg-white/5 rounded" />
          </div>

          {/* Donut chart placeholder */}
          <div className="h-80 w-full flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-8 border-white/5" />
          </div>
        </div>

        {/* Bar Chart Skeleton */}
        <div
          className={cn(
            "rounded-2xl p-6 shadow-xl border lg:col-span-2",
            "bg-card border-border/50",
            "animate-pulse"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-white/5 rounded" />
              <div className="h-3 w-40 bg-white/5 rounded" />
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 w-16 bg-white/5 rounded" />
              ))}
            </div>
          </div>

          {/* Bar chart placeholder */}
          <div className="h-80 w-full flex items-end justify-between gap-2 px-4">
            {[40, 60, 45, 70, 55, 65, 50, 75, 60, 55, 70, 65].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-white/5 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Table Skeleton */}
      <div
        className={cn(
          "rounded-2xl shadow-xl border overflow-hidden",
          "bg-card border-border/50",
          "animate-pulse"
        )}
      >
        {/* Table Header */}
        <div className="p-6 border-b border-border/50">
          <div className="h-5 w-32 bg-white/5 rounded" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              {/* User info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/5 rounded" />
                  <div className="h-3 w-48 bg-white/5 rounded" />
                </div>
              </div>

              {/* Role badge */}
              <div className="h-6 w-24 bg-white/5 rounded-md" />

              {/* Date */}
              <div className="h-4 w-24 bg-white/5 rounded" />

              {/* Action button */}
              <div className="w-8 h-8 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Card Skeleton
 * 
 * Skeleton reutilizável para cards individuais.
 * Útil para páginas de detalhes ou listas de cards.
 */
export function CardSkeleton() {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-xl border",
        "bg-card border-border/50",
        "animate-pulse"
      )}
    >
      <div className="space-y-4">
        <div className="h-5 w-3/4 bg-white/5 rounded" />
        <div className="h-4 w-full bg-white/5 rounded" />
        <div className="h-4 w-5/6 bg-white/5 rounded" />
      </div>
    </div>
  );
}

/**
 * Table Skeleton
 * 
 * Skeleton reutilizável para tabelas de dados.
 * Útil para páginas de listagem (Users, Tenants, Invoices, etc).
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-xl border overflow-hidden",
        "bg-card border-border/50",
        "animate-pulse"
      )}
    >
      {/* Table Header */}
      <div className="p-6 border-b border-border/50 bg-muted/50">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-24 bg-white/5 rounded" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-6 flex items-center gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 w-24 bg-white/5 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
