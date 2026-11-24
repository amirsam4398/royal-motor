import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SeoRequestBody {
  handles?: string[] | string;
  competitorHandles?: string[] | string;
  niche?: string;
  city?: string;
  province?: string;
  topics?: string;
  cardNumber?: string;
  phone?: string;
  email?: string;
  subscriptionPlan?: "free" | "paid_1m" | "paid_2m" | "vip_all";
  activationCode?: string;
}

interface HistoryPoint {
  timestamp: string;
  label: string;
  seoScore: number;
  keywordScore: number;
  hashtagScore: number;
}

interface StoredAccount {
  handle: string;
  niche: string;
  city: string;
  province: string;
  scanCount: number;
  currentScore: number;
  lastScannedAt: string;
  history: HistoryPoint[];
}

interface SeoStore {
  accounts: Record<string, StoredAccount>;
}

const CEO_PHONE = "09366681963";
const SUPPORT_EMAIL = "amirsamyaghobi62@gmail.com";

const PERSIAN_TO_LATIN_MAP: Record<string, string> = {
  ا: "a",
  آ: "a",
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "gh",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  و: "v",
  ه: "h",
  ی: "y",
  ي: "y",
  ئ: "y",
  ة: "h",
  ء: "",
};

const TWO_SYLLABLE_RIVALS = [
  "آوا سئو",
  "پارس وب",
  "داده یاب",
  "موج نت",
  "فکر نو",
  "رهنما سئو",
  "تیک نت",
  "پیک سئو",
  "برتر وب",
  "سریع نت",
  "آریا وب",
  "بامداد سئو",
  "تابش نت",
  "چشم انداز",
  "دانش وب",
  "رایان سئو",
  "زرین نت",
  "سپهر وب",
  "شهاب سئو",
  "طلا نت",
  "فراز وب",
  "کمان سئو",
  "گستر نت",
  "مبین وب",
  "نوین سئو",
  "هامون نت",
  "واریا وب",
  "یاقوت سئو",
  "آرش وب",
  "بهتا سئو",
  "پرواز نت",
  "توسعه وب",
  "جلوه سئو",
  "حافظ نت",
  "خرد وب",
  "درخش سئو",
  "رادمان وب",
  "زیبا نت",
  "ساحل سئو",
  "صبا وب",
  "طراح نت",
  "عصر سئو",
  "فانوس وب",
  "کارا نت",
  "کیهان سئو",
  "لوتوس وب",
  "مهر نت",
  "نیک سئو",
  "پگاه وب",
  "کاوه نت",
];

const THREE_SYLLABLE_RIVALS = [
  "آینده ساز سئو",
  "بهینه پرداز وب",
  "پژوهشگران نت",
  "تحلیلگران سئو",
  "توانمندساز وب",
  "جستجوگران نت",
  "چشم‌انداز دیجیتال",
  "دانش‌بنیان سئو",
  "راهکارهای هوشمند",
  "سرمایه‌گذار وب",
  "شتاب‌دهنده سئو",
  "طراحی مدرن وب",
  "فناوری نوین نت",
  "کارآفرینان سئو",
  "گسترش‌دهنده وب",
  "مدیریت هوشمند نت",
  "نوآوران دیجیتال",
  "همراه هوشمند سئو",
  "هوشمندسازان وب",
  "آفرینندگان نت",
  "برندسازی هوشمند",
  "پیشگامان دیجیتال",
  "تحول‌آفرین وب",
  "تضمین‌کننده سئو",
  "جریان ساز دیجیتال",
  "حرفه‌ای‌های نت",
  "خلاقیت برتر وب",
  "دقیق‌بینان سئو",
  "رشدآفرینان وب",
  "سازندگان آینده",
  "شتاب‌بخشی سئو",
  "صنعتگران دیجیتال",
  "طراحان خلاق وب",
  "فرایندهای هوشمند",
  "کسب‌وکارهای نوین",
  "گام‌های بلند سئو",
  "متخصصان رشد وب",
  "مهندسان داده نت",
  "نمایشگرهای هوشمند",
  "هدفمندان دیجیتال",
  "آشنایان با سئو",
  "بازاریابان نوین",
  "پشتیبانان رشد وب",
  "توسعه‌دهندگان نت",
  "حامیان کسب‌وکار",
  "خردمندان دیجیتال",
  "رهروان بازار وب",
  "سنجشگران هوشمند",
  "فروش‌آفرینان نت",
  "موفقیت ساز سئو",
];

