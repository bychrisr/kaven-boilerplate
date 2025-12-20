export default function HelpCenterPage() {
  const categories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      articles: ['Quick Start Guide', 'Account Setup', 'First Steps']
    },
    {
      title: 'User Management',
      icon: '👥',
      articles: ['Creating Users', 'Roles & Permissions', 'User Settings']
    },
    {
      title: 'Billing & Payments',
      icon: '💳',
      articles: ['Payment Methods', 'Invoices', 'Subscriptions']
    },
    {
      title: 'Security',
      icon: '🔒',
      articles: ['Two-Factor Authentication', 'Password Security', 'API Keys']
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
      <p className="text-gray-600 mb-8">Browse our guides and documentation</p>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full max-w-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="font-bold text-gray-900 mb-3">{category.title}</h3>
            <ul className="space-y-2">
              {category.articles.map((article, j) => (
                <li key={j}>
                  <a href="#" className="text-sm text-primary-main hover:text-primary-dark">
                    {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2">Can&apos;t find what you&apos;re looking for?</h3>
        <p className="text-gray-600 mb-4">Our support team is here to help</p>
        <a
          href="/contact"
          className="inline-block bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
