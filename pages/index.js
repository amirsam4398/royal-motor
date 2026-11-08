import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('royal-motor');
  const [leads] = useState([
    { id: 1, name: 'تکنسین منطقه ۲ تهران', phone: '09120000000', status: 'فعال', date: '۱۴۰۵/۰۸/۱۷' },
    { id: 2, name: 'سالن زیبایی بتی‌سا', phone: '09366681963', status: 'سئو شده', date: '۱۴۰۵/۰۸/۱۷' }
  ]);

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tahoma, sans-serif', background: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <Head>
        <title>سامانه جامع رویال موتور و بتی‌سا</title>
      </Head>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', color: '#38bdf8' }}>🚀 سامانه هوشمند رویال موتور / نوبت فام</h1>
        <div>
          <button 
            onClick={() => setActiveTab('royal-motor')} 
            style={{ background: activeTab === 'royal-motor' ? '#0284c7' : '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', marginLeft: '10px', borderRadius: '5px', cursor: 'pointer' }}>
            رویال موتور (کشوری)
          </button>
          <button 
            onClick={() => setActiveTab('betisa')} 
            style={{ background: activeTab === 'betisa' ? '#db2777' : '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            سالن بتی‌سا (تهران)
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'royal-motor' ? (
          <section>
            <h2>مدیریت موتور جستجو و سئو (۱۰۰ هزار کلمه)</h2>
            <p>داده‌کاوی بلادرنگ گوگل ترندز و اکسپلور فعال است.</p>
          </section>
        ) : (
          <section>
            <h2>پنل مدیریت سالن زیبایی بتی‌سا (نوبت فام)</h2>
            <p>مقیاس سئو: ۲۰,۰۰۰ کلمه در ۲۲ منطقه تهران.</p>
          </section>
        )}

        <div style={{ marginTop: '30px', background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
          <h3>آخرین لیدها و درخواست‌های ثبت‌شده</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
            {leads.map((lead) => (
              <li key={lead.id} style={{ background: '#334155', padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{lead.name} - {lead.phone}</span>
                <span style={{ color: '#4ade80' }}>{lead.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
