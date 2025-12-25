'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, Crown, DollarSign, Headphones, TrendingUp, Server } from 'lucide-react';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';
import { Stepper } from '@/components/setup/stepper';
import { ArchitectureCard } from '@/components/setup/architecture-card';
import { RoleToggle } from '@/components/setup/role-toggle';
import { toast } from 'sonner';

interface SetupConfig {
  companyName: string;
  adminEmail: string;
  adminPassword: string;
  language: 'pt-BR' | 'en-US';
  currency: 'BRL' | 'USD';
  primaryColor: string;
  mode: 'SINGLE_TENANT' | 'MULTI_TENANT';
  modules: {
    createFinance: boolean;
    createSupport: boolean;
    createMarketing: boolean;
    createDevOps: boolean;
  };
}

const STEPS = [
  { id: 1, title: 'Branding', description: 'Configurações básicas' },
  { id: 2, title: 'Arquitetura', description: 'Modo de operação' },
  { id: 3, title: 'Time', description: 'Personas administrativas' },
  { id: 4, title: 'Finalizar', description: 'Revisar e instalar' }
];

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [config, setConfig] = useState<SetupConfig>({
    companyName: '',
    adminEmail: '',
    adminPassword: '',
    language: 'pt-BR',
    currency: 'BRL',
    primaryColor: '#6366f1',
    mode: 'MULTI_TENANT',
    modules: {
      createFinance: true,
      createSupport: true,
      createMarketing: true,
      createDevOps: true
    }
  });

  const updateConfig = <K extends keyof SetupConfig>(key: K, value: SetupConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateModule = <K extends keyof SetupConfig['modules']>(
    key: K,
    value: SetupConfig['modules'][K]
  ) => {
    setConfig(prev => ({
      ...prev,
      modules: { ...prev.modules, [key]: value }
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInstall = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/setup/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed');
      }

      // Salvar preferências no localStorage
      localStorage.setItem('language', config.language);
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('primaryColor', config.primaryColor);

      toast.success('Setup concluído com sucesso!');
      
      // Redirecionar para login
      setTimeout(() => {
        router.push('/login');
      }, 1000);

    } catch (error) {
      console.error('Setup error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao executar setup');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserCount = () => {
    let count = 1; // ARCHITECT é obrigatório
    if (config.modules.createFinance) count++;
    if (config.modules.createSupport) count++;
    if (config.modules.createMarketing) count++;
    if (config.modules.createDevOps) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#161C24] via-[#1C252E] to-[#212B36] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="large" className="mb-6 mx-auto" />
          <h1 className="text-3xl font-bold text-white mb-2">Kaven Boilerplate</h1>
          <p className="text-gray-400">Configure seu SaaS em minutos</p>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Content Card */}
        <div className="bg-[#212B36] rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          {/* Step 1: Branding */}
          {currentStep === 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Configurações Básicas</h2>
                <p className="text-gray-400 text-sm">Defina as informações principais do seu projeto</p>
              </div>
              <div className="space-y-5">
                <TextField
                  id="companyName"
                  label="Nome do Projeto"
                  placeholder="Meu SaaS Inc"
                  value={config.companyName}
                  onChange={(e) => updateConfig('companyName', e.target.value)}
                  required
                  fullWidth
                  className="bg-[#161C24] border-gray-700 text-white placeholder-gray-500 focus:border-primary-main focus:ring-primary-main/20"
                  labelClassName="text-gray-400"
                />

                <TextField
                  id="adminEmail"
                  type="email"
                  label="Email do Administrador"
                  placeholder="admin@example.com"
                  value={config.adminEmail}
                  onChange={(e) => updateConfig('adminEmail', e.target.value)}
                  required
                  fullWidth
                  className="bg-[#161C24] border-gray-700 text-white placeholder-gray-500 focus:border-primary-main focus:ring-primary-main/20"
                  labelClassName="text-gray-400"
                />

                <TextField
                  id="adminPassword"
                  type="password"
                  label="Senha do Administrador"
                  placeholder="Mínimo 8 caracteres"
                  value={config.adminPassword}
                  onChange={(e) => updateConfig('adminPassword', e.target.value)}
                  required
                  fullWidth
                  className="bg-[#161C24] border-gray-700 text-white placeholder-gray-500 focus:border-primary-main focus:ring-primary-main/20"
                  labelClassName="text-gray-400"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm font-medium mb-1.5 block">Idioma Padrão</Label>
                    <Select value={config.language} onChange={(v: 'pt-BR' | 'en-US') => updateConfig('language', v)} fullWidth>
                      <SelectOption value="pt-BR">🇧🇷 Português (Brasil)</SelectOption>
                      <SelectOption value="en-US">🇺🇸 English (US)</SelectOption>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm font-medium mb-1.5 block">Moeda Padrão</Label>
                    <Select value={config.currency} onChange={(v: 'BRL' | 'USD') => updateConfig('currency', v)} fullWidth>
                      <SelectOption value="BRL">R$ Real (BRL)</SelectOption>
                      <SelectOption value="USD">$ Dollar (USD)</SelectOption>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="primaryColor" className="text-gray-400 text-sm font-medium mb-1.5 block">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="w-20 h-10 bg-[#161C24] border-gray-700"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      placeholder="#6366f1"
                      className="flex-1 bg-[#161C24] border-gray-700 text-white placeholder-gray-500 focus:border-primary-main focus:ring-primary-main/20"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outlined" disabled className="border-gray-700 text-gray-500">Voltar</Button>
                <Button 
                  onClick={handleNext}
                  disabled={!config.companyName || !config.adminEmail || !config.adminPassword}
                  variant="contained"
                  color="primary"
                  className="shadow-lg shadow-primary-main/25 hover:shadow-primary-main/40"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Arquitetura */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Escolha a Arquitetura</h2>
                <p className="text-gray-400 text-sm">Defina como seu sistema irá operar</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ArchitectureCard
                  title="Single Tenant"
                  description="Uma aplicação, uma organização"
                  icon={<Building2 className="w-6 h-6" />}
                  selected={config.mode === 'SINGLE_TENANT'}
                  onClick={() => updateConfig('mode', 'SINGLE_TENANT')}
                >
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>✓ Ideal para ferramentas internas</li>
                    <li>✓ Mais simples de gerenciar</li>
                    <li>✓ Sem isolamento de dados</li>
                  </ul>
                </ArchitectureCard>

                <ArchitectureCard
                  title="Multi-Tenant (Camaleão)"
                  description="SaaS com múltiplos clientes"
                  icon={<Users className="w-6 h-6" />}
                  selected={config.mode === 'MULTI_TENANT'}
                  onClick={() => updateConfig('mode', 'MULTI_TENANT')}
                >
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>✓ Ideal para SaaS</li>
                    <li>✓ Isolamento por tenant</li>
                    <li>✓ Subdomínios automáticos</li>
                  </ul>
                </ArchitectureCard>
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outlined" onClick={handleBack} className="border-gray-700 text-gray-400">Voltar</Button>
                <Button 
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  className="shadow-lg shadow-primary-main/25 hover:shadow-primary-main/40"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Configure seu Time</h2>
                <p className="text-gray-400 text-sm">Escolha quais personas criar no Admin Tenant</p>
              </div>
              <div className="space-y-3">
                <RoleToggle
                  icon={<Crown className="w-5 h-5" />}
                  title="Super Admin (The Architect)"
                  description="Acesso total ao sistema"
                  checked={true}
                  disabled={true}
                  badge="Obrigatório"
                />

                <RoleToggle
                  icon={<DollarSign className="w-5 h-5" />}
                  title="CFO / Financeiro"
                  description="Gestão de pagamentos, faturas e Stripe"
                  checked={config.modules.createFinance}
                  onCheckedChange={(v) => updateModule('createFinance', v)}
                />

                <RoleToggle
                  icon={<Headphones className="w-5 h-5" />}
                  title="Customer Success"
                  description="Suporte, impersonation e reset de 2FA"
                  checked={config.modules.createSupport}
                  onCheckedChange={(v) => updateModule('createSupport', v)}
                />

                <RoleToggle
                  icon={<TrendingUp className="w-5 h-5" />}
                  title="Marketing / Growth"
                  description="Analytics, CRM e campanhas"
                  checked={config.modules.createMarketing}
                  onCheckedChange={(v) => updateModule('createMarketing', v)}
                />

                <RoleToggle
                  icon={<Server className="w-5 h-5" />}
                  title="DevOps"
                  description="Logs, monitoramento e saúde do sistema"
                  checked={config.modules.createDevOps}
                  onCheckedChange={(v) => updateModule('createDevOps', v)}
                />
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outlined" onClick={handleBack} className="border-gray-700 text-gray-400">Voltar</Button>
                <Button 
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  className="shadow-lg shadow-primary-main/25 hover:shadow-primary-main/40"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Finalização */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Pronto para Instalar</h2>
                <p className="text-gray-400 text-sm">Revise suas configurações</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Projeto:</span>
                  <span className="font-medium text-white">{config.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email Admin:</span>
                  <span className="font-medium text-white">{config.adminEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Modo:</span>
                  <span className="font-medium text-white">{config.mode === 'MULTI_TENANT' ? 'Multi-Tenant' : 'Single-Tenant'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Usuários:</span>
                  <span className="font-medium text-white">{getUserCount()} personas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Idioma:</span>
                  <span className="font-medium text-white">{config.language === 'pt-BR' ? 'Português' : 'English'}</span>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outlined" onClick={handleBack} className="border-gray-700 text-gray-400">Voltar</Button>
                <Button 
                  onClick={handleInstall} 
                  disabled={isLoading}
                  variant="contained"
                  color="primary"
                  loading={isLoading}
                  className="min-w-[200px] shadow-lg shadow-primary-main/25 hover:shadow-primary-main/40"
                >
                  {isLoading ? 'Instalando...' : 'Instalar Kaven Boilerplate'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
