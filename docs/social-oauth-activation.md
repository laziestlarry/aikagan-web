# Social OAuth activation matrix

Canonical campaign destination: https://aikagan.com/start-free/

## LinkedIn

Use a LinkedIn Developer app and enable **Share on LinkedIn**. Request member authorization using OAuth 2.0 and the `w_member_social` scope. For organization posting, use `w_organization_social` only when the authenticated member has an eligible Page role and the app has the required Marketing/Community access.

Recommended callback: `https://aikagan.com/api/social/oauth/linkedin/callback`

Production secrets/values (never commit):
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_REDIRECT_URI`
- `LINKEDIN_AUTHOR_URN` (member or organization URN used by the publishing connector)

## X

Use an approved X Developer Project/App. Enable OAuth 2.0 Authorization Code with PKCE for user-context publishing. Required scopes for posting: `tweet.read tweet.write users.read`; add `offline.access` when refresh tokens are needed for durable automation.

Recommended callback: `https://aikagan.com/api/social/oauth/x/callback`

Production secrets/values:
- `X_CLIENT_ID`
- `X_CLIENT_SECRET` (for confidential web app)
- `X_REDIRECT_URI`

Publish endpoint: `POST https://api.x.com/2/tweets`.

## Facebook Page

Use a Meta Business app and Facebook Login for Business. The publishing connector should obtain a user token, resolve Pages managed by that user, obtain the Page access token, and publish only to a Page the authorized user administers. Keep Page IDs and tokens out of source control.

Recommended callback: `https://aikagan.com/api/social/oauth/meta/callback`

Production values:
- `META_APP_ID`
- `META_APP_SECRET`
- `META_REDIRECT_URI`
- `META_PAGE_ID`

## Instagram

Use an Instagram Professional account (Business or Creator). Preferred current path: Business Login for Instagram with `instagram_business_basic` and `instagram_business_content_publish`, or Facebook Login for Business with the corresponding Instagram/Page permissions when the Instagram account is linked to a Facebook Page.

Content publishing requires public media URLs; publishing is a media-container then `media_publish` flow. Consumer/personal Instagram accounts are not suitable for API publishing.

Production values:
- `INSTAGRAM_USER_ID`
- provider access/refresh tokens in the connector secret store only

## Security and evidence rules

- Do not place provider access tokens, refresh tokens, app secrets, or Page tokens in GitHub.
- Use HTTPS callback URLs and validate OAuth `state`; X PKCE must use a verifier/challenge.
- Request the narrowest scopes required for publishing.
- Store provider tokens in a server-side encrypted secret store or managed OAuth broker.
- Direct publishing is only considered activated after a real provider response returns a post/media ID and the post URL is verified.
- Keep one-click social share intents available as a fallback while provider approval or OAuth setup is pending.
