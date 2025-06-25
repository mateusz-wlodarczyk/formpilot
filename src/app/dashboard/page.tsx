export default function DashboardPage() {
  // Demo dane
  const demoStats = {
    forms: 3,
    responses: 12,
    active: 2,
  };

  const demoForms = [
    {
      id: "1",
      title: "Formularz kontaktowy",
      description: "Formularz do kontaktu z klientami",
      submissions: 5,
      createdAt: new Date("2024-06-20"),
    },
    {
      id: "2",
      title: "Ankieta satysfakcji",
      description: "Ankieta zadowolenia klientów",
      submissions: 7,
      createdAt: new Date("2024-06-18"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Nowy formularz
        </button>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Formularze</h3>
          <p className="text-3xl font-bold text-blue-600">{demoStats.forms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Odpowiedzi</h3>
          <p className="text-3xl font-bold text-green-600">
            {demoStats.responses}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Aktywne</h3>
          <p className="text-3xl font-bold text-purple-600">
            {demoStats.active}
          </p>
        </div>
      </div>

      {/* Ostatnie formularze */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Ostatnie formularze</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {demoForms.map((form) => (
              <div
                key={form.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{form.title}</h3>
                  <p className="text-sm text-gray-500">{form.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {form.submissions} odpowiedzi
                  </p>
                  <p className="text-xs text-gray-400">
                    {form.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
