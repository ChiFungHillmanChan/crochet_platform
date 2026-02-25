const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",");

export function corsHeaders(origin) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function response(statusCode, body, origin = "") {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
    body: JSON.stringify(body),
  };
}

export function success(data, origin) {
  return response(200, data, origin);
}

export function error(statusCode, message, origin) {
  return response(statusCode, { error: message }, origin);
}
