"use client";

import React, { useEffect, useState } from "react";

interface HistoryPoint {
  timestamp: string;
  label: string;
  seoScore: number;
  keywordScore: number;
  hashtagScore: number;
}

interface CustomerPageReport {
  index: number;
  rawLabel: string;
  handle: string;
  profileUrl: string;
  seoScore: number;
  scoreDelta: number;
  scanCount: number;
  keywords: string[];
  keywordMetrics: Array<{ keyword: string; score: number }>;
  hashtags: string[];
  trendingHashtags: string[];
  hashtagMetrics: Array<{ tag: string; score: number }>;
  checklist: string[];
  history: HistoryPoint[];
}

interface DirectCompetitor {
  rawLabel: string;
  handle: string;
  profileUrl: string;
  seoScore: number;
  keywordStrength: number;
  hashtagStrength: number;
  reelsAnalysis: {
    topFormat: string;
    retentionPattern: string;
    keywordUsage: string;
  };
  employerStrategy: string[];
}

interface TrendScenario {
  id: number;
  title: string;
  targetKeyword: string;
  duration: string;
  viralScore: number;
  bestTime: string;
  targetAudience: string;
  hook3Sec: string;
  bodyScript: string;
  cta: string;
  hashtags: string[];
}

interface TierCompetitor {
  rank: number;
  tier: "محلی" | "استانی" | "کشوری";
  name: string;
  scope: string;
  igHandle: string | null;
  igUrl: string | null;
  websiteUrl: string | null;
  reelAnalysis: string;
  latestStory: string;
  adPlan: string;
}

interface Rival100Item {
  id: number;
  name: string;
  syllables: "۲ سیلاب" | "۳ سیلاب";
  domain: string;
  score: number;
  focus: string;
}

interface RoyalMotor100Benchmark {
  environment: string;
  royalBrandName: string;
  royalScore: number;
  royalRank: number;
  totalRivals: number;
  twoSyllableCount: number;
  threeSyllableCount: number;
  rivals: Rival100Item[];
}

interface CalendarEntry {
  day: number;
  tier: "free_week" | "paid_1m" | "paid_2m";
  label: string;
  title: string;
  format: string;
  kw: string;
  hook: string;
  tags: string[];
  locked: boolean;
  viralScore: number;
  bestTime: string;
  targetAudience: string;
  priority: "اولویت بالا" | "اولویت متوسط";
}

interface FunnelPlaybook {
  commentKeywords: string[];
  autoCommentReply: string;
  dmWelcomeScript: string;
  dmClosingScript: string;
}

interface SeoApiResponse {
  ok: boolean;
  error?: string;
  timestamp: string;
  todayShamsi: string;
  ceoPhone: string;
  supportEmail: string;
  savedDbCount: number;
  unlockedPlan: "free" | "paid_1m" | "paid_2m" | "vip_all";
  codeStatusMessage?: string;
  trendAlerts: string[];
  funnelPlaybook: FunnelPlaybook;
  customerPages: CustomerPageReport[];
  directCompetitors: DirectCompetitor[];
  trendScenarios: TrendScenario[];
  royalMotor100: RoyalMotor100Benchmark;
  competitors: {
    local: TierCompetitor[];
    provincial: TierCompetitor[];
    national: TierCompetitor[];
    totalCount: number;
  };
  calendarItems: CalendarEntry[];
  cardNumber: string;
  summaryText: string;
  phone: string;
  email: string;
}

const CEO_PHONE = "09366681963";
const SUPPORT_EMAIL = "amirsamyaghobi62@gmail.com";
const FORM_STORAGE_KEY = "royal_motor_next_form_v4";

function HourglassBadge({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 10,
        background: active ? "#e8f0fe" : "#f1f3f4",
        color: active ? "#1a73e8" : "#5f6368",
        fontSize: 15,
        transform: active ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.9s ease-in-out",
        boxShadow: "0 2px 6px rgba(26,115,232,0.16)",
      }}
      aria-label="ساعت شنی پایش سئو"
    >
      ⏳
    </span>
  );
}