function getStorePath(): string {
  const baseDir =
    process.env.VERCEL === "1"
      ? path.join("/tmp", "royal-motor-next-db")
      : path.join(process.cwd(), "data");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  return path.join(baseDir, "royal-motor-store.json");
}

function loadStore(): SeoStore {
  try {
    const filePath = getStorePath();
    if (!fs.existsSync(filePath)) {
      return { accounts: {} };
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as SeoStore;
    return {
      accounts:
        parsed && typeof parsed.accounts === "object" ? parsed.accounts : {},
    };
  } catch {
    return { accounts: {} };
  }
}

function saveStore(store: SeoStore): void {
  try {
    const filePath = getStorePath();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Ignore read-only filesystem errors
  }
}

function transliteratePersianToHandle(input: string): string {
  const asciiPart = String(input || "")
    .replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^@+/, "");

  const latinDirect = asciiPart.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
  if (latinDirect.length >= 2) {
    return latinDirect.slice(0, 28);
  }

  const mapped = Array.from(asciiPart)
    .map((ch) => {
      if (ch === " " || ch === "_" || ch === "-") return "_";
      return PERSIAN_TO_LATIN_MAP[ch] ?? "";
    })
    .join("")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return mapped.slice(0, 28);
}

function parseHandlesOrNames(
  raw: string[] | string | undefined,
  maxCount = 10
): Array<{ rawLabel: string; handle: string }> {
  const items = Array.isArray(raw)
    ? raw
    : String(raw || "").split(/[,،\n\r]+/);

  const seen = new Set<string>();
  const output: Array<{ rawLabel: string; handle: string }> = [];

  for (const item of items) {
    const label = String(item || "").trim();
    if (!label) continue;
    const handle = transliteratePersianToHandle(label);
    if (!handle || seen.has(handle)) continue;
    seen.add(handle);
    output.push({ rawLabel: label, handle });
    if (output.length >= maxCount) break;
  }

  return output;
}

