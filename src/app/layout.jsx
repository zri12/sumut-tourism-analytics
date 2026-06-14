import "./globals.css";
import TopNav from "@/components/layout/TopNav";

export const metadata = {
  title: {
    default: "SumutCluster | Tourism Research Analytics",
    template: "%s | SumutCluster",
  },
  description:
    "Analisis pola kunjungan wisatawan untuk rekomendasi waktu berkunjung ideal di Sumatera Utara.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <TopNav />
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
            <p className="font-semibold text-slate-700">Sistem Analisis Pola Kunjungan Wisatawan</p>
            <p>Implementasi K-Means Clustering untuk penelitian akademik.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
