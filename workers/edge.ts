const CANONICAL_ORIGIN = "https://aikagan.com";

function isAikaganHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "aikagan.com" || host.endsWith(".aikagan.com");
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/healthz" || url.pathname === "/cf-health") {
      return Response.json({
        ok: true,
        service: "aikagan-web",
        runtime: "cloudflare-workers",
      });
    }

    if (isAikaganHost(url.hostname)) {
      return new Response("AIKAGAN edge worker. Canonical app: https://app.aikagan.com\n", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    return Response.redirect(
      new URL(url.pathname + url.search, CANONICAL_ORIGIN).toString(),
      302
    );
  },
};
