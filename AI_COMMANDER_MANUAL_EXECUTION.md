# AI COMMANDER: MANUAL EXECUTION SCRIPT

> **STATUS:** CODE WRITTEN. WAITING FOR HUMAN FULFILLMENT.
> **OBJECTIVE:** Finalize the Make.com bridging so AIKAGAN can run selective launch announcements and customer-service coverage from the new agent payloads.

Complete these steps in exact order to activate the Chimera Genesis Launch.

## Step 1: Supply Fulfillment Credentials
I have generated a `.env.fulfillment` file in the root of `aikagan-web`.
1. Open `.env.fulfillment`.
2. Add your `GEMINI_API_KEY`.
3. Create a new Scenario in Make.com.
4. Add a "Custom Webhook" module as the trigger. Copy that URL and paste it into `.env.fulfillment` as `MAKE_OMNICHANNEL_WEBHOOK_URL`.
5. Create a second Scenario in Make.com for Customer Support.
6. Add a "Custom Webhook" module. Copy that URL and paste it as `MAKE_CUSTOMER_SERVICE_WEBHOOK_URL`.
7. Optional but recommended: set `AIKAGAN_LAUNCH_CHANNELS=x,linkedin,reddit,discord,substack,hacker_news` and `AIKAGAN_DISCOUNT_CODE=KAGANATE`.
8. The Python scripts now auto-read `.env.fulfillment` from the repo root, so no rename is required.

## Step 2: Configure Make.com Routing
The Python code handles the AI generation. Make.com just routes the text.

### Omnichannel Router (Make.com)
- Connect your "Custom Webhook" to a "Router" module.
- Add only the launch paths you want active immediately.
- Recommended starting set: X, LinkedIn, Reddit, Discord, Substack, Hacker News.
- Route each object from `launch_posts[]` by its `channel`.
- Use `execution_waves[]` to queue or delay later waves rather than blasting every post at once.
- **Turn the Scenario ON.**

### Customer Service Router (Make.com)
- The webhook will receive FAQ updates, objection replies, support macros, and public support posts.
- Connect the Webhook to Gmail, your helpdesk, or the community/social modules you actually use.
- Route `reply_macros[]` into email/helpdesk templates and `support_posts[]` into selected public channels.
- **Turn the Scenario ON.**

## Step 3: Trigger the Grand Launch
1. Install the Python dependencies:
   - `pip install -r scripts/agent/requirements.txt`
2. Run the launch director:
   - `python scripts/agent/omnichannel_publisher_agent.py`
3. Run the customer success commander:
   - `python scripts/agent/customer_success_commander.py`
4. Confirm both payloads were written into `scripts/agent/content_backlog/`.
5. Confirm both Make.com scenarios received the payloads and routed the correct items.

---
**END OF MANUAL SCRIPT. AUTOMATION ACHIEVED.**
