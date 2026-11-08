import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'royal_leads_db.json');

export function getDatabase() {
  try {
    if (!fs.existsSync(filePath)) {
      const initialData = { betisaLeads: [], royalLeads: [], allSectorsLeads: [] };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return { betisaLeads: [], royalLeads: [], allSectorsLeads: [] };
  }
}

export function saveLead(leadData, category) {
  const db = getDatabase();
  const targetKey = category === 'betisa' ? 'betisaLeads' : (category === 'royal' ? 'royalLeads' : 'allSectorsLeads');
  
  if (!db[targetKey]) db[targetKey] = [];

  const newEntry = { 
    ...leadData, 
    entryTime: new Date().toLocaleTimeString('fa-IR'),
    timestamp: new Date().toISOString() 
  };
  
  db[targetKey].push(newEntry);
  if (db[targetKey].length > 10000) db[targetKey].shift();

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  return db;
}
