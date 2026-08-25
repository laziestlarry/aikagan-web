# Direct social publishing release

AIKAGAN now contains first-party OAuth and publishing paths for LinkedIn, Facebook Pages, and Instagram Professional accounts.

Activation requires production provider credentials and a completed OAuth authorization:

- LinkedIn: `/api/social/oauth/linkedin`
- Meta: `/api/social/oauth/meta`
- Publish API: `/api/social/publish`

Tokens are stored encrypted in server-side KV using `SOCIAL_TOKEN_ENCRYPTION_KEY` (falling back to the admin publish secret only when necessary). No provider tokens or app secrets belong in source control.
