/**
 * Dashboard Current Visits
 * Pie chart widget for current visits distribution
 */

'use client';

type VisitData = {
  label: string;
  value: number;
};

type DashboardCurrentVisitsProps = {
  data: VisitData[];
};

const colors = ['#1877F2', '#22C55E', '#FFAB00'];

export function DashboardCurrentVisits({ data }: DashboardCurrentVisitsProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Visitas Atuais</h2>
      
      {/* Simple visualization - will be replaced with actual chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {total.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
}
