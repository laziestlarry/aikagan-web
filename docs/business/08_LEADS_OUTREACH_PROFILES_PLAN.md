# Chrome & Google Profiles Outreach Strategy
## AutonomaX Business Unit — Lead Generation Engine

To launch leads organically and scale outbound conversations without cross-contaminating account sessions or triggering platform-level anti-spam filters, we use isolated **Google Chrome Profiles** mapping to specific **Outreach Personas**.

---

## 1. OUTREACH PERSONAS

We define 3 core personas, each mapping to a unique target audience and specific "approved networks".

### Persona A: "Lazy Larry" (Brand Ambassador)
- **Target Audience**: Indie builders, SaaS developers, creators, and micro-bootstrappers.
- **Approved Networks**: Reddit (r/SideProject, r/SaaSMarketing, r/Entrepreneur, r/IndieHackers), IndieHackers.
- **Core Pitch**: AutonomaX replaces expensive monthly SaaS subscriptions (checkout, fulfillment, email) for a single one-time fee.
- **Angle**: High-empathy developer-to-developer peer recommendation.

### Persona B: "Kagan" (Founder / Strategic)
- **Target Audience**: Business coaches, marketing agency owners, and "Done-For-You" service providers.
- **Approved Networks**: LinkedIn, Twitter/X.
- **Core Pitch**: The Reseller/White-Label program. Buy the Commander Pack for $149 once, and resell it to your clients at $497-$997 under your own brand, keeping 100% of the profits.
- **Angle**: Business growth, new revenue stream, white-label leverage.

### Persona C: "Affiliate Recruiter" (Ambassador Recruiter)
- **Target Audience**: Micro-influencers (500 to 5,000 followers) in the startup/solopreneur niches.
- **Approved Networks**: Twitter/X, Instagram, YouTube.
- **Core Pitch**: Join the Tier 1/2 Affiliate Program. Earn 20-30% recurring commission on referrals with a pre-packaged affiliate promo kit.
- **Angle**: Partnership enablement, zero-work side income.

---

## 2. CHROME / GOOGLE PROFILES CONFIGURATION

Each persona must run in an isolated Chrome Instance to protect cookies, session storage, and avoid platform fingerprint linking.

### Command-line Start Scripts (macOS)

Run these commands in terminal to launch isolated Chrome instances:

```bash
# Launch Larry Lazy Profile
open -n -a "Google Chrome" --args --user-data-dir="/Users/pq/Library/Application Support/Google/Chrome/AutonomaX_Larry" --profile-directory="Profile 1"

# Launch Kagan Profile
open -n -a "Google Chrome" --args --user-data-dir="/Users/pq/Library/Application Support/Google/Chrome/AutonomaX_Kagan" --profile-directory="Profile 1"

# Launch Affiliate Recruiter Profile
open -n -a "Google Chrome" --args --user-data-dir="/Users/pq/Library/Application Support/Google/Chrome/AutonomaX_Recruiter" --profile-directory="Profile 1"
```

### Safety & Configuration Checklist
1. **IP Isolation**: If running high daily message volume, use a dedicated proxy extension inside each profile (e.g. Proxy SwitchyOmega) mapped to distinct residential proxies.
2. **Dedicated Logins**: Never log into Kagan's LinkedIn from Larry's profile or vice versa.
3. **Session Cookies**: Keep profiles open; do not clear cookies upon exiting, as logging in from new sessions daily triggers security alerts.

---

## 3. APPROVED NETWORKS & SEARCH QUERIES

| Persona | Platform | Search Query / Filter | Action |
|---------|----------|-----------------------|--------|
| **Larry** | Reddit | `r/SideProject` sorting by "New" | Look for "How do I monetize?" or launch announcements. |
| **Larry** | Reddit | `r/SaaSMarketing` query: `"first customer"` | Find builders struggling with acquisition. |
| **Larry** | IndieHackers | Category: `Milestones` or tag: `SaaS` | Congratulate on launch, suggest checking out white-label/templates. |
| **Kagan** | LinkedIn | Titles: `"agency founder"` OR `"business coach"` | Pitch white-label system to upsell to their clients. |
| **Kagan** | Twitter/X | Query: `"looking for SaaS"`, `"stripe checkout"` | Suggest AutonomaX as a Paddle-ready alternative. |
| **Recruiter**| Twitter/X | Query: `"marketing tips"` or followers of Indie solopreneurs | Pitch affiliate program to micro-content creators. |

---

## 4. OUTREACH TEMPLATES (PLATFORM-TAILORED)

### Reddit / IndieHackers (Larry)
> **Subject**: Nice launch! Quick question about your checkout setup
>
> Hey [username], saw your post about [product name] in [r/SideProject]. The UI looks super clean!
>
> I was wondering what you're planning to use for your checkout and digital fulfillment? I used to get hit with high monthly SaaS fees just to deliver files and handle Stripe, so I ended up switching to AutonomaX. It's a one-time $29 layout and supports Paddle + auto-delivery.
>
> If you're interested, you can check it out here: `https://aikagan.com/products/masterclass-starter/?utm_source=reddit_larry&utm_medium=dm_outreach`
>
> Keep up the great work!

### LinkedIn (Kagan - Agency White-Label)
> Hi [First Name],
>
> I notice you help agency clients scale their marketing operations. 
>
> We just launched the AutonomaX Reseller Program. Agency owners buy our Commander package once ($149) and white-label the complete business ops engine to resell to their own clients at $497-$997, keeping 100% of the resale margin.
>
> It solves client onboarding, Paddle checkout, and automated fulfillment in one package under your own brand.
>
> Are you open to a quick look to see if this fits your current agency portfolio?
>
> Best,
> Kagan
> `https://aikagan.com/products/masterclass-commander/?utm_source=linkedin_kagan&utm_medium=dm_outreach`

### Twitter/X / Instagram (Affiliate Recruiter)
> Hey [Name]! Love your content on solopreneurship.
>
> We just launched AutonomaX (aikagan.com) - a business-in-a-box ops engine for a single one-time fee instead of $147/mo SaaS subscriptions.
>
> We're onboarding partners this week:
> - 20% recurring commission on every sale.
> - Pre-made promo kit (emails, posts, carousels).
> - Free access to our Pro tools.
>
> Let me know if you want me to send over your unique invite link!
