/**
 * Settings Security Tab
 * Security and password settings
 */

'use client';

export function SettingsSecurity() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Segurança</h2>

      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha Atual
              </label>
              <input
                id="current-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nova Senha
              </label>
              <input
                id="new-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Nova Senha
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-2">Autenticação de Dois Fatores</h3>
          <p className="text-sm text-gray-600 mb-4">
            Adicione uma camada extra de segurança à sua conta
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Ativar 2FA
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
