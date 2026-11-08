import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function RoyalSearchEngine() {
  const [activeTab, setActiveTab] = useState('betisa'); 
  const [aiSubTab, setAiSubTab] = useState('chatgpt'); 
  const [crmSubTab, setCrmSubTab] = useState('betisaCRM');
  const [tokens, setTokens] = useState(30);

  const [searchQuery, setSearchQuery] = useState('داده‌کاوی ۱۲۰ ثانیه‌ای گوگل ترندز و اکسپلور - کراتین و ناخن');
  const [businessName, setBusinessName] = useState('سالن زیبایی بتی‌سا');
  const [managerName, setManagerName] = useState('خانم بیتا قناعتی');
  const [phone, setPhone] = useState('09125154024');
  const [specialtyField, setSpecialtyField] = useState('کراتین، صافی مو، پروتئین تراپی و ناخن');
  const [plan, setPlan] = useState('پلن جامع VIP (۱۲,۰۰۰,۰۰۰ تومان)');
  
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [sourceRoute, setSourceRoute] = useState('داده‌کاوی بلادرنگ هر ۱۲۰ ثانیه (گوگل ترندز و اکسپلور)');

  const [resultData, setResultData] = useState(null);
  const [dbData, setDbData] = useState({ betisaLeads: [], royalLeads: [], allSectorsLeads: [] });
  const [loading, setLoading] = useState(false);

  const provincesList = ["تهران (سراسر ۲۲ منطقه)", "اصفهان", "خراسان رضوی", "فارس", "آذربایجان شرقی", "مازندران", "گیلان", "البرز", "خوزستان", "قم", "کرمان", "یزد", "هرمزگان", "گلستان", "قزوین", "مرکزی", "همدان", "اردبیل", "سیستان و بلوچستان", "کرمانشاه", "لرستان", "کردستان", "بوشهر", "زنجان", "سمنان"];
  const citiesList = ["تهران (مراکز ۲۲ گانه)", "مشهد", "اصفهان", "شیراز", "تبریز"];

  useEffect(() => {
    const fetchCrm = () => {
      fetch('/api/analyze')
        .then(res => res.json())
        .then(data => setDbData(data))
        .catch(err => console.log(err));
    };
    fetchCrm();
    // داده‌کاوی خودکار هر ۱۲۰ ثانیه
    const interval = setInterval(fetchCrm, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
    setResultData(null);
    if (tab === 'betisa') {
      setTokens(30);
      setBusinessName('سالن زیبایی بتی‌سا');
      setManagerName('خانم بیتا قناعتی');
      setPhone('09125154024');
      setSpecialtyField('کراتین، صافی مو، پروتئین تراپی و ناخن (۲۲ منطقه تهران)');
    } else if (tab === 'royal') {
      setTokens(3); 
      setBusinessName('استارتاپ فناورانه هوش مصنوعی رویال فام');
      setManagerName('امیرسام یعقوبی');
      setPhone('09366681963');
      setSpecialtyField('موتور هوش مصنوعی و سئوی ۱۰۰ هزار کلمه کشوری');
    } else if (tab === 'all') {
      setTokens(3); 
      setBusinessName('اصناف و خدمات آرایشگاهی کشور');
      setManagerName('مدیر صنف');
      setPhone('09366681963');
      setSpecialtyField('پوشش سراسری اصناف');
    } else if (tab === 'ai') {
      setTokens(3);
      setBusinessName(`هوش مصنوعی (${aiSubTab.toUpperCase()})`);
      setManagerName('امیرسام یعقوبی');
      setPhone('09366681963');
      setSpecialtyField('تحلیل و داده‌کاوی رقبای کراتین و ناخن');
    }
  };

  const handleRunSearch = async (e) => {
    e.preventDefault();
    if (tokens <= 0) {
      alert('⚠️ توکن‌های شما به پایان رسید!');
      return;
    }
    setLoading(true);
    try {
      const targetType = (activeTab === 'ai') ? 'royal' : activeTab;
      
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabType: targetType, searchQuery, businessName, managerName, phone, plan, province, city, sourceRoute, specialtyField })
      });
      const data = await res.json();
      setResultData(data);
      setTokens(prev => prev - 1); 
      
      const crmRes = await fetch('/api/analyze');
      const crmData = await crmRes.json();
      setDbData(crmData);
    } catch (err) {
      alert('خطا در ارتباط با سرور');
    }
    setLoading(false);
  };

  const handleDownloadExcel = (cat) => { window.location.href = `/api/analyze?format=excel&cat=${cat}`; };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Arial, Tahoma, sans-serif', direction: 'rtl', color: '#202124', paddingBottom: '70px', margin: '0' }}>
      <Head>
        <title>Royal Search Engine — داده‌کاوی ۱۲۰ ثانیه‌ای گوگل ترندز و اکسپلور</title>
      </Head>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f1f3f4', fontSize: '11px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', color: '#5f6368', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', fontWeight: activeTab === 'betisa' ? 'bold' : 'normal', color: activeTab === 'betisa' ? '#1a73e8' : '#5f6368', background: activeTab === 'betisa' ? '#e8f0fe' : 'transparent', padding: '4px 7px', borderRadius: '6px' }} onClick={() => handleSwitchTab('betisa')}>⭐ بتی‌سا (۲۰k - ۲۲ منطقه)</span>
          <span style={{ cursor: 'pointer', fontWeight: activeTab === 'royal' ? 'bold' : 'normal', color: activeTab === 'royal' ? '#1a73e8' : '#5f6368', background: activeTab === 'royal' ? '#e8f0fe' : 'transparent', padding: '4px 7px', borderRadius: '6px' }} onClick={() => handleSwitchTab('royal')}>🚀 رویال موتور (۱۰۰k کشوری)</span>
          <span style={{ cursor: 'pointer', fontWeight: activeTab === 'all' ? 'bold' : 'normal', color: activeTab === 'all' ? '#1a73e8' : '#5f6368', background: activeTab === 'all' ? '#e8f0fe' : 'transparent', padding: '4px 7px', borderRadius: '6px' }} onClick={() => handleSwitchTab('all')}>🌐 اصناف (کشوری)</span>
          <span style={{ cursor: 'pointer', fontWeight: activeTab === 'ai' ? 'bold' : 'normal', color: activeTab === 'ai' ? '#1a73e8' : '#5f6368', background: activeTab === 'ai' ? '#e8f0fe' : 'transparent', padding: '4px 7px', borderRadius: '6px' }} onClick={() => handleSwitchTab('ai')}>🤖 تحلیل رقبا و ۱۰۰ کلمه</span>
          <span style={{ cursor: 'pointer', fontWeight: activeTab === 'crm' ? 'bold' : 'normal', color: activeTab === 'crm' ? '#1a73e8' : '#5f6368', background: activeTab === 'crm' ? '#e8f0fe' : 'transparent', padding: '4px 7px', borderRadius: '6px' }} onClick={() => handleSwitchTab('crm')}>📊 CRM تفکیک‌شده</span>
          <span style={{ background: '#f1f3f4', color: '#d93025', padding: '3px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>توکن: {tokens} 🪙</span>
        </div>

        <div style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          <span style={{ color: '#4285F4' }}>R</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>y</span><span style={{ color: '#4285F4' }}>a</span><span style={{ color: '#34A853' }}>l</span> <span style={{ color: '#202124', fontSize: '10px', marginRight: '3px' }}>Search Engine</span>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '25px auto', padding: '0 20px' }}>
        
        <div style={{ marginBottom: '15px', padding: '10px', background: '#fce8e6', border: '1px solid #fadcda', borderRadius: '8px', color: '#d93025', fontSize: '11px', fontWeight: 'bold', lineHeight: '1.5', textAlign: 'center' }}>
          🔥 داده‌کاوی بلادرنگ هر ۱۲۰ ثانیه از گوگل ترندز و اکسپلور فعال<br />
          🚀 پایش ۱۰۰ کلمه برتر سئو کلاسیک گوگل و تحلیل رقبای کراتین و ناخن (۲۲ منطقه تهران)
        </div>

        {activeTab === 'ai' && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', justifyContent: 'center' }}>
            <button onClick={() => setAiSubTab('chatgpt')} style={{ padding: '6px 12px', background: aiSubTab === 'chatgpt' ? '#1a73e8' : '#f1f3f4', color: aiSubTab === 'chatgpt' ? '#fff' : '#202124', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🤖 چت‌جی‌پتی</button>
            <button onClick={() => setAiSubTab('gemini')} style={{ padding: '6px 12px', background: aiSubTab === 'gemini' ? '#1a73e8' : '#f1f3f4', color: aiSubTab === 'gemini' ? '#fff' : '#202124', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ جمنای</button>
            <button onClick={() => setAiSubTab('claude')} style={{ padding: '6px 12px', background: aiSubTab === 'claude' ? '#1a73e8' : '#f1f3f4', color: aiSubTab === 'claude' ? '#fff' : '#202124', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🧠 کلود (Claude)</button>
            <button onClick={() => setAiSubTab('trends')} style={{ padding: '6px 12px', background: aiSubTab === 'trends' ? '#1a73e8' : '#f1f3f4', color: aiSubTab === 'trends' ? '#fff' : '#202124', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>📈 گوگل ترندز ۱۲۰s</button>
          </div>
        )}

        {activeTab !== 'crm' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'normal', color: '#202124', marginBottom: '8px', letterSpacing: '-1px' }}>
                <span style={{ color: '#4285F4' }}>R</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>y</span><span style={{ color: '#4285F4' }}>a</span><span style={{ color: '#34A853' }}>l</span> <span style={{ color: '#EA4335' }}>M</span><span style={{ color: '#4285F4' }}>o</span><span style={{ color: '#FBBC05' }}>t</span><span style={{ color: '#34A853' }}>o</span><span style={{ color: '#EA4335' }}>r</span>
              </h1>
              <p style={{ fontSize: '11px', color: '#5f6368' }}>
                {activeTab === 'betisa' ? 'سئوی ۲۰ هزار کلمه بتی‌سا + ۱۰۰ کلمه برتر گوگل و تحلیل رقبا در ۲۲ منطقه' : (activeTab === 'royal' ? 'سئوی ۱۰۰ هزار کلمه‌ای کشوری رویال فام' : (activeTab === 'ai' ? `موتور هوش مصنوعی: ${aiSubTab.toUpperCase()}` : 'سامانه جامع اصناف کشور'))}
              </p>
            </div>

            <form onSubmit={handleRunSearch} style={{ display: 'flex', alignItems: 'center', border: '1px solid #dfe1e5', borderRadius: '24px', padding: '8px 18px', boxShadow: '0 1px 6px rgba(32,33,36,0.08)', background: '#fff', marginBottom: '15px' }}>
              <span style={{ fontSize: '16px', marginLeft: '8px' }}>🔍</span>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="جستجوی کراتین، صافی، پروتئین تراپی و ناخن..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', background: 'transparent', textAlign: 'right' }} 
              />
              <button type="submit" style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '7px 15px', borderRadius: '14px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                {loading ? 'در حال کاوش...' : 'جستجو و تحلیل'}
              </button>
            </form>

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', border: '1px solid #dadce0', display: 'grid', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>نام صنف / برند:</label>
                  <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px', border: '1px solid #dadce0', borderRadius: '6px', marginTop: '2px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold' }}>تلفن هدایت لید (SMPP):</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px', border: '1px solid #dadce0', borderRadius: '6px', marginTop: '2px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 'bold' }}>حوزه تخصصی خدمات:</label>
                <input type="text" value={specialtyField} onChange={e => setSpecialtyField(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px', border: '1px solid #dadce0', borderRadius: '6px', marginTop: '2px' }} />
              </div>

              {activeTab === 'all' && (
                <div>
                  <label style={{ fontWeight: 'bold' }}>انتخاب پلن‌های درآمدی تجاری اصناف:</label>
                  <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px', border: '1px solid #dadce0', borderRadius: '6px', marginTop: '2px', background: '#fff' }}>
                    <option value="پلن پایه (۳,۰۰۰,۰۰۰ تومان)">📦 پلن پایه — ۳,۰۰۰,۰۰۰ تومان (سئوی محلی اصناف)</option>
                    <option value="پلن پیشرفته (۷,۰۰۰,۰۰۰ تومان)">🚀 پلن پیشرفته — ۷,۰۰۰,۰۰۰ تومان (سئو ۲۰k مناطق تهران)</option>
                    <option value="پلن جامع VIP (۱۲,۰۰۰,۰۰۰ تومان)">💎 پلن جامع VIP — ۱۲,۰۰۰,۰۰۰ تومان (سئو ۱۰۰k کشوری ۲۴/۷)</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>محدوده جغرافیایی (استان):</label>
                  <select value={province} onChange={e => setProvince(e.target.value)} style={{ width: '100%', padding: '5px', fontSize: '10px', border: '1px solid #dadce0', borderRadius: '6px', marginTop: '2px', background: '#fff' }}>
                    {provincesList.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold' }}>شهر / پوشش:</label>
                  <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '5px', fontSize: '10px', border: '1px solid #dadce0', borderRadius: '6px', marginTop: '2px', background: '#fff' }}>
                    {citiesList.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {resultData && (
              <div style={{ marginTop: '15px', background: '#e8f0fe', padding: '12px', borderRadius: '8px', border: '1px solid #b8d4fc', fontSize: '11px' }}>
                <h4 style={{ color: '#1a73e8', margin: '0 0 6px 0', fontSize: '12px' }}>🟢 گزارش داده‌کاوی ۱۲۰ ثانیه‌ای، رقبای تحلیل‌شده و ۱۰۰ کلمه برتر گوگل:</h4>
                <p><strong>وضعیت موتور:</strong> <span style={{color:'#137333', fontWeight:'bold'}}>{resultData.aiMetrics.activeStatus}</span></p>
                <p><strong>ساعت ثبت:</strong> <span style={{color:'#d93025', fontWeight:'bold'}}>{resultData.aiMetrics.entryTime}</span></p>
                <p><strong>حوزه خدمات:</strong> <span style={{color:'#1a73e8', fontWeight:'bold'}}>{resultData.aiMetrics.specialty}</span></p>
                <p><strong>تحلیل رقبا:</strong> <span style={{color:'#d93025', fontWeight:'bold'}}>{resultData.aiMetrics.competitorsAnalysis}</span></p>
                <p><strong>۱۰۰ کلمه برتر سئو (گوگل و اکسپلور):</strong> <span style={{color:'#137333', fontWeight:'bold'}}>{resultData.aiMetrics.top100Keywords}</span></p>
                <p><strong>وضعیت SMPP:</strong> <span style={{color:'#137333', fontWeight:'bold'}}>{resultData.aiMetrics.smppReport}</span></p>
                
                <div style={{ marginTop: '8px', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #d2e3fc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                    <span>📈 پایداری داده‌کاوی بلادرنگ (گوگل ترندز ۱۲۰s)</span>
                    <span style={{ color: '#1a73e8' }}>{resultData.aiMetrics.digitalGraphScore}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#f1f3f4', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${resultData.aiMetrics.digitalGraphScore}%`, background: '#1a73e8', height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <p style={{ marginTop: '8px' }}><strong>مجموع کل لیدهای ثبت‌شده در CRM:</strong> <span style={{color:'#d93025', fontWeight:'bold'}}>{resultData.totalLeads} لید قطعی</span></p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crm' && (
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #dadce0' }}>
            <h3 style={{ color: '#1a73e8', fontSize: '13px', margin: '0 0 12px 0' }}>📋 CRM هوشمند (تفکیک‌شده، داده‌کاوی‌شده با ۱۰۰ کلمه برتر و تحلیل رقبا)</h3>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <button onClick={() => setCrmSubTab('betisaCRM')} style={{ flex: 1, padding: '7px', background: crmSubTab === 'betisaCRM' ? '#1a73e8' : '#fff', color: crmSubTab === 'betisaCRM' ? '#fff' : '#202124', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>CRM بتی‌سا (تهران ۲۲ منطقه)</button>
              <button onClick={() => setCrmSubTab('royalCRM')} style={{ flex: 1, padding: '7px', background: crmSubTab === 'royalCRM' ? '#1a73e8' : '#fff', color: crmSubTab === 'royalCRM' ? '#fff' : '#202124', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>CRM رویال موتور (کشوری)</button>
              <button onClick={() => setCrmSubTab('allCRM')} style={{ flex: 1, padding: '7px', background: crmSubTab === 'allCRM' ? '#1a73e8' : '#fff', color: crmSubTab === 'allCRM' ? '#fff' : '#202124', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>CRM اصناف کشور</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button onClick={() => handleDownloadExcel(crmSubTab === 'betisaCRM' ? 'betisa' : (crmSubTab === 'royalCRM' ? 'royal' : 'all'))} style={{ background: '#137333', color: '#fff', border: 'none', padding: '7px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>📥 دانلود اکسل این بخش (CSV)</button>
            </div>

            <div style={{ display: 'grid', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
              {((crmSubTab === 'betisaCRM' ? dbData.betisaLeads : (crmSubTab === 'royalCRM' ? dbData.royalLeads : dbData.allSectorsLeads)) || []).length === 0 ? (
                <p style={{ fontSize: '11px', color: '#5f6368', textAlign: 'center', padding: '15px' }}>هیچ لیدی در این بخش ثبت نشده است (کاملاً تفکیک‌شده).</p>
              ) : (
                ((crmSubTab === 'betisaCRM' ? dbData.betisaLeads : (crmSubTab === 'royalCRM' ? dbData.royalLeads : dbData.allSectorsLeads)) || []).map((lead, idx) => (
                  <div key={idx} style={{ background: '#fff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{idx + 1}. {lead.business}</strong> ({lead.manager} - {lead.phone})<br />
                      <span style={{ color: '#1a73e8' }}>حوزه: {lead.specialtyField}</span> | <span style={{ color: '#137333' }}>پوشش: {lead.coverageScope}</span><br />
                      <span style={{ color: '#d93025' }}>رقبا: {lead.competitors}</span><br />
                      <span style={{ color: '#34a853' }}>۱۰۰ کلمه برتر: {lead.topKeywords}</span><br />
                      <span style={{ color: '#b06000' }}>⏰ ساعت ورود: {lead.entryTime} (داده‌کاوی ۱۲۰s)</span>
                    </div>
                    <span style={{ background: '#e6f4ea', color: '#137333', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold' }}>SMPP تایید</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', background: '#fef7e0', borderTop: '2px solid #fbbc04', padding: '8px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#b06000' }}>
        ⚠️ تحت نظارت استارتاپ فناورانه هوش مصنوعی رویال فام | توسعه‌دهنده: امیرسام یعقوبی (09366681963)
      </div>
    </div>
  );
}

