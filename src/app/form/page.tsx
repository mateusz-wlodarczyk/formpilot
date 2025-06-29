"use client";
import { useEffect, useState } from "react";

type Form = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

export default function FormsList() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    fetch("/api/forms")
      .then((res) => res.json())
      .then((data) => setForms(data));
  }, []);

  return (
    <div>
      <h1>Forms List</h1>
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            {form.title}
            <a
              href={`/dashboard/forms/${form.id}/edit`}
              className="text-blue-500"
            >
              Edit
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
