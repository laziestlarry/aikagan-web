import { redirect } from "next/navigation";

/**
 * The old /thank-you page showed all 3 product downloads to anyone
 * with no purchase verification. It has been replaced by /checkout-success
 * which requires a signed download token from the LemonSqueezy webhook.
 *
 * Existing links are redirected to the new page; buyers should use the
 * token from their confirmation email.
 */
export default function ThankYouPage() {
  redirect("/checkout-success");
}
