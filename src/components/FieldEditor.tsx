import { useState } from "react";
type Field = {
  type: string;
  id: number;
};
export default function FieldEditor() {
  const [fields, setFields] = useState<Field[]>([]);

  const addField = (type: string) => {
    setFields([...fields, { type, id: Date.now() }]);
  };

  return (
    <div>
      <button onClick={() => addField("input")}>Dodaj Input</button>
      <button onClick={() => addField("textarea")}>Dodaj Textarea</button>
      <button onClick={() => addField("select")}>Dodaj Select</button>
      <button onClick={() => addField("checkbox")}>Dodaj Checkbox</button>

      <div>
        {fields.map((field) => (
          <div key={field.id}>
            <span>{field.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
