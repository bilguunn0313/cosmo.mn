type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

interface ErrorBody {
  message?: string | string[];
  errors?: Record<string, string[] | undefined>;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body: unknown,
  ) {
    super(message);
  }

  get fieldErrors(): Record<string, string[] | undefined> {
    return (this.body as ErrorBody | null)?.errors ?? {};
  }
}

function buildUrl(path: string, searchParams: RequestOptions["searchParams"]) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `/api${path}?${query}` : `/api${path}`;
}

function buildBody(body: unknown) {
  if (body === undefined) {
    return { body: undefined, headers: undefined };
  }

  if (body instanceof FormData) {
    return { body, headers: undefined };
  }

  return {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
}

function errorMessage(body: unknown, status: number) {
  const message = (body as ErrorBody | null)?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message ?? `Алдаа гарлаа (${status})`;
}

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers } = buildBody(options.body);

  const response = await fetch(buildUrl(path, options.searchParams), {
    method: options.method ?? "GET",
    credentials: "same-origin",
    headers,
    body,
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorMessage(errorBody, response.status),
      errorBody,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
