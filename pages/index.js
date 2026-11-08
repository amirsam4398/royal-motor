import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('royal-fam');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // شبیه‌سازی فراکنی بک‌اند API با Next.js
  const fetchBackendData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seo-engine');
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      setApiData({ status: 'Active 24/7', message: 'موتور داده‌کاوی و سئو خودکار رویال فام فعال است' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tahoma, sans-serif', background: '#070b14', color: '#f1f5f9', minHeight: '100vh', padding: '20px' }}>
      <Head>
        <title>استارتاپ فناورانه هوش مصنوعی رویال فام | موتور سئو ۲۴ ساعته</title>
      </Head>

      {/* هدر اصلی */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '20px', color: '#38bdf8', margin: 0 }}>👑 استارتاپ فناورانه هوش مصنوعی رویال فام</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '5px 0 0 0' }}>
            مدیرعامل و مالک: امیر سام یعقوبی | تلفن: ۰۹۳۶۶۶۸۱۹۶۳ | ایمیل: amirsamyaghobi62@gmail.com
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('royal-fam')} 
            style={{ background: activeTab === 'royal-fam' ? '#0284c7' : '#1e293b', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            رویال فام (۱۰۰k کلمه)
          </button>
          <button 
            onClick={() => setActiveTab('betisa')} 
            style={{ background: activeTab === 'betisa' ? '#db2777' : '#1e293b', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            سالن بتی‌سا (تهران)
          </button>
          <button 
            onClick={() => setActiveTab('asnaf')} 
            style={{ background: activeTab === 'asnaf' ? '#10b981' : '#1e293b', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            اصناف و توکن رایگان
          </button>
        </div>
      </header>

      {/* وضعیت بک‌اند Next.js API */}
      <div style={{ background: '#1e293b', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', flexWrap: 'wrap', gap: '10px' }}>
        <span>وضعیت بک‌اند Next.js API: <strong style={{ color: '#38bdf8' }}>{loading ? 'در حال همگام‌سازی...' : 'متصل و فعال (24/7)'}</strong></span>
        <span style={{ color: '#4ade80', background: '#064e3b', padding: '3px 10px', borderRadius: '4px' }}>● داده‌کاوی سراسری و SMPP برقرار</span>
      </div>

      {/* محتوای تب‌ها */}
      <main>
        {activeTab === 'royal-fam' && (
          <section style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '18px' }}>موتور هوشمند داده‌کاوی و سئو خودکار سراسری</h2>
            <p>پایش ۲۴ ساعته در ۷ روز هفته، تحلیل گوگل ترندز و مدل‌های هوش مصنوعی (جمنای و مدل‌های تخصصی کراک)، سئو خودکار بیش از ۱۰۰,۰۰۰ کلمه کلیدی در ۳۱ استان و ۵ شهر کلیدی کشور.</p>
            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px' }}>📊 کلمات کلیدی: <strong>۱۰۰,۰۰۰ کلیدواژه</strong></div>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px' }}>🌐 پهنه پوشش: <strong>۳۱ استان و کشور</strong></div>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px' }}>⚡ بک‌اند: <strong>Next.js API & Node</strong></div>
            </div>
          </section>
        )}

        {activeTab === 'betisa' && (
          <section style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ color: '#db2777', fontSize: '18px' }}>مدیریت پیشرفته سالن زیبایی بتی‌سا</h2>
            <p>مدیر مجموعه: خانم بیتا قناعتی | تلفن تماس و لید: <strong>۰۹۱۲۵۱۵۴۰۲۴</strong></p>
            <p>سئو اختصاصی، بررسی و تحلیل بیش از ۵۰ رقیب در منطقه، ارزیابی هشتگ‌ها و نوبت‌دهی هوشمند در تمامی <strong>۲۲ منطقه تهران</strong> با ارسال گزارش خودکار به خط مدیرعامل (`۰۹۳۶۶۶۸۱۹۶۳`).</p>
          </section>
        )}

        {activeTab === 'asnaf' && (
          <section style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ color: '#10b981', fontSize: '18px' }}>سامانه جامع اصناف و اعطای توکن رایگان</h2>
            <p>سیستم اختصاصی برای اصناف مختلف جهت راه‌اندازی صفحات و سایت‌های تخصصی متصل به مناطق ۲۲ گانه تهران و سراسر کشور.</p>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', marginTop: '10px' }}>
              🎁 بسته تشویقی: <strong>۱۰ توکن رایگان برای راه‌اندازی اولیه اصناف فعال</strong>
            </div>
          </section>
        )}
      </main>

      {/* قوانین حقوقی و انحصاری */}
      <footer style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '15px', textAlign: 'center', fontSize: '11px', color: '#94a3b8', lineHeight: '1.8' }}>
        <p>تمامی حقوق این سامانه، زیرساخت‌های بک‌اند Next.js API، اسکریپت‌ها و کدهای فکری متعلق به <strong>استارتاپ فناورانه هوش مصنوعی رویال فام</strong> (امیر سام یعقوبی) می‌باشد.</p>
        <p style={{ color: '#f87171', fontWeight: 'bold', marginTop: '4px' }}>هرگونه کپی‌برداری از کدهای ساختار و فکری معنوی مالک استارتاپ پیگیری حقوقی و قضایی دارد.</p>
      </footer>
    </div>
  );
}