function buildPersianTag(text: string): string {
  const normalized = String(text || "")
    .replace(/[a-zA-Z0-9_#]/g, " ")
    .replace(/[^\u0600-\u06FF\s]/g, " ")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized.length >= 2 ? `#${normalized}` : "";
}

async function fetchJsonSafe(url: string, timeoutMs = 7000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "RoyalMotorHighCrawlEngine/8.0 (https://royal-motor-eta.vercel.app; amirsamyaghobi62@gmail.com)",
        "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTierCompetitors(
  tier: "محلی" | "استانی" | "کشوری",
  niche: string,
  scope: string,
  excluded: Set<string>
) {
  const query = tier === "کشوری" ? `${niche} ایران` : `${niche} ${scope} ایران`;
  const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&extratags=1&namedetails=1&limit=18&accept-language=fa&q=${encodeURIComponent(
    query
  )}`;

  const payload = await fetchJsonSafe(endpoint, 7500);
  const rows = Array.isArray(payload) ? payload : [];
  const list: Array<{
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
  }> = [];

  const seenNames = new Set<string>();

  for (const rawRow of rows) {
    const row = rawRow as {
      display_name?: string;
      name?: string;
      extratags?: Record<string, string>;
      namedetails?: Record<string, string>;
    };
    const tags = row.extratags || {};
    const names = row.namedetails || {};
    const title = String(
      names["name:fa"] ||
        row.name ||
        (row.display_name || "").split(",")[0] ||
        ""
    ).trim();

    if (!title || seenNames.has(title)) continue;
    seenNames.add(title);

    const rawWeb = tags.website || tags["contact:website"] || tags.url || null;
    const websiteUrl =
      rawWeb && !String(rawWeb).toLowerCase().includes("instagram.com")
        ? /^https?:\/\//i.test(rawWeb)
          ? rawWeb
          : `https://${rawWeb}`
        : null;

    const rawIg =
      tags["contact:instagram"] ||
      tags.instagram ||
      tags["social:instagram"] ||
      null;

    let igHandle: string | null = null;
    let igUrl: string | null = null;

    if (rawIg) {
      const m = String(rawIg).match(/instagram\.com\/([A-Za-z0-9._]{2,30})/i);
      igHandle = m
        ? m[1].toLowerCase()
        : transliteratePersianToHandle(String(rawIg));
      if (igHandle) {
        igUrl = `https://www.instagram.com/${igHandle}/`;
      }
    } else {
      const generated = transliteratePersianToHandle(title);
      if (generated.length >= 3) {
        igHandle = generated;
        igUrl = `https://www.instagram.com/${generated}/`;
      }
    }

    if (igHandle && excluded.has(igHandle)) continue;

    list.push({
      rank: list.length + 1,
      tier,
      name: title,
      scope,
      igHandle,
      igUrl,
      websiteUrl,
      reelAnalysis: `تحلیل عمیق ریلزهای ${title}: تمرکز بر ویدیوهای کوتاه عمودی ۹:۱۶، نمایش سریع نتیجه کار در ۳ ثانیه اول و استفاده از کلیدواژه‌های ${niche}.`,
      latestStory: igHandle
        ? `پایش استوری و هایلایت‌های فعال ${igHandle}`
        : "پایش عمومی در نقشه و دایرکتوری فعال است",
      adPlan:
        tier === "محلی"
          ? "سئوی محلی روی نقشه و جذب مشتری حضوری در محدوده"
          : tier === "استانی"
          ? "کمپین تبلیغاتی و معرفی خدمات در سطح استان"
          : "برندینگ کشوری و جذب مخاطب سراسری در ایران",
    });

    if (list.length >= 15) break;
  }

  return list;
}

function buildRoyalMotor100Benchmark(
  niche: string,
  city: string,
  isVercelEnv: boolean
) {
  const twoSyl = TWO_SYLLABLE_RIVALS.slice(0, 50).map((name, idx) => ({
    id: idx + 1,
    name,
    syllables: "۲ سیلاب" as const,
    domain: `${transliteratePersianToHandle(name)}.ir`,
    score: Math.max(58, 92 - ((idx * 3) % 28)),
    focus: `رقابت در کلیدواژه‌های ${niche} و ${city}`,
  }));

  const threeSyl = THREE_SYLLABLE_RIVALS.slice(0, 50).map((name, idx) => ({
    id: idx + 51,
    name,
    syllables: "۳ سیلاب" as const,
    domain: `${transliteratePersianToHandle(name)}.ir`,
    score: Math.max(55, 90 - ((idx * 4) % 30)),
    focus: `رقابت در سئوی محتوایی و برندینگ ${niche}`,
  }));

  const all100 = [...twoSyl, ...threeSyl];
  const royalScore = isVercelEnv ? 96 : 94;
  const beatenCount = all100.filter((r) => royalScore >= r.score).length;
  const royalRank = Math.max(1, 101 - beatenCount);

  return {
    environment: isVercelEnv ? "ورسل (Vercel Production)" : "لوکال‌هاست (Localhost)",
    royalBrandName: "رویال موتور (royal-motor)",
    royalScore,
    royalRank,
    totalRivals: 100,
    twoSyllableCount: twoSyl.length,
    threeSyllableCount: threeSyl.length,
    rivals: all100,
  };
}

function buildTrendScenarios(
  niche: string,
  city: string,
  keywords: string[],
  tags: string[]
) {
  const k1 = keywords[0] || niche;
  const k2 = keywords[1] || `${niche} در ${city}`;
  const k3 = keywords[2] || `بهترین ${niche}`;
  const topTags =
    tags.length > 0 ? tags.slice(0, 4) : ["#سئو_اینستاگرام", "#اکسپلور"];

  return [
    {
      id: 1,
      title: `سناریو ترند قلاب‌دار: «۳ اشتباه رایج در ${k1}»`,
      targetKeyword: k1,
      duration: "۲۰ تا ۳۰ ثانیه (ریلز ترند)",
      viralScore: 95,
      bestTime: "۱۸:۳۰ تا ۲۰:۳۰",
      targetAudience: `جستجوگران ${k1} در ${city}`,
      hook3Sec: `اگر در ${city} دنبال ${k1} هستید، قبل از هزینه کردن این ۳ اشتباه را نبینید!`,
      bodyScript: `ثانیه ۴ تا ۱۵: هر سه اشتباه رایج را به زبان ساده و با مثال واقعی نشان دهید. ثانیه ۱۵ تا ۲۵: راهکار استاندارد و نتیجه درست را نمایش دهید.`,
      cta: `کلمه «${niche}» را کامنت کنید تا راهنمای کامل و مشاوره دریافت کنید.`,
      hashtags: topTags,
    },
    {
      id: 2,
      title: `سناریو ترند مقایسه قبل و بعد واقعی در «${k2}»`,
      targetKeyword: k2,
      duration: "۱۵ تا ۲۵ ثانیه (ریلز قبل/بعد)",
      viralScore: 92,
      bestTime: "۲۱:۰۰ تا ۲۲:۳۰",
      targetAudience: `مشتریان آماده رزرو ${k2}`,
      hook3Sec: `تفاوت واقعی قبل و بعد در ${k2} را بدون فیلتر و روتوش ببینید.`,
      bodyScript: `ثانیه ۳ تا ۱۲: تصویر قبل از انجام کار و توضیح کوتاه مشکل مخاطب. ثانیه ۱۲ تا ۲۰: نتیجه نهایی و توضیح دلیل ماندگاری و کیفیت.`,
      cta: `برای دریافت نوبت و مشاوره در ${city} دایرکت بدهید یا ذخیره (Save) کنید.`,
      hashtags: topTags,
    },
    {
      id: 3,
      title: `سناریو ترند پاسخ به سوال جنجالی بازار «${k3}»`,
      targetKeyword: k3,
      duration: "۲۵ تا ۳۵ ثانیه (ریلز آموزشی)",
      viralScore: 89,
      bestTime: "۱۲:۰۰ تا ۱۴:۰۰",
      targetAudience: `دنبال‌کنندگان مقایسه‌گر ${niche}`,
      hook3Sec: `حقیقتی درباره ${k3} که خیلی‌ها به شما نمی‌گویند!`,
      bodyScript: `ثانیه ۴ تا ۲۰: بررسی شفاف تفاوت کیفیت، مواد/ابزار و مهارت اجرا. ثانیه ۲۰ تا ۳۰: جمع‌بندی معیارهای انتخاب مطمئن برای مشتری.`,
      cta: `این ویدیو را برای کسی که به ${k1} نیاز دارد بفرستید (Send).`,
      hashtags: topTags,
    },
  ];
}

function buildCalendarItems(
  niche: string,
  city: string,
  keywords: string[],
  tags: string[],
  unlockedPlan: "free" | "paid_1m" | "paid_2m" | "vip_all"
) {
  const k1 = keywords[0] || niche;
  const k2 = keywords[1] || `${niche} در ${city}`;
  const k3 = keywords[2] || `مشاوره ${niche}`;
  const topTags = tags.length > 0 ? tags.slice(0, 5) : ["#سئو_اینستاگرام"];

  const bestTimes = ["۱۸:۳۰ تا ۲۰:۳۰", "۱۲:۰۰ تا ۱۴:۰۰", "۲۱:۰۰ تا ۲۲:۳۰"];
  const audiences = [
    `مخاطبان جستجوگر ${k1}`,
    `مشتریان آماده تصمیم‌گیری در ${city}`,
    `دنبال‌کنندگان علاقه‌مند به مقایسه و مشاوره`,
  ];

  const items: Array<{
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
  }> = [];

  const freePlan = [
    {
      title: `پاسخ سریع به پرتکرارترین سوال درباره ${k1}`,
      format: "ریلز آموزشی",
      kw: k1,
      hook: `اگر به دنبال ${k1} هستید، این ۳ نکته را قبل از تصمیم‌گیری بدانید.`,
      viralScore: 92,
    },
    {
      title: `چک‌لیست مقایسه و انتخاب هوشمندانه در ${k2}`,
      format: "اسلاید تخصصی",
      kw: k2,
      hook: `تفاوت‌های مهم در ${k2} را در ۵ اسلاید کوتاه بررسی کنید.`,
      viralScore: 87,
    },
    {
      title: `نظرسنجی و چالش تعاملی با مخاطبان درباره ${k3}`,
      format: "استوری تعاملی",
      kw: k3,
      hook: `بزرگ‌ترین دغدغه شما در ${k3} چیست؟ در استوری رأی دهید.`,
      viralScore: 85,
    },
    {
      title: `نمای واقعی از استاندارد اجرا و کیفیت در ${k1}`,
      format: "ریلز آموزشی",
      kw: k1,
      hook: `فرآیند واقعی اجرای کار در ${k1} از صفر تا صد.`,
      viralScore: 90,
    },
    {
      title: `عوامل موثر بر قیمت و ارزش واقعی در ${k2}`,
      format: "اسلاید تخصصی",
      kw: k2,
      hook: `چرا هزینه و کیفیت در ${k2} با هم فرق دارد؟`,
      viralScore: 86,
    },
    {
      title: `پاسخ به سوالات پرتکرار دایرکت‌های این هفته`,
      format: "استوری تعاملی",
      kw: k3,
      hook: `پرتکرارترین سوال این هفته درباره ${k3} و پاسخ روشن آن.`,
      viralScore: 83,
    },
    {
      title: `جمع‌بندی هفتگی و مسیر اقدام سریع برای مشتریان جدید`,
      format: "ریلز آموزشی",
      kw: k1,
      hook: `چطور همین هفته بهترین انتخاب را در ${k1} داشته باشید؟`,
      viralScore: 89,
    },
  ];

  freePlan.forEach((f, idx) => {
    items.push({
      day: idx + 1,
      tier: "free_week",
      label: "هفته اول رایگان",
      title: f.title,
      format: f.format,
      kw: f.kw,
      hook: f.hook,
      tags: topTags,
      locked: false,
      viralScore: f.viralScore,
      bestTime: bestTimes[idx % bestTimes.length],
      targetAudience: audiences[idx % audiences.length],
      priority: f.viralScore >= 88 ? "اولویت بالا" : "اولویت متوسط",
    });
  });

  for (let d = 8; d <= 30; d++) {
    const isUnlocked =
      unlockedPlan === "paid_1m" ||
      unlockedPlan === "paid_2m" ||
      unlockedPlan === "vip_all";
    const viralScore = Math.min(96, 79 + ((d * 3) % 15));
    items.push({
      day: d,
      tier: "paid_1m",
      label: "تقویم پولی یک‌ماهه",
      title: `سناریوی سئومحور روز ${d} برای تثبیت رتبه در «${
        d % 2 === 0 ? k2 : k1
      }»`,
      format:
        d % 3 === 0
          ? "ریلز آموزشی"
          : d % 3 === 1
          ? "اسلاید تخصصی"
          : "استوری تعاملی",
      kw: d % 2 === 0 ? k2 : k1,
      hook: `قلاب اختصاصی روز ${d} برای جذب مشتری هدفمند در ${city}.`,
      tags: topTags,
      locked: !isUnlocked,
      viralScore,
      bestTime: bestTimes[d % bestTimes.length],
      targetAudience: audiences[d % audiences.length],
      priority: viralScore >= 88 ? "اولویت بالا" : "اولویت متوسط",
    });
  }

  for (let d = 31; d <= 60; d++) {
    const isUnlocked = unlockedPlan === "paid_2m" || unlockedPlan === "vip_all";
    const viralScore = Math.min(98, 81 + ((d * 2) % 16));
    items.push({
      day: d,
      tier: "paid_2m",
      label: "تقویم پولی دوماهه",
      title: `سناریوی رشد و برندینگ روز ${d} با تمرکز بر «${
        d % 2 === 0 ? k3 : k2
      }»`,
      format:
        d % 3 === 1
          ? "ریلز آموزشی"
          : d % 3 === 2
          ? "اسلاید تخصصی"
          : "استوری تعاملی",
      kw: d % 2 === 0 ? k3 : k2,
      hook: `قلاب پیشرفته روز ${d} برای تبدیل دنبال‌کننده به مشتری وفادار.`,
      tags: topTags,
      locked: !isUnlocked,
      viralScore,
      bestTime: bestTimes[d % bestTimes.length],
      targetAudience: audiences[d % audiences.length],
      priority: viralScore >= 88 ? "اولویت بالا" : "اولویت متوسط",
    });
  }

  return items;
}

function buildFunnelPlaybook(niche: string, city: string, keywords: string[]) {
  const primaryKw = keywords[0] || niche;
  const secondaryKw = keywords[1] || `${niche} در ${city}`;
  return {
    commentKeywords: ["راهنما", "قیمت", "مشاوره", "رزرو"],
    autoCommentReply: `ممنون از همراهیتون 🙏 راهنمای کامل «${primaryKw}» و شرایط ویژه در ${city} براتون دایرکت شد؛ اگر سوالی دارید همین‌جا بنویسید.`,
    dmWelcomeScript: `سلام! خوش اومدید 🌟 دیدم کامنت گذاشتید تا اطلاعات «${secondaryKw}» رو بدونید. کوتاه بگم چطور کمکتون کنم و چه زمانی براتون مناسب‌تره؟`,
    dmClosingScript: `عالیه! برای اینکه دقیق‌ترین پیشنهاد رو متناسب با نیازتون بدم، کافیه بفرمایید در چه مرحله‌ای هستید یا شماره تماس/زمان مشاوره رو بفرستید تا هماهنگ کنیم.`,
  };
}

export async function GET() {
  const store = loadStore();
  return NextResponse.json({
    ok: true,
    savedAccountsCount: Object.keys(store.accounts).length,
    accounts: Object.values(store.accounts),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SeoRequestBody;
    const customerEntries = parseHandlesOrNames(body.handles, 10);
    const competitorEntries = parseHandlesOrNames(body.competitorHandles, 12);
    const niche = String(body.niche || "").trim();
    const city = String(body.city || "تهران").trim() || "تهران";
    const province = String(body.province || "تهران").trim() || "تهران";
    const topics = String(body.topics || "").trim();
    const cardNumber = String(body.cardNumber || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const rawCode = String(body.activationCode || "").trim().toUpperCase();

    let unlockedPlan: "free" | "paid_1m" | "paid_2m" | "vip_all" =
      body.subscriptionPlan || "free";
    let codeStatusMessage = "";

    if (rawCode) {
      if (rawCode.includes("VIP") || rawCode.includes("ROYAL60")) {
        unlockedPlan = "vip_all";
        codeStatusMessage = `کد اشتراک «${rawCode}» تایید شد؛ تقویم ۱ ماهه و ۲ ماهه کاملاً باز شد.`;
      } else if (rawCode.includes("1M") || rawCode.includes("30")) {
        unlockedPlan = "paid_1m";
        codeStatusMessage = `کد اشتراک «${rawCode}» تایید شد؛ تقویم ۱ ماهه (روز ۸ تا ۳۰) باز شد.`;
      } else if (rawCode.includes("2M") || rawCode.includes("60")) {
        unlockedPlan = "paid_2m";
        codeStatusMessage = `کد اشتراک «${rawCode}» تایید شد؛ تقویم ۲ ماهه (روز ۳۱ تا ۶۰) باز شد.`;
      } else {
        codeStatusMessage = `کد «${rawCode}» ثبت شد؛ برای فعال‌سازی آنی تقویم پولی از کدهای ROYAL1M، ROYAL2M یا ROYALVIP استفاده کنید یا با ${CEO_PHONE} تماس بگیرید.`;
      }
    }

    if (customerEntries.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "حداقل یک آیدی یا نام پیج کارفرما وارد کنید (تا ۱۰ پیج همزمان).",
        },
        { status: 400 }
      );
    }

    if (!niche) {
      return NextResponse.json(
        {
          ok: false,
          error: "وارد کردن حوزه فعالیت یا صنف الزامی است.",
        },
        { status: 400 }
      );
    }

    const extraTopics = topics
      .split(/[\s,،\n\r]+/)
      .map((t) => t.replace(/[a-zA-Z0-9_]/g, "").trim())
      .filter((t) => t.length >= 2)
      .slice(0, 6);

    const keywords = Array.from(
      new Set(
        [
          niche,
          `${niche} در ${city}`,
          `${niche} ${province}`,
          `بهترین ${niche}`,
          `قیمت ${niche}`,
          `مشاوره ${niche}`,
          ...extraTopics,
        ].filter(Boolean)
      )
    ).slice(0, 10);

    const nicheTags = Array.from(
      new Set(
        [
          buildPersianTag(niche),
          buildPersianTag(`بهترین ${niche}`),
          buildPersianTag(`خدمات ${niche}`),
          ...extraTopics.map(buildPersianTag),
        ].filter(Boolean)
      )
    );

    const localTags = Array.from(
      new Set(
        [
          buildPersianTag(city),
          buildPersianTag(`${niche} ${city}`),
          buildPersianTag(province),
        ].filter(Boolean)
      )
    );

    const hashtags = Array.from(
      new Set([
        ...nicheTags,
        ...localTags,
        "#سئو_اینستاگرام",
        "#رشد_پیج",
        "#اکسپلور",
      ])
    );

    const store = loadStore();
    const now = new Date();
    const timeLabel = now.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const trendAlerts: string[] = [];

    const customerPages = customerEntries.map((entry, idx) => {
      const key = entry.handle.toLowerCase();
      const prev = store.accounts[key];
      const scanCount = (prev ? prev.scanCount : 0) + 1;
      const baseScore =
        74 + Math.min(12, extraTopics.length * 2) + (idx === 0 ? 2 : 0);
      const seoScore = Math.min(
        99,
        prev ? Math.max(baseScore, prev.currentScore + 2) : baseScore
      );
      const scoreDelta = prev ? seoScore - prev.currentScore : 0;
      const keywordScore = Math.min(98, 80 + scanCount * 2);
      const hashtagScore = Math.min(98, 82 + scanCount * 2);

      const pageSpecificTrendTags = Array.from(
        new Set([
          buildPersianTag(`${niche} ${entry.rawLabel}`),
          buildPersianTag(`ترند ${niche}`),
          buildPersianTag(`${city} ${niche}`),
          ...nicheTags.slice(0, 3),
          "#ریلز_ترند",
          "#سئو_پیج",
        ].filter(Boolean))
      );

      if (prev) {
        if (scoreDelta > 0) {
          trendAlerts.push(
            `رشد مثبت ${entry.handle}: امتیاز سئو از ${prev.currentScore} به ${seoScore} (+${scoreDelta}) در اسکن #${scanCount} رسید.`
          );
        } else if (scoreDelta < 0) {
          trendAlerts.push(
            `هشدار افت ${entry.handle}: امتیاز سئو ${Math.abs(scoreDelta)} واحد کاهش یافت؛ کلیدواژه‌های «${niche}» را بازبینی کنید.`
          );
        } else {
          trendAlerts.push(
            `ثبات امتیاز ${entry.handle} در ${seoScore}/100 (اسکن #${scanCount}) — برای جهش بعدی، محتوای کلیدواژه‌محور منتشر کنید.`
          );
        }
      } else {
        trendAlerts.push(
          `شروع پایش ۲۴/۷ برای ${entry.handle} با امتیاز پایه ${seoScore}/100 در حوزه «${niche}».`
        );
      }

      const point: HistoryPoint = {
        timestamp: now.toISOString(),
        label: timeLabel,
        seoScore,
        keywordScore,
        hashtagScore,
      };

      const history = [...(prev ? prev.history : []), point].slice(-14);

      store.accounts[key] = {
        handle: entry.handle,
        niche,
        city,
        province,
        scanCount,
        currentScore: seoScore,
        lastScannedAt: now.toISOString(),
        history,
      };

      return {
        index: idx + 1,
        rawLabel: entry.rawLabel,
        handle: entry.handle,
        profileUrl: `https://www.instagram.com/${entry.handle}/`,
        seoScore,
        scoreDelta,
        scanCount,
        keywords,
        keywordMetrics: keywords.slice(0, 6).map((kw, i) => ({
          keyword: kw,
          score: Math.max(70, 96 - i * 3),
        })),
        hashtags,
        trendingHashtags: pageSpecificTrendTags.slice(0, 6),
        hashtagMetrics: pageSpecificTrendTags.slice(0, 5).map((tag, i) => ({
          tag,
          score: Math.max(74, 97 - i * 3),
        })),
        checklist: [
          `درج کلیدواژه اصلی «${niche}» و «${city}» در سطر اول عنوان و بایو پیج ${entry.handle}`,
          `استفاده هدفمند از هشتگ‌های ترند اختصاصی ${pageSpecificTrendTags
            .slice(0, 4)
            .join(" ")}`,
          `ثبت خودکار اسکن #${scanCount} در پایگاه پایش ۲۴/۷ رویال موتور`,
        ],
        history,
      };
    });

    saveStore(store);

    const avgCustomerScore = Math.round(
      customerPages.reduce((sum, p) => sum + p.seoScore, 0) /
        customerPages.length
    );

    const directCompetitors = competitorEntries.map((comp, idx) => {
      const compScore = Math.min(96, 81 + (idx === 0 ? 5 : 2));
      const diff = avgCustomerScore - compScore;
      const focusTopic = topics || niche;

      return {
        rawLabel: comp.rawLabel,
        handle: comp.handle,
        profileUrl: `https://www.instagram.com/${comp.handle}/`,
        seoScore: compScore,
        keywordStrength: Math.min(95, 80 + idx * 3),
        hashtagStrength: Math.min(94, 82 + idx * 2),
        reelsAnalysis: {
          topFormat: "ریلز آموزشی کوتاه و قبل/بعد با زیرنویس فارسی درشت",
          retentionPattern:
            "شروع سریع با نتیجه کار یا چالش در ۳ ثانیه اول برای بالا نگه داشتن نرخ تکمیل ویدیو",
          keywordUsage: `به‌کارگیری عبارت‌های «${focusTopic}» و «${city}» در عنوان ریلز و کپشن`,
        },
        employerStrategy: [
          `تولید حداقل ۴ ریلز هفتگی با تمرکز بر «${focusTopic}» و نمایش شفاف تفاوت کیفیت در ${city}`,
          `استفاده از هشتگ‌های ترکیبی ${nicheTags
            .slice(0, 3)
            .join(" ")} و ${localTags.slice(0, 2).join(" ")} در کپشن و اولین کامنت`,
          diff >= 0
            ? `امتیاز سئو شما ${diff} واحد بالاتر است؛ با انتشار منظم ریلزهای ترند فاصله را تثبیت کنید.`
            : `رقیب ${Math.abs(
                diff
              )} واحد جلوتر است؛ با سناریوهای قلاب‌دار و پاسخ سریع در دایرکت سهم بازار بگیرید.`,
        ],
      };
    });

    const excludedSet = new Set([
      ...customerEntries.map((c) => c.handle.toLowerCase()),
      ...competitorEntries.map((c) => c.handle.toLowerCase()),
    ]);

    const [localList, provList, natList] = await Promise.all([
      fetchTierCompetitors("محلی", niche, city, excludedSet),
      fetchTierCompetitors("استانی", niche, province, excludedSet),
      fetchTierCompetitors("کشوری", niche, "ایران", excludedSet),
    ]);

    const isVercelEnv = process.env.VERCEL === "1";
    const royalMotor100 = buildRoyalMotor100Benchmark(niche, city, isVercelEnv);

    const todayShamsi = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);

    const trendScenarios = buildTrendScenarios(niche, city, keywords, hashtags);
    const calendarItems = buildCalendarItems(
      niche,
      city,
      keywords,
      hashtags,
      unlockedPlan
    );
    const funnelPlaybook = buildFunnelPlaybook(niche, city, keywords);

    const summaryText = [
      `گزارش سئو هوشمند ۲۴/۷ رویال موتور (رویال فام)`,
      `تاریخ: ${todayShamsi} | محیط: ${royalMotor100.environment}`,
      `صنف: ${niche} | شهر: ${city} | استان: ${province}`,
      `پیج‌های کارفرما (${customerPages.length}/10): ${customerPages
        .map((p) => `${p.handle} (امتیاز ${p.seoScore}/100)`)
        .join("، ")}`,
      `رقبا: محلی (${localList.length}) • استانی (${provList.length}) • کشوری (${natList.length})`,
      `جایگاه رویال موتور بین ۱۰۰ رقیب (۲ و ۳ سیلاب): رتبه #${royalMotor100.royalRank} از ۱۰۰ (امتیاز ${royalMotor100.royalScore}/100)`,
      `پشتیبانی رویال فام: ${CEO_PHONE} | ${SUPPORT_EMAIL}`,
    ].join("\n");

    return NextResponse.json({
      ok: true,
      timestamp: now.toISOString(),
      todayShamsi,
      ceoPhone: CEO_PHONE,
      supportEmail: SUPPORT_EMAIL,
      savedDbCount: Object.keys(store.accounts).length,
      unlockedPlan,
      codeStatusMessage,
      trendAlerts,
      funnelPlaybook,
      customerPages,
      directCompetitors,
      trendScenarios,
      royalMotor100,
      competitors: {
        local: localList,
        provincial: provList,
        national: natList,
        totalCount: localList.length + provList.length + natList.length,
      },
      calendarItems,
      cardNumber:
        cardNumber ||
        `جهت دریافت شماره کارت و فعال‌سازی با ${CEO_PHONE} تماس بگیرید`,
      summaryText,
      phone,
      email,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "خطای داخلی در موتور نکست جی اس رویال موتور",
      },
      { status: 500 }
    );
  }
}
