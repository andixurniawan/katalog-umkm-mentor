export default function Input({ label, name, type = "text", textarea = false, ...props }) {
  const baseKelas =
    "w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none";

  const fileKelas =
    type === "file"
      ? " file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-utama file:text-white hover:file:bg-utama-gelap cursor-pointer"
      : "";

  const kelas = `${baseKelas}${fileKelas}`;

  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      {textarea ? (
        <textarea name={name} rows={4} className={kelas} {...props} />
      ) : (
        <input name={name} type={type} className={kelas} {...props} />
      )}
    </label>
  );
}