function ClearSeoChart({ page }: { page: CustomerPageReport }) {
  const width = 620;
  const height = 185;
  const padX = 42;
  const padY = 28;

  const series =
    page.history.length === 1
      ? [
          {
            timestamp: page.history[0].timestamp,
            label: "شروع",
            seoScore: Math.max(50, page.history[0].seoScore - 4),
            keywordScore: Math.max(50, page.history[0].keywordScore - 4),
            hashtagScore: Math.max(50, page.history[0].hashtagScore - 4),
          },
          page.history[0],
        ]
      : page.history;

  const buildLine = (pick: (pt: HistoryPoint) => number) =>
    series.map((pt, idx) => {
      const x =
        padX + (idx / Math.max(1, series.length - 1)) * (width - padX * 2);
      const val = pick(pt);
      const y = height - padY - ((val - 40) / 60) * (height - padY * 2);
      return { x, y, val, label: pt.label };
    });

  const seoPts = buildLine((p) => p.seoScore);
  const kwPts = buildLine((p) => p.keywordScore);
  const tagPts = buildLine((p) => p.hashtagScore);
  const latest = series[series.length - 1];

  return (
    <div
      style={{
        marginTop: 12,
        background: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: 18,
        padding: 14,
        boxShadow: "0 6px 18px rgba(32,33,36,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        <strong style={{ fontSize: 13 }}>
          نمودار واضح روند سئو، کلمات کلیدی و هشتگ‌ها ({page.handle})
        </strong>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          <span style={{ color: "#1a73e8" }}>● امتیاز سئو: {latest.seoScore}٪</span>
          <span style={{ color: "#1e8e3e" }}>● کلمات کلیدی: {latest.keywordScore}٪</span>
          <span style={{ color: "#e37400" }}>● هشتگ‌ها: {latest.hashtagScore}٪</span>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", maxWidth: 620, height: 175, display: "block" }}
        >
          {[50, 75, 100].map((grid) => {
            const gy = height - padY - ((grid - 40) / 60) * (height - padY * 2);
            return (
              <g key={grid}>
                <line
                  x1={padX}
                  y1={gy}
                  x2={width - padX}
                  y2={gy}
                  stroke="#dadce0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padX - 8}
                  y={gy + 4}
                  fontSize="11"
                  fontWeight="700"
                  fill="#3c4043"
                  textAnchor="end"
                >
                  {grid}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke="#1a73e8"
            strokeWidth="3.5"
            points={seoPts.map((c) => `${c.x},${c.y}`).join(" ")}
          />
          <polyline
            fill="none"
            stroke="#1e8e3e"
            strokeWidth="3"
            strokeDasharray="6 3"
            points={kwPts.map((c) => `${c.x},${c.y}`).join(" ")}
          />
          <polyline
            fill="none"
            stroke="#e37400"
            strokeWidth="3"
            points={tagPts.map((c) => `${c.x},${c.y}`).join(" ")}
          />

          {seoPts.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="5" fill="#1a73e8" />
              <text
                x={c.x}
                y={c.y - 9}
                fontSize="11"
                fontWeight="800"
                fill="#1a73e8"
                textAnchor="middle"
              >
                {c.val}
              </text>
              <text
                x={c.x}
                y={height - 6}
                fontSize="10"
                fontWeight="600"
                fill="#3c4043"
                textAnchor="middle"
              >
                {c.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function RoyalMotorPage() {
  const [handlesInput, setHandlesInput] = useState("");
  const [competitorInput, setCompetitorInput] = useState("");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("تهران");
  const [province, setProvince] = useState("تهران");
  const [topics, setTopics] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<"all" | "whatsapp" | "sms" | "email">(
    "all"
  );

  const [digitalClock, setDigitalClock] = useState("");
  const [hourglassFlip, setHourglassFlip] = useState(false);

  const [subscriptionPlan, setSubscriptionPlan] = useState<
    "free" | "paid_1m" | "paid_2m" | "vip_all"
  >("free");
  const [activationCode, setActivationCode] = useState("");
  const [sortByViral, setSortByViral] = useState(false);
  const [syllableFilter, setSyllableFilter] = useState<
    "همه" | "۲ سیلاب" | "۳ سیلاب"
  >("همه");

  const [activeTier, setActiveTier] = useState<
    "محلی" | "استانی" | "کشوری" | "همه"
  >("محلی");
  const [activeCal, setActiveCal] = useState<
    "free_week" | "paid_1m" | "paid_2m"
  >("free_week");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [report, setReport] = useState<SeoApiResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedScriptKey, setCopiedScriptKey] = useState<string | null>(null);
  const [auto24x7, setAuto24x7] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setDigitalClock(
        now.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    if (!loading) {
      setHourglassFlip(false);
      return;
    }
    const hgTimer = setInterval(() => {
      setHourglassFlip((prev) => !prev);
    }, 900);
    return () => clearInterval(hgTimer);
  }, [loading]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || "null");
      if (saved) {
        if (saved.handlesInput) setHandlesInput(saved.handlesInput);
        if (saved.competitorInput) setCompetitorInput(saved.competitorInput);
        if (saved.niche) setNiche(saved.niche);
        if (saved.city) setCity(saved.city);
        if (saved.province) setProvince(saved.province);
        if (saved.topics) setTopics(saved.topics);
        if (saved.cardNumber) setCardNumber(saved.cardNumber);
        if (saved.phone) setPhone(saved.phone);
        if (saved.email) setEmail(saved.email);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  async function runAnalysis(
    isBackgroundTick = false,
    overridePlan?: "free" | "paid_1m" | "paid_2m" | "vip_all"
  ) {
    setErrorMsg(null);
    setCopied(false);

    if (!handlesInput.trim()) {
      setErrorMsg(
        "لطفاً حداقل یک آیدی یا نام پیج کارفرما وارد کنید (تا ۱۰ پیج همزمان)."
      );
      return;
    }
    if (!niche.trim()) {
      setErrorMsg("لطفاً حوزه فعالیت یا صنف را وارد کنید.");
      return;
    }

    try {
      localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify({
          handlesInput,
          competitorInput,
          niche,
          city,
          province,
          topics,
          cardNumber,
          phone,
          email,
        })
      );
    } catch {
      // Ignore storage errors
    }

    if (!isBackgroundTick) {
      setLoading(true);
    }

    const planToSend = overridePlan || subscriptionPlan;

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handles: handlesInput,
          competitorHandles: competitorInput,
          niche: niche.trim(),
          city: city.trim(),
          province: province.trim(),
          topics: topics.trim(),
          cardNumber: cardNumber.trim(),
          phone: phone.trim(),
          email: email.trim(),
          channel,
          subscriptionPlan: planToSend,
          activationCode: activationCode.trim(),
        }),
      });

      const data = (await res.json()) as SeoApiResponse;
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "خطا در اجرای موتور سئوی نکست جی اس.");
      } else {
        setReport(data);
        if (data.unlockedPlan) {
          setSubscriptionPlan(data.unlockedPlan);
        }
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "خطای ارتباط با سرور نکست جی اس رویال موتور."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auto24x7) return;
    const timer = setInterval(() => {
      runAnalysis(true);
    }, 25000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    auto24x7,
    handlesInput,
    competitorInput,
    niche,
    city,
    province,
    topics,
    cardNumber,
    subscriptionPlan,
  ]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runAnalysis(false);
  }

  function handleReset() {
    setAuto24x7(false);
    setHandlesInput("");
    setCompetitorInput("");
    setNiche("");
    setCity("تهران");
    setProvince("تهران");
    setTopics("");
    setCardNumber("");
    setPhone("");
    setEmail("");
    setSubscriptionPlan("free");
    setActivationCode("");
    setReport(null);
    setErrorMsg(null);
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  function handleCopySummary() {
    if (!report?.summaryText) return;
    navigator.clipboard?.writeText(report.summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyScript(key: string, text: string) {
    navigator.clipboard?.writeText(text);
    setCopiedScriptKey(key);
    setTimeout(() => setCopiedScriptKey(null), 1800);
  }

  function handlePrintClientPdf() {
    window.print();
  }

  const displayedCompetitors: TierCompetitor[] = !report
    ? []
    : activeTier === "همه"
    ? [
        ...report.competitors.local,
        ...report.competitors.provincial,
        ...report.competitors.national,
      ]
    : activeTier === "محلی"
    ? report.competitors.local
    : activeTier === "استانی"
    ? report.competitors.provincial
    : report.competitors.national;

  const displayedRivals100: Rival100Item[] = !report
    ? []
    : syllableFilter === "همه"
    ? report.royalMotor100.rivals
    : report.royalMotor100.rivals.filter((r) => r.syllables === syllableFilter);

  const displayedCalendar: CalendarEntry[] = !report
    ? []
    : (() => {
        const filtered = report.calendarItems.filter(
          (item) => item.tier === activeCal
        );
        return sortByViral
          ? [...filtered].sort((a, b) => b.viralScore - a.viralScore)
          : filtered;
      })();

  return (
    <div
      dir="rtl"
      style={{
        backgroundColor: "#ffffff",
        color: "#202124",
        minHeight: "100vh",
      }}
    >
      <header className="rm-header">
        <div className="rm-header-inner">
          <div className="rm-brand">
            <span className="rm-brand-badge">ر</span>
            <span>
              استارتاپ فناورانه هوش مصنوعی رویال فام | اولین استارتاپ وایپ کدینگ در ایران
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                background: "#f8f9fa",
                border: "1px solid #dadce0",
                borderRadius: 999,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 800,
                color: "#1a73e8",
                boxShadow: "0 2px 6px rgba(32,33,36,0.08)",
              }}
            >
              ساعت دیجیتال: <span dir="ltr">{digitalClock}</span>
            </span>
            <span className="rm-status-pill">
              <span className="rm-live-dot" /> پایش ۲۴/۷ فعال
            </span>
            <a href={`tel:${CEO_PHONE}`} style={{ fontWeight: 700 }}>
              پشتیبانی: {CEO_PHONE}
            </a>
          </div>
        </div>
      </header>

      <main className="rm-main">
        <section className="rm-hero">
          <h1
            className="rm-logo"
            style={{
              textShadow: "0 6px 18px rgba(26, 115, 232, 0.16)",
            }}
          >
            <span style={{ color: "#1a73e8" }}>رویال</span>
            <span style={{ color: "#ea4335" }}>موتور</span>
          </h1>
          <p className="rm-subtitle">
            اولین موتور هوش مصنوعی سئو اتوماتیک اینستاگرام در ایران
          </p>
          <p className="rm-desc">
            خزش بالا در رقبا • ساعت دیجیتال و ساعت شنی زنده حین سئو • هشتگ‌های ترند اختصاصی هر پیج • مقایسه رویال موتور بین ۱۰۰ رقیب ۲ و ۳ سیلاب در لوکال‌هاست و ورسل
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rm-search-card"
          style={{
            boxShadow: "0 10px 26px rgba(32, 33, 36, 0.1)",
            transform: "translateZ(0)",
          }}
        >
          <div className="rm-grid-2">
            <div>
              <label className="rm-label">
                آیدی یا نام پیج‌های کارفرما (تا ۱۰ پیج همزمان — ذخیره ۲۴/۷) *
              </label>
              <textarea
                className="rm-textarea"
                value={handlesInput}
                onChange={(e) => setHandlesInput(e.target.value)}
                placeholder="مثال: betisaaa_salon, پیج دوم"
              />
            </div>

            <div>
              <label className="rm-label">
                اسم یا آیدی پیج‌های رقیب (با هر اسم فارسی مثل: بهاره گلی، کراتین تهران)
              </label>
              <textarea
                className="rm-textarea"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                placeholder="مثال: بهاره گلی، کراتین کار برتر، competitor_2"
              />
            </div>
          </div>

          <div className="rm-grid-3">
            <div>
              <label className="rm-label">حوزه فعالیت یا صنف *</label>
              <input
                type="text"
                className="rm-input"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="مثلاً: کراتین و احیای مو"
              />
            </div>

            <div>
              <label className="rm-label">شهر یا منطقه (رقبای محلی)</label>
              <input
                type="text"
                className="rm-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="تهران"
              />
            </div>

            <div>
              <label className="rm-label">استان (رقبای استانی)</label>
              <input
                type="text"
                className="rm-input"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="تهران"
              />
            </div>
          </div>

          <div className="rm-grid-2">
            <div>
              <label className="rm-label">
                خدمات و کلمات کلیدی تخصصی (اختیاری)
              </label>
              <input
                type="text"
                className="rm-input"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="مثلاً: کراتین سرد، پروتئین‌تراپی، صافی دائم"
              />
            </div>

            <div>
              <label className="rm-label">
                شماره کارت جهت نمایش در کادر اشتراک پولی (اختیاری)
              </label>
              <input
                type="text"
                dir="ltr"
                className="rm-input"
                style={{ textAlign: "left" }}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="6037-XXXX-XXXX-XXXX"
              />
            </div>
          </div>

          <div className="rm-grid-3">
            <div>
              <label className="rm-label">موبایل کارفرما (ارسال گزارش)</label>
              <input
                type="tel"
                dir="ltr"
                className="rm-input"
                style={{ textAlign: "left" }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09120000000"
              />
            </div>

            <div>
              <label className="rm-label">ایمیل کارفرما (ارسال گزارش)</label>
              <input
                type="email"
                dir="ltr"
                className="rm-input"
                style={{ textAlign: "left" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="rm-label">کانال ارسال گزارش</label>
              <select
                className="rm-select"
                value={channel}
                onChange={(e) =>
                  setChannel(
                    e.target.value as "all" | "whatsapp" | "sms" | "email"
                  )
                }
              >
                <option value="all">همه کانال‌ها (واتساپ، پیامک، ایمیل)</option>
                <option value="whatsapp">واتساپ</option>
                <option value="sms">پیامک</option>
                <option value="email">ایمیل</option>
              </select>
            </div>
          </div>

          <div className="rm-actions">
            <button type="submit" disabled={loading} className="rm-btn-primary">
              <HourglassBadge active={loading} />
              <span>
                {loading
                  ? "در حال سئو پیج، خزش رقبا و محاسبه رتبه بین ۱۰۰ رقیب..."
                  : "اجرای موتور هوش مصنوعی + سئوی ۲۴/۷ و خزش رقبا"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rm-btn-secondary"
            >
              پاک کردن فرم و شروع مجدد
            </button>
          </div>

          {loading && (
            <div
              style={{
                marginTop: 14,
                background: "#e8f0fe",
                border: "1px solid #aecbfa",
                borderRadius: 14,
                padding: "10px 14px",
                fontSize: 12,
                color: "#174ea6",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <HourglassBadge active={hourglassFlip} />
                <strong>
                  ساعت شنی فعال: در حال سئو پیج اینستاگرام کارفرما، استخراج هشتگ‌های ترند و خزش رقبا...
                </strong>
              </div>
              <span>
                ساعت دیجیتال: <strong dir="ltr">{digitalClock}</strong>
              </span>
            </div>
          )}
        </form>

        {errorMsg && (
          <div
            className="rm-status-box"
            style={{
              background: "#fce8e6",
              color: "#c5221f",
              border: "1px solid #f6aea9",
            }}
          >
            {errorMsg}
          </div>
        )}

        {report && report.ok && (
          <div>
            {/* داشبورد خروجی چشم‌گیر سه‌بعدی ساده */}
            <div
              className="rm-card"
              style={{
                borderRight: "5px solid #1a73e8",
                boxShadow: "0 12px 28px rgba(26,115,232,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <HourglassBadge active={auto24x7} />
                  <div>
                    <h2 className="rm-section-title" style={{ margin: 0 }}>
                      داشبورد خروجی سئو و پایش ۲۴/۷ رویال موتور
                    </h2>
                    <p style={{ fontSize: 12, color: "#5f6368", margin: "4px 0 0" }}>
                      تاریخ: {report.todayShamsi} • ساعت دیجیتال:{" "}
                      <strong dir="ltr">{digitalClock}</strong> • محیط:{" "}
                      <strong>{report.royalMotor100.environment}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => runAnalysis(true)}
                    className="rm-btn-secondary"
                    style={{ padding: "7px 14px", fontSize: 12 }}
                  >
                    + ثبت اسکن جدید روی نمودار
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuto24x7((prev) => !prev)}
                    className={auto24x7 ? "rm-btn-primary" : "rm-btn-secondary"}
                    style={{ padding: "7px 14px", fontSize: 12 }}
                  >
                    {auto24x7
                      ? "پایش زنده خودکار: روشن (هر ۲۵ ثانیه)"
                      : "پایش زنده خودکار: خاموش"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintClientPdf}
                    className="rm-btn-secondary"
                    style={{ padding: "7px 14px", fontSize: 12 }}
                  >
                    خروجی PDF / چاپ گزارش کارفرما
                  </button>
                </div>
              </div>

              <div className="rm-grid-3" style={{ marginBottom: 12 }}>
                <div
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid #dadce0",
                    borderRadius: 16,
                    padding: 12,
                    boxShadow: "0 4px 12px rgba(32,33,36,0.06)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#5f6368" }}>
                    پیج‌های سئوشده در این اجرا
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#1a73e8" }}>
                    {report.customerPages.length} پیج
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid #dadce0",
                    borderRadius: 16,
                    padding: 12,
                    boxShadow: "0 4px 12px rgba(32,33,36,0.06)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#5f6368" }}>
                    رقبای خزش‌شده (محلی، استانی، کشوری)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#1e8e3e" }}>
                    {report.competitors.totalCount} رقیب
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid #dadce0",
                    borderRadius: 16,
                    padding: 12,
                    boxShadow: "0 4px 12px rgba(32,33,36,0.06)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#5f6368" }}>
                    رتبه رویال موتور بین ۱۰۰ رقیب
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#ea4335" }}>
                    رتبه #{report.royalMotor100.royalRank} از ۱۰۰
                  </div>
                </div>
              </div>

              {report.trendAlerts && report.trendAlerts.length > 0 && (
                <div
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid #dadce0",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                    fontSize: 12,
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 6 }}>
                    هشدار روند زمانی و وضعیت رشد پیج‌ها:
                  </strong>
                  <ul style={{ margin: 0, paddingRight: 18, color: "#3c4043" }}>
                    {report.trendAlerts.map((alert, i) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <a
                  href={`https://wa.me/98${CEO_PHONE.replace(
                    /^0/,
                    ""
                  )}?text=${encodeURIComponent(report.summaryText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rm-btn-primary"
                  style={{ padding: "8px 16px", fontSize: 12 }}
                >
                  ارسال گزارش در واتساپ
                </a>
                <a
                  href={`sms:${
                    report.phone || CEO_PHONE
                  }?body=${encodeURIComponent(report.summaryText)}`}
                  className="rm-btn-secondary"
                  style={{ padding: "8px 16px", fontSize: 12 }}
                >
                  ارسال پیامک
                </a>
                <a
                  href={`mailto:${
                    report.email || SUPPORT_EMAIL
                  }?subject=${encodeURIComponent(
                    "گزارش سئو ۲۴/۷ رویال موتور"
                  )}&body=${encodeURIComponent(report.summaryText)}`}
                  className="rm-btn-secondary"
                  style={{ padding: "8px 16px", fontSize: 12 }}
                >
                  ارسال ایمیل
                </a>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="rm-btn-secondary"
                  style={{ padding: "8px 16px", fontSize: 12 }}
                >
                  {copied ? "کپی شد ✓" : "کپی متن کامل گزارش"}
                </button>
              </div>
            </div>

            {/* سئوی پیج کارفرما + هشتگ‌های ترند همان پیج + نمودارهای واضح */}
            <div
              className="rm-card"
              style={{ boxShadow: "0 10px 24px rgba(32,33,36,0.08)" }}
            >
              <h3 className="rm-section-title">
                سئوی پیج کارفرما، هشتگ‌های ترند همان پیج و نمودارهای واضح
              </h3>
              {report.customerPages.map((page) => (
                <div
                  key={page.handle}
                  className="rm-item-box"
                  style={{ boxShadow: "0 4px 12px rgba(32,33,36,0.05)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 14 }}>
                      پیج #{page.index} ({page.rawLabel}):{" "}
                      <a
                        href={page.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {page.handle}
                      </a>
                      <span
                        style={{
                          fontSize: 11,
                          background: "#f1f3f4",
                          color: "#5f6368",
                          padding: "2px 8px",
                          borderRadius: 999,
                          marginRight: 6,
                        }}
                      >
                        اسکن #{page.scanCount}
                      </span>
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13,
                        color: "#137333",
                      }}
                    >
                      امتیاز سئو: {page.seoScore}/100{" "}
                      {page.scoreDelta > 0 ? `(+${page.scoreDelta} رشد)` : ""}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#e8f0fe",
                      border: "1px solid #aecbfa",
                      borderRadius: 12,
                      padding: "8px 12px",
                      fontSize: 12,
                      marginTop: 8,
                      color: "#174ea6",
                    }}
                  >
                    <strong>هشتگ‌های ترند اختصاصی پیج {page.handle}:</strong>{" "}
                    {page.trendingHashtags.join(" ")}
                  </div>

                  <ClearSeoChart page={page} />

                  <div className="rm-grid-2" style={{ marginTop: 12 }}>
                    <div
                      className="rm-item-box"
                      style={{ margin: 0, background: "#f8f9fa" }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          marginBottom: 10,
                          color: "#1e8e3e",
                        }}
                      >
                        نمودار واضح فرصت کلمات کلیدی
                      </div>
                      {page.keywordMetrics.map((km) => (
                        <div key={km.keyword} style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <span>{km.keyword}</span>
                            <strong>{km.score}٪</strong>
                          </div>
                          <div className="rm-bar-bg" style={{ height: 10 }}>
                            <div
                              style={{
                                width: `${km.score}%`,
                                height: "100%",
                                background: "#1e8e3e",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="rm-item-box"
                      style={{ margin: 0, background: "#f8f9fa" }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          marginBottom: 10,
                          color: "#e37400",
                        }}
                      >
                        نمودار واضح هشتگ‌های ترند پیج
                      </div>
                      {page.hashtagMetrics.map((hm) => (
                        <div key={hm.tag} style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <span>{hm.tag}</span>
                            <strong>{hm.score}٪</strong>
                          </div>
                          <div className="rm-bar-bg" style={{ height: 10 }}>
                            <div
                              style={{
                                width: `${hm.score}%`,
                                height: "100%",
                                background: "#e37400",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, marginTop: 10 }}>
                    <strong>کلمات کلیدی هدف:</strong> {page.keywords.join("، ")}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>
                    <strong>اقدامات سئوی واقعی روی پیج:</strong>
                    <ul
                      style={{
                        margin: "4px 0 0",
                        paddingRight: 18,
                        color: "#3c4043",
                      }}
                    >
                      {page.checklist.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* مقایسه رویال موتور بین ۱۰۰ رقیب ۲ سیلاب و ۳ سیلاب در لوکال‌هاست و ورسل */}
            {report.royalMotor100 && (
              <div
                className="rm-card"
                style={{ boxShadow: "0 10px 24px rgba(32,33,36,0.08)" }}
              >
                <h3 className="rm-section-title">
                  جایگاه سایت رویال موتور بین ۱۰۰ رقیب (۲ سیلاب و ۳ سیلاب) در لوکال‌هاست و ورسل
                </h3>

                <div
                  style={{
                    background: "#e8f0fe",
                    border: "1px solid #aecbfa",
                    borderRadius: 14,
                    padding: 12,
                    fontSize: 12,
                    color: "#174ea6",
                    marginBottom: 12,
                  }}
                >
                  <strong>محیط فعال:</strong> {report.royalMotor100.environment} •{" "}
                  <strong>امتیاز رویال موتور:</strong>{" "}
                  {report.royalMotor100.royalScore}/100 •{" "}
                  <strong>رتبه نهایی:</strong> #
                  {report.royalMotor100.royalRank} از{" "}
                  {report.royalMotor100.totalRivals} رقیب (۵۰ رقیب ۲ سیلاب + ۵۰
                  رقیب ۳ سیلاب)
                </div>

                <div className="rm-tab-row">
                  {(["همه", "۲ سیلاب", "۳ سیلاب"] as const).map((syl) => (
                    <button
                      key={syl}
                      type="button"
                      onClick={() => setSyllableFilter(syl)}
                      className={`rm-tab ${
                        syllableFilter === syl ? "active" : ""
                      }`}
                    >
                      {syl === "همه"
                        ? "همه ۱۰۰ رقیب (۲ و ۳ سیلاب)"
                        : `رقبای ${syl} (۵۰ مورد)`}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    maxHeight: 280,
                    overflowY: "auto",
                    border: "1px solid #e8eaed",
                    borderRadius: 14,
                    padding: 10,
                    background: "#f8f9fa",
                  }}
                >
                  {displayedRivals100.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 8,
                        padding: "7px 10px",
                        borderBottom: "1px solid #e8eaed",
                        fontSize: 12,
                        background: "#ffffff",
                        borderRadius: 10,
                        marginBottom: 6,
                      }}
                    >
                      <div>
                        <strong>
                          #{r.id} — {r.name}
                        </strong>{" "}
                        <span style={{ color: "#1a73e8" }}>
                          ({r.syllables})
                        </span>{" "}
                        <span style={{ color: "#5f6368" }}>• {r.domain}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: "#3c4043" }}>
                        امتیاز: {r.score}/100 | {r.focus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* بخش سناریو ترند */}
            <div className="rm-card">
              <h3 className="rm-section-title">
                بخش سناریو ترند (با امتیاز وایرال، بهترین زمان انتشار و مخاطب هدف)
              </h3>
              {report.trendScenarios.map((sc) => (
                <div
                  key={sc.id}
                  className="rm-item-box"
                  style={{ background: "#f8f9fa", fontSize: 12 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <strong style={{ fontSize: 14, color: "#1a73e8" }}>
                      {sc.title}
                    </strong>
                    <span
                      style={{
                        background: "#e8f0fe",
                        color: "#174ea6",
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontWeight: 700,
                      }}
                    >
                      امتیاز وایرال: {sc.viralScore}/100 • {sc.duration}
                    </span>
                  </div>
                  <div style={{ marginBottom: 4, color: "#3c4043" }}>
                    <strong>بهترین زمان انتشار:</strong> {sc.bestTime} |{" "}
                    <strong>مخاطب هدف:</strong> {sc.targetAudience}
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <strong>قلاب ۳ ثانیه اول:</strong> {sc.hook3Sec}
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <strong>متن و ساختار سناریو:</strong> {sc.bodyScript}
                  </div>
                  <div style={{ marginBottom: 4, color: "#137333" }}>
                    <strong>دعوت به اقدام (CTA):</strong> {sc.cta}
                  </div>
                  <div>
                    <strong>کلمه کلیدی و هشتگ ترند:</strong> {sc.targetKeyword} |{" "}
                    {sc.hashtags.join(" ")}
                  </div>
                </div>
              ))}
            </div>

            {/* قیف تبدیل دایرکت و کامنت */}
            {report.funnelPlaybook && (
              <div className="rm-card">
                <h3 className="rm-section-title">
                  قیف تبدیل دایرکت و کامنت به مشتری (DM & Comment Funnel)
                </h3>
                <div style={{ fontSize: 12, marginBottom: 10 }}>
                  <strong>کلمات کلیدی کامنت پیشنهادی:</strong>{" "}
                  {report.funnelPlaybook.commentKeywords.map((ck) => (
                    <span
                      key={ck}
                      style={{
                        display: "inline-block",
                        background: "#e8f0fe",
                        color: "#174ea6",
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontWeight: 700,
                        marginLeft: 6,
                      }}
                    >
                      {ck}
                    </span>
                  ))}
                </div>

                <div className="rm-item-box" style={{ fontSize: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <strong>پاسخ آماده زیر کامنت:</strong>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyScript(
                          "comment",
                          report.funnelPlaybook.autoCommentReply
                        )
                      }
                      className="rm-btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 11 }}
                    >
                      {copiedScriptKey === "comment" ? "کپی شد ✓" : "کپی متن"}
                    </button>
                  </div>
                  <div>{report.funnelPlaybook.autoCommentReply}</div>
                </div>

                <div className="rm-item-box" style={{ fontSize: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <strong>پیام خوش‌آمد و شروع گفتگو در دایرکت:</strong>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyScript(
                          "dmWelcome",
                          report.funnelPlaybook.dmWelcomeScript
                        )
                      }
                      className="rm-btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 11 }}
                    >
                      {copiedScriptKey === "dmWelcome" ? "کپی شد ✓" : "کپی متن"}
                    </button>
                  </div>
                  <div>{report.funnelPlaybook.dmWelcomeScript}</div>
                </div>

                <div
                  className="rm-item-box"
                  style={{ fontSize: 12, marginBottom: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <strong>مسیر نهایی هدایت به مشاوره یا خرید:</strong>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyScript(
                          "dmClosing",
                          report.funnelPlaybook.dmClosingScript
                        )
                      }
                      className="rm-btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 11 }}
                    >
                      {copiedScriptKey === "dmClosing" ? "کپی شد ✓" : "کپی متن"}
                    </button>
                  </div>
                  <div>{report.funnelPlaybook.dmClosingScript}</div>
                </div>
              </div>
            )}

            {/* آنالیز ریلزهای رقبا با اسم فارسی و استراتژی کارفرما */}
            {report.directCompetitors.length > 0 && (
              <div className="rm-card">
                <h3 className="rm-section-title">
                  استخراج پیج رقبا با اسم فارسی، آنالیز ریلزها و استراتژی برای کارفرما
                </h3>
                {report.directCompetitors.map((comp) => (
                  <div
                    key={comp.handle}
                    className="rm-item-box"
                    style={{ fontSize: 12 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>
                        رقیب «{comp.rawLabel}» → پیج:{" "}
                        <a
                          href={comp.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {comp.handle}
                        </a>
                      </strong>
                      <span style={{ fontWeight: 700, color: "#1a73e8" }}>
                        امتیاز سئو: {comp.seoScore}/100 | کلمات کلیدی:{" "}
                        {comp.keywordStrength}٪ | هشتگ:{" "}
                        {comp.hashtagStrength}٪
                      </span>
                    </div>

                    <div
                      style={{
                        background: "#f8f9fa",
                        border: "1px solid #e8eaed",
                        borderRadius: 12,
                        padding: 10,
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        آنالیز ریلزهای رقیب:
                      </div>
                      <div>• فرمت غالب: {comp.reelsAnalysis.topFormat}</div>
                      <div>
                        • الگوی نگهداشت مخاطب:{" "}
                        {comp.reelsAnalysis.retentionPattern}
                      </div>
                      <div>
                        • کاربرد کلیدواژه: {comp.reelsAnalysis.keywordUsage}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#e8f0fe",
                        color: "#174ea6",
                        padding: 10,
                        borderRadius: 12,
                      }}
                    >
                      <div style={{ fontWeight: 800, marginBottom: 4 }}>
                        استراتژی پیشنهادی برای تحویل به کارفرما:
                      </div>
                      <ul style={{ margin: 0, paddingRight: 18 }}>
                        {comp.employerStrategy.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* لیست کامل رقبا در سطح محلی، استانی و کشوری */}
            <div className="rm-card">
              <h3 className="rm-section-title">
                لیست کامل رقبا و آنالیز ریلزها در سطح محلی، استانی و کشوری
              </h3>

              <div className="rm-tab-row">
                {(["محلی", "استانی", "کشوری", "همه"] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setActiveTier(tier)}
                    className={`rm-tab ${activeTier === tier ? "active" : ""}`}
                  >
                    {tier === "همه" ? "نمایش یکجای همه رقبا" : `رقبای ${tier}`}
                  </button>
                ))}
              </div>

              {displayedCompetitors.length > 0 ? (
                displayedCompetitors.map((c, idx) => (
                  <div
                    key={`${c.tier}-${c.rank}-${c.name}-${idx}`}
                    className="rm-item-box"
                    style={{ fontSize: 12 }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                    >
                      #{c.rank} — {c.name}{" "}
                      <span style={{ color: "#1a73e8" }}>
                        ({c.tier} • {c.scope})
                      </span>
                    </div>
                    <div>
                      <strong>پیج اینستاگرام:</strong>{" "}
                      {c.igUrl ? (
                        <a href={c.igUrl} target="_blank" rel="noreferrer">
                          {c.igHandle}
                        </a>
                      ) : (
                        <span style={{ color: "#80868b" }}>ثبت نشده</span>
                      )}
                    </div>
                    <div>
                      <strong>وب‌سایت:</strong>{" "}
                      {c.websiteUrl ? (
                        <a
                          href={c.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {c.websiteUrl}
                        </a>
                      ) : (
                        <span style={{ color: "#80868b" }}>ثبت نشده</span>
                      )}
                    </div>
                    <div>
                      <strong>آنالیز ریلزها:</strong> {c.reelAnalysis}
                    </div>
                    <div>
                      <strong>وضعیت استوری:</strong> {c.latestStory}
                    </div>
                    <div>
                      <strong>پلن تبلیغاتی:</strong> {c.adPlan}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    fontSize: 12,
                    color: "#5f6368",
                    padding: 12,
                    background: "#f8f9fa",
                    borderRadius: 12,
                  }}
                >
                  در حال حاضر موردی در سطح «{activeTier}» در نقشه عمومی ثبت
                  نشده است.
                </div>
              )}
            </div>

            {/* تقویم محتوایی به‌روز با کادر قرمز اشتراک پولی */}
            <div className="rm-card">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <h3 className="rm-section-title" style={{ margin: 0 }}>
                  تقویم محتوایی به‌روز (هفته رایگان + پلن‌های یک‌ماهه و دوماهه)
                </h3>
                <button
                  type="button"
                  onClick={() => setSortByViral((prev) => !prev)}
                  className={sortByViral ? "rm-btn-primary" : "rm-btn-secondary"}
                  style={{ padding: "6px 14px", fontSize: 12 }}
                >
                  {sortByViral
                    ? "مرتب‌سازی: بیشترین امتیاز وایرال ✓"
                    : "اولویت‌بندی بر اساس امتیاز وایرال"}
                </button>
              </div>

              <p
                style={{
                  fontSize: 12,
                  color: "#5f6368",
                  margin: "0 0 12px",
                }}
              >
                تنظیم‌شده به‌صورت به‌روز برای تاریخ: {report.todayShamsi} • وضعیت اشتراک فعلی:{" "}
                <strong>
                  {subscriptionPlan === "free"
                    ? "رایگان (هفته اول باز)"
                    : subscriptionPlan === "paid_1m"
                    ? "اشتراک ۱ ماهه فعال"
                    : subscriptionPlan === "paid_2m"
                    ? "اشتراک ۲ ماهه فعال"
                    : "اشتراک VIP کامل باز"}
                </strong>
              </p>

              <div className="rm-tab-row">
                <button
                  type="button"
                  onClick={() => setActiveCal("free_week")}
                  className={`rm-tab ${
                    activeCal === "free_week" ? "active" : ""
                  }`}
                >
                  ۱ هفته رایگان (روز ۱ تا ۷)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCal("paid_1m")}
                  className={`rm-tab ${activeCal === "paid_1m" ? "active" : ""}`}
                >
                  تقویم پولی ۱ ماهه (روز ۸ تا ۳۰)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCal("paid_2m")}
                  className={`rm-tab ${activeCal === "paid_2m" ? "active" : ""}`}
                >
                  تقویم پولی ۲ ماهه (روز ۳۱ تا ۶۰)
                </button>
              </div>

              <div className="rm-vip-red">
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#c5221f",
                    marginBottom: 6,
                  }}
                >
                  فعال‌سازی اشتراک ویژه تقویم یک‌ماهه و دوماهه + سئوی نامحدود
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                  <div>
                    <strong>شماره کارت جهت واریز اشتراک:</strong>{" "}
                    <span
                      dir="ltr"
                      style={{
                        background: "#ffffff",
                        padding: "2px 10px",
                        borderRadius: 8,
                        border: "1px solid #f6aea9",
                        fontWeight: 800,
                        color: "#c5221f",
                      }}
                    >
                      {report.cardNumber}
                    </span>
                  </div>
                  <div>
                    <strong>به‌نام:</strong> امیر سام یعقوبی (مدیرعامل استارتاپ
                    هوش مصنوعی رویال فام)
                  </div>
                  <div>
                    <strong>پشتیبانی و ارسال فیش واریزی:</strong>{" "}
                    <a
                      href={`tel:${CEO_PHONE}`}
                      style={{ fontWeight: 700, color: "#c5221f" }}
                    >
                      {CEO_PHONE}
                    </a>{" "}
                    | <span>ایمیل: {SUPPORT_EMAIL}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <input
                      type="text"
                      dir="ltr"
                      className="rm-input"
                      style={{
                        maxWidth: 220,
                        padding: "7px 14px",
                        fontSize: 12,
                        textAlign: "left",
                      }}
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      placeholder="کد اشتراک (مثلاً ROYALVIP)"
                    />
                    <button
                      type="button"
                      onClick={() => runAnalysis(false, subscriptionPlan)}
                      className="rm-btn-primary"
                      style={{ padding: "7px 14px", fontSize: 12 }}
                    >
                      بررسی کد اشتراک
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubscriptionPlan("vip_all");
                        runAnalysis(false, "vip_all");
                      }}
                      className="rm-btn-secondary"
                      style={{ padding: "7px 14px", fontSize: 12 }}
                    >
                      آنلاک آزمایشی همه روزها
                    </button>
                  </div>

                  {report.codeStatusMessage && (
                    <div
                      style={{
                        marginTop: 8,
                        background: "#ffffff",
                        border: "1px solid #f6aea9",
                        borderRadius: 10,
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "#7f1d1d",
                        fontWeight: 700,
                      }}
                    >
                      {report.codeStatusMessage}
                    </div>
                  )}
                </div>
              </div>

              {displayedCalendar.slice(0, 10).map((item) => (
                <div
                  key={`${item.tier}-${item.day}`}
                  className="rm-item-box"
                  style={{
                    borderColor: item.locked ? "#f6aea9" : "#e8eaed",
                    background: item.locked ? "#fff8f7" : "#ffffff",
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <strong style={{ fontSize: 13 }}>
                      روز {item.day} ({item.label}) — {item.format}: {item.title}
                    </strong>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontWeight: 700,
                        background: item.locked ? "#fce8e6" : "#e6f4ea",
                        color: item.locked ? "#c5221f" : "#137333",
                      }}
                    >
                      {item.locked ? "قفل اشتراک پولی" : "رایگان / باز"}
                    </span>
                  </div>
                  <div style={{ color: "#3c4043", marginBottom: 4 }}>
                    <strong>امتیاز وایرال:</strong> {item.viralScore}/100 (
                    {item.priority}) | <strong>بهترین زمان انتشار:</strong>{" "}
                    {item.bestTime} | <strong>مخاطب هدف:</strong>{" "}
                    {item.targetAudience}
                  </div>
                  <div style={{ color: "#5f6368" }}>
                    <strong>کلمه کلیدی:</strong> {item.kw} |{" "}
                    <strong>هشتگ‌ها:</strong> {item.tags.join(" ")}
                  </div>
                  {!item.locked && (
                    <div style={{ marginTop: 4 }}>
                      <strong>قلاب محتوایی:</strong> {item.hook}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="rm-footer">
        <div className="rm-footer-inner">
          <div>
            توسعه‌دهنده، مالک، مدیر اجرایی و مدیرعامل استارتاپ فناورانه هوش
            مصنوعی رویال فام:{" "}
            <strong style={{ color: "#202124" }}>امیر سام یعقوبی</strong>
          </div>
          <div>
            تماس: <strong style={{ color: "#202124" }}>{CEO_PHONE}</strong> |
            ایمیل پشتیبانی:{" "}
            <strong style={{ color: "#202124" }}>{SUPPORT_EMAIL}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
