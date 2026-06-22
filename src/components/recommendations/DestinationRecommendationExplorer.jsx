"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck2,
  ChevronDown,
  MapPin,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
  UserRoundCheck,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import RecommendationTrendChart from "@/components/recommendations/RecommendationTrendChart";
import { getDestinationRecommendation } from "@/lib/recommendation";
import { formatNumber } from "@/utils/formatter";

const PROFILE_STYLES = {
  family: { icon: UsersRound, tone: "bg-violet-50 text-violet-600", bar: "bg-violet-500" },
  solo: { icon: UserRound, tone: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500" },
  friends: { icon: UserRoundCheck, tone: "bg-amber-50 text-amber-600", bar: "bg-amber-500" },
};

export default function DestinationRecommendationExplorer({ data }) {
  const destinations = useMemo(
    () => [...new Set(data.map((item) => item.destinasi_wisata).filter(Boolean))].sort(),
    [data],
  );
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredDestinations = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return destinations.filter(
      (item) => !keyword || item.toLowerCase().includes(keyword),
    );
  }, [destinations, query]);
  const selectedDestination = destinations.find(
    (item) => item.toLowerCase() === query.trim().toLowerCase(),
  );
  const recommendation = useMemo(
    () => getDestinationRecommendation(data, selectedDestination),
    [data, selectedDestination],
  );

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <label htmlFor="destination-search" className="text-sm font-bold text-slate-900">
          Cari nama wisata
        </label>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Ketik atau pilih destinasi untuk melihat waktu ideal dan gaya perjalanan yang sesuai.
        </p>
        <div
          className="relative mt-4 max-w-2xl"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
          }}
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              id="destination-search"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsOpen(false);
              }}
              placeholder="Ketik nama destinasi wisata..."
              className="h-14 pl-10 pr-11"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls="destination-options"
            />
            <button
              type="button"
              aria-label="Buka daftar destinasi"
              onClick={() => setIsOpen((value) => !value)}
              className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            >
              <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} size={18} />
            </button>
          </div>

          {isOpen && (
            <div
              id="destination-options"
              role="listbox"
              className="destination-results absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
            >
              {filteredDestinations.length ? (
                filteredDestinations.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={item === selectedDestination}
                    onClick={() => {
                      setQuery(item);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      item === selectedDestination
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <MapPin className="shrink-0 text-slate-400" size={16} />
                    <span className="truncate">{item}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-5 text-center text-sm text-slate-500">
                  Destinasi tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>
        {!recommendation && query && (
          <p className="mt-3 text-sm text-amber-700">
            Pilih nama destinasi yang tersedia pada daftar pencarian.
          </p>
        )}
      </Card>

      {recommendation && (
        <>
          <Card className="overflow-hidden border-blue-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
                    <MapPin size={15} /> {recommendation.region}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{recommendation.destination}</h2>
                  <p className="mt-2 text-sm text-blue-100">
                    Rata-rata {formatNumber(recommendation.averageVisits)} kunjungan per periode data.
                  </p>
                </div>
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur">
                  Paling sesuai: {recommendation.bestProfile.title}
                </span>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarCheck2 size={19} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">Waktu ideal berkunjung</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Bulan dengan rata-rata kepadatan terendah sehingga kunjungan cenderung lebih nyaman.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {recommendation.idealMonths.map((item, index) => (
                  <div key={item.bulan} className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs font-semibold text-blue-600">Pilihan {index + 1}</p>
                    <p className="mt-1 font-bold text-slate-900">{item.bulan}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatNumber(item.jumlah_kunjungan)} rata-rata kunjungan
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            {recommendation.profiles.map((profile) => {
              const style = PROFILE_STYLES[profile.type];
              const Icon = style.icon;
              return (
                <Card key={profile.type} className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${style.tone}`}>
                      <Icon size={19} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {profile.label}
                    </span>
                  </div>
                  <h3 className="mt-5 font-bold text-slate-900">{profile.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{profile.reason}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${profile.score}%` }} />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">Skor kecocokan {profile.score}%</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.months.map((item) => (
                      <span key={item.bulan} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700">
                        {item.bulan}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          <RecommendationTrendChart
            data={recommendation.monthly.map((item) => ({
              bulan: item.bulan_pendek,
              jumlah_kunjungan: item.jumlah_kunjungan,
            }))}
          />

          <Card className="flex items-start gap-4 border-slate-200 bg-slate-50 p-5 sm:p-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cara membaca rekomendasi</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Hasil dihitung dari pola jumlah kunjungan, musim libur sekolah, dan hari libur nasional pada dataset.
                Skor ini menggambarkan kecenderungan waktu dan keramaian, bukan penilaian fasilitas destinasi.
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
