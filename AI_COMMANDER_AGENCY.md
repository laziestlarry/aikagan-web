# AI Commander Agency - System Organization

This document maps the AIKAGAN launch and customer-success agents that turn product pages into a self-operating launch system.

## The Commanders

### 1. Launch Director
- **Role:** Selective omnichannel launch operator.
- **Directive:** Pull a live buyer signal, choose the highest-intent launch channels, and generate announcement posts, follow-up replies, and public reassurance copy that push qualified traffic into the conversion path.
- **Location:** `scripts/agent/omnichannel_publisher_agent.py`
- **Output:** `scripts/agent/content_backlog/latest_launch_director_payload.json`
- **Distribution:** Sends one structured payload to `MAKE_OMNICHANNEL_WEBHOOK_URL` for routing by channel and wave.

### 2. Customer Success Commander
- **Role:** Pre-sales and post-purchase friction remover.
- **Directive:** Generate FAQ updates, objection-handling replies, delivery-support macros, and reassurance posts that protect conversion and reduce refund friction.
- **Location:** `scripts/agent/customer_success_commander.py`
- **Output:** `scripts/agent/content_backlog/latest_customer_success_payload.json`
- **Distribution:** Sends one structured payload to `MAKE_CUSTOMER_SERVICE_WEBHOOK_URL`.

### 3. Audience Signal Agent (Legacy / Optional)
- **Role:** Friction map builder.
- **Directive:** Analyze objections and recurring resistance patterns for roadmap and FAQ updates.
- **Location:** `autonomax_revenue_ops/agents/audience_signal_agent.py`

## Operating Model

1. **Signal intake:** The launch director pulls a current audience pain point and combines it with AIKAGAN offer context.
2. **Selective channel planning:** The agent chooses high-intent networks instead of forcing every possible platform.
3. **Launch-wave execution:** Make.com receives a payload containing priority channels, timing waves, launch copy, and follow-up replies.
4. **Customer-service coverage:** The customer success commander generates support macros, FAQs, and public reassurance posts for objection handling.
5. **Human override remains available:** Operators can review payloads in `scripts/agent/content_backlog/` before or after Make.com distribution.
