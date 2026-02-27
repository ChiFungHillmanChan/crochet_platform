function handler(event) {
  var response = event.response;
  var headers = response.headers;

  // Prevent clickjacking
  headers["x-frame-options"] = { value: "DENY" };

  // Prevent MIME type sniffing
  headers["x-content-type-options"] = { value: "nosniff" };

  // Force HTTPS (2 year max-age + preload)
  headers["strict-transport-security"] = {
    value: "max-age=63072000; includeSubDomains; preload",
  };

  // Control Referrer information leakage
  headers["referrer-policy"] = { value: "strict-origin-when-cross-origin" };

  // Basic CSP — allow own domain + Firebase + Stripe + R2 CDN + GA4
  headers["content-security-policy"] = {
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://apis.google.com https://*.firebaseio.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev https://*.googleusercontent.com https://www.google-analytics.com https://img.youtube.com",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.google.com https://2tqn1i1a3e.execute-api.eu-west-2.amazonaws.com https://api.stripe.com https://www.google-analytics.com https://analytics.google.com",
      "frame-src https://js.stripe.com https://*.firebaseapp.com https://www.youtube-nocookie.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  };

  // Prevent browser features from being abused by third parties
  headers["permissions-policy"] = {
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  };

  return response;
}
