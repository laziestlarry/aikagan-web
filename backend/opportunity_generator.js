const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'leads.json');
const OUTPUT_DIR = path.join(__dirname, '../PRODUCTION_SPRINT/Opportunity_Maps');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generateMap(lead) {
    const mapPath = path.join(OUTPUT_DIR, `opp\_map_${lead.id}.md`);
    
    // In a real scenario, we would use the lead's actual responses to the Intent Audit.
    // Here, we simulate a "High-Performance Operator" persona.
    const content = `# CUSTOM AI OPPORTUNITY MAP: ${lead.email}
## Prepared by RA6 Orchestrator | Aikagan

### 1. THE FRICTION DIAGNOSIS
**Identified Bottleneck:** Manual lead qualification and inconsistent discovery calls.
**Cost of Inefficiency:** Estimated 15-20 hours/week of high-value time spent on unqualified leads.
**Revenue Leak:** Approx. 20% of potential conversion lost due to slow response time.

### 2. THE ZERO-GAP SOLUTION: THE AI AGENCY PIPELINE
We propose the implementation of the **RA6 L0-L8 Progress Bus**:
- **L0-L1 (Autonomous Intake):** Move from manual forms to intent-scored capture.
- **L2 (Automated Opportunity Mapping):** Instant value delivery to high-intent leads.
- **L5-L6 (Fast-Track Fulfillment):** Automated onboarding and "First Value Delivery" within 24 hours.

### 3. EXPECTED OUTCOMES
- **Velocity Increase:** 30-50% reduction in time-to-close.
- **Quality Lift:** 100% of calls will be with "High-Intent" partners.
- **Scalability:** Ability to handle 10x lead volume without increasing headcount.

### 4. THE FOUNDING PARTNER OFFER
**Next Step:** Activate the "Zero-Gap" build. 
**Terms:** Lifetime access to the AI Agency Pipeline + Priority implementation.
`;

    fs.writeFileSync(mapPath, content);
    return mapPath;
}

function processL2Leads() {
    if (!fs.existsSync(LEADS_FILE)) return;

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    let changed = false;

    for (let lead of leads) {
        if (lead.status === 'L2_OPPORTUNITY_MAPPING') {
            console.log(`Generating Opportunity Map for ${lead.email}...`);
            const mapPath = generateMap(lead);
            
            lead.status = 'L3_CONVERSION';
            lead.progress_bus = 'L3';
            lead.artifact_uri = mapPath;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    }
}

processL2Leads();
