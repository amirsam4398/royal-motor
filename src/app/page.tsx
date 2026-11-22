'use client';

import React, { useState } from 'react';

interface Competitor {
  rank: number;
  handle: string;
  title: string;
  level: string;
  bioSnippet: string;
  estimatedEngagement: string;
  url: string;
}

interface ContentDay {
  day: number;
  title: string;
  format: string;
  seoCaption: string;
  hashtags: string[];
  isFree: boolean;
}

interface PageReport {
  handle: string;
  profileTitle: string;
  profileBio: string;
  profileUrl: string;
  clientPhone: string;
  seoStatus: string;
  competitorsCount: number;
  competitors: Competitor[];
  topHashtags: string[];
  contentCalendar: ContentDay[];
  generatedAt: string;
}

export default function RoyalMotorGoogleUI() {
  const [pagesInput, setPagesInput] = useState('');
  const [niche, setNiche] = useState('');
  const [city, setCity] = useState('تهران');
  const [province, setProvince] = useState('تهران');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<PageReport[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [activeSubView, setActiveSubView] = useState<'competitors' | 'hashtags' | 'calendar' | 'reports'>('competitors');

  const CEO_PHONE = '09366681963';
  const CEO_EMAIL = 'amirsamyaghobi62@gmail.com';

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pagesInput.trim() || !niche.trim()) {
      setError('لطفاً حداقل یک آیدی پیج اینستاگرام و حوزه فعالیت را وارد کنید.');
      return;
    }

    setLoading(true);
    setError('');
    setReports([]);

    try {
      const res = await fetch('/api/seo-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagesInput,
          niche,
          city,
          province,
          clientPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ارتباط با موتور سئو');
      }

      setReports(data.reports || []);
      setSelectedTab(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buildReportText = (report: PageReport) => {
    const top5Comp = report.competitors
      .slice(0, 5)
      .map((c) => `${c.rank}. ${c.handle} (${c.level}) - تعامل: ${c.estimatedEngagement}`)
      .join('\n');

    return `گزارش رسمی سئو اتوماتیک 24/7 - رویال موتور (استارتاپ هوش مصنوعی رویال فام)
پیج هدف: ${report.handle}
حوزه: ${niche} | شهر: ${city}
وضعیت سئو: ${report.seoStatus}
تعداد رقبای شناسایی شده: ${report.competitorsCount} پیج (محلی، استانی، کشوری)

۵ رقیب برتر:
${top5Comp}

هشتگ‌های سئو شده 24/7:
${report.topHashtags.slice(0, 10).join(' ')}

تقویم محتوایی: ۷ روز اول رایگان فعال شد (روز ۸ به بعد اشتراک VIP).
توسعه‌دهنده و مالک: امیر سام یعقوبی | پشتیبانی: ${CEO_PHONE}`;
  };

  const sendWhatsApp = (phone: string, report: PageReport) => {
    const cleanPhone = phone.replace(/^0/, '98').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(buildReportText(report));
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const sendSMS = (phone: string, report: PageReport) => {
    const text = encodeURIComponent(buildReportText(report));
    window.open(`sms:${phone}?body=${text}`, '_blank');
  };

  const sendEmail = (report: PageReport) => {
    const subject = encodeURIComponent(`گزارش سئو 24/7 پیج ${report.handle} - رویال موتور`);
    const body = encodeURIComponent(buildReportText(report));
    window.open(`mailto:${CEO_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  const activeReport = reports[selectedTab];

  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#202124] font-sans flex flex-col justify-between">
      <header className="w-full px-6 py-3 flex items-center justify-between border-b border-gray-100 text-xs sm:text-sm text-[#5f6368]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#1a73e8]">استارتاپ فناورانه هوش مصنوعی رویال فام</span>
          <span className="hidden md:inline">| اولین استارتاپ وایب کدینگ در ایران</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            موتور خزش زنده 24/7 فعال
          </span>
          <a
            href={`tel:${CEO_PHONE}`}
            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
          >
            پشتیبانی: {CEO_PHONE}
          </a>
        </div>
      </header>

      <main className={`w-full max-w-5xl mx-auto px-4 ${reports.length > 0 ? 'py-6' : 'my-auto py-12'}`}>
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-3 select-none">
            <span className="text-[#4285F4]">ر</span>
            <span className="text-[#EA4335]">و</span>
            <span className="text-[#FBBC05]">ی</span>
            <span className="text-[#4285F4]">ا</span>
            <span className="text-[#34A853]">ل</span>
            <span className="mx-2"></span>
            <span className="text-[#EA4335]">م</span>
            <span className="text-[#4285F4]">و</span>
            <span className="text-[#FBBC05]">ت</span>
            <span className="text-[#34A853]">و</span>
            <span className="text-[#EA4335]">ر</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5f6368] font-medium">
            اولین موتور هوش مصنوعی سئو اتوماتیک اینستاگرام در ایران (پردازش همزمان تا ۱۰ پیج مشتری)
          </p>
        </div>

        <form
          onSubmit={handleAnalyze}
          className="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-[#dfe1e5] shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow p-4 sm:p-6"
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#5f6368] mb-1.5">
              آیدی پیج‌های اینستاگرام مشتریان (حداکثر ۱۰ پیج - با کاما یا خط جدید جدا کنید):
            </label>
            <textarea
              rows={2}
              dir="ltr"
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              placeholder="example: @betisa_salon, @tooba_beauty, @royal_motor_ir"
              className="w-full text-left text-sm sm:text-base text-[#202124] bg-[#f8f9fa] focus:bg-white border border-gray-200 focus:border-[#4285F4] rounded-2xl px-4 py-3 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
            <div>
              <label className="block text-[11px] font-medium text-[#5f6368] mb-1">حوزه فعالیت / صنف *</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="مثلاً: سالن زیبایی یا نمایشگاه خودرو"
                className="w-full text-xs sm:text-sm border border-gray-200 focus:border-[#4285F4] rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#5f6368] mb-1">شهر / منطقه (رقبای محلی)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثلاً: سعادت‌آباد تهران"
                className="w-full text-xs sm:text-sm border border-gray-200 focus:border-[#4285F4] rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#5f6368] mb-1">استان (رقبای استانی)</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="مثلاً: تهران"
                className="w-full text-xs sm:text-sm border border-gray-200 focus:border-[#4285F4] rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#5f6368] mb-1">موبایل مشتری (ارسال گزارش)</label>
              <input
                type="tel"
                dir="ltr"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="09120000000"
                className="w-full text-left text-xs sm:text-sm border border-gray-200 focus:border-[#4285F4] rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#3c4043] border border-[#f8f9fa] hover:border-[#dadce0] px-6 py-2.5 rounded-md text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'در حال خزش زنده اینستاگرام و تحلیل رقبا...' : 'جستجو و سئو 24/7 پیج‌ها'}
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2.5 rounded-md text-sm font-medium shadow-sm transition disabled:opacity-50"
            >
              دریافت ۲۰ رقیب + تقویم ۷ روز رایگان
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
              {error}
            </div>
          )}
        </form>

        {reports.length > 0 && activeReport && (
          <div className="mt-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-gray-200 mb-6">
              {reports.map((rep, idx) => (
                <button
                  key={rep.handle}
                  onClick={() => setSelectedTab(idx)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                    selectedTab === idx
                      ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#1a73e8]'
                      : 'bg-[#f8f9fa] text-[#5f6368] hover:bg-gray-100'
                  }`}
                >
                  {rep.handle} ({rep.competitorsCount} رقیب)
                </button>
              ))}
            </div>

            <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={activeReport.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-bold text-[#1a0dab] hover:underline"
                    dir="ltr"
                  >
                    {activeReport.handle}
                  </a>
                  <span className="bg-green-100 text-green-800 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                    {activeReport.seoStatus}
                  </span>
                </div>
                <p className="text-xs text-[#4d5156] leading-relaxed">{activeReport.profileBio}</p>
                <p className="text-[11px] text-[#70757a] mt-1">زمان تحلیل زنده: {activeReport.generatedAt}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => sendWhatsApp(CEO_PHONE, activeReport)}
                  className="bg-[#34A853] hover:bg-green-700 text-white text-xs px-3.5 py-2 rounded-lg font-medium transition"
                >
                  ارسال گزارش به مدیرعامل (واتساپ)
                </button>
                {activeReport.clientPhone !== 'ثبت نشده' && (
                  <button
                    onClick={() => sendWhatsApp(activeReport.clientPhone, activeReport)}
                    className="bg-[#1a73e8] hover:bg-blue-700 text-white text-xs px-3.5 py-2 rounded-lg font-medium transition"
                  >
                    ارسال گزارش به مشتری ({activeReport.clientPhone})
                  </button>
                )}
                <button
                  onClick={() => sendSMS(CEO_PHONE, activeReport)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-[#3c4043] text-xs px-3 py-2 rounded-lg font-medium transition"
                >
                  ارسال پیامک گزارش
                </button>
                <button
                  onClick={() => sendEmail(activeReport)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-[#3c4043] text-xs px-3 py-2 rounded-lg font-medium transition"
                >
                  ارسال ایمیل
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 border-b border-gray-200 mb-6 text-xs sm:text-sm">
              <button
                onClick={() => setActiveSubView('competitors')}
                className={`pb-3 font-medium border-b-2 transition ${
                  activeSubView === 'competitors'
                    ? 'border-[#1a73e8] text-[#1a73e8]'
                    : 'border-transparent text-[#5f6368] hover:text-[#202124]'
                }`}
              >
                ۲۰ رقیب محلی، استانی و کشوری ({activeReport.competitorsCount})
              </button>
              <button
                onClick={() => setActiveSubView('hashtags')}
                className={`pb-3 font-medium border-b-2 transition ${
                  activeSubView === 'hashtags'
                    ? 'border-[#1a73e8] text-[#1a73e8]'
                    : 'border-transparent text-[#5f6368] hover:text-[#202124]'
                }`}
              >
                هشتگ‌های سئو 24/7 ({activeReport.topHashtags.length})
              </button>
              <button
                onClick={() => setActiveSubView('calendar')}
                className={`pb-3 font-medium border-b-2 transition ${
                  activeSubView === 'calendar'
                    ? 'border-[#1a73e8] text-[#1a73e8]'
                    : 'border-transparent text-[#5f6368] hover:text-[#202124]'
                }`}
              >
                تقویم محتوایی (۷ روز رایگان + اشتراک پولی)
              </button>
            </div>

            {activeSubView === 'competitors' && (
              <div className="space-y-4">
                {activeReport.competitors.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">
                    رقبای بیشتری در ایندکس عمومی یافت نشد. کلیدواژه صنف را عمومی‌تر وارد کنید.
                  </p>
                ) : (
                  activeReport.competitors.map((comp) => (
                    <div
                      key={comp.handle}
                      className="p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold flex items-center justify-center">
                            {comp.rank}
                          </span>
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base font-medium text-[#1a0dab] hover:underline"
                          >
                            {comp.title} ({comp.handle})
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                            سطح: {comp.level}
                          </span>
                          <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                            نرخ تعامل: {comp.estimatedEngagement}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#006621] mb-1" dir="ltr">
                        {comp.url}
                      </p>
                      <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed">{comp.bioSnippet}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSubView === 'hashtags' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-base font-bold mb-2">هشتگ‌های فعال در موتور سئو 24/7 برای {activeReport.handle}</h3>
                <p className="text-xs text-[#5f6368] mb-4">
                  این هشتگ‌ها به صورت خودکار روی پست‌ها و ریلزهای پیج پایش و بهینه‌سازی می‌شوند:
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeReport.topHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#f1f3f4] hover:bg-[#e8f0fe] text-[#1a73e8] px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(activeReport.topHashtags.join(' '))}
                  className="bg-[#1a73e8] text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  کپی تمام هشتگ‌ها
                </button>
              </div>
            )}

            {activeSubView === 'calendar' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeReport.contentCalendar.map((item) => (
                  <div
                    key={item.day}
                    className={`p-5 rounded-2xl border ${
                      item.isFree ? 'bg-white border-green-200' : 'bg-gray-50 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[#202124]">روز {item.day} — {item.format}</span>
                      {item.isFree ? (
                        <span className="bg-green-100 text-green-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                          رایگان (هفته اول)
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                          اشتراک پولی VIP
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-[#1a73e8] mb-2">{item.title}</h4>
                    <p className="text-xs text-[#4d5156] leading-relaxed mb-3">{item.seoCaption}</p>
                    {item.isFree ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.hashtags.map((h) => (
                          <span key={h} className="text-[11px] text-[#5f6368] bg-gray-100 px-2 py-0.5 rounded">
                            {h}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <a
                        href={`tel:${CEO_PHONE}`}
                        className="inline-block bg-[#FBBC05] hover:bg-amber-500 text-black text-xs font-bold px-4 py-2 rounded-lg transition"
                      >
                        فعال‌سازی اشتراک پولی ماهانه ({CEO_PHONE})
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full bg-[#f2f2f2] border-t border-[#dadce0] px-6 py-4 text-xs text-[#70757a] mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            توسعه‌دهنده، مالک، مدیر اجرایی و مدیرعامل استارتاپ فناورانه هوش مصنوعی رویال فام: <strong>امیر سام یعقوبی</strong>
          </div>
          <div className="flex items-center gap-4">
            <span>تماس: {CEO_PHONE}</span>
            <span>ایمیل پشتیبانی: {CEO_EMAIL}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
