export default function handler(req, res) {
  res.status(200).json({
    status: "Success",
    engine: "Royal Fam Smart SEO Engine 24/7",
    backend: "Next.js API & Node.js",
    coverage: {
      provinces: "31 Provinces",
      tehranDistricts: "22 Districts",
      betisaCompetitors: "50+ Analyzed",
      keywords: "100,000 Target Keywords"
    },
    contacts: {
      ceo: "Amirsam Yaghobi (09366681963)",
      betisaManager: "Bita Ghanaati (09125154024)"
    },
    copyright: "استارتاپ فناورانه هوش مصنوعی رویال فام - تمامی حقوق محفوظ است و هرگونه کپی‌برداری پیگیری قضایی دارد."
  });
}
