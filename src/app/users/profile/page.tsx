"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  subscription_plan: string;
  provider: string;
  created_at: string;
  token: string | null;
}

interface UsageData {
  date: string;
  count: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profileData, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !profileData) {
        // Handle case where profile might be missing (should be handled by callback but just in case)
        router.replace("/dashboard");
        return;
      } else {
        setProfile(profileData);
      }

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });

      // Use api_usage for credits and counts
      const { data: usageLogs } = await supabaseClient
        .from("api_usage")
        .select("created_at, credits_used")
        .eq("user_id", user.id)
        .gte("created_at", last7Days[0] + "T00:00:00Z")
        .order("created_at", { ascending: true });

      const dailyUsage: Record<string, number> = {};
      last7Days.forEach(d => dailyUsage[d] = 0);
      
      let total = 0;
      usageLogs?.forEach(log => {
        const date = log.created_at.split("T")[0];
        if (dailyUsage[date] !== undefined) {
          dailyUsage[date] += 1; // Count of requests
          total += 1;
        }
      });

      setUsageData(last7Days.map(date => ({ date, count: dailyUsage[date] })));
      setTotalUsage(total);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.replace("/");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const maxUsage = Math.max(...usageData.map(d => d.count), 1);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const creditPercentage = Math.max(0, Math.min(100, (profile.credits / 1000000) * 100));

  return (
    <div className="min-vh-100 bg-light text-dark">
      <style dangerouslySetInnerHTML={{ __html: `
        .text-dark { color: #000000 !important; }
        .text-muted { color: #333333 !important; }
        .card { background: #ffffff !important; border: 1px solid #e0e0e0 !important; }
        .progress { background-color: #f0f0f0 !important; }
        body { color: #000000 !important; }
      `}} />

      <nav className="navbar navbar-expand-lg py-3 border-bottom bg-white">
        <div className="container">
          <a href="/" className="navbar-brand">
            <img src="https://visora-dev-assets-id.assetsvsiddev.workers.dev/index/base-logo.png" alt="Logo" width="100" />
          </a>
          <div className="ms-auto d-flex align-items-center gap-3">
            <a href="/dashboard" className="btn btn-outline-dark btn-sm">Dashboard</a>
            <button onClick={handleLogout} className="btn btn-dark btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar Profil */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-body text-center p-4">
                <div className="position-relative d-inline-block mb-3">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="rounded-circle border"
                      width="100"
                      height="100"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: "100px",
                        height: "100px",
                        background: "#000",
                        fontSize: "2.5rem"
                      }}
                    >
                      {profile.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h5 className="fw-bold mb-1 text-dark">{profile.full_name || "User"}</h5>
                <p className="text-muted small mb-3">{profile.email}</p>
                
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                  <span className="badge bg-dark px-3 py-2 text-white" style={{ borderRadius: "20px" }}>
                    {profile.subscription_plan === "free" ? "Free Plan" : profile.subscription_plan}
                  </span>
                </div>
              </div>
            </div>

            {/* API Token Card */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 text-dark">API Token</h6>
                <div className="bg-light p-3 rounded-3 position-relative border">
                  <code className="text-dark small d-block mb-0 overflow-hidden" style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {profile.token || "Generating..."}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(profile.token || "")}
                    className="btn btn-sm btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-muted x-small mt-2 mb-0" style={{ fontSize: "0.75rem" }}>
                  Gunakan token ini untuk melakukan request ke API kami.
                </p>
              </div>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 text-dark">Informasi Akun</h6>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Dibuat pada</span>
                  <span className="fw-medium text-dark">{formatDate(profile.created_at)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Provider</span>
                  <span className="fw-medium text-dark text-capitalize">{profile.provider}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Status</span>
                  <span className="fw-medium text-success">Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-4 text-dark">Credit API</h6>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="text-center mb-4 mb-md-0">
                      <div className="position-relative d-inline-block">
                        <svg width="180" height="180" viewBox="0 0 180 180">
                          <circle
                            cx="90"
                            cy="90"
                            r="80"
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth="12"
                          />
                          <circle
                            cx="90"
                            cy="90"
                            r="80"
                            fill="none"
                            stroke="#000"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${creditPercentage * 5.02} 502`}
                            transform="rotate(-90 90 90)"
                          />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <div className="fw-bold text-dark" style={{ fontSize: "1.8rem" }}>{formatNumber(profile.credits)}</div>
                          <div className="text-muted small">dari 1M</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small text-muted">Credit Tersisa</span>
                        <span className="small fw-medium text-dark">{creditPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                        <div
                          className="progress-bar bg-dark"
                          style={{
                            width: `${creditPercentage}%`,
                            borderRadius: "4px"
                          }}
                        />
                      </div>
                    </div>
                    <div className="bg-light rounded-3 p-3 border">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Total Limit</span>
                        <span className="fw-medium text-dark">1,000,000</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Terpakai</span>
                        <span className="fw-medium text-dark">{formatNumber(1000000 - profile.credits)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">Tersisa</span>
                        <span className="fw-medium text-dark">{formatNumber(profile.credits)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0 text-dark">Grafik Penggunaan (7 Hari Terakhir)</h6>
                  <span className="badge bg-dark text-white">Total: {formatNumber(totalUsage)} Request</span>
                </div>
                <div className="d-flex align-items-end justify-content-between" style={{ height: "200px", padding: "0 10px" }}>
                  {usageData.map((data, index) => (
                    <div key={index} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                      <div
                        className="w-100 mx-1"
                        style={{
                          height: `${Math.max((data.count / maxUsage) * 160, 4)}px`,
                          backgroundColor: "#000",
                          borderRadius: "6px 6px 0 0",
                          maxWidth: "40px",
                          transition: "height 0.3s ease"
                        }}
                        title={`${data.count} request`}
                      />
                      <div className="text-dark mt-2" style={{ fontSize: "10px", fontWeight: "500" }}>
                        {new Date(data.date).toLocaleDateString("id-ID", { weekday: "short" })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {profile.credits <= 0 && (
              <div className="alert alert-dark border-dark mt-4 d-flex align-items-center" style={{ borderRadius: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div className="text-dark">
                  <strong>Credit Habis!</strong> Anda tidak dapat menggunakan API lagi. Silakan upgrade paket.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
