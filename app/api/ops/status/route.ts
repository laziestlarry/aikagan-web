import { NextRequest, NextResponse } from "next/server";
import { CHECKOUT_SENTINEL, getPaidProducts } from "@/lib/products";
import { ensureGumroadSaleSubscription, isGumroadApiConfigured } from "@/lib/gumroad-api";
import { canonicalSiteOrigin, isFirstPartyCommerceHost, paddleCheckoutOrigin } from "@/lib/site-origin";
import { getSocialCredential } from "@/lib/social/token-store";
import { getLinkedInAppConfig, getMetaAppConfig, socialAdminSecret } from "@/lib/social/config-store";
import { canStartPaidCheckout, isHostedGumroadOffer, isStorefrontCommerceEnabled, storefrontCommerceState } from "@/lib/commerce";
import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function configured(name: string): boolean { const value = process.env[name]; return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim())); }
function configuredAny(...names: string[]): boolean { return names.some(configured); }

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorizedResponse();
  const paidProducts = getPaidProducts();
  const managedProducts = paidProducts.filter((product) => product.checkoutUrl === CHECKOUT_SENTINEL);
  const scopedServices = paidProducts.filter((product) => product.checkoutUrl !== CHECKOUT_SENTINEL);
  const hostedGumroadProducts = managedProducts.filter((product) => isHostedGumroadOffer(product.slug));
  const startableProducts = managedProducts.filter((product) => canStartPaidCheckout(product.slug));
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const firstPartySurface = isFirstPartyCommerceHost(hostname);
  const paddleCredentialsReady = process.env.PADDLE_CHECKOUT_DISABLED !== "true" && configured("PADDLE_API_KEY") && configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") && configured("PADDLE_WEBHOOK_SECRET");
  const lemonMerchantApproved = process.env.LEMONSQUEEZY_MERCHANT_APPROVED === "true";
  const siteUrl = canonicalSiteOrigin(req.nextUrl.origin);

  let gumroadVerification: { ready: boolean; created: boolean; detail?: string } = { ready: false, created: false, detail: "GUMROAD_ACCESS_TOKEN missing" };
  if (isGumroadApiConfigured()) {
    try { gumroadVerification = await ensureGumroadSaleSubscription(new URL("/api/webhooks/gumroad", siteUrl).toString()); }
    catch (e) { gumroadVerification = { ready: false, created: false, detail: `Gumroad sales verification probe failed: ${e instanceof Error ? e.message : String(e)}` }; }
  }

  const providers = {
    gumroad: hostedGumroadProducts.length > 0,
    shopier: configuredAny("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") && configuredAny("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") && configuredAny("SHOPIER_OSB_PASSWORD", "AUTONOMAX_SHOPIER_OSB_KEY", "AUTONOMAX_SHOPIER_OSB_PASSWORD"),
    paddle: firstPartySurface && paddleCredentialsReady,
    lemonsqueezy: lemonMerchantApproved && process.env.LEMONSQUEEZY_CHECKOUT_ENABLED === "true" && configured("LEMONSQUEEZY_API_KEY") && configured("LEMONSQUEEZY_STORE_ID") && configured("LEMONSQUEEZY_WEBHOOK_SECRET"),
  };
  const defaultCheckoutProvider = providers.gumroad ? "gumroad" : providers.shopier ? "shopier" : providers.paddle ? "paddle" : providers.lemonsqueezy ? "lemonsqueezy" : null;

  const commerceChecks = {
    deployment: true,
    catalog: managedProducts.length > 0,
    checkoutStartable: startableProducts.length > 0,
    hostedGumroadMapped: hostedGumroadProducts.length > 0,
    checkoutProvider: Boolean(defaultCheckoutProvider),
    downloadTokens: configured("DOWNLOAD_TOKEN_SECRET"),
    customerSessionSigning: configuredAny("CUSTOMER_SESSION_SECRET", "DOWNLOAD_TOKEN_SECRET"),
    fulfillmentWebhook: configuredAny("MAKE_PURCHASE_WEBHOOK_URL", "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL"),
    durableQueue: configured("KV_REST_API_URL") && configured("KV_REST_API_TOKEN"),
  };

  const [linkedinCredential, facebookCredential, instagramCredential, linkedinConfig, metaConfig] = await Promise.all([getSocialCredential("linkedin"),getSocialCredential("facebook"),getSocialCredential("instagram"),getLinkedInAppConfig(),getMetaAppConfig()]);
  const social = { linkedinAppConfigured:Boolean(linkedinConfig), metaAppConfigured:Boolean(metaConfig), linkedinConnected:Boolean(linkedinCredential), facebookConnected:Boolean(facebookCredential), instagramConnected:Boolean(instagramCredential), publishAdminConfigured:Boolean(socialAdminSecret()), tokenEncryptionConfigured:configuredAny("SOCIAL_TOKEN_ENCRYPTION_KEY","SOCIAL_PUBLISH_ADMIN_SECRET","ADMIN_SECRET","DOWNLOAD_TOKEN_SECRET") };
  const directSocialReady = social.publishAdminConfigured && social.tokenEncryptionConfigured && (social.linkedinConnected || social.facebookConnected || social.instagramConnected);

  const warnings = {
    globalStorefrontFlag:isStorefrontCommerceEnabled(), analytics:configuredAny("NEXT_PUBLIC_GA_ID","NEXT_PUBLIC_GA_MEASUREMENT_ID","NEXT_PUBLIC_META_PIXEL_ID"), capi:configured("META_CAPI_ACCESS_TOKEN")&&configuredAny("NEXT_PUBLIC_META_PIXEL_ID","META_PIXEL_ID"), omnichannel:configured("MAKE_OMNICHANNEL_WEBHOOK_URL"), gumroadSalesVerificationApi:gumroadVerification.ready, shopierBackup:providers.shopier, lemonsqueezyBackup:providers.lemonsqueezy, directSocialPublishing:directSocialReady,
  };

  const commerceReady = Object.values(commerceChecks).every(Boolean);
  const launchReady = commerceReady;

  return NextResponse.json({
    service:"AIKAGAN ProfitOS Commerce", mode:launchReady?"live":storefrontCommerceState(), ready:launchReady, commerceReady, commercialEvidence:"configuration_only", growthAutomationReady:directSocialReady, simulated:false, checkedAt:new Date().toISOString(),
    architecture:{ storefront:siteUrl, app:"https://app.aikagan.com", checkoutSurface:defaultCheckoutProvider==="paddle"?paddleCheckoutOrigin():siteUrl, defaultCheckoutProvider, flow:"storefront -> /api/income/checkout -> hosted Gumroad -> independently verified sale -> ledger -> entitlement -> customer session -> secure delivery", growthFlow:"useful free experience -> attributed network traffic -> qualified offer -> verified checkout -> fulfillment -> acceptance" },
    products:{ managedCheckout:managedProducts.length, managedCheckoutSlugs:managedProducts.map(p=>p.slug), startableCheckout:startableProducts.length, startableCheckoutSlugs:startableProducts.map(p=>p.slug), hostedGumroad:hostedGumroadProducts.length, hostedGumroadSlugs:hostedGumroadProducts.map(p=>p.slug), scopedServices:scopedServices.length, scopedServiceSlugs:scopedServices.map(p=>p.slug) },
    providers,
    providerEvidence:{ gumroad:{ hostedCheckoutMapped:hostedGumroadProducts.length>0, mappedOffers:hostedGumroadProducts.length, apiConfigured:isGumroadApiConfigured(), salesVerificationReady:gumroadVerification.ready, detail:gumroadVerification.detail }, paddle:{serverRequestSurfaceApproved:firstPartySurface,credentialsReady:paddleCredentialsReady,requestHostname:hostname,checkoutSurface:paddleCheckoutOrigin()}, lemonsqueezy:{merchantApproved:lemonMerchantApproved,enabled:lemonMerchantApproved&&process.env.LEMONSQUEEZY_CHECKOUT_ENABLED==="true"} },
    social, checks:commerceChecks, warnings,
    blockers:Object.entries(commerceChecks).filter(([,ok])=>!ok).map(([name])=>name),
    growthBlockers:[...(!social.linkedinAppConfigured?["linkedin_app_credentials"]:[]),...(!social.metaAppConfigured?["meta_app_credentials"]:[]),...(!social.publishAdminConfigured?["social_publish_admin_authority"]:[]),...(!social.tokenEncryptionConfigured?["social_token_encryption"]:[]),...(!(social.linkedinConnected||social.facebookConnected||social.instagramConnected)?["social_account_authorization"]:[])],
    advisories:Object.entries(warnings).filter(([,ok])=>!ok).map(([name])=>name),
  },{status:launchReady?200:503});
}
