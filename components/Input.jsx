export default function Input({ label, name, type = "text", textarea = false, error, ...props }) {
  const baseKelas =
    "w-full rounded-lg border bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none";
  const kelasGaris = error ? "border-bahaya" : "border-garis";

  const fileKelas =
    type === "file"
      ? " file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-utama file:text-kontras hover:file:bg-utama-gelap cursor-pointer"
      : "";

  const kelas = `${baseKelas} ${kelasGaris}${fileKelas}`;
  const idError = error ? `error-${name}` : undefined;
  const ariaError = { "aria-invalid": error ? true : undefined, "aria-describedby": idError };

  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      {textarea ? (
        <textarea name={name} rows={4} className={kelas} {...ariaError} {...props} />
      ) : (
        <input name={name} type={type} className={kelas} {...ariaError} {...props} />
      )}
      {error && (
        <span id={idError} role="alert" className="text-sm font-medium text-bahaya">
          {error}
        </span>
      )}
    </label>
  );
}
