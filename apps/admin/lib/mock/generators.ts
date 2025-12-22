/**
 * Mock Data Generators
 * Inspired by Minimals.cc approach
 * Provides reusable generators for fake data
 */

// ============================================
// BASIC GENERATORS
// ============================================

export const _id = (index: number) => `${Date.now()}-${index.toString().padStart(4, '0')}`;

export const _times = (index: number) => {
  const dates = [
    '2024-01-15', '2024-02-20', '2024-03-10', '2024-04-05',
    '2024-05-12', '2024-06-18', '2024-07-22', '2024-08-30',
    '2024-09-14', '2024-10-08', '2024-11-25', '2024-12-03',
  ];
  return dates[index % dates.length];
};

export const _fullName = (index: number) => {
  const names = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Souza',
    'Juliana Lima',
    'Rafael Alves',
    'Fernanda Rocha',
    'Lucas Martins',
    'Camila Ferreira',
    'Bruno Carvalho',
    'Patricia Ribeiro',
    'Rodrigo Gomes',
    'Amanda Dias',
    'Felipe Barbosa',
    'Beatriz Araújo',
    'Gustavo Cardoso',
    'Larissa Monteiro',
    'Thiago Nascimento',
    'Gabriela Freitas',
    'Daniel Correia',
    'Isabela Castro',
    'Marcelo Pinto',
    'Renata Moreira',
  ];
  return names[index % names.length];
};

export const _email = (index: number) => {
  const name = _fullName(index).toLowerCase().replace(' ', '.');
  const domains = ['gmail.com', 'outlook.com', 'empresa.com.br', 'email.com'];
  return `${name}@${domains[index % domains.length]}`;
};

export const _phone = (index: number) => {
  const ddd = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '91'];
  const num = Math.floor(90000000 + Math.random() * 10000000);
  return `(${ddd[index % ddd.length]}) 9${num}`;
};

export const _cpf = (index: number) => {
  const base = (index * 123456789).toString().padStart(9, '0').slice(0, 9);
  return `${base.slice(0, 3)}.${base.slice(3, 6)}.${base.slice(6, 9)}-${(index % 100).toString().padStart(2, '0')}`;
};

export const _cnpj = (index: number) => {
  const base = (index * 987654321).toString().padStart(12, '0').slice(0, 12);
  return `${base.slice(0, 2)}.${base.slice(2, 5)}.${base.slice(5, 8)}/${base.slice(8, 12)}-${(index % 100).toString().padStart(2, '0')}`;
};

export const _company = (index: number) => {
  const companies = [
    'Tech Solutions Ltda',
    'Inovação Digital',
    'Sistemas Avançados',
    'Consultoria Empresarial',
    'Desenvolvimento Web',
    'Marketing Digital Pro',
    'Logística Express',
    'Comércio Eletrônico',
    'Serviços Financeiros',
    'Educação Online',
    'Saúde e Bem-Estar',
    'Construção Civil',
    'Alimentos e Bebidas',
    'Moda e Estilo',
    'Automação Industrial',
    'Energia Renovável',
    'Transporte Urbano',
    'Hotelaria Premium',
    'Eventos Corporativos',
    'Design Criativo',
    'Segurança Digital',
    'Consultoria Jurídica',
    'Recursos Humanos',
    'Contabilidade Moderna',
  ];
  return companies[index % companies.length];
};

export const _domain = (index: number) => {
  const company = _company(index)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${company}.com.br`;
};

export const _price = (index: number) => {
  const prices = [
    99.90, 149.90, 199.90, 299.90, 399.90, 499.90, 599.90, 699.90,
    799.90, 899.90, 999.90, 1499.90, 1999.90, 2499.90, 2999.90,
  ];
  return prices[index % prices.length];
};

export const _boolean = (index: number) => index % 2 === 0;

export const _status = (index: number) => {
  const statuses = ['active', 'inactive', 'pending', 'suspended'];
  return statuses[index % statuses.length];
};

export const _role = (index: number) => {
  const roles = ['ADMIN', 'USER', 'MANAGER', 'VIEWER'];
  return roles[index % roles.length];
};

export const _avatar = (index: number) => {
  const seed = _fullName(index).replace(' ', '-');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

export const _address = (index: number) => {
  const streets = [
    'Rua das Flores',
    'Av. Paulista',
    'Rua Augusta',
    'Av. Brasil',
    'Rua XV de Novembro',
    'Av. Atlântica',
    'Rua Oscar Freire',
    'Av. Ipiranga',
  ];
  const cities = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Curitiba',
    'Porto Alegre',
    'Brasília',
    'Salvador',
    'Fortaleza',
  ];
  const states = ['SP', 'RJ', 'MG', 'PR', 'RS', 'DF', 'BA', 'CE'];
  
  return {
    street: `${streets[index % streets.length]}, ${100 + index * 10}`,
    city: cities[index % cities.length],
    state: states[index % states.length],
    zipCode: `${(10000 + index * 100).toString().slice(0, 5)}-${(index * 10).toString().padStart(3, '0')}`,
  };
};

export const _description = (index: number) => {
  const descriptions = [
    'Solução completa para gestão empresarial com foco em produtividade',
    'Plataforma inovadora de transformação digital para empresas modernas',
    'Sistema integrado de gestão com inteligência artificial',
    'Ferramenta profissional para otimização de processos',
    'Software de última geração para controle financeiro',
    'Aplicação web responsiva com design moderno',
    'Sistema robusto e escalável para grandes volumes',
    'Plataforma cloud-native com alta disponibilidade',
  ];
  return descriptions[index % descriptions.length];
};

// ============================================
// ARRAY GENERATORS
// ============================================

export const _mock = {
  id: _id,
  time: _times,
  fullName: _fullName,
  email: _email,
  phone: _phone,
  cpf: _cpf,
  cnpj: _cnpj,
  company: _company,
  domain: _domain,
  price: _price,
  boolean: _boolean,
  status: _status,
  role: _role,
  avatar: _avatar,
  address: _address,
  description: _description,
};
