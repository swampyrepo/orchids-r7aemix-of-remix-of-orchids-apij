"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Crown, Briefcase, Server, Cpu, Star, Sparkles, Shield, Activity, Globe } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "STARTER PACK",
    price: "0",
    priceIDR: "Gratis",
    period: "Gratis (masa awal)",
    description: "Cocok untuk coba-coba dan user baru",
    icon: Zap,
    color: "from-slate-500 to-slate-600",
    badge: null,
    features: [
      "Akses AI standar",
      "Generate teks & chat",
      "Limit harian rendah",
      "Tanpa private server",
      "Shared server",
    ],
    models: ["Aurora Lite"],
    popular: false,
  },
  {
    id: "plus",
    name: "PLUS",
    price: "10",
    priceIDR: "Rp160.000",
    period: "/ bulan",
    description: "Stabil untuk penggunaan rutin",
    icon: Star,
    color: "from-blue-500 to-blue-600",
    badge: null,
    features: [
      "Limit lebih besar dari Starter",
      "Response lebih cepat",
      "Prioritas antrian ringan",
      "Shared server",
    ],
    models: ["Aurora Lite", "Aurora Core"],
    popular: false,
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "25",
    priceIDR: "Rp400.000",
    period: "/ bulan",
    description: "Lebih jarang error & konteks panjang",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    badge: "Popular",
    features: [
      "Limit tinggi",
      "Konteks lebih panjang",
      "Lebih jarang error",
      "Prioritas komputasi menengah",
      "Shared server premium",
    ],
    models: ["Aurora Lite", "Aurora Core", "Aurora Pro"],
    popular: true,
  },
  {
    id: "creator",
    name: "CREATOR",
    price: "60",
    priceIDR: "Rp960.000",
    period: "/ bulan",
    description: "Cocok untuk konten, video prompt, dan coding berat",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    badge: null,
    features: [
      "Limit sangat tinggi",
      "Cocok untuk konten & coding berat",
      "Response cepat & stabil",
      "Prioritas komputasi tinggi",
      "Shared server high-performance",
    ],
    models: ["Aurora Core", "Aurora Pro"],
    popular: false,
  },
  {
    id: "business",
    name: "BUSINESS",
    price: "300 – 600",
    priceIDR: "Rp4.800.000 – Rp9.600.000",
    period: "/ bulan",
    description: "Private Server untuk perusahaan",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-500",
    badge: "Private Server",
    features: [
      "Private Server (PS)",
      "Isolasi user penuh",
      "Statistik penggunaan real-time (grafik)",
      "Total kredit terpakai",
      "Jumlah request API",
      "Lebih aman & stabil",
      "Cocok untuk sistem internal perusahaan",
    ],
    models: ["Aurora Pro", "Aurora Business"],
    serverPath: "/users/server_business/[token]",
    popular: false,
  },
  {
    id: "ultimate",
    name: "ULTIMATE",
    price: "1.200 – 2.500",
    priceIDR: "Rp19.000.000 – Rp40.000.000",
    period: "/ bulan",
    description: "Dedicated / HPC Class dengan resource maksimal",
    icon: Server,
    color: "from-rose-500 to-red-600",
    badge: "Dedicated HPC",
    features: [
      "Dedicated Private Server",
      "Kelas supercomputer / HPC",
      "Resource sangat besar",
      "Beban berat tanpa throttling",
      "Statistik lengkap & real-time",
      "Prioritas absolut",
    ],
    models: ["Aurora Pro", "Aurora Ultimate", "Aurora Prime 8K (akses terbatas)"],
    serverSpecs: {
      os: "Linux x64",
      ram: "hingga 17 TB",
      memory: "200–320 GB",
      server: "VSID_SERVER10",
    },
    serverPath: "/users/server_ultimate/[token]",
    popular: false,
  },
];

function generatePaymentId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-&";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function PlanPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://visora-dev-assets-id.assetsvsiddev.workers.dev/index/base-logo.png" alt="Logo" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Daftar Plan & Fitur Layanan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pilih Plan yang <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Sesuai</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Dari pemula hingga enterprise, temukan plan yang cocok untuk kebutuhanmu
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-300 mb-1">Catatan Penting</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Saat ini semua plan masih <strong className="text-amber-400">GRATIS</strong> (early access)</li>
                <li>• Kecuali <strong className="text-rose-400">Aurora Prime 8K</strong> - masih tahap training & uji coba</li>
                <li>• Penggunaan Aurora Prime 8K dikenakan biaya khusus</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === plan.id;
            const paymentId = generatePaymentId();
            
            return (
              <div
                key={plan.id}
                className={`relative group rounded-2xl transition-all duration-500 ${
                  plan.popular 
                    ? "lg:scale-105 lg:-mt-4 lg:mb-4" 
                    : ""
                }`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color} shadow-lg z-10`}>
                    {plan.badge}
                  </div>
                )}
                
                <div className={`h-full p-6 rounded-2xl border transition-all duration-500 ${
                  plan.popular
                    ? "bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-amber-500/50 shadow-xl shadow-amber-500/10"
                    : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50"
                } ${isHovered ? "transform -translate-y-1" : ""}`}>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-slate-400 text-lg">$</span>
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">± {plan.priceIDR} {plan.period !== "Gratis (masa awal)" ? "/ bulan" : ""}</p>
                  </div>

                  <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-br ${plan.color}`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.serverSpecs && (
                    <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Spesifikasi Server</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-400">{plan.serverSpecs.os}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-400">RAM {plan.serverSpecs.ram}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-400">Mem {plan.serverSpecs.memory}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Server className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-400">{plan.serverSpecs.server}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Model Terbuka</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.models.map((model, idx) => (
                        <span 
                          key={idx} 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            model.includes("Prime 8K")
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : model.includes("Ultimate")
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : model.includes("Business")
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : model.includes("Pro")
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : model.includes("Core")
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-slate-700/50 text-slate-300 border border-slate-600/30"
                          }`}
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>

                  {plan.serverPath && (
                    <div className="mb-6 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-xs text-slate-500 font-mono">{plan.serverPath}</p>
                    </div>
                  )}

                  <Link
                    href={`/payment-gateway/v1/${plan.id}/${paymentId}`}
                    className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg`
                        : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                    }`}
                  >
                    {plan.price === "0" ? "Mulai Gratis" : "Pilih Plan"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-slate-400 mb-4">Butuh bantuan memilih plan yang tepat?</p>
          <Link href="https://wa.me/6285643115199" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hubungi Kami
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Vallzx APIs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
