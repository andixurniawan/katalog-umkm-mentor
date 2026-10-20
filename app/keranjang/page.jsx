import IsiKeranjang from "@/components/IsiKeranjang";

export const metadata = { title: "Keranjang" };

export default function HalamanKeranjang() {
  return (
    <div className="py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Keranjang</h1>
      <IsiKeranjang />
    </div>
  );
}
