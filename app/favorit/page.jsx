import IsiFavorit from "@/components/IsiFavorit";

export const metadata = { title: "Favorit" };

export default function HalamanFavorit() {
  return (
    <div className="py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Produk favorit</h1>
      <IsiFavorit />
    </div>
  );
}
