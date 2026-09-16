const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');

app.use(cors());
app.use(express.json());
app.use(express.static('../PRODUCTION_SPRINT/Landing_Page'));

app.post('/capture', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
        leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }

    const newLead = {
        email,
        status: 'L0_INTAKE',
        timestamp: new Date().toISOString(),
        id: 'lead_' + Date.now(),
        progress_bus: 'L0'
    };

    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    console.log(`Lead captured: ${email} (ID: ${newLead.id})`);
    
    res.json({ 
        message: 'Success! Your toolkit is on its way.',
        leadId: newLead.id,
        toolkitUrl: 'https://aikagan.com/toolkit' // Placeholder
    });
});

app.listen(PORT, () => {
    console.log(`Aikagan Lead Capture Server running at http://localhost:${PORT}`);
});
