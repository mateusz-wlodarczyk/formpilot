import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
const formSchema = z.object({
  title: z.string().min(1, "Nazwa formularza jest wymagana"),
  description: z.string().optional(),
  fields: z.array(z.object({ type: z.string(), label: z.string() })).optional(),
});

export default function FormBuilder() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const router = useRouter();
        router.push("/dashboard/forms");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("title")}
        placeholder="Nazwa formularza"
        className="border p-2 w-full"
      />
      <textarea
        {...register("description")}
        placeholder="Opis formularza"
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Zapisz formularz
      </button>
    </form>
  );
}
