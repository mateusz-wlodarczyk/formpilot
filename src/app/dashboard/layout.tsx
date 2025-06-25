export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold">FormPilot</div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            <li>
              <a
                href="/dashboard"
                className="block p-2 rounded hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/dashboard/forms"
                className="block p-2 rounded hover:bg-gray-700 transition-colors"
              >
                Formularze
              </a>
            </li>
            <li>
              <a
                href="/dashboard/analytics"
                className="block p-2 rounded hover:bg-gray-700 transition-colors"
              >
                Analityka
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo User</span>
              <a
                href="/"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Wyloguj
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
