const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'leads.json');
const AUDIT_QUESTIONS = path.join(__dirname, '../PRODUCTION_SPRINT/Pipeline/Intent_Audit_Questions.md');
const OUTPUT_LOG = path.join(__dirname, 'pipeline_ops.log');

function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(OUTPUT_LOG, entry);
    console.log(msg);
}

async function processLeads() {
    if (!fs.existsSync(LEADS_FILE)) return;

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    let changed = false;

    for (let lead of leads) {
        if (lead.status === 'L0_INTAKE') {
            log(`Processing L0 -> L1 for ${lead.email} (ID: ${lead.id})`);
            
            // Simulate sending the Intent Audit Questions
            const questions = fs.readFileSync(AUDIT_QUESTIONS, 'utf8');
            log(`SENT INTENT AUDIT to ${lead.email}:\n${questions}`);
            
            lead.status = 'L1_QUALIFICATION';
            lead.progress_bus = 'L1';
            changed = true;
        }
        
        // If lead is in L1, we would normally wait for a response.
        // For this prototype, let's simulate a "Positive Response" for any lead that's been in L1 for > 10 seconds.
        if (lead.status === 'L1_QUALIFICATION' && (Date.now() - new Date(lead.timestamp).getTime() > 10000)) {
            log(`SIMULATING POSITIVE RESPONSE for ${lead.email} (ID: ${lead.id})`);
            
            // Move to L2: Opportunity Mapping
            lead.status = 'L2_OPPORTUNITY_MAPPING';
            lead.progress_bus = 'L2';
            
            log(`Processing L1 -> L2 for ${lead.email}. Generating Custom Opportunity Map...`);
            changed = true;
        }

        if (lead.status === 'L2_OPPORTUNITY_MAPPING') {
             log(`Processing L2 -> L3 for ${lead.email}. Preparing Proposal...`);
             lead.status = 'L3_CONVERSION';
             lead.progress_bus = 'L3';
             changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    }
}

log('Pipeline Monitor started. Watching for leads...');
setInterval(processLeads, 5000);
