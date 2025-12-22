/**
 * Settings Notifications Tab
 * Notification preferences
 */

'use client';

export function SettingsNotifications() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Notificações</h2>
      <p className="text-sm text-gray-600 mb-6">
        Gerencie como e quando você recebe notificações
      </p>
      
      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">Notificações por Email</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">Novos usuários</p>
                <p className="text-xs text-gray-500">Receba um email quando um novo usuário se cadastrar</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">Novos pedidos</p>
                <p className="text-xs text-gray-500">Receba um email quando um novo pedido for criado</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">Atualizações do sistema</p>
                <p className="text-xs text-gray-500">Receba emails sobre atualizações e manutenções</p>
              </div>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Notificações Push</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">Atividade em tempo real</p>
                <p className="text-xs text-gray-500">Receba notificações sobre atividades importantes</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">Lembretes</p>
                <p className="text-xs text-gray-500">Receba lembretes sobre tarefas pendentes</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
}
