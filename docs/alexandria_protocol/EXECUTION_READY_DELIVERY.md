# Execution-Ready Delivery

This document outlines the deployment, execution, and validation procedures to transition from dev environments to live production.

## 1. System Initialization
- **Resource Provisioning**: Ensure Google Cloud BigQuery datasets and Looker explores are properly mapped and active.
- **Access Control**: RLS (Row-Level Security) and column masking policies must be enabled before connecting live CRM/ERP feeds.

## 2. Deployment Rituals
- **Checks and Gates**: Operations status checkers (Paddle/LS/Shopier webhook connectivity, KV stores, and email queues) must pass with zero blockers.
- **Weekly Scorecard**: Review pipeline velocity, on-time delivery rates, and automation coverage every Friday.

## 3. Incident & Recovery Runbooks
- **Stealth Protocols**: If any provider issues a policy warning or API failure, execute the emergency withdrawal drill:
  1. Pause automatic deployments.
  2. Rotate platform API credentials.
  3. Reroute checkout flows to active fallbacks (e.g. Gumroad/Shopier).
- **Manual Seeding**: Manually inject lead records and verify webhook payloads during signal dry spells.
