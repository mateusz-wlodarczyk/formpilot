import { useForm } from "react-hook-form";

export default function FormCreator() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Wyślij dane do API
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
      <input
        {...register("tags")}
        placeholder="Tagi (oddzielone przecinkami)"
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
