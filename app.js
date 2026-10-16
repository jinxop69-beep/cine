// node_modules/@supabase/supabase-js/dist/tracingRegistry.mjs
var EXTRACTOR_KEY = /* @__PURE__ */ Symbol.for("@supabase/supabase-js.traceContextExtractor");
function getTraceContextExtractor() {
  return globalThis[EXTRACTOR_KEY];
}

// node_modules/tslib/tslib.es6.mjs
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

// node_modules/@supabase/functions-js/dist/module/helper.js
var resolveFetch = (customFetch) => {
  if (customFetch) {
    return (...args) => customFetch(...args);
  }
  return (...args) => fetch(...args);
};

// node_modules/@supabase/functions-js/dist/module/types.js
var FunctionsError = class extends Error {
  constructor(message, name = "FunctionsError", context) {
    super(message);
    this.name = name;
    this.context = context;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context
    };
  }
};
var FunctionsFetchError = class extends FunctionsError {
  constructor(context) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
  }
};
var FunctionsRelayError = class extends FunctionsError {
  constructor(context) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
  }
};
var FunctionsHttpError = class extends FunctionsError {
  constructor(context) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
  }
};
var FunctionRegion;
(function(FunctionRegion2) {
  FunctionRegion2["Any"] = "any";
  FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
  FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
  FunctionRegion2["ApSouth1"] = "ap-south-1";
  FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
  FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
  FunctionRegion2["CaCentral1"] = "ca-central-1";
  FunctionRegion2["EuCentral1"] = "eu-central-1";
  FunctionRegion2["EuWest1"] = "eu-west-1";
  FunctionRegion2["EuWest2"] = "eu-west-2";
  FunctionRegion2["EuWest3"] = "eu-west-3";
  FunctionRegion2["SaEast1"] = "sa-east-1";
  FunctionRegion2["UsEast1"] = "us-east-1";
  FunctionRegion2["UsWest1"] = "us-west-1";
  FunctionRegion2["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));

// node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
var FunctionsClient = class {
  /**
   * Creates a new Functions client bound to an Edge Functions URL.
   *
   * @example Using supabase-js (recommended)
   * ```ts
   * import { createClient } from '@supabase/supabase-js'
   *
   * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
   * const { data, error } = await supabase.functions.invoke('hello-world')
   * ```
   *
   * @category Edge Functions
   *
   * @example Standalone import for bundle-sensitive environments
   * ```ts
   * import { FunctionsClient, FunctionRegion } from '@supabase/functions-js'
   *
   * const functions = new FunctionsClient('https://xyzcompany.supabase.co/functions/v1', {
   *   headers: { apikey: 'your-publishable-key' },
   *   region: FunctionRegion.UsEast1,
   * })
   * ```
   */
  constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
    this.url = url;
    this.headers = headers;
    this.region = region;
    this.fetch = resolveFetch(customFetch);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   *
   * @category Edge Functions
   *
   * @example Setting the authorization header
   * ```ts
   * functions.setAuth(session.access_token)
   * ```
   */
  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   * @example
   * ```ts
   * const { data, error } = await functions.invoke('hello-world', {
   *   body: { name: 'Ada' },
   * })
   * ```
   *
   * @category Edge Functions
   *
   * @remarks
   * - The API key is sent in the `apikey` header. The `Authorization` header is reserved
   *   for the signed-in user's JWT (or a custom auth token) — when there is no session, a
   *   new-format API key (`sb_publishable_…` / `sb_secret_…`) is not sent as a Bearer token.
   * - Invoke params generally match the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) spec.
   * - When you pass in a body to your function, we automatically attach the Content-Type header for `Blob`, `ArrayBuffer`, `File`, `FormData` and `String`. If it doesn't match any of these types we assume the payload is `json`, serialize it and attach the `Content-Type` header as `application/json`. You can override this behavior by passing in a `Content-Type` header of your own.
   * - Responses are automatically parsed as `json`, `blob` and `form-data` depending on the `Content-Type` header sent by your function. Responses are parsed as `text` by default.
   *
   * @example Basic invocation
   * ```js
   * const { data, error } = await supabase.functions.invoke('hello', {
   *   body: { foo: 'bar' }
   * })
   * ```
   *
   * @exampleDescription Error handling
   * A `FunctionsHttpError` error is returned if your function throws an error, `FunctionsRelayError` if the Supabase Relay has an error processing your function and `FunctionsFetchError` if there is a network error in calling your function. Log the full error object so fields like `name`, `context`, and any structured body aren't hidden.
   *
   * @example Error handling
   * ```js
   * import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
   *
   * const { data, error } = await supabase.functions.invoke('hello', {
   *   headers: {
   *     "my-custom-header": 'my-custom-header-value'
   *   },
   *   body: { foo: 'bar' }
   * })
   *
   * if (error instanceof FunctionsHttpError) {
   *   const errorMessage = await error.context.json()
   *   console.error('Function returned an error', errorMessage)
   * } else if (error instanceof FunctionsRelayError) {
   *   console.error('Relay error:', error)
   * } else if (error instanceof FunctionsFetchError) {
   *   console.error('Fetch error:', error)
   * }
   * ```
   *
   * @exampleDescription Passing custom headers
   * You can pass custom headers to your function. Note: supabase-js automatically passes the `Authorization` header with the signed in user's JWT.
   *
   * @example Passing custom headers
   * ```js
   * const { data, error } = await supabase.functions.invoke('hello', {
   *   headers: {
   *     "my-custom-header": 'my-custom-header-value'
   *   },
   *   body: { foo: 'bar' }
   * })
   * ```
   *
   * @exampleDescription Calling with DELETE HTTP verb
   * You can also set the HTTP verb to `DELETE` when calling your Edge Function.
   *
   * @example Calling with DELETE HTTP verb
   * ```js
   * const { data, error } = await supabase.functions.invoke('hello', {
   *   headers: {
   *     "my-custom-header": 'my-custom-header-value'
   *   },
   *   body: { foo: 'bar' },
   *   method: 'DELETE'
   * })
   * ```
   *
   * @exampleDescription Invoking a Function in the UsEast1 region
   * Here are the available regions:
   * - `FunctionRegion.Any`
   * - `FunctionRegion.ApNortheast1`
   * - `FunctionRegion.ApNortheast2`
   * - `FunctionRegion.ApSouth1`
   * - `FunctionRegion.ApSoutheast1`
   * - `FunctionRegion.ApSoutheast2`
   * - `FunctionRegion.CaCentral1`
   * - `FunctionRegion.EuCentral1`
   * - `FunctionRegion.EuWest1`
   * - `FunctionRegion.EuWest2`
   * - `FunctionRegion.EuWest3`
   * - `FunctionRegion.SaEast1`
   * - `FunctionRegion.UsEast1`
   * - `FunctionRegion.UsWest1`
   * - `FunctionRegion.UsWest2`
   *
   * @example Invoking a Function in the UsEast1 region
   * ```js
   * import { createClient, FunctionRegion } from '@supabase/supabase-js'
   *
   * const { data, error } = await supabase.functions.invoke('hello', {
   *   body: { foo: 'bar' },
   *   region: FunctionRegion.UsEast1
   * })
   * ```
   *
   * @exampleDescription Calling with GET HTTP verb
   * You can also set the HTTP verb to `GET` when calling your Edge Function.
   *
   * @example Calling with GET HTTP verb
   * ```js
   * const { data, error } = await supabase.functions.invoke('hello', {
   *   headers: {
   *     "my-custom-header": 'my-custom-header-value'
   *   },
   *   method: 'GET'
   * })
   * ```
   *
   * @example Standalone client invoke
   * ```ts
   * const { data, error } = await functions.invoke('hello-world', {
   *   body: { name: 'Ada' },
   * })
   * ```
   */
  invoke(functionName_1) {
    return __awaiter(this, arguments, void 0, function* (functionName, options = {}) {
      var _a, _b;
      let timeoutId;
      let timeoutController;
      let onAbort;
      try {
        const { headers, method, body: functionArgs, signal, timeout } = options;
        let _headers = {};
        let { region } = options;
        if (!region) {
          region = this.region;
        }
        const url = new URL(`${this.url}/${functionName}`);
        if (region && region !== "any") {
          _headers["x-region"] = region;
          url.searchParams.set("forceFunctionRegion", region);
        }
        let body;
        const hasContentTypeHeader = !!headers && Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
        if (functionArgs && !hasContentTypeHeader) {
          if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            _headers["Content-Type"] = functionArgs.type || "application/octet-stream";
            body = functionArgs;
          } else if (typeof functionArgs === "string") {
            _headers["Content-Type"] = "text/plain";
            body = functionArgs;
          } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
            body = functionArgs;
          } else {
            _headers["Content-Type"] = "application/json";
            body = JSON.stringify(functionArgs);
          }
        } else {
          if (functionArgs && typeof functionArgs !== "string" && !(typeof Blob !== "undefined" && functionArgs instanceof Blob) && !(functionArgs instanceof ArrayBuffer) && !(typeof FormData !== "undefined" && functionArgs instanceof FormData)) {
            body = JSON.stringify(functionArgs);
          } else {
            body = functionArgs;
          }
        }
        let effectiveSignal = signal;
        if (timeout) {
          timeoutController = new AbortController();
          timeoutId = setTimeout(() => timeoutController.abort(), timeout);
          if (signal) {
            effectiveSignal = timeoutController.signal;
            onAbort = () => timeoutController.abort();
            signal.addEventListener("abort", onAbort);
          } else {
            effectiveSignal = timeoutController.signal;
          }
        }
        const response = yield this.fetch(url.toString(), {
          method: method || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body,
          signal: effectiveSignal
        }).catch((fetchError) => {
          throw new FunctionsFetchError(fetchError);
        });
        const isRelayError = response.headers.get("x-relay-error");
        if (isRelayError && isRelayError === "true") {
          throw new FunctionsRelayError(response);
        }
        if (!response.ok) {
          throw new FunctionsHttpError(response);
        }
        let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim().toLowerCase();
        let data;
        if (responseType === "application/json") {
          data = yield response.json();
        } else if (responseType === "application/octet-stream" || responseType === "application/pdf") {
          data = yield response.blob();
        } else if (responseType === "text/event-stream") {
          data = response;
        } else if (responseType === "multipart/form-data") {
          data = yield response.formData();
        } else {
          data = yield response.text();
        }
        return { data, error: null, response };
      } catch (error) {
        return {
          data: null,
          error,
          response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
        };
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (onAbort) {
          (_b = options.signal) === null || _b === void 0 ? void 0 : _b.removeEventListener("abort", onAbort);
        }
      }
    });
  }
};

// node_modules/@supabase/postgrest-js/dist/index.mjs
var PostgrestError = class extends Error {
  /**
  * @example
  * ```ts
  * import PostgrestError from '@supabase/postgrest-js'
  *
  * throw new PostgrestError({
  *   message: 'Row level security prevented the request',
  *   details: 'RLS denied the insert',
  *   hint: 'Check your policies',
  *   code: 'PGRST301',
  * })
  * ```
  */
  constructor(context) {
    super(context.message);
    this.name = "PostgrestError";
    this.details = context.details;
    this.hint = context.hint;
    this.code = context.code;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
      hint: this.hint,
      code: this.code
    };
  }
};
var DEFAULT_MAX_RETRIES = 3;
var getRetryDelay = (attemptIndex) => Math.min(1e3 * 2 ** attemptIndex, 3e4);
var RETRYABLE_STATUS_CODES = [520, 503];
var RETRYABLE_METHODS = [
  "GET",
  "HEAD",
  "OPTIONS"
];
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
    return typeof o$1;
  } : function(o$1) {
    return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
  }, _typeof(o);
}
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r$1) {
      return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r$1) {
      _defineProperty(e, r$1, t[r$1]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
      Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
    });
  }
  return e;
}
function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
      resolve();
      return;
    }
    const id = setTimeout(() => {
      signal === null || signal === void 0 || signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(id);
      resolve();
    }
    signal === null || signal === void 0 || signal.addEventListener("abort", onAbort);
  });
}
function shouldRetry(method, status, attemptCount, retryEnabled) {
  if (!retryEnabled || attemptCount >= DEFAULT_MAX_RETRIES) return false;
  if (!RETRYABLE_METHODS.includes(method)) return false;
  if (!RETRYABLE_STATUS_CODES.includes(status)) return false;
  return true;
}
async function fetchWithRetry(fetchImpl, url, request, retryEnabled) {
  let attemptCount = 0;
  while (true) {
    const headers = _objectSpread2({}, request.headers);
    if (attemptCount > 0) headers["X-Retry-Count"] = String(attemptCount);
    let res;
    try {
      res = await fetchImpl(url, {
        method: request.method,
        headers,
        body: request.body,
        signal: request.signal
      });
    } catch (fetchError) {
      var _request$signal;
      if ((fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) === "AbortError" || (fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) === "ABORT_ERR" || (fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) === "TimeoutError" && ((_request$signal = request.signal) === null || _request$signal === void 0 ? void 0 : _request$signal.aborted)) throw fetchError;
      if (!RETRYABLE_METHODS.includes(request.method)) throw fetchError;
      if (retryEnabled && attemptCount < DEFAULT_MAX_RETRIES) {
        const delay = getRetryDelay(attemptCount);
        attemptCount++;
        await sleep(delay, request.signal);
        continue;
      }
      throw fetchError;
    }
    if (shouldRetry(request.method, res.status, attemptCount, retryEnabled)) {
      var _res$headers$get, _res$headers;
      const retryAfterHeader = (_res$headers$get = (_res$headers = res.headers) === null || _res$headers === void 0 ? void 0 : _res$headers.get("Retry-After")) !== null && _res$headers$get !== void 0 ? _res$headers$get : null;
      const delay = retryAfterHeader !== null ? Math.max(0, parseInt(retryAfterHeader, 10) || 0) * 1e3 : getRetryDelay(attemptCount);
      await res.text();
      attemptCount++;
      await sleep(delay, request.signal);
      continue;
    }
    return res;
  }
}
var PostgrestBuilder = class {
  /**
  * Creates a builder configured for a specific PostgREST request.
  *
  * @example Using supabase-js (recommended)
  * ```ts
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * const { data, error } = await supabase.from('users').select('*')
  * ```
  *
  * @category Database
  *
  * @example Standalone import for bundle-sensitive environments
  * ```ts
  * import { PostgrestQueryBuilder } from '@supabase/postgrest-js'
  *
  * const builder = new PostgrestQueryBuilder(
  *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
  *   { headers: new Headers({ apikey: 'your-publishable-key' }) }
  * )
  * ```
  */
  constructor(builder) {
    var _builder$shouldThrowO, _builder$isMaybeSingl, _builder$shouldStripN, _builder$urlLengthLim, _builder$retry;
    this.shouldThrowOnError = false;
    this.retryEnabled = true;
    this.method = builder.method;
    this.url = builder.url;
    this.headers = new Headers(builder.headers);
    this.schema = builder.schema;
    this.body = builder.body;
    this.shouldThrowOnError = (_builder$shouldThrowO = builder.shouldThrowOnError) !== null && _builder$shouldThrowO !== void 0 ? _builder$shouldThrowO : false;
    this.signal = builder.signal;
    this.isMaybeSingle = (_builder$isMaybeSingl = builder.isMaybeSingle) !== null && _builder$isMaybeSingl !== void 0 ? _builder$isMaybeSingl : false;
    this.shouldStripNulls = (_builder$shouldStripN = builder.shouldStripNulls) !== null && _builder$shouldStripN !== void 0 ? _builder$shouldStripN : false;
    this.urlLengthLimit = (_builder$urlLengthLim = builder.urlLengthLimit) !== null && _builder$urlLengthLim !== void 0 ? _builder$urlLengthLim : 8e3;
    this.retryEnabled = (_builder$retry = builder.retry) !== null && _builder$retry !== void 0 ? _builder$retry : true;
    if (builder.fetch) this.fetch = builder.fetch;
    else this.fetch = fetch;
  }
  /**
  * If there's an error with the query, throwOnError will reject the promise by
  * throwing the error instead of returning it as part of a successful response.
  *
  * {@link https://github.com/supabase/supabase-js/issues/92}
  *
  * @category Database
  * @subcategory Using modifiers
  */
  throwOnError() {
    this.shouldThrowOnError = true;
    return this;
  }
  /**
  * Strip null values from the response data. Properties with `null` values
  * will be omitted from the returned JSON objects.
  *
  * Requires PostgREST 11.2.0+.
  *
  * {@link https://docs.postgrest.org/en/stable/references/api/resource_representation.html#stripped-nulls}
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .stripNulls()
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text, bio text);
  *
  * insert into
  *   characters (id, name, bio)
  * values
  *   (1, 'Luke', null),
  *   (2, 'Leia', 'Princess of Alderaan');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Luke"
  *     },
  *     {
  *       "id": 2,
  *       "name": "Leia",
  *       "bio": "Princess of Alderaan"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  stripNulls() {
    if (this.headers.get("Accept") === "text/csv") throw new Error("stripNulls() cannot be used with csv()");
    this.shouldStripNulls = true;
    return this;
  }
  /**
  * Set an HTTP header on this single PostgREST request, overriding any header
  * with the same name set on the client.
  *
  * This is an advanced escape hatch for one-off needs (passing a custom
  * `Authorization` for a single query, attaching a tracing header, etc.).
  * Most callers do not need it: configure client-wide headers via the
  * `headers` option when constructing the client, and authentication via
  * Supabase Auth.
  *
  * @param name - HTTP header name
  * @param value - HTTP header value
  *
  * @category Database
  * @subcategory Using modifiers
  */
  setHeader(name, value) {
    this.headers = new Headers(this.headers);
    this.headers.set(name, value);
    return this;
  }
  /**
  * @category Database
  * @subcategory Using modifiers
  *
  * Configure retry behavior for this request.
  *
  * By default, retries are enabled for idempotent requests (GET, HEAD, OPTIONS)
  * that fail with network errors or specific HTTP status codes (503, 520).
  * Retries use exponential backoff (1s, 2s, 4s) with a maximum of 3 attempts.
  *
  * @param enabled - Whether to enable retries for this request
  *
  * @example
  * ```ts
  * // Disable retries for a specific query
  * const { data, error } = await supabase
  *   .from('users')
  *   .select()
  *   .retry(false)
  * ```
  */
  retry(enabled) {
    this.retryEnabled = enabled;
    return this;
  }
  then(onfulfilled, onrejected) {
    var _this = this;
    if (this.schema === void 0) {
    } else if (["GET", "HEAD"].includes(this.method)) this.headers.set("Accept-Profile", this.schema);
    else this.headers.set("Content-Profile", this.schema);
    if (this.method !== "GET" && this.method !== "HEAD") this.headers.set("Content-Type", "application/json");
    if (this.shouldStripNulls) {
      const currentAccept = this.headers.get("Accept");
      if (currentAccept === "application/vnd.pgrst.object+json") this.headers.set("Accept", "application/vnd.pgrst.object+json;nulls=stripped");
      else if (!currentAccept || currentAccept === "application/json") this.headers.set("Accept", "application/vnd.pgrst.array+json;nulls=stripped");
    }
    const _fetch = this.fetch;
    const executeWithRetry = async () => {
      const headers = {};
      _this.headers.forEach((value, key) => {
        headers[key] = value;
      });
      const res$1 = await fetchWithRetry(_fetch, _this.url.toString(), {
        method: _this.method,
        headers,
        body: JSON.stringify(_this.body, (_, value) => typeof value === "bigint" ? value.toString() : value),
        signal: _this.signal
      }, _this.retryEnabled);
      return await _this.processResponse(res$1);
    };
    let res = executeWithRetry();
    if (!this.shouldThrowOnError) res = res.catch((fetchError) => {
      var _fetchError$name2;
      let errorDetails = "";
      let hint = "";
      let code = "";
      const cause = fetchError === null || fetchError === void 0 ? void 0 : fetchError.cause;
      if (cause) {
        var _cause$message, _cause$code, _fetchError$name, _cause$name;
        const causeMessage = (_cause$message = cause === null || cause === void 0 ? void 0 : cause.message) !== null && _cause$message !== void 0 ? _cause$message : "";
        const causeCode = (_cause$code = cause === null || cause === void 0 ? void 0 : cause.code) !== null && _cause$code !== void 0 ? _cause$code : "";
        errorDetails = `${(_fetchError$name = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _fetchError$name !== void 0 ? _fetchError$name : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`;
        errorDetails += `

Caused by: ${(_cause$name = cause === null || cause === void 0 ? void 0 : cause.name) !== null && _cause$name !== void 0 ? _cause$name : "Error"}: ${causeMessage}`;
        if (causeCode) errorDetails += ` (${causeCode})`;
        if (cause === null || cause === void 0 ? void 0 : cause.stack) errorDetails += `
${cause.stack}`;
      } else {
        var _fetchError$stack;
        errorDetails = (_fetchError$stack = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _fetchError$stack !== void 0 ? _fetchError$stack : "";
      }
      const urlLength = this.url.toString().length;
      if ((fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) === "AbortError" || (fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) === "ABORT_ERR") {
        code = "";
        hint = "Request was aborted (timeout or manual cancellation)";
        if (urlLength > this.urlLengthLimit) hint += `. Note: Your request URL is ${urlLength} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`;
      } else if ((cause === null || cause === void 0 ? void 0 : cause.name) === "HeadersOverflowError" || (cause === null || cause === void 0 ? void 0 : cause.code) === "UND_ERR_HEADERS_OVERFLOW") {
        code = "";
        hint = "HTTP headers exceeded server limits (typically 16KB)";
        if (urlLength > this.urlLengthLimit) hint += `. Your request URL is ${urlLength} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`;
      }
      return {
        success: false,
        error: {
          message: `${(_fetchError$name2 = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _fetchError$name2 !== void 0 ? _fetchError$name2 : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
          details: errorDetails,
          hint,
          code
        },
        data: null,
        count: null,
        status: 0,
        statusText: ""
      };
    });
    return res.then(onfulfilled, onrejected);
  }
  /**
  * Process a fetch response and return the standardized postgrest response.
  */
  async processResponse(res) {
    var _this2 = this;
    let error = null;
    let data = null;
    let count = null;
    let status = res.status;
    let statusText = res.statusText;
    if (res.ok) {
      var _this$headers$get2, _res$headers$get;
      if (_this2.method !== "HEAD") {
        var _this$headers$get;
        const body = await res.text();
        if (body === "") {
        } else if (_this2.headers.get("Accept") === "text/csv") data = body;
        else if (_this2.headers.get("Accept") && ((_this$headers$get = _this2.headers.get("Accept")) === null || _this$headers$get === void 0 ? void 0 : _this$headers$get.includes("application/vnd.pgrst.plan+text"))) data = body;
        else try {
          data = JSON.parse(body);
        } catch (_unused) {
          error = { message: body };
          data = null;
          if (_this2.shouldThrowOnError) throw new PostgrestError({
            message: body,
            details: "",
            hint: "",
            code: ""
          });
        }
      }
      const countHeader = (_this$headers$get2 = _this2.headers.get("Prefer")) === null || _this$headers$get2 === void 0 ? void 0 : _this$headers$get2.match(/count=(exact|planned|estimated)/);
      const contentRange = (_res$headers$get = res.headers.get("content-range")) === null || _res$headers$get === void 0 ? void 0 : _res$headers$get.split("/");
      if (countHeader && contentRange && contentRange.length > 1) count = parseInt(contentRange[1]);
      if (_this2.isMaybeSingle && Array.isArray(data)) if (data.length > 1) {
        error = {
          code: "PGRST116",
          details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
          hint: null,
          message: "JSON object requested, multiple (or no) rows returned"
        };
        data = null;
        count = null;
        status = 406;
        statusText = "Not Acceptable";
        if (_this2.shouldThrowOnError) {
          var _error$hint;
          throw new PostgrestError(_objectSpread2(_objectSpread2({}, error), {}, { hint: (_error$hint = error.hint) !== null && _error$hint !== void 0 ? _error$hint : "" }));
        }
      } else if (data.length === 1) data = data[0];
      else data = null;
    } else {
      const body = await res.text();
      try {
        error = JSON.parse(body);
        if (Array.isArray(error) && res.status === 404) {
          data = [];
          error = null;
          status = 200;
          statusText = "OK";
        }
      } catch (_unused2) {
        if (res.status === 404 && body === "") {
          status = 204;
          statusText = "No Content";
        } else error = { message: body };
      }
      if (error && _this2.shouldThrowOnError) throw new PostgrestError(error);
    }
    return {
      success: error === null,
      error,
      data,
      count,
      status,
      statusText
    };
  }
  /**
  * Override the type of the returned `data`.
  *
  * @typeParam NewResult - The new result type to override with
  * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
  *
  * @category Database
  * @subcategory Using modifiers
  */
  returns() {
    return this;
  }
  /**
  * Override the type of the returned `data` field in the response.
  *
  * @typeParam NewResult - The new type to cast the response data to
  * @typeParam Options - Optional type configuration (defaults to { merge: true })
  * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
  * @example
  * ```typescript
  * // Merge with existing types (default behavior)
  * const query = supabase
  *   .from('users')
  *   .select()
  *   .overrideTypes<{ custom_field: string }>()
  *
  * // Replace existing types completely
  * const replaceQuery = supabase
  *   .from('users')
  *   .select()
  *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
  * ```
  * @returns A PostgrestBuilder instance with the new type
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example Complete Override type of successful response
  * ```ts
  * const { data } = await supabase
  *   .from('countries')
  *   .select()
  *   .overrideTypes<Array<MyType>, { merge: false }>()
  * ```
  *
  * @exampleResponse Complete Override type of successful response
  * ```ts
  * let x: typeof data // MyType[]
  * ```
  *
  * @example Complete Override type of object response
  * ```ts
  * const { data } = await supabase
  *   .from('countries')
  *   .select()
  *   .maybeSingle()
  *   .overrideTypes<MyType, { merge: false }>()
  * ```
  *
  * @exampleResponse Complete Override type of object response
  * ```ts
  * let x: typeof data // MyType | null
  * ```
  *
  * @example Partial Override type of successful response
  * ```ts
  * const { data } = await supabase
  *   .from('countries')
  *   .select()
  *   .overrideTypes<Array<{ status: "A" | "B" }>>()
  * ```
  *
  * @exampleResponse Partial Override type of successful response
  * ```ts
  * let x: typeof data // Array<CountryRowProperties & { status: "A" | "B" }>
  * ```
  *
  * @example Partial Override type of object response
  * ```ts
  * const { data } = await supabase
  *   .from('countries')
  *   .select()
  *   .maybeSingle()
  *   .overrideTypes<{ status: "A" | "B" }>()
  * ```
  *
  * @exampleResponse Partial Override type of object response
  * ```ts
  * let x: typeof data // CountryRowProperties & { status: "A" | "B" } | null
  * ```
  *
  * @example Merge vs replace existing types
  * ```typescript
  * // Merge with existing types (default behavior)
  * const query = supabase
  *   .from('users')
  *   .select()
  *   .overrideTypes<{ custom_field: string }>()
  *
  * // Replace existing types completely
  * const replaceQuery = supabase
  *   .from('users')
  *   .select()
  *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
  * ```
  */
  overrideTypes() {
    return this;
  }
};
var PostgrestTransformBuilder = class extends PostgrestBuilder {
  throwOnError() {
    return super.throwOnError();
  }
  /**
  * Perform a SELECT on the query result.
  *
  * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
  * return modified rows. By calling this method, modified rows are returned in
  * `data`.
  *
  * @param columns - The columns to retrieve, separated by commas
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `upsert()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .upsert({ id: 1, name: 'Han Solo' })
  *   .select()
  * ```
  *
  * @exampleSql With `upsert()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Han');
  * ```
  *
  * @exampleResponse With `upsert()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Han Solo"
  *     }
  *   ],
  *   "status": 201,
  *   "statusText": ""
  * }
  * ```
  */
  select(columns) {
    let quoted = false;
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
      if (/\s/.test(c) && !quoted) return "";
      if (c === '"') quoted = !quoted;
      return c;
    }).join("");
    this.url.searchParams.set("select", cleanedColumns);
    this.headers.append("Prefer", "return=representation");
    return this;
  }
  /**
  * Order the query result by `column`.
  *
  * You can call this method multiple times to order by multiple columns.
  *
  * You can order referenced tables, but it only affects the ordering of the
  * parent table if you use `!inner` in the query.
  *
  * @param column - The column to order by
  * @param options - Named parameters
  * @param options.ascending - If `true`, the result will be in ascending order
  * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
  * `null`s appear last.
  * @param options.referencedTable - Set this to order a referenced table by
  * its columns
  * @param options.foreignTable - Deprecated, use `options.referencedTable`
  * instead
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('id, name')
  *   .order('id', { ascending: false })
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 3,
  *       "name": "Han"
  *     },
  *     {
  *       "id": 2,
  *       "name": "Leia"
  *     },
  *     {
  *       "id": 1,
  *       "name": "Luke"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription On a referenced table
  * Ordering with `referencedTable` doesn't affect the ordering of the
  * parent table.
  *
  * @example On a referenced table
  * ```ts
  *   const { data, error } = await supabase
  *     .from('orchestral_sections')
  *     .select(`
  *       name,
  *       instruments (
  *         name
  *       )
  *     `)
  *     .order('name', { referencedTable: 'instruments', ascending: false })
  *
  * ```
  *
  * @exampleSql On a referenced table
  * ```sql
  * create table
  *   orchestral_sections (id int8 primary key, name text);
  * create table
  *   instruments (
  *     id int8 primary key,
  *     section_id int8 not null references orchestral_sections,
  *     name text
  *   );
  *
  * insert into
  *   orchestral_sections (id, name)
  * values
  *   (1, 'strings'),
  *   (2, 'woodwinds');
  * insert into
  *   instruments (id, section_id, name)
  * values
  *   (1, 1, 'harp'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse On a referenced table
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "strings",
  *       "instruments": [
  *         {
  *           "name": "violin"
  *         },
  *         {
  *           "name": "harp"
  *         }
  *       ]
  *     },
  *     {
  *       "name": "woodwinds",
  *       "instruments": []
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Order parent table by a referenced table
  * Ordering with `referenced_table(col)` affects the ordering of the
  * parent table.
  *
  * @example Order parent table by a referenced table
  * ```ts
  *   const { data, error } = await supabase
  *     .from('instruments')
  *     .select(`
  *       name,
  *       section:orchestral_sections (
  *         name
  *       )
  *     `)
  *     .order('section(name)', { ascending: true })
  *
  * ```
  *
  * @exampleSql Order parent table by a referenced table
  * ```sql
  * create table
  *   orchestral_sections (id int8 primary key, name text);
  * create table
  *   instruments (
  *     id int8 primary key,
  *     section_id int8 not null references orchestral_sections,
  *     name text
  *   );
  *
  * insert into
  *   orchestral_sections (id, name)
  * values
  *   (1, 'strings'),
  *   (2, 'woodwinds');
  * insert into
  *   instruments (id, section_id, name)
  * values
  *   (1, 2, 'flute'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse Order parent table by a referenced table
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "violin",
  *       "orchestral_sections": {"name": "strings"}
  *     },
  *     {
  *       "name": "flute",
  *       "orchestral_sections": {"name": "woodwinds"}
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
    const key = referencedTable ? `${referencedTable}.order` : "order";
    const existingOrder = this.url.searchParams.get(key);
    this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
    return this;
  }
  /**
  * Limit the query result by `rows`.
  *
  * @param rows - The maximum number of rows to return
  * @param options - Named parameters
  * @param options.referencedTable - Set this to limit rows of referenced
  * tables instead of the parent table
  * @param options.foreignTable - Deprecated, use `options.referencedTable`
  * instead
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('name')
  *   .limit(1)
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "Luke"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @example On a referenced table
  * ```ts
  * const { data, error } = await supabase
  *   .from('orchestral_sections')
  *   .select(`
  *     name,
  *     instruments (
  *       name
  *     )
  *   `)
  *   .limit(1, { referencedTable: 'instruments' })
  * ```
  *
  * @exampleSql On a referenced table
  * ```sql
  * create table
  *   orchestral_sections (id int8 primary key, name text);
  * create table
  *   instruments (
  *     id int8 primary key,
  *     section_id int8 not null references orchestral_sections,
  *     name text
  *   );
  *
  * insert into
  *   orchestral_sections (id, name)
  * values
  *   (1, 'strings');
  * insert into
  *   instruments (id, section_id, name)
  * values
  *   (1, 1, 'harp'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse On a referenced table
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "strings",
  *       "instruments": [
  *         {
  *           "name": "violin"
  *         }
  *       ]
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  limit(rows, { foreignTable, referencedTable = foreignTable } = {}) {
    const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
    this.url.searchParams.set(key, `${rows}`);
    return this;
  }
  /**
  * Limit the query result by starting at an offset `from` and ending at the offset `to`.
  * Only records within this range are returned.
  * This respects the query order and if there is no order clause the range could behave unexpectedly.
  * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
  * and fourth rows of the query.
  *
  * @param from - The starting index from which to limit the result
  * @param to - The last index to which to limit the result
  * @param options - Named parameters
  * @param options.referencedTable - Set this to limit rows of referenced
  * tables instead of the parent table
  * @param options.foreignTable - Deprecated, use `options.referencedTable`
  * instead
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('name')
  *   .range(0, 1)
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "Luke"
  *     },
  *     {
  *       "name": "Leia"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
    const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
    const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
    this.url.searchParams.set(keyOffset, `${from}`);
    this.url.searchParams.set(keyLimit, `${to - from + 1}`);
    return this;
  }
  /**
  * Set the AbortSignal for the fetch request.
  *
  * @param signal - The AbortSignal to use for the fetch request
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @remarks
  * You can use this to set a timeout for the request.
  *
  * @exampleDescription Aborting requests in-flight
  * You can use an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to abort requests.
  * Note that `status` and `statusText` don't mean anything for aborted requests as the request wasn't fulfilled.
  *
  * @example Aborting requests in-flight
  * ```ts
  * const ac = new AbortController()
  *
  * const { data, error } = await supabase
  *   .from('very_big_table')
  *   .select()
  *   .abortSignal(ac.signal)
  *
  * // Abort the request after 100 ms
  * setTimeout(() => ac.abort(), 100)
  * ```
  *
  * @exampleResponse Aborting requests in-flight
  * ```json
  *   {
  *     "error": {
  *       "message": "AbortError: The user aborted a request.",
  *       "details": "",
  *       "hint": "The request was aborted locally via the provided AbortSignal.",
  *       "code": ""
  *     },
  *     "status": 0,
  *     "statusText": ""
  *   }
  *
  * ```
  *
  * @example Set a timeout
  * ```ts
  * const { data, error } = await supabase
  *   .from('very_big_table')
  *   .select()
  *   .abortSignal(AbortSignal.timeout(1000 /* ms *\/))
  * ```
  *
  * @exampleResponse Set a timeout
  * ```json
  *   {
  *     "error": {
  *       "message": "FetchError: The user aborted a request.",
  *       "details": "",
  *       "hint": "",
  *       "code": ""
  *     },
  *     "status": 0,
  *     "statusText": ""
  *   }
  *
  * ```
  */
  abortSignal(signal) {
    this.signal = signal;
    return this;
  }
  /**
  * Return `data` as a single object instead of an array of objects.
  *
  * Query result must be one row (e.g. using `.limit(1)`), otherwise this
  * returns an error.
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('name')
  *   .limit(1)
  *   .single()
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": {
  *     "name": "Luke"
  *   },
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  single() {
    this.headers.set("Accept", "application/vnd.pgrst.object+json");
    return this;
  }
  /**
  * Return `data` as a single object instead of an array of objects.
  *
  * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
  * this returns an error.
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .eq('name', 'Katniss')
  *   .maybeSingle()
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }
  /**
  * Return `data` as a string in CSV format.
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @exampleDescription Return data as CSV
  * By default, the data is returned in JSON format, but can also be returned as Comma Separated Values.
  *
  * @example Return data as CSV
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .csv()
  * ```
  *
  * @exampleSql Return data as CSV
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse Return data as CSV
  * ```json
  * {
  *   "data": "id,name\n1,Luke\n2,Leia\n3,Han",
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  csv() {
    this.headers.set("Accept", "text/csv");
    return this;
  }
  /**
  * Return `data` as an object in [GeoJSON](https://geojson.org) format.
  *
  * @category Database
  * @subcategory Using modifiers
  */
  geojson() {
    this.headers.set("Accept", "application/geo+json");
    return this;
  }
  /**
  * Return `data` as the EXPLAIN plan for the query.
  *
  * You need to enable the
  * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
  * setting before using this method.
  *
  * @param options - Named parameters
  *
  * @param options.analyze - If `true`, the query will be executed and the
  * actual run time will be returned
  *
  * @param options.verbose - If `true`, the query identifier will be returned
  * and `data` will include the output columns of the query
  *
  * @param options.settings - If `true`, include information on configuration
  * parameters that affect query planning
  *
  * @param options.buffers - If `true`, include information on buffer usage
  *
  * @param options.wal - If `true`, include information on WAL record generation
  *
  * @param options.format - The format of the output, can be `"text"` (default)
  * or `"json"`
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @exampleDescription Get the execution plan
  * By default, the data is returned in TEXT format, but can also be returned as JSON by using the `format` parameter.
  *
  * @example Get the execution plan
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .explain()
  * ```
  *
  * @exampleSql Get the execution plan
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse Get the execution plan
  * ```js
  * Aggregate  (cost=33.34..33.36 rows=1 width=112)
  *   ->  Limit  (cost=0.00..18.33 rows=1000 width=40)
  *         ->  Seq Scan on characters  (cost=0.00..22.00 rows=1200 width=40)
  * ```
  *
  * @exampleDescription Get the execution plan with analyze and verbose
  * By default, the data is returned in TEXT format, but can also be returned as JSON by using the `format` parameter.
  *
  * @example Get the execution plan with analyze and verbose
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .explain({analyze:true,verbose:true})
  * ```
  *
  * @exampleSql Get the execution plan with analyze and verbose
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse Get the execution plan with analyze and verbose
  * ```js
  * Aggregate  (cost=33.34..33.36 rows=1 width=112) (actual time=0.041..0.041 rows=1 loops=1)
  *   Output: NULL::bigint, count(ROW(characters.id, characters.name)), COALESCE(json_agg(ROW(characters.id, characters.name)), '[]'::json), NULLIF(current_setting('response.headers'::text, true), ''::text), NULLIF(current_setting('response.status'::text, true), ''::text)
  *   ->  Limit  (cost=0.00..18.33 rows=1000 width=40) (actual time=0.005..0.006 rows=3 loops=1)
  *         Output: characters.id, characters.name
  *         ->  Seq Scan on public.characters  (cost=0.00..22.00 rows=1200 width=40) (actual time=0.004..0.005 rows=3 loops=1)
  *               Output: characters.id, characters.name
  * Query Identifier: -4730654291623321173
  * Planning Time: 0.407 ms
  * Execution Time: 0.119 ms
  * ```
  */
  explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
    var _this$headers$get;
    const options = [
      analyze ? "analyze" : null,
      verbose ? "verbose" : null,
      settings ? "settings" : null,
      buffers ? "buffers" : null,
      wal ? "wal" : null
    ].filter(Boolean).join("|");
    const forMediatype = (_this$headers$get = this.headers.get("Accept")) !== null && _this$headers$get !== void 0 ? _this$headers$get : "application/json";
    this.headers.set("Accept", `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`);
    if (format === "json") return this;
    else return this;
  }
  /**
  * Dry-run this request: execute the query but discard the changes.
  *
  * Server-side, PostgREST runs the query inside a transaction and rolls it back
  * instead of committing. The response still contains the data that *would* have
  * been returned — `RETURNING` clauses execute and RLS, triggers, and constraints
  * are all evaluated — but no row is actually inserted, updated, or deleted.
  *
  * This affects only the single request it is chained to. The JS caller has no
  * handle on the transaction: supabase-js does not group multiple queries into
  * one transaction. For multi-statement transactional logic, use a database
  * function (`supabase.rpc(...)`).
  *
  * Sets the `Prefer: tx=rollback` header. See PostgREST's docs on transaction
  * preferences for the underlying mechanism.
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @example Validate an insert without persisting
  * ```ts
  * const { data, error } = await supabase
  *   .from('countries')
  *   .insert({ name: 'France' })
  *   .select()
  *   .rollback()
  * // `data` shows what would have been inserted; nothing is saved.
  * ```
  */
  rollback() {
    this.headers.append("Prefer", "tx=rollback");
    return this;
  }
  /**
  * Override the type of the returned `data`.
  *
  * @typeParam NewResult - The new result type to override with
  * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
  *
  * @category Database
  * @subcategory Using modifiers
  *
  * @remarks
  * - Deprecated: use overrideTypes method instead
  *
  * @example Override type of successful response
  * ```ts
  * const { data } = await supabase
  *   .from('countries')
  *   .select()
  *   .returns<Array<MyType>>()
  * ```
  *
  * @exampleResponse Override type of successful response
  * ```js
  * let x: typeof data // MyType[]
  * ```
  *
  * @example Override type of object response
  * ```ts
  * const { data } = await supabase
  *   .from('countries')
  *   .select()
  *   .maybeSingle()
  *   .returns<MyType>()
  * ```
  *
  * @exampleResponse Override type of object response
  * ```js
  * let x: typeof data // MyType | null
  * ```
  */
  returns() {
    return this;
  }
  /**
  * Set the maximum number of rows that can be affected by the query.
  * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
  *
  * @param rows - The maximum number of rows that can be affected
  *
  * @category Database
  * @subcategory Using modifiers
  */
  maxAffected(rows) {
    this.headers.append("Prefer", "handling=strict");
    this.headers.append("Prefer", `max-affected=${rows}`);
    return this;
  }
};
var PostgrestReservedCharsRegexp = /* @__PURE__ */ new RegExp("[,()]");
var PostgrestFilterBuilder = class extends PostgrestTransformBuilder {
  throwOnError() {
    return super.throwOnError();
  }
  /**
  * Match only rows where `column` is equal to `value`.
  *
  * To check if the value of `column` is NULL, you should use `.is()` instead.
  *
  * @param column - The column to filter on
  * @param value - The value to filter with
  *
  * @category Database
  * @subcategory Using filters
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .eq('name', 'Leia')
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 2,
  *       "name": "Leia"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  eq(column, value) {
    this.url.searchParams.append(column, `eq.${value}`);
    return this;
  }
  /**
  * Match only rows where `column` is not equal to `value`.
  *
  * This filter does not include rows where `column` is `NULL`. To match null
  * values, use `.is(column, null)` instead.
  *
  * @param column - The column to filter on
  * @param value - The value to filter with
  *
  * @category Database
  * @subcategory Using filters
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .neq('name', 'Leia')
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Luke"
  *     },
  *     {
  *       "id": 3,
  *       "name": "Han"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  neq(column, value) {
    this.url.searchParams.append(column, `neq.${value}`);
    return this;
  }
  gt(column, value) {
    this.url.searchParams.append(column, `gt.${value}`);
    return this;
  }
  gte(column, value) {
    this.url.searchParams.append(column, `gte.${value}`);
    return this;
  }
  lt(column, value) {
    this.url.searchParams.append(column, `lt.${value}`);
    return this;
  }
  lte(column, value) {
    this.url.searchParams.append(column, `lte.${value}`);
    return this;
  }
  like(column, pattern) {
    this.url.searchParams.append(column, `like.${pattern}`);
    return this;
  }
  likeAllOf(column, patterns) {
    this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
    return this;
  }
  likeAnyOf(column, patterns) {
    this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
    return this;
  }
  ilike(column, pattern) {
    this.url.searchParams.append(column, `ilike.${pattern}`);
    return this;
  }
  ilikeAllOf(column, patterns) {
    this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
    return this;
  }
  ilikeAnyOf(column, patterns) {
    this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
    return this;
  }
  regexMatch(column, pattern) {
    this.url.searchParams.append(column, `match.${pattern}`);
    return this;
  }
  regexIMatch(column, pattern) {
    this.url.searchParams.append(column, `imatch.${pattern}`);
    return this;
  }
  is(column, value) {
    this.url.searchParams.append(column, `is.${value}`);
    return this;
  }
  /**
  * Match only rows where `column` IS DISTINCT FROM `value`.
  *
  * Unlike `.neq()`, this treats `NULL` as a comparable value. Two `NULL` values
  * are considered equal (not distinct), and comparing `NULL` with any non-NULL
  * value returns true (distinct).
  *
  * @param column - The column to filter on
  * @param value - The value to filter with
  */
  isDistinct(column, value) {
    this.url.searchParams.append(column, `isdistinct.${value}`);
    return this;
  }
  /**
  * Match only rows where `column` is included in the `values` array.
  *
  * @param column - The column to filter on
  * @param values - The values array to filter with
  *
  * @category Database
  * @subcategory Using filters
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  *   .in('name', ['Leia', 'Han'])
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 2,
  *       "name": "Leia"
  *     },
  *     {
  *       "id": 3,
  *       "name": "Han"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  in(column, values) {
    const cleanedValues = Array.from(new Set(values)).map((s) => {
      if (typeof s === "string" && PostgrestReservedCharsRegexp.test(s)) return `"${s}"`;
      else return `${s}`;
    }).join(",");
    this.url.searchParams.append(column, `in.(${cleanedValues})`);
    return this;
  }
  /**
  * Match only rows where `column` is NOT included in the `values` array.
  *
  * @param column - The column to filter on
  * @param values - The values array to filter with
  */
  notIn(column, values) {
    const cleanedValues = Array.from(new Set(values)).map((s) => {
      if (typeof s === "string" && PostgrestReservedCharsRegexp.test(s)) return `"${s}"`;
      else return `${s}`;
    }).join(",");
    this.url.searchParams.append(column, `not.in.(${cleanedValues})`);
    return this;
  }
  contains(column, value) {
    if (typeof value === "string") this.url.searchParams.append(column, `cs.${value}`);
    else if (Array.isArray(value)) this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
    else this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
    return this;
  }
  containedBy(column, value) {
    if (typeof value === "string") this.url.searchParams.append(column, `cd.${value}`);
    else if (Array.isArray(value)) this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
    else this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
    return this;
  }
  rangeGt(column, range) {
    this.url.searchParams.append(column, `sr.${range}`);
    return this;
  }
  rangeGte(column, range) {
    this.url.searchParams.append(column, `nxl.${range}`);
    return this;
  }
  rangeLt(column, range) {
    this.url.searchParams.append(column, `sl.${range}`);
    return this;
  }
  rangeLte(column, range) {
    this.url.searchParams.append(column, `nxr.${range}`);
    return this;
  }
  rangeAdjacent(column, range) {
    this.url.searchParams.append(column, `adj.${range}`);
    return this;
  }
  overlaps(column, value) {
    if (typeof value === "string") this.url.searchParams.append(column, `ov.${value}`);
    else this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
    return this;
  }
  textSearch(column, query2, { config, type } = {}) {
    let typePart = "";
    if (type === "plain") typePart = "pl";
    else if (type === "phrase") typePart = "ph";
    else if (type === "websearch") typePart = "w";
    const configPart = config === void 0 ? "" : `(${config})`;
    this.url.searchParams.append(column, `${typePart}fts${configPart}.${query2}`);
    return this;
  }
  match(query2) {
    Object.entries(query2).filter(([_, value]) => value !== void 0).forEach(([column, value]) => {
      this.url.searchParams.append(column, `eq.${value}`);
    });
    return this;
  }
  /**
  * Match only rows which doesn't satisfy the filter.
  *
  * Unlike most filters, `opearator` and `value` are used as-is and need to
  * follow [PostgREST
  * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
  * to make sure they are properly sanitized.
  *
  * @param column - The column to filter on
  * @param operator - The operator to be negated to filter with, following
  * PostgREST syntax
  * @param value - The value to filter with, following PostgREST syntax
  *
  * @category Database
  * @subcategory Using filters
  *
  * @remarks
  * not() expects you to use the raw PostgREST syntax for the filter values.
  *
  * ```ts
  * .not('id', 'in', '(5,6,7)')  // Use `()` for `in` filter
  * .not('arraycol', 'cs', '{"a","b"}')  // Use `cs` for `contains()`, `{}` for array values
  * ```
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('countries')
  *   .select()
  *   .not('name', 'is', null)
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  *
  * insert into
  *   countries (id, name)
  * values
  *   (1, 'null'),
  *   (2, null);
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  *   {
  *     "data": [
  *       {
  *         "id": 1,
  *         "name": "null"
  *       }
  *     ],
  *     "status": 200,
  *     "statusText": "OK"
  *   }
  *
  * ```
  */
  not(column, operator, value) {
    this.url.searchParams.append(column, `not.${operator}.${value}`);
    return this;
  }
  /**
  * Match only rows which satisfy at least one of the filters.
  *
  * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
  * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
  * to make sure it's properly sanitized.
  *
  * It's currently not possible to do an `.or()` filter across multiple tables.
  *
  * @param filters - The filters to use, following PostgREST syntax
  * @param options - Named parameters
  * @param options.referencedTable - Set this to filter on referenced tables
  * instead of the parent table
  * @param options.foreignTable - Deprecated, use `referencedTable` instead
  *
  * @category Database
  * @subcategory Using filters
  *
  * @remarks
  * or() expects you to use the raw PostgREST syntax for the filter names and values.
  *
  * ```ts
  * .or('id.in.(5,6,7), arraycol.cs.{"a","b"}')  // Use `()` for `in` filter, `{}` for array values and `cs` for `contains()`.
  * .or('id.in.(5,6,7), arraycol.cd.{"a","b"}')  // Use `cd` for `containedBy()`
  * ```
  *
  * @example With `select()`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('name')
  *   .or('id.eq.2,name.eq.Han')
  * ```
  *
  * @exampleSql With `select()`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse With `select()`
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "Leia"
  *     },
  *     {
  *       "name": "Han"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @example Use `or` with `and`
  * ```ts
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('name')
  *   .or('id.gt.3,and(id.eq.1,name.eq.Luke)')
  * ```
  *
  * @exampleSql Use `or` with `and`
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse Use `or` with `and`
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "Luke"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @example Use `or` on referenced tables
  * ```ts
  * const { data, error } = await supabase
  *   .from('orchestral_sections')
  *   .select(`
  *     name,
  *     instruments!inner (
  *       name
  *     )
  *   `)
  *   .or('section_id.eq.1,name.eq.guzheng', { referencedTable: 'instruments' })
  * ```
  *
  * @exampleSql Use `or` on referenced tables
  * ```sql
  * create table
  *   orchestral_sections (id int8 primary key, name text);
  * create table
  *   instruments (
  *     id int8 primary key,
  *     section_id int8 not null references orchestral_sections,
  *     name text
  *   );
  *
  * insert into
  *   orchestral_sections (id, name)
  * values
  *   (1, 'strings'),
  *   (2, 'woodwinds');
  * insert into
  *   instruments (id, section_id, name)
  * values
  *   (1, 2, 'flute'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse Use `or` on referenced tables
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "strings",
  *       "instruments": [
  *         {
  *           "name": "violin"
  *         }
  *       ]
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
    const key = referencedTable ? `${referencedTable}.or` : "or";
    this.url.searchParams.append(key, `(${filters})`);
    return this;
  }
  filter(column, operator, value) {
    this.url.searchParams.append(column, `${operator}.${value}`);
    return this;
  }
};
var PostgrestQueryBuilder = class {
  /**
  * Creates a query builder scoped to a Postgres table or view.
  *
  * @category Database
  *
  * @param url - The URL for the query
  * @param options - Named parameters
  * @param options.headers - Custom headers
  * @param options.schema - Postgres schema to use
  * @param options.fetch - Custom fetch implementation
  * @param options.urlLengthLimit - Maximum URL length before warning
  * @param options.retry - Enable automatic retries for transient errors (default: true)
  *
  * @example Using supabase-js (recommended)
  * ```ts
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * const { data, error } = await supabase.from('users').select('*')
  * ```
  *
  * @example Standalone import for bundle-sensitive environments
  * ```ts
  * import { PostgrestQueryBuilder } from '@supabase/postgrest-js'
  *
  * const query = new PostgrestQueryBuilder(
  *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
  *   { headers: { apikey: 'your-publishable-key' }, retry: true }
  * )
  * ```
  */
  constructor(url, { headers = {}, schema, fetch: fetch$1, urlLengthLimit = 8e3, retry }) {
    this.url = url;
    this.headers = new Headers(headers);
    this.schema = schema;
    this.fetch = fetch$1;
    this.urlLengthLimit = urlLengthLimit;
    this.retry = retry;
  }
  /**
  * Clone URL and headers to prevent shared state between operations.
  */
  cloneRequestState() {
    return {
      url: new URL(this.url.toString()),
      headers: new Headers(this.headers)
    };
  }
  /**
  * Perform a SELECT query on the table or view.
  *
  * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
  *
  * @param options - Named parameters
  *
  * @param options.head - When set to `true`, `data` will not be returned.
  * Useful if you only need the count.
  *
  * @param options.count - Count algorithm to use to count rows in the table or view.
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  *
  * @remarks
  * When using `count` with `.range()` or `.limit()`, the returned `count` is the total number of rows
  * that match your filters, not the number of rows in the current page. Use this to build pagination UI.
  
  * - By default, Supabase projects return a maximum of 1,000 rows. This setting can be changed in your project's [API settings](/dashboard/project/_/settings/api). It's recommended that you keep it low to limit the payload size of accidental or malicious requests. You can use `range()` queries to paginate through your data.
  * - `select()` can be combined with [Filters](/docs/reference/javascript/using-filters)
  * - `select()` can be combined with [Modifiers](/docs/reference/javascript/using-modifiers)
  * - `apikey` is a reserved keyword if you're using the [Supabase Platform](/docs/guides/platform) and [should be avoided as a column name](https://github.com/supabase/supabase/issues/5465). *
  * @category Database
  *
  * @example Getting your data
  * ```js
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select()
  * ```
  *
  * @exampleSql Getting your data
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Harry'),
  *   (2, 'Frodo'),
  *   (3, 'Katniss');
  * ```
  *
  * @exampleResponse Getting your data
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Harry"
  *     },
  *     {
  *       "id": 2,
  *       "name": "Frodo"
  *     },
  *     {
  *       "id": 3,
  *       "name": "Katniss"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Handling errors
  * The most useful field on a Postgres error is usually `hint` — when the database knows the fix, it puts the literal SQL there. For example, a permission-denied error (`code: '42501'`) arrives with a `hint` like `"Grant the required privileges to the current role with: GRANT SELECT ON public.characters TO anon;"`. Log the full `error` object so the hint isn't hidden behind `error.message`.
  *
  * @example Handling errors
  * ```js
  * const { data, error } = await supabase.from('characters').select()
  * if (error) {
  *   // Logs the full error: message, code, details, and hint.
  *   console.error(error)
  *   return
  * }
  * ```
  *
  * @exampleResponse Handling errors
  * ```json
  * {
  *   "error": {
  *     "code": "42501",
  *     "details": null,
  *     "hint": "Grant the required privileges to the current role with: GRANT SELECT ON public.characters TO anon;",
  *     "message": "permission denied for table characters"
  *   },
  *   "status": 401,
  *   "statusText": ""
  * }
  * ```
  *
  * @example Selecting specific columns
  * ```js
  * const { data, error } = await supabase
  *   .from('characters')
  *   .select('name')
  * ```
  *
  * @exampleSql Selecting specific columns
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Frodo'),
  *   (2, 'Harry'),
  *   (3, 'Katniss');
  * ```
  *
  * @exampleResponse Selecting specific columns
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "Frodo"
  *     },
  *     {
  *       "name": "Harry"
  *     },
  *     {
  *       "name": "Katniss"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Query referenced tables
  * If your database has foreign key relationships, you can query related tables too.
  *
  * @example Query referenced tables
  * ```js
  * const { data, error } = await supabase
  *   .from('orchestral_sections')
  *   .select(`
  *     name,
  *     instruments (
  *       name
  *     )
  *   `)
  * ```
  *
  * @exampleSql Query referenced tables
  * ```sql
  * create table
  *   orchestral_sections (id int8 primary key, name text);
  * create table
  *   instruments (
  *     id int8 primary key,
  *     section_id int8 not null references orchestral_sections,
  *     name text
  *   );
  *
  * insert into
  *   orchestral_sections (id, name)
  * values
  *   (1, 'strings'),
  *   (2, 'woodwinds');
  * insert into
  *   instruments (id, section_id, name)
  * values
  *   (1, 2, 'flute'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse Query referenced tables
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "strings",
  *       "instruments": [
  *         {
  *           "name": "violin"
  *         }
  *       ]
  *     },
  *     {
  *       "name": "woodwinds",
  *       "instruments": [
  *         {
  *           "name": "flute"
  *         }
  *       ]
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Query referenced tables with spaces in their names
  * If your table name contains spaces, you must use double quotes in the `select` statement to reference the table.
  *
  * @example Query referenced tables with spaces in their names
  * ```js
  * const { data, error } = await supabase
  *   .from('orchestral sections')
  *   .select(`
  *     name,
  *     "musical instruments" (
  *       name
  *     )
  *   `)
  * ```
  *
  * @exampleSql Query referenced tables with spaces in their names
  * ```sql
  * create table
  *   "orchestral sections" (id int8 primary key, name text);
  * create table
  *   "musical instruments" (
  *     id int8 primary key,
  *     section_id int8 not null references "orchestral sections",
  *     name text
  *   );
  *
  * insert into
  *   "orchestral sections" (id, name)
  * values
  *   (1, 'strings'),
  *   (2, 'woodwinds');
  * insert into
  *   "musical instruments" (id, section_id, name)
  * values
  *   (1, 2, 'flute'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse Query referenced tables with spaces in their names
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "strings",
  *       "musical instruments": [
  *         {
  *           "name": "violin"
  *         }
  *       ]
  *     },
  *     {
  *       "name": "woodwinds",
  *       "musical instruments": [
  *         {
  *           "name": "flute"
  *         }
  *       ]
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Query referenced tables through a join table
  * If you're in a situation where your tables are **NOT** directly
  * related, but instead are joined by a _join table_, you can still use
  * the `select()` method to query the related data. The join table needs
  * to have the foreign keys as part of its composite primary key.
  *
  * @example Query referenced tables through a join table
  * ```ts
  * const { data, error } = await supabase
  *   .from('users')
  *   .select(`
  *     name,
  *     teams (
  *       name
  *     )
  *   `)
  *   
  * ```
  *
  * @exampleSql Query referenced tables through a join table
  * ```sql
  * create table
  *   users (
  *     id int8 primary key,
  *     name text
  *   );
  * create table
  *   teams (
  *     id int8 primary key,
  *     name text
  *   );
  * -- join table
  * create table
  *   users_teams (
  *     user_id int8 not null references users,
  *     team_id int8 not null references teams,
  *     -- both foreign keys must be part of a composite primary key
  *     primary key (user_id, team_id)
  *   );
  *
  * insert into
  *   users (id, name)
  * values
  *   (1, 'Kiran'),
  *   (2, 'Evan');
  * insert into
  *   teams (id, name)
  * values
  *   (1, 'Green'),
  *   (2, 'Blue');
  * insert into
  *   users_teams (user_id, team_id)
  * values
  *   (1, 1),
  *   (1, 2),
  *   (2, 2);
  * ```
  *
  * @exampleResponse Query referenced tables through a join table
  * ```json
  *   {
  *     "data": [
  *       {
  *         "name": "Kiran",
  *         "teams": [
  *           {
  *             "name": "Green"
  *           },
  *           {
  *             "name": "Blue"
  *           }
  *         ]
  *       },
  *       {
  *         "name": "Evan",
  *         "teams": [
  *           {
  *             "name": "Blue"
  *           }
  *         ]
  *       }
  *     ],
  *     "status": 200,
  *     "statusText": "OK"
  *   }
  *   
  * ```
  *
  * @exampleDescription Query the same referenced table multiple times
  * If you need to query the same referenced table twice, use the name of the
  * joined column to identify which join to use. You can also give each
  * column an alias.
  *
  * @example Query the same referenced table multiple times
  * ```ts
  * const { data, error } = await supabase
  *   .from('messages')
  *   .select(`
  *     content,
  *     from:sender_id(name),
  *     to:receiver_id(name)
  *   `)
  *
  * // To infer types, use the name of the table (in this case `users`) and
  * // the name of the foreign key constraint.
  * const { data, error } = await supabase
  *   .from('messages')
  *   .select(`
  *     content,
  *     from:users!messages_sender_id_fkey(name),
  *     to:users!messages_receiver_id_fkey(name)
  *   `)
  * ```
  *
  * @exampleSql Query the same referenced table multiple times
  * ```sql
  *  create table
  *  users (id int8 primary key, name text);
  *
  *  create table
  *    messages (
  *      sender_id int8 not null references users,
  *      receiver_id int8 not null references users,
  *      content text
  *    );
  *
  *  insert into
  *    users (id, name)
  *  values
  *    (1, 'Kiran'),
  *    (2, 'Evan');
  *
  *  insert into
  *    messages (sender_id, receiver_id, content)
  *  values
  *    (1, 2, '👋');
  *  ```
  * ```
  *
  * @exampleResponse Query the same referenced table multiple times
  * ```json
  * {
  *   "data": [
  *     {
  *       "content": "👋",
  *       "from": {
  *         "name": "Kiran"
  *       },
  *       "to": {
  *         "name": "Evan"
  *       }
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Query nested foreign tables through a join table
  * You can use the result of a joined table to gather data in
  * another foreign table. With multiple references to the same foreign
  * table you must specify the column on which to conduct the join.
  *
  * @example Query nested foreign tables through a join table
  * ```ts
  *   const { data, error } = await supabase
  *     .from('games')
  *     .select(`
  *       game_id:id,
  *       away_team:teams!games_away_team_fkey (
  *         users (
  *           id,
  *           name
  *         )
  *       )
  *     `)
  *   
  * ```
  *
  * @exampleSql Query nested foreign tables through a join table
  * ```sql
  * ```sql
  * create table
  *   users (
  *     id int8 primary key,
  *     name text
  *   );
  * create table
  *   teams (
  *     id int8 primary key,
  *     name text
  *   );
  * -- join table
  * create table
  *   users_teams (
  *     user_id int8 not null references users,
  *     team_id int8 not null references teams,
  *
  *     primary key (user_id, team_id)
  *   );
  * create table
  *   games (
  *     id int8 primary key,
  *     home_team int8 not null references teams,
  *     away_team int8 not null references teams,
  *     name text
  *   );
  *
  * insert into users (id, name)
  * values
  *   (1, 'Kiran'),
  *   (2, 'Evan');
  * insert into
  *   teams (id, name)
  * values
  *   (1, 'Green'),
  *   (2, 'Blue');
  * insert into
  *   users_teams (user_id, team_id)
  * values
  *   (1, 1),
  *   (1, 2),
  *   (2, 2);
  * insert into
  *   games (id, home_team, away_team, name)
  * values
  *   (1, 1, 2, 'Green vs Blue'),
  *   (2, 2, 1, 'Blue vs Green');
  * ```
  *
  * @exampleResponse Query nested foreign tables through a join table
  * ```json
  *   {
  *     "data": [
  *       {
  *         "game_id": 1,
  *         "away_team": {
  *           "users": [
  *             {
  *               "id": 1,
  *               "name": "Kiran"
  *             },
  *             {
  *               "id": 2,
  *               "name": "Evan"
  *             }
  *           ]
  *         }
  *       },
  *       {
  *         "game_id": 2,
  *         "away_team": {
  *           "users": [
  *             {
  *               "id": 1,
  *               "name": "Kiran"
  *             }
  *           ]
  *         }
  *       }
  *     ],
  *     "status": 200,
  *     "statusText": "OK"
  *   }
  *   
  * ```
  *
  * @exampleDescription Filtering through referenced tables
  * If the filter on a referenced table's column is not satisfied, the referenced
  * table returns `[]` or `null` but the parent table is not filtered out.
  * If you want to filter out the parent table rows, use the `!inner` hint
  *
  * @example Filtering through referenced tables
  * ```ts
  * const { data, error } = await supabase
  *   .from('instruments')
  *   .select('name, orchestral_sections(*)')
  *   .eq('orchestral_sections.name', 'percussion')
  * ```
  *
  * @exampleSql Filtering through referenced tables
  * ```sql
  * create table
  *   orchestral_sections (id int8 primary key, name text);
  * create table
  *   instruments (
  *     id int8 primary key,
  *     section_id int8 not null references orchestral_sections,
  *     name text
  *   );
  *
  * insert into
  *   orchestral_sections (id, name)
  * values
  *   (1, 'strings'),
  *   (2, 'woodwinds');
  * insert into
  *   instruments (id, section_id, name)
  * values
  *   (1, 2, 'flute'),
  *   (2, 1, 'violin');
  * ```
  *
  * @exampleResponse Filtering through referenced tables
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "flute",
  *       "orchestral_sections": null
  *     },
  *     {
  *       "name": "violin",
  *       "orchestral_sections": null
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Querying referenced table with count
  * You can get the number of rows in a related table by using the
  * **count** property.
  *
  * @example Querying referenced table with count
  * ```ts
  * const { data, error } = await supabase
  *   .from('orchestral_sections')
  *   .select(`*, instruments(count)`)
  * ```
  *
  * @exampleSql Querying referenced table with count
  * ```sql
  * create table orchestral_sections (
  *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
  *   "name" text
  * );
  *
  * create table characters (
  *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
  *   "name" text,
  *   "section_id" "uuid" references public.orchestral_sections on delete cascade
  * );
  *
  * with section as (
  *   insert into orchestral_sections (name)
  *   values ('strings') returning id
  * )
  * insert into instruments (name, section_id) values
  * ('violin', (select id from section)),
  * ('viola', (select id from section)),
  * ('cello', (select id from section)),
  * ('double bass', (select id from section));
  * ```
  *
  * @exampleResponse Querying referenced table with count
  * ```json
  * [
  *   {
  *     "id": "693694e7-d993-4360-a6d7-6294e325d9b6",
  *     "name": "strings",
  *     "instruments": [
  *       {
  *         "count": 4
  *       }
  *     ]
  *   }
  * ]
  * ```
  *
  * @exampleDescription Querying with count option
  * You can get the number of rows by using the
  * [count](/docs/reference/javascript/select#parameters) option.
  *
  * @example Querying with count option
  * ```ts
  * const { count, error } = await supabase
  *   .from('characters')
  *   .select('*', { count: 'exact', head: true })
  * ```
  *
  * @exampleSql Querying with count option
  * ```sql
  * create table
  *   characters (id int8 primary key, name text);
  *
  * insert into
  *   characters (id, name)
  * values
  *   (1, 'Luke'),
  *   (2, 'Leia'),
  *   (3, 'Han');
  * ```
  *
  * @exampleResponse Querying with count option
  * ```json
  * {
  *   "count": 3,
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Querying JSON data
  * You can select and filter data inside of
  * [JSON](/docs/guides/database/json) columns. Postgres offers some
  * [operators](/docs/guides/database/json#query-the-jsonb-data) for
  * querying JSON data.
  *
  * @example Querying JSON data
  * ```ts
  * const { data, error } = await supabase
  *   .from('users')
  *   .select(`
  *     id, name,
  *     address->city
  *   `)
  * ```
  *
  * @exampleSql Querying JSON data
  * ```sql
  * create table
  *   users (
  *     id int8 primary key,
  *     name text,
  *     address jsonb
  *   );
  *
  * insert into
  *   users (id, name, address)
  * values
  *   (1, 'Frodo', '{"city":"Hobbiton"}');
  * ```
  *
  * @exampleResponse Querying JSON data
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Frodo",
  *       "city": "Hobbiton"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Querying referenced table with inner join
  * If you don't want to return the referenced table contents, you can leave the parenthesis empty.
  * Like `.select('name, orchestral_sections!inner()')`.
  *
  * @example Querying referenced table with inner join
  * ```ts
  * const { data, error } = await supabase
  *   .from('instruments')
  *   .select('name, orchestral_sections!inner(name)')
  *   .eq('orchestral_sections.name', 'woodwinds')
  *   .limit(1)
  * ```
  *
  * @exampleSql Querying referenced table with inner join
  * ```sql
  * create table orchestral_sections (
  *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
  *   "name" text
  * );
  *
  * create table instruments (
  *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
  *   "name" text,
  *   "section_id" "uuid" references public.orchestral_sections on delete cascade
  * );
  *
  * with section as (
  *   insert into orchestral_sections (name)
  *   values ('woodwinds') returning id
  * )
  * insert into instruments (name, section_id) values
  * ('flute', (select id from section)),
  * ('clarinet', (select id from section)),
  * ('bassoon', (select id from section)),
  * ('piccolo', (select id from section));
  * ```
  *
  * @exampleResponse Querying referenced table with inner join
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "flute",
  *       "orchestral_sections": {"name": "woodwinds"}
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Switching schemas per query
  * In addition to setting the schema during initialization, you can also switch schemas on a per-query basis.
  * Make sure you've set up your [database privileges and API settings](/docs/guides/api/using-custom-schemas).
  *
  * @example Switching schemas per query
  * ```ts
  * const { data, error } = await supabase
  *   .schema('myschema')
  *   .from('mytable')
  *   .select()
  * ```
  *
  * @exampleSql Switching schemas per query
  * ```sql
  * create schema myschema;
  *
  * create table myschema.mytable (
  *   id uuid primary key default gen_random_uuid(),
  *   data text
  * );
  *
  * insert into myschema.mytable (data) values ('mydata');
  * ```
  *
  * @exampleResponse Switching schemas per query
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": "4162e008-27b0-4c0f-82dc-ccaeee9a624d",
  *       "data": "mydata"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  select(columns, options) {
    const { head: head2 = false, count } = options !== null && options !== void 0 ? options : {};
    const method = head2 ? "HEAD" : "GET";
    let quoted = false;
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
      if (/\s/.test(c) && !quoted) return "";
      if (c === '"') quoted = !quoted;
      return c;
    }).join("");
    const { url, headers } = this.cloneRequestState();
    url.searchParams.set("select", cleanedColumns);
    if (count) headers.append("Prefer", `count=${count}`);
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      fetch: this.fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
  /**
  * Perform an INSERT into the table or view.
  *
  * By default, inserted rows are not returned. To return it, chain the call
  * with `.select()`.
  *
  * @param values - The values to insert. Pass an object to insert a single row
  * or an array to insert multiple rows.
  *
  * @param options - Named parameters
  *
  * @param options.count - Count algorithm to use to count inserted rows.
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  *
  * @param options.defaultToNull - Make missing fields default to `null`.
  * Otherwise, use the default value for the column. Only applies for bulk
  * inserts.
  *
  * @category Database
  *
  * @example Create a record
  * ```ts
  * const { error } = await supabase
  *   .from('countries')
  *   .insert({ id: 1, name: 'Mordor' })
  * ```
  *
  * @exampleSql Create a record
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  * ```
  *
  * @exampleResponse Create a record
  * ```json
  * {
  *   "status": 201,
  *   "statusText": ""
  * }
  * ```
  *
  * @exampleDescription Handling errors
  * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT INSERT ON public.countries TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
  *
  * @example Handling errors
  * ```js
  * const { error } = await supabase.from('countries').insert({ id: 1, name: 'Mordor' })
  * if (error) console.error(error)
  * ```
  *
  * @example Create a record and return it
  * ```ts
  * const { data, error } = await supabase
  *   .from('countries')
  *   .insert({ id: 1, name: 'Mordor' })
  *   .select()
  * ```
  *
  * @exampleSql Create a record and return it
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  * ```
  *
  * @exampleResponse Create a record and return it
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Mordor"
  *     }
  *   ],
  *   "status": 201,
  *   "statusText": ""
  * }
  * ```
  *
  * @exampleDescription Bulk create
  * A bulk create operation is handled in a single transaction.
  * If any of the inserts fail, none of the rows are inserted.
  *
  * @example Bulk create
  * ```ts
  * const { error } = await supabase
  *   .from('countries')
  *   .insert([
  *     { id: 1, name: 'Mordor' },
  *     { id: 1, name: 'The Shire' },
  *   ])
  * ```
  *
  * @exampleSql Bulk create
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  * ```
  *
  * @exampleResponse Bulk create
  * ```json
  * {
  *   "error": {
  *     "code": "23505",
  *     "details": "Key (id)=(1) already exists.",
  *     "hint": null,
  *     "message": "duplicate key value violates unique constraint \"countries_pkey\""
  *   },
  *   "status": 409,
  *   "statusText": ""
  * }
  * ```
  */
  insert(values, { count, defaultToNull = true } = {}) {
    var _this$fetch;
    const method = "POST";
    const { url, headers } = this.cloneRequestState();
    if (count) headers.append("Prefer", `count=${count}`);
    if (!defaultToNull) headers.append("Prefer", `missing=default`);
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
        url.searchParams.set("columns", uniqueColumns.join(","));
      }
    }
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      body: values,
      fetch: (_this$fetch = this.fetch) !== null && _this$fetch !== void 0 ? _this$fetch : fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
  /**
  * Perform an UPSERT on the table or view. Depending on the column(s) passed
  * to `onConflict`, `.upsert()` allows you to perform the equivalent of
  * `.insert()` if a row with the corresponding `onConflict` columns doesn't
  * exist, or if it does exist, perform an alternative action depending on
  * `ignoreDuplicates`.
  *
  * By default, upserted rows are not returned. To return it, chain the call
  * with `.select()`.
  *
  * @param values - The values to upsert with. Pass an object to upsert a
  * single row or an array to upsert multiple rows.
  *
  * @param options - Named parameters
  *
  * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
  * duplicate rows are determined. Two rows are duplicates if all the
  * `onConflict` columns are equal.
  *
  * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
  * `false`, duplicate rows are merged with existing rows.
  *
  * @param options.count - Count algorithm to use to count upserted rows.
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  *
  * @param options.defaultToNull - Make missing fields default to `null`.
  * Otherwise, use the default value for the column. This only applies when
  * inserting new rows, not when merging with existing rows under
  * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
  *
  * @example Upsert a single row using a unique key
  * ```ts
  * // Upserting a single row, overwriting based on the 'username' unique column
  * const { data, error } = await supabase
  *   .from('users')
  *   .upsert({ username: 'supabot' }, { onConflict: 'username' })
  *
  * // Example response:
  * // {
  * //   data: [
  * //     { id: 4, message: 'bar', username: 'supabot' }
  * //   ],
  * //   error: null
  * // }
  * ```
  *
  * @example Upsert with conflict resolution and exact row counting
  * ```ts
  * // Upserting and returning exact count
  * const { data, error, count } = await supabase
  *   .from('users')
  *   .upsert(
  *     {
  *       id: 3,
  *       message: 'foo',
  *       username: 'supabot'
  *     },
  *     {
  *       onConflict: 'username',
  *       count: 'exact'
  *     }
  *   )
  *
  * // Example response:
  * // {
  * //   data: [
  * //     {
  * //       id: 42,
  * //       handle: "saoirse",
  * //       display_name: "Saoirse"
  * //     }
  * //   ],
  * //   count: 1,
  * //   error: null
  * // }
  * ```
  *
  * @category Database
  *
  * @remarks
  * - Primary keys must be included in `values` to use upsert.
  *
  * @example Upsert your data
  * ```ts
  * const { data, error } = await supabase
  *   .from('instruments')
  *   .upsert({ id: 1, name: 'piano' })
  *   .select()
  * ```
  *
  * @exampleSql Upsert your data
  * ```sql
  * create table
  *   instruments (id int8 primary key, name text);
  *
  * insert into
  *   instruments (id, name)
  * values
  *   (1, 'harpsichord');
  * ```
  *
  * @exampleResponse Upsert your data
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "piano"
  *     }
  *   ],
  *   "status": 201,
  *   "statusText": ""
  * }
  * ```
  *
  * @exampleDescription Handling errors
  * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT INSERT, UPDATE ON public.instruments TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
  *
  * @example Handling errors
  * ```js
  * const { data, error } = await supabase.from('instruments').upsert({ id: 1, name: 'piano' }).select()
  * if (error) console.error(error)
  * ```
  *
  * @example Bulk Upsert your data
  * ```ts
  * const { data, error } = await supabase
  *   .from('instruments')
  *   .upsert([
  *     { id: 1, name: 'piano' },
  *     { id: 2, name: 'harp' },
  *   ])
  *   .select()
  * ```
  *
  * @exampleSql Bulk Upsert your data
  * ```sql
  * create table
  *   instruments (id int8 primary key, name text);
  *
  * insert into
  *   instruments (id, name)
  * values
  *   (1, 'harpsichord');
  * ```
  *
  * @exampleResponse Bulk Upsert your data
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "piano"
  *     },
  *     {
  *       "id": 2,
  *       "name": "harp"
  *     }
  *   ],
  *   "status": 201,
  *   "statusText": ""
  * }
  * ```
  *
  * @exampleDescription Upserting into tables with constraints
  * In the following query, `upsert()` implicitly uses the `id`
  * (primary key) column to determine conflicts. If there is no existing
  * row with the same `id`, `upsert()` inserts a new row, which
  * will fail in this case as there is already a row with `handle` `"saoirse"`.
  * Using the `onConflict` option, you can instruct `upsert()` to use
  * another column with a unique constraint to determine conflicts.
  *
  * @example Upserting into tables with constraints
  * ```ts
  * const { data, error } = await supabase
  *   .from('users')
  *   .upsert({ id: 42, handle: 'saoirse', display_name: 'Saoirse' })
  *   .select()
  * ```
  *
  * @exampleSql Upserting into tables with constraints
  * ```sql
  * create table
  *   users (
  *     id int8 generated by default as identity primary key,
  *     handle text not null unique,
  *     display_name text
  *   );
  *
  * insert into
  *   users (id, handle, display_name)
  * values
  *   (1, 'saoirse', null);
  * ```
  *
  * @exampleResponse Upserting into tables with constraints
  * ```json
  * {
  *   "error": {
  *     "code": "23505",
  *     "details": "Key (handle)=(saoirse) already exists.",
  *     "hint": null,
  *     "message": "duplicate key value violates unique constraint \"users_handle_key\""
  *   },
  *   "status": 409,
  *   "statusText": ""
  * }
  * ```
  */
  upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
    var _this$fetch2;
    const method = "POST";
    const { url, headers } = this.cloneRequestState();
    headers.append("Prefer", `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`);
    if (onConflict !== void 0) url.searchParams.set("on_conflict", onConflict);
    if (count) headers.append("Prefer", `count=${count}`);
    if (!defaultToNull) headers.append("Prefer", "missing=default");
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
        url.searchParams.set("columns", uniqueColumns.join(","));
      }
    }
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      body: values,
      fetch: (_this$fetch2 = this.fetch) !== null && _this$fetch2 !== void 0 ? _this$fetch2 : fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
  /**
  * Perform an UPDATE on the table or view.
  *
  * By default, updated rows are not returned. To return it, chain the call
  * with `.select()` after filters.
  *
  * @param values - The values to update with
  *
  * @param options - Named parameters
  *
  * @param options.count - Count algorithm to use to count updated rows.
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  *
  * @category Database
  *
  * @remarks
  * - `update()` should always be combined with [Filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to update.
  *
  * @example Updating your data
  * ```ts
  * const { error } = await supabase
  *   .from('instruments')
  *   .update({ name: 'piano' })
  *   .eq('id', 1)
  * ```
  *
  * @exampleSql Updating your data
  * ```sql
  * create table
  *   instruments (id int8 primary key, name text);
  *
  * insert into
  *   instruments (id, name)
  * values
  *   (1, 'harpsichord');
  * ```
  *
  * @exampleResponse Updating your data
  * ```json
  * {
  *   "status": 204,
  *   "statusText": ""
  * }
  * ```
  *
  * @exampleDescription Handling errors
  * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT UPDATE ON public.instruments TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
  *
  * @example Handling errors
  * ```js
  * const { error } = await supabase.from('instruments').update({ name: 'piano' }).eq('id', 1)
  * if (error) console.error(error)
  * ```
  *
  * @example Update a record and return it
  * ```ts
  * const { data, error } = await supabase
  *   .from('instruments')
  *   .update({ name: 'piano' })
  *   .eq('id', 1)
  *   .select()
  * ```
  *
  * @exampleSql Update a record and return it
  * ```sql
  * create table
  *   instruments (id int8 primary key, name text);
  *
  * insert into
  *   instruments (id, name)
  * values
  *   (1, 'harpsichord');
  * ```
  *
  * @exampleResponse Update a record and return it
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "piano"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Updating JSON data
  * Postgres offers some
  * [operators](/docs/guides/database/json#query-the-jsonb-data) for
  * working with JSON data. Currently, it is only possible to update the entire JSON document.
  *
  * @example Updating JSON data
  * ```ts
  * const { data, error } = await supabase
  *   .from('users')
  *   .update({
  *     address: {
  *       street: 'Melrose Place',
  *       postcode: 90210
  *     }
  *   })
  *   .eq('address->postcode', 90210)
  *   .select()
  * ```
  *
  * @exampleSql Updating JSON data
  * ```sql
  * create table
  *   users (
  *     id int8 primary key,
  *     name text,
  *     address jsonb
  *   );
  *
  * insert into
  *   users (id, name, address)
  * values
  *   (1, 'Michael', '{ "postcode": 90210 }');
  * ```
  *
  * @exampleResponse Updating JSON data
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Michael",
  *       "address": {
  *         "street": "Melrose Place",
  *         "postcode": 90210
  *       }
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  update(values, { count } = {}) {
    var _this$fetch3;
    const method = "PATCH";
    const { url, headers } = this.cloneRequestState();
    if (count) headers.append("Prefer", `count=${count}`);
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      body: values,
      fetch: (_this$fetch3 = this.fetch) !== null && _this$fetch3 !== void 0 ? _this$fetch3 : fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
  /**
  * Perform a DELETE on the table or view.
  *
  * By default, deleted rows are not returned. To return it, chain the call
  * with `.select()` after filters.
  *
  * @param options - Named parameters
  *
  * @param options.count - Count algorithm to use to count deleted rows.
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  *
  * @category Database
  *
  * @remarks
  * - `delete()` should always be combined with [filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to delete.
  * - If you use `delete()` with filters and you have
  *   [RLS](/docs/learn/auth-deep-dive/auth-row-level-security) enabled, only
  *   rows visible through `SELECT` policies are deleted. Note that by default
  *   no rows are visible, so you need at least one `SELECT`/`ALL` policy that
  *   makes the rows visible.
  * - When using `delete().in()`, specify an array of values to target multiple rows with a single query. This is particularly useful for batch deleting entries that share common criteria, such as deleting users by their IDs. Ensure that the array you provide accurately represents all records you intend to delete to avoid unintended data removal.
  *
  * @example Delete a single record
  * ```ts
  * const response = await supabase
  *   .from('countries')
  *   .delete()
  *   .eq('id', 1)
  * ```
  *
  * @exampleSql Delete a single record
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  *
  * insert into
  *   countries (id, name)
  * values
  *   (1, 'Mordor');
  * ```
  *
  * @exampleResponse Delete a single record
  * ```json
  * {
  *   "status": 204,
  *   "statusText": ""
  * }
  * ```
  *
  * @exampleDescription Handling errors
  * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT DELETE ON public.countries TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
  *
  * @example Handling errors
  * ```js
  * const { error } = await supabase.from('countries').delete().eq('id', 1)
  * if (error) console.error(error)
  * ```
  *
  * @example Delete a record and return it
  * ```ts
  * const { data, error } = await supabase
  *   .from('countries')
  *   .delete()
  *   .eq('id', 1)
  *   .select()
  * ```
  *
  * @exampleSql Delete a record and return it
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  *
  * insert into
  *   countries (id, name)
  * values
  *   (1, 'Mordor');
  * ```
  *
  * @exampleResponse Delete a record and return it
  * ```json
  * {
  *   "data": [
  *     {
  *       "id": 1,
  *       "name": "Mordor"
  *     }
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @example Delete multiple records
  * ```ts
  * const response = await supabase
  *   .from('countries')
  *   .delete()
  *   .in('id', [1, 2, 3])
  * ```
  *
  * @exampleSql Delete multiple records
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  *
  * insert into
  *   countries (id, name)
  * values
  *   (1, 'Rohan'), (2, 'The Shire'), (3, 'Mordor');
  * ```
  *
  * @exampleResponse Delete multiple records
  * ```json
  * {
  *   "status": 204,
  *   "statusText": ""
  * }
  * ```
  */
  delete({ count } = {}) {
    var _this$fetch4;
    const method = "DELETE";
    const { url, headers } = this.cloneRequestState();
    if (count) headers.append("Prefer", `count=${count}`);
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schema,
      fetch: (_this$fetch4 = this.fetch) !== null && _this$fetch4 !== void 0 ? _this$fetch4 : fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
};
function toOpenApiError(body, statusText) {
  try {
    const parsed = JSON.parse(body);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      var _parsed$message, _parsed$details, _parsed$hint, _parsed$code;
      return new PostgrestError({
        message: String((_parsed$message = parsed.message) !== null && _parsed$message !== void 0 ? _parsed$message : body),
        details: (_parsed$details = parsed.details) !== null && _parsed$details !== void 0 ? _parsed$details : "",
        hint: (_parsed$hint = parsed.hint) !== null && _parsed$hint !== void 0 ? _parsed$hint : "",
        code: (_parsed$code = parsed.code) !== null && _parsed$code !== void 0 ? _parsed$code : ""
      });
    }
  } catch (_unused) {
  }
  return new PostgrestError({
    message: body || statusText,
    details: "",
    hint: "",
    code: ""
  });
}
function toTransportFailure(cause, status, statusText) {
  var _err$name;
  const err = cause;
  return {
    success: false,
    error: new PostgrestError({
      message: `${(_err$name = err === null || err === void 0 ? void 0 : err.name) !== null && _err$name !== void 0 ? _err$name : "FetchError"}: ${err === null || err === void 0 ? void 0 : err.message}`,
      details: "",
      hint: "",
      code: ""
    }),
    data: null,
    count: null,
    status,
    statusText
  };
}
var PostgrestClient = class PostgrestClient2 {
  /**
  * Creates a PostgREST client.
  *
  * @param url - URL of the PostgREST endpoint
  * @param options - Named parameters
  * @param options.headers - Custom headers
  * @param options.schema - Postgres schema to switch to
  * @param options.fetch - Custom fetch
  * @param options.timeout - Optional timeout in milliseconds for all requests. When set, requests will automatically abort after this duration to prevent indefinite hangs.
  * @param options.urlLengthLimit - Maximum URL length in characters before warnings/errors are triggered. Defaults to 8000.
  * @param options.retry - Enable or disable automatic retries for transient errors.
  *   When enabled, idempotent requests (GET, HEAD, OPTIONS) that fail with network
  *   errors or HTTP 503/520 responses will be automatically retried up to 3 times
  *   with exponential backoff (1s, 2s, 4s). Defaults to `true`.
  * @example Using supabase-js (recommended)
  * ```ts
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * const { data, error } = await supabase.from('profiles').select('*')
  * ```
  *
  * @category Database
  *
  * @remarks
  * - A `timeout` option (in milliseconds) can be set to automatically abort requests that take too long.
  * - A `urlLengthLimit` option (default: 8000) can be set to control when URL length warnings are included in error messages for aborted requests.
  *
  * @example Standalone import for bundle-sensitive environments
  * ```ts
  * import { PostgrestClient } from '@supabase/postgrest-js'
  *
  * const postgrest = new PostgrestClient('https://xyzcompany.supabase.co/rest/v1', {
  *   headers: { apikey: 'your-publishable-key' },
  *   schema: 'public',
  *   timeout: 30000, // 30 second timeout
  * })
  * ```
  */
  constructor(url, { headers = {}, schema, fetch: fetch$1, timeout, urlLengthLimit = 8e3, retry } = {}) {
    this.url = url;
    this.headers = new Headers(headers);
    this.schemaName = schema;
    this.urlLengthLimit = urlLengthLimit;
    const originalFetch = fetch$1 !== null && fetch$1 !== void 0 ? fetch$1 : globalThis.fetch;
    if (timeout !== void 0 && timeout > 0) this.fetch = (input, init) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const existingSignal = init === null || init === void 0 ? void 0 : init.signal;
      if (existingSignal) {
        if (existingSignal.aborted) {
          clearTimeout(timeoutId);
          return originalFetch(input, init);
        }
        const abortHandler = () => {
          clearTimeout(timeoutId);
          controller.abort();
        };
        existingSignal.addEventListener("abort", abortHandler, { once: true });
        return originalFetch(input, _objectSpread2(_objectSpread2({}, init), {}, { signal: controller.signal })).finally(() => {
          clearTimeout(timeoutId);
          existingSignal.removeEventListener("abort", abortHandler);
        });
      }
      return originalFetch(input, _objectSpread2(_objectSpread2({}, init), {}, { signal: controller.signal })).finally(() => clearTimeout(timeoutId));
    };
    else this.fetch = originalFetch;
    this.retry = retry;
  }
  from(relation) {
    if (!relation || typeof relation !== "string" || relation.trim() === "") throw new Error("Invalid relation name: relation must be a non-empty string.");
    return new PostgrestQueryBuilder(new URL(`${this.url}/${relation}`), {
      headers: new Headers(this.headers),
      schema: this.schemaName,
      fetch: this.fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
  /**
  * Select a schema to query or perform an function (rpc) call.
  *
  * The schema needs to be on the list of exposed schemas inside Supabase.
  *
  * @param schema - The schema to query
  *
  * @category Database
  */
  schema(schema) {
    return new PostgrestClient2(this.url, {
      headers: this.headers,
      schema,
      fetch: this.fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
  /**
  * Fetch the OpenAPI description PostgREST publishes for this client's schema.
  *
  * The document lists only the tables, views and functions the caller's role
  * holds privileges on; PostgREST applies that filtering server-side. The
  * schema is the one this client was created with, so call `.schema()` first
  * to describe a different one. Transient failures are retried according to
  * the client's `retry` option, like any other idempotent request.
  *
  * @example
  * ```ts
  * const { data, error } = await supabase.getOpenApiSpec()
  * ```
  *
  * @example Describe a schema other than the client default
  * ```ts
  * const { data, error } = await supabase.schema('billing').getOpenApiSpec()
  * ```
  *
  * @category Database
  */
  async getOpenApiSpec() {
    var _this = this;
    var _this$fetch;
    const headers = new Headers(_this.headers);
    headers.set("Accept", "application/openapi+json");
    if (_this.schemaName) headers.set("Accept-Profile", _this.schemaName);
    const requestHeaders = {};
    headers.forEach((value, key) => {
      requestHeaders[key] = value;
    });
    const fetchImpl = (_this$fetch = _this.fetch) !== null && _this$fetch !== void 0 ? _this$fetch : globalThis.fetch;
    let res;
    try {
      var _this$retry;
      res = await fetchWithRetry(fetchImpl, `${_this.url}/`, {
        method: "GET",
        headers: requestHeaders
      }, (_this$retry = _this.retry) !== null && _this$retry !== void 0 ? _this$retry : true);
    } catch (fetchError) {
      return toTransportFailure(fetchError, 0, "");
    }
    let body;
    try {
      body = await res.text();
    } catch (readError) {
      return toTransportFailure(readError, res.status, res.statusText);
    }
    if (res.ok) try {
      return {
        success: true,
        error: null,
        data: JSON.parse(body),
        count: null,
        status: res.status,
        statusText: res.statusText
      };
    } catch (_unused2) {
    }
    return {
      success: false,
      error: toOpenApiError(body, res.statusText),
      data: null,
      count: null,
      status: res.status,
      statusText: res.statusText
    };
  }
  /**
  * Perform a function call.
  *
  * @param fn - The function name to call
  * @param args - The arguments to pass to the function call
  * @param options - Named parameters
  * @param options.head - When set to `true`, `data` will not be returned.
  * Useful if you only need the count.
  * @param options.get - When set to `true`, the function will be called with
  * read-only access mode.
  * @param options.count - Count algorithm to use to count rows returned by the
  * function. Only applicable for [set-returning
  * functions](https://www.postgresql.org/docs/current/functions-srf.html).
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  *
  * @example
  * ```ts
  * // For cross-schema functions where type inference fails, use overrideTypes:
  * const { data } = await supabase
  *   .schema('schema_b')
  *   .rpc('function_a', {})
  *   .overrideTypes<{ id: string; user_id: string }[]>()
  * ```
  *
  * @category Database
  *
  * @example Call a Postgres function without arguments
  * ```ts
  * const { data, error } = await supabase.rpc('hello_world')
  * ```
  *
  * @exampleSql Call a Postgres function without arguments
  * ```sql
  * create function hello_world() returns text as $$
  *   select 'Hello world';
  * $$ language sql;
  * ```
  *
  * @exampleResponse Call a Postgres function without arguments
  * ```json
  * {
  *   "data": "Hello world",
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @example Call a Postgres function with arguments
  * ```ts
  * const { data, error } = await supabase.rpc('echo', { say: '👋' })
  * ```
  *
  * @exampleSql Call a Postgres function with arguments
  * ```sql
  * create function echo(say text) returns text as $$
  *   select say;
  * $$ language sql;
  * ```
  *
  * @exampleResponse Call a Postgres function with arguments
  * ```json
  *   {
  *     "data": "👋",
  *     "status": 200,
  *     "statusText": "OK"
  *   }
  *
  * ```
  *
  * @exampleDescription Bulk processing
  * You can process large payloads by passing in an array as an argument.
  *
  * @example Bulk processing
  * ```ts
  * const { data, error } = await supabase.rpc('add_one_each', { arr: [1, 2, 3] })
  * ```
  *
  * @exampleSql Bulk processing
  * ```sql
  * create function add_one_each(arr int[]) returns int[] as $$
  *   select array_agg(n + 1) from unnest(arr) as n;
  * $$ language sql;
  * ```
  *
  * @exampleResponse Bulk processing
  * ```json
  * {
  *   "data": [
  *     2,
  *     3,
  *     4
  *   ],
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @exampleDescription Call a Postgres function with filters
  * Postgres functions that return tables can also be combined with [Filters](/docs/reference/javascript/using-filters) and [Modifiers](/docs/reference/javascript/using-modifiers).
  *
  * @example Call a Postgres function with filters
  * ```ts
  * const { data, error } = await supabase
  *   .rpc('list_stored_countries')
  *   .eq('id', 1)
  *   .single()
  * ```
  *
  * @exampleSql Call a Postgres function with filters
  * ```sql
  * create table
  *   countries (id int8 primary key, name text);
  *
  * insert into
  *   countries (id, name)
  * values
  *   (1, 'Rohan'),
  *   (2, 'The Shire');
  *
  * create function list_stored_countries() returns setof countries as $$
  *   select * from countries;
  * $$ language sql;
  * ```
  *
  * @exampleResponse Call a Postgres function with filters
  * ```json
  * {
  *   "data": {
  *     "id": 1,
  *     "name": "Rohan"
  *   },
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  *
  * @example Call a read-only Postgres function
  * ```ts
  * const { data, error } = await supabase.rpc('hello_world', undefined, { get: true })
  * ```
  *
  * @exampleSql Call a read-only Postgres function
  * ```sql
  * create function hello_world() returns text as $$
  *   select 'Hello world';
  * $$ language sql;
  * ```
  *
  * @exampleResponse Call a read-only Postgres function
  * ```json
  * {
  *   "data": "Hello world",
  *   "status": 200,
  *   "statusText": "OK"
  * }
  * ```
  */
  rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
    var _this$fetch2;
    let method;
    const url = new URL(`${this.url}/rpc/${fn}`);
    let body;
    const _isObject = (v) => v !== null && typeof v === "object" && (!Array.isArray(v) || v.some(_isObject));
    const _hasObjectArg = head2 && Object.values(args).some(_isObject);
    if (_hasObjectArg) {
      method = "POST";
      body = args;
    } else if (head2 || get2) {
      method = head2 ? "HEAD" : "GET";
      Object.entries(args).filter(([_, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
        url.searchParams.append(name, value);
      });
    } else {
      method = "POST";
      body = args;
    }
    const headers = new Headers(this.headers);
    if (_hasObjectArg) headers.set("Prefer", count ? `count=${count},return=minimal` : "return=minimal");
    else if (count) headers.set("Prefer", `count=${count}`);
    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schemaName,
      body,
      fetch: (_this$fetch2 = this.fetch) !== null && _this$fetch2 !== void 0 ? _this$fetch2 : fetch,
      urlLengthLimit: this.urlLengthLimit,
      retry: this.retry
    });
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
var WebSocketFactory = class {
  /**
   * Static-only utility – prevent instantiation.
   */
  constructor() {
  }
  static detectEnvironment() {
    var _a;
    if (typeof WebSocket !== "undefined") {
      return { type: "native", wsConstructor: WebSocket };
    }
    const gt = globalThis;
    if (typeof globalThis !== "undefined" && typeof gt.WebSocket !== "undefined") {
      return { type: "native", wsConstructor: gt.WebSocket };
    }
    const gl = typeof global !== "undefined" ? global : void 0;
    if (gl && typeof gl.WebSocket !== "undefined") {
      return { type: "native", wsConstructor: gl.WebSocket };
    }
    if (typeof globalThis !== "undefined" && typeof gt.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") {
      return {
        type: "cloudflare",
        error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
        workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
      };
    }
    if (typeof globalThis !== "undefined" && gt.EdgeRuntime || typeof navigator !== "undefined" && ((_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) {
      return {
        type: "unsupported",
        error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
        workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
      };
    }
    const _process = globalThis["process"];
    if (_process) {
      const processVersions = _process["versions"];
      if (processVersions && processVersions["node"]) {
        return {
          type: "unsupported",
          error: "Node.js detected but native WebSocket not found.",
          workaround: "Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option."
        };
      }
    }
    return {
      type: "unsupported",
      error: "Unknown JavaScript runtime without WebSocket support.",
      workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
    };
  }
  /**
   * Returns the best available WebSocket constructor for the current runtime.
   *
   * @category Realtime
   *
   * @example Example with error handling
   * ```ts
   * try {
   *   const WS = WebSocketFactory.getWebSocketConstructor()
   *   const socket = new WS('wss://example.com/socket')
   * } catch (error) {
   *   console.error('WebSocket not available in this environment.', error)
   * }
   * ```
   */
  static getWebSocketConstructor() {
    const env = this.detectEnvironment();
    if (env.wsConstructor) {
      return env.wsConstructor;
    }
    let errorMessage = env.error || "WebSocket not supported in this environment.";
    if (env.workaround) {
      errorMessage += `

Suggested solution: ${env.workaround}`;
    }
    throw new Error(errorMessage);
  }
  /**
   * Detects whether the runtime can establish WebSocket connections.
   *
   * @category Realtime
   *
   * @example Example in a Node.js script
   * ```ts
   * if (!WebSocketFactory.isWebSocketSupported()) {
   *   console.error('WebSockets are required for this script.')
   *   process.exitCode = 1
   * }
   * ```
   */
  static isWebSocketSupported() {
    try {
      const env = this.detectEnvironment();
      return env.type === "native";
    } catch (_a) {
      return false;
    }
  }
};
var websocket_factory_default = WebSocketFactory;

// node_modules/@supabase/realtime-js/dist/module/lib/version.js
var version = "2.117.3";

// node_modules/@supabase/realtime-js/dist/module/lib/constants.js
var DEFAULT_VERSION = `realtime-js/${version}`;
var VSN_1_0_0 = "1.0.0";
var VSN_2_0_0 = "2.0.0";
var DEFAULT_VSN = VSN_2_0_0;
var DEFAULT_TIMEOUT = 1e4;
var DEFAULT_POSTGRES_CHANGES_WAIT_TIMEOUT = 15e3;
var POSTGRES_CHANGES_WAIT_ERROR_GRACE = 1e4;
var MAX_PUSH_BUFFER_SIZE = 100;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave",
  access_token: "access_token"
};
var CONNECTION_STATE = {
  connecting: "connecting",
  open: "open",
  closing: "closing",
  closed: "closed"
};

// node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
var Serializer = class {
  constructor(allowedMetadataKeys) {
    this.HEADER_LENGTH = 1;
    this.USER_BROADCAST_PUSH_META_LENGTH = 6;
    this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 };
    this.BINARY_ENCODING = 0;
    this.JSON_ENCODING = 1;
    this.BROADCAST_EVENT = "broadcast";
    this.allowedMetadataKeys = [];
    this.allowedMetadataKeys = allowedMetadataKeys !== null && allowedMetadataKeys !== void 0 ? allowedMetadataKeys : [];
  }
  encode(msg, callback) {
    if (msg.event === this.BROADCAST_EVENT && !(msg.payload instanceof ArrayBuffer) && typeof msg.payload.event === "string") {
      return callback(this._binaryEncodeUserBroadcastPush(msg));
    }
    let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
    return callback(JSON.stringify(payload));
  }
  _binaryEncodeUserBroadcastPush(message) {
    var _a;
    if (this._isArrayBuffer((_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload)) {
      return this._encodeBinaryUserBroadcastPush(message);
    } else {
      return this._encodeJsonUserBroadcastPush(message);
    }
  }
  _encodeBinaryUserBroadcastPush(message) {
    var _a, _b;
    const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : new ArrayBuffer(0);
    return this._encodeUserBroadcastPush(message, this.BINARY_ENCODING, userPayload);
  }
  _encodeJsonUserBroadcastPush(message) {
    var _a, _b;
    const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : {};
    const encoder = new TextEncoder();
    const encodedUserPayload = encoder.encode(JSON.stringify(userPayload)).buffer;
    return this._encodeUserBroadcastPush(message, this.JSON_ENCODING, encodedUserPayload);
  }
  _encodeUserBroadcastPush(message, encodingType, encodedPayload) {
    var _a, _b;
    const encoder = new TextEncoder();
    const topic = encoder.encode(message.topic);
    const ref = encoder.encode((_a = message.ref) !== null && _a !== void 0 ? _a : "");
    const joinRef = encoder.encode((_b = message.join_ref) !== null && _b !== void 0 ? _b : "");
    const userEvent = encoder.encode(message.payload.event);
    const rest = this.allowedMetadataKeys ? this._pick(message.payload, this.allowedMetadataKeys) : {};
    const metadata = encoder.encode(Object.keys(rest).length === 0 ? "" : JSON.stringify(rest));
    if (joinRef.length > 255) {
      throw new Error(`joinRef length ${joinRef.length} exceeds maximum of 255`);
    }
    if (ref.length > 255) {
      throw new Error(`ref length ${ref.length} exceeds maximum of 255`);
    }
    if (topic.length > 255) {
      throw new Error(`topic length ${topic.length} exceeds maximum of 255`);
    }
    if (userEvent.length > 255) {
      throw new Error(`userEvent length ${userEvent.length} exceeds maximum of 255`);
    }
    if (metadata.length > 255) {
      throw new Error(`metadata length ${metadata.length} exceeds maximum of 255`);
    }
    const metaLength = this.USER_BROADCAST_PUSH_META_LENGTH + joinRef.length + ref.length + topic.length + userEvent.length + metadata.length;
    const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
    const view = new DataView(header);
    const bytes = new Uint8Array(header);
    let offset = 0;
    view.setUint8(offset++, this.KINDS.userBroadcastPush);
    view.setUint8(offset++, joinRef.length);
    view.setUint8(offset++, ref.length);
    view.setUint8(offset++, topic.length);
    view.setUint8(offset++, userEvent.length);
    view.setUint8(offset++, metadata.length);
    view.setUint8(offset++, encodingType);
    bytes.set(joinRef, offset);
    offset += joinRef.length;
    bytes.set(ref, offset);
    offset += ref.length;
    bytes.set(topic, offset);
    offset += topic.length;
    bytes.set(userEvent, offset);
    offset += userEvent.length;
    bytes.set(metadata, offset);
    offset += metadata.length;
    var combined = new Uint8Array(header.byteLength + encodedPayload.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(encodedPayload), header.byteLength);
    return combined.buffer;
  }
  decode(rawPayload, callback) {
    if (this._isArrayBuffer(rawPayload)) {
      let result = this._binaryDecode(rawPayload);
      return callback(result);
    }
    if (typeof rawPayload === "string") {
      const jsonPayload = JSON.parse(rawPayload);
      const [join_ref, ref, topic, event, payload] = jsonPayload;
      return callback({ join_ref, ref, topic, event, payload });
    }
    return callback({});
  }
  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const kind = view.getUint8(0);
    const decoder = new TextDecoder();
    switch (kind) {
      case this.KINDS.userBroadcast:
        return this._decodeUserBroadcast(buffer, view, decoder);
    }
  }
  _decodeUserBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const userEventSize = view.getUint8(2);
    const metadataSize = view.getUint8(3);
    const payloadEncoding = view.getUint8(4);
    let offset = this.HEADER_LENGTH + 4;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const userEvent = decoder.decode(buffer.slice(offset, offset + userEventSize));
    offset = offset + userEventSize;
    const metadata = decoder.decode(buffer.slice(offset, offset + metadataSize));
    offset = offset + metadataSize;
    const payload = buffer.slice(offset, buffer.byteLength);
    const parsedPayload = payloadEncoding === this.JSON_ENCODING ? JSON.parse(decoder.decode(payload)) : payload;
    const data = {
      type: this.BROADCAST_EVENT,
      event: userEvent,
      payload: parsedPayload
    };
    if (metadataSize > 0) {
      data["meta"] = JSON.parse(metadata);
    }
    return { join_ref: null, ref: null, topic, event: this.BROADCAST_EVENT, payload: data };
  }
  _isArrayBuffer(buffer) {
    var _a;
    return buffer instanceof ArrayBuffer || ((_a = buffer === null || buffer === void 0 ? void 0 : buffer.constructor) === null || _a === void 0 ? void 0 : _a.name) === "ArrayBuffer";
  }
  _pick(obj, keys) {
    if (!obj || typeof obj !== "object") {
      return {};
    }
    return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
var PostgresTypes;
(function(PostgresTypes2) {
  PostgresTypes2["abstime"] = "abstime";
  PostgresTypes2["bool"] = "bool";
  PostgresTypes2["date"] = "date";
  PostgresTypes2["daterange"] = "daterange";
  PostgresTypes2["float4"] = "float4";
  PostgresTypes2["float8"] = "float8";
  PostgresTypes2["int2"] = "int2";
  PostgresTypes2["int4"] = "int4";
  PostgresTypes2["int4range"] = "int4range";
  PostgresTypes2["int8"] = "int8";
  PostgresTypes2["int8range"] = "int8range";
  PostgresTypes2["json"] = "json";
  PostgresTypes2["jsonb"] = "jsonb";
  PostgresTypes2["money"] = "money";
  PostgresTypes2["numeric"] = "numeric";
  PostgresTypes2["oid"] = "oid";
  PostgresTypes2["reltime"] = "reltime";
  PostgresTypes2["text"] = "text";
  PostgresTypes2["time"] = "time";
  PostgresTypes2["timestamp"] = "timestamp";
  PostgresTypes2["timestamptz"] = "timestamptz";
  PostgresTypes2["timetz"] = "timetz";
  PostgresTypes2["tsrange"] = "tsrange";
  PostgresTypes2["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
var convertChangeData = (columns, record, options = {}) => {
  var _a;
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  if (!record) {
    return {};
  }
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
var convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find((x) => x.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }
  return noop(value);
};
var convertCell = (type, value) => {
  if (type.charAt(0) === "_") {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  }
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);
    case PostgresTypes.timestamp:
      return toTimestampString(value);
    // Format to be consistent with PostgREST
    case PostgresTypes.abstime:
    // To allow users to cast it based on Timezone
    case PostgresTypes.date:
    // To allow users to cast it based on Timezone
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime:
    // To allow users to cast it based on Timezone
    case PostgresTypes.text:
    case PostgresTypes.time:
    // To allow users to cast it based on Timezone
    case PostgresTypes.timestamptz:
    // To allow users to cast it based on Timezone
    case PostgresTypes.timetz:
    // To allow users to cast it based on Timezone
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop(value);
    default:
      return noop(value);
  }
};
var noop = (value) => {
  return value;
};
var toBoolean = (value) => {
  switch (value) {
    case "t":
      return true;
    case "f":
      return false;
    default:
      return value;
  }
};
var toNumber = (value) => {
  if (typeof value === "string") {
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};
var toJson = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (_a) {
      return value;
    }
  }
  return value;
};
var toArray = (value, type) => {
  if (typeof value !== "string") {
    return value;
  }
  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0];
  if (openBrace === "{" && closeBrace === "}") {
    let arr;
    const valTrim = value.slice(1, lastIdx);
    try {
      arr = JSON.parse("[" + valTrim + "]");
    } catch (_) {
      arr = valTrim ? valTrim.split(",") : [];
    }
    return arr.map((val) => convertCell(type, val));
  }
  return value;
};
var toTimestampString = (value) => {
  if (typeof value === "string") {
    return value.replace(" ", "T");
  }
  return value;
};
var httpEndpointURL = (socketUrl) => {
  const wsUrl = new URL(socketUrl);
  wsUrl.protocol = wsUrl.protocol.replace(/^ws/i, "http");
  wsUrl.pathname = wsUrl.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, "");
  if (wsUrl.pathname === "" || wsUrl.pathname === "/") {
    wsUrl.pathname = "/api/broadcast";
  } else {
    wsUrl.pathname = wsUrl.pathname + "/api/broadcast";
  }
  return wsUrl.href;
};

// node_modules/@supabase/phoenix/priv/static/phoenix.mjs
var closure = (value) => {
  if (typeof value === "function") {
    return (
      /** @type {() => T} */
      value
    );
  } else {
    let closure2 = function() {
      return value;
    };
    return closure2;
  }
};
var globalSelf = typeof self !== "undefined" ? self : null;
var phxWindow = typeof window !== "undefined" ? window : null;
var global2 = globalSelf || phxWindow || globalThis;
var DEFAULT_VSN2 = "2.0.0";
var DEFAULT_TIMEOUT2 = 1e4;
var WS_CLOSE_NORMAL = 1e3;
var MAX_LONGPOLL_BATCH_SIZE = 100;
var SOCKET_STATES = (
  /** @type {const} */
  { connecting: 0, open: 1, closing: 2, closed: 3 }
);
var CHANNEL_STATES2 = (
  /** @type {const} */
  {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  }
);
var CHANNEL_EVENTS2 = (
  /** @type {const} */
  {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  }
);
var TRANSPORTS = (
  /** @type {const} */
  {
    longpoll: "longpoll",
    websocket: "websocket"
  }
);
var XHR_STATES = (
  /** @type {const} */
  {
    complete: 4
  }
);
var AUTH_TOKEN_PREFIX = "base64url.bearer.phx.";
var Push = class {
  /**
   * Initializes the Push
   * @param {Channel} channel - The Channel
   * @param {ChannelEvent} event - The event, for example `"phx_join"`
   * @param {() => Record<string, unknown>} payload - The payload, for example `{user_id: 123}`
   * @param {number} timeout - The push timeout in milliseconds
   */
  constructor(channel, event, payload, timeout) {
    this.channel = channel;
    this.event = event;
    this.payload = payload || function() {
      return {};
    };
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
    this.ref = void 0;
  }
  /**
   *
   * @param {number} timeout
   */
  resend(timeout) {
    this.timeout = timeout;
    this.reset();
    this.send();
  }
  /**
   *
   */
  send() {
    if (this.hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload(),
      ref: this.ref,
      join_ref: this.channel.joinRef()
    });
  }
  /**
   *
   * @param {string} status
   * @param {(response: any) => void} callback
   */
  receive(status, callback) {
    if (this.hasReceived(status)) {
      callback(this.receivedResp.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  reset() {
    this.cancelRefEvent();
    this.ref = null;
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
  }
  destroy() {
    this.cancelRefEvent();
    this.cancelTimeout();
  }
  /**
   * @private
   */
  matchReceive({ status, response, _ref }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
  }
  /**
   * @private
   */
  cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel.off(this.refEvent);
  }
  cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      this.cancelTimeout();
    }
    this.ref = this.channel.socket.makeRef();
    this.refEvent = this.channel.replyEventName(this.ref);
    this.channel.on(this.refEvent, (payload) => {
      this.cancelRefEvent();
      this.cancelTimeout();
      this.receivedResp = payload;
      this.matchReceive(payload);
    });
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  /**
   * @private
   */
  hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
  trigger(status, response) {
    this.channel.trigger(this.refEvent, { status, response });
  }
};
var Timer = class {
  /**
  * @param {() => void} callback
  * @param {(tries: number) => number} timerCalc
  */
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = void 0;
    this.tries = 0;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  /**
   * Cancels any previous scheduleTimeout and schedules callback
   */
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
};
var Channel = class {
  /**
   * @param {string} topic
   * @param {Params | (() => Params)} params
   * @param {Socket} socket
   */
  constructor(topic, params, socket) {
    this.state = CHANNEL_STATES2.closed;
    this.topic = topic;
    this.params = closure(params || {});
    this.socket = socket;
    this.bindings = [];
    this.bindingRef = 0;
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS2.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.stateChangeRefs = [];
    this.rejoinTimer = new Timer(() => {
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }, this.socket.rejoinAfterMs);
    this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
    this.stateChangeRefs.push(
      this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      })
    );
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES2.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this.joinPush.receive("error", (reason) => {
      this.state = CHANNEL_STATES2.errored;
      if (this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason);
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.onClose(() => {
      this.rejoinTimer.reset();
      if (this.socket.hasLogger()) this.socket.log("channel", `close ${this.topic}`);
      this.state = CHANNEL_STATES2.closed;
      this.socket.remove(this);
    });
    this.onError((reason) => {
      if (this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason);
      if (this.isJoining()) {
        this.joinPush.reset();
      }
      this.state = CHANNEL_STATES2.errored;
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.joinPush.receive("timeout", () => {
      if (this.socket.hasLogger()) this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
      let leavePush = new Push(this, CHANNEL_EVENTS2.leave, closure({}), this.timeout);
      leavePush.send();
      this.state = CHANNEL_STATES2.errored;
      this.joinPush.reset();
      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.on(CHANNEL_EVENTS2.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
  }
  /**
   * Join the channel
   * @param {number} timeout
   * @returns {Push}
   */
  join(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
    } else {
      this.timeout = timeout;
      this.joinedOnce = true;
      this.rejoin();
      return this.joinPush;
    }
  }
  /**
   * Teardown the channel.
   *
   * Destroys and stops related timers.
   */
  teardown() {
    this.pushBuffer.forEach((push) => push.destroy());
    this.pushBuffer = [];
    this.rejoinTimer.reset();
    this.joinPush.destroy();
    this.state = CHANNEL_STATES2.closed;
    this.bindings = [];
  }
  /**
   * Hook into channel close
   * @param {ChannelBindingCallback} callback
   */
  onClose(callback) {
    this.on(CHANNEL_EVENTS2.close, callback);
  }
  /**
   * Hook into channel errors
   * @param {ChannelOnErrorCallback} callback
   * @return {number}
   */
  onError(callback) {
    return this.on(CHANNEL_EVENTS2.error, (reason) => callback(reason));
  }
  /**
   * Subscribes on channel events
   *
   * Subscription returns a ref counter, which can be used later to
   * unsubscribe the exact event listener
   *
   * @example
   * const ref1 = channel.on("event", do_stuff)
   * const ref2 = channel.on("event", do_other_stuff)
   * channel.off("event", ref1)
   * // Since unsubscription, do_stuff won't fire,
   * // while do_other_stuff will keep firing on the "event"
   *
   * @param {string} event
   * @param {ChannelBindingCallback} callback
   * @returns {number} ref
   */
  on(event, callback) {
    let ref = this.bindingRef++;
    this.bindings.push({ event, ref, callback });
    return ref;
  }
  /**
   * Unsubscribes off of channel events
   *
   * Use the ref returned from a channel.on() to unsubscribe one
   * handler, or pass nothing for the ref to unsubscribe all
   * handlers for the given event.
   *
   * @example
   * // Unsubscribe the do_stuff handler
   * const ref1 = channel.on("event", do_stuff)
   * channel.off("event", ref1)
   *
   * // Unsubscribe all handlers from event
   * channel.off("event")
   *
   * @param {string} event
   * @param {number} [ref]
   */
  off(event, ref) {
    this.bindings = this.bindings.filter((bind) => {
      return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
    });
  }
  /**
   * @private
   */
  canPush() {
    return this.socket.isConnected() && this.isJoined();
  }
  /**
   * Sends a message `event` to phoenix with the payload `payload`.
   * Phoenix receives this in the `handle_in(event, payload, socket)`
   * function. if phoenix replies or it times out (default 10000ms),
   * then optionally the reply can be received.
   *
   * @example
   * channel.push("event")
   *   .receive("ok", payload => console.log("phoenix replied:", payload))
   *   .receive("error", err => console.log("phoenix errored", err))
   *   .receive("timeout", () => console.log("timed out pushing"))
   * @param {string} event
   * @param {Object} payload
   * @param {number} [timeout]
   * @returns {Push}
   */
  push(event, payload, timeout = this.timeout) {
    payload = payload || {};
    if (!this.joinedOnce) {
      throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
    }
    let pushEvent = new Push(this, event, function() {
      return payload;
    }, timeout);
    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  /** Leaves the channel
   *
   * Unsubscribes from server events, and
   * instructs channel to terminate on server
   *
   * Triggers onClose() hooks
   *
   * To receive leave acknowledgements, use the `receive`
   * hook to bind to the server ack, ie:
   *
   * @example
   * channel.leave().receive("ok", () => alert("left!") )
   *
   * @param {number} timeout
   * @returns {Push}
   */
  leave(timeout = this.timeout) {
    this.rejoinTimer.reset();
    this.joinPush.cancelTimeout();
    this.state = CHANNEL_STATES2.leaving;
    let onClose = () => {
      if (this.socket.hasLogger()) this.socket.log("channel", `leave ${this.topic}`);
      this.trigger(CHANNEL_EVENTS2.close, "leave");
    };
    let leavePush = new Push(this, CHANNEL_EVENTS2.leave, closure({}), timeout);
    leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
    leavePush.send();
    if (!this.canPush()) {
      leavePush.trigger("ok", {});
    }
    return leavePush;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling
   * before dispatching to the channel callbacks.
   *
   * Must return the payload, modified or unmodified
   * @type{ChannelOnMessage}
   */
  onMessage(_event, payload, _ref) {
    return payload;
  }
  /**
   * Overridable filter hook
   *
   * If this function returns `true`, `binding`'s callback will be called.
   *
   * @type{ChannelFilterBindings}
   */
  filterBindings(_binding, _payload, _ref) {
    return true;
  }
  isMember(topic, event, payload, joinRef) {
    if (this.topic !== topic) {
      return false;
    }
    if (joinRef && joinRef !== this.joinRef()) {
      if (this.socket.hasLogger()) this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
      return false;
    } else {
      return true;
    }
  }
  joinRef() {
    return this.joinPush.ref;
  }
  /**
   * @private
   */
  rejoin(timeout = this.timeout) {
    if (this.isLeaving()) {
      return;
    }
    this.socket.leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES2.joining;
    this.joinPush.resend(timeout);
  }
  /**
   * @param {string} event
   * @param {unknown} [payload]
   * @param {?string} [ref]
   * @param {?string} [joinRef]
   */
  trigger(event, payload, ref, joinRef) {
    let handledPayload = this.onMessage(event, payload, ref, joinRef);
    if (payload && !handledPayload) {
      throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
    }
    let eventBindings = this.bindings.filter((bind) => bind.event === event && this.filterBindings(bind, payload, ref));
    for (let i = 0; i < eventBindings.length; i++) {
      let bind = eventBindings[i];
      bind.callback(handledPayload, ref, joinRef || this.joinRef());
    }
  }
  /**
  * @param {string} ref
  */
  replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  isClosed() {
    return this.state === CHANNEL_STATES2.closed;
  }
  isErrored() {
    return this.state === CHANNEL_STATES2.errored;
  }
  isJoined() {
    return this.state === CHANNEL_STATES2.joined;
  }
  isJoining() {
    return this.state === CHANNEL_STATES2.joining;
  }
  isLeaving() {
    return this.state === CHANNEL_STATES2.leaving;
  }
};
var Ajax = class {
  static request(method, endPoint, headers, body, timeout, ontimeout, callback) {
    if (global2.XDomainRequest) {
      let req = new global2.XDomainRequest();
      return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
    } else if (global2.XMLHttpRequest) {
      let req = new global2.XMLHttpRequest();
      return this.xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback);
    } else if (global2.fetch && global2.AbortController) {
      return this.fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback);
    } else {
      throw new Error("No suitable XMLHttpRequest implementation found");
    }
  }
  static fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback) {
    let options = {
      method,
      headers,
      body
    };
    let controller = null;
    if (timeout) {
      controller = new AbortController();
      const _timeoutId = setTimeout(() => controller.abort(), timeout);
      options.signal = controller.signal;
    }
    global2.fetch(endPoint, options).then((response) => response.text()).then((data) => this.parseJSON(data)).then((data) => callback && callback(data)).catch((err) => {
      if (err.name === "AbortError" && ontimeout) {
        ontimeout();
      } else {
        callback && callback(null);
      }
    });
    return controller;
  }
  static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
    req.timeout = timeout;
    req.open(method, endPoint);
    req.onload = () => {
      let response = this.parseJSON(req.responseText);
      callback && callback(response);
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }
    req.onprogress = () => {
    };
    req.send(body);
    return req;
  }
  static xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback) {
    req.open(method, endPoint, true);
    req.timeout = timeout;
    for (let [key, value] of Object.entries(headers)) {
      req.setRequestHeader(key, value);
    }
    req.onerror = () => callback && callback(null);
    req.onreadystatechange = () => {
      if (req.readyState === XHR_STATES.complete && callback) {
        let response = this.parseJSON(req.responseText);
        callback(response);
      }
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }
    req.send(body);
    return req;
  }
  static parseJSON(resp) {
    if (!resp || resp === "") {
      return null;
    }
    try {
      return JSON.parse(resp);
    } catch {
      console && console.log("failed to parse JSON response", resp);
      return null;
    }
  }
  static serialize(obj, parentKey) {
    let queryStr = [];
    for (var key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        continue;
      }
      let paramKey = parentKey ? `${parentKey}[${key}]` : key;
      let paramVal = obj[key];
      if (typeof paramVal === "object") {
        queryStr.push(this.serialize(paramVal, paramKey));
      } else {
        queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
      }
    }
    return queryStr.join("&");
  }
  static appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    let prefix = url.match(/\?/) ? "&" : "?";
    return `${url}${prefix}${this.serialize(params)}`;
  }
};
var arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
var LongPoll = class {
  constructor(endPoint, protocols) {
    if (protocols && protocols.length === 2 && protocols[1].startsWith(AUTH_TOKEN_PREFIX)) {
      this.authToken = atob(protocols[1].slice(AUTH_TOKEN_PREFIX.length));
    }
    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.reqs = /* @__PURE__ */ new Set();
    this.awaitingBatchAck = false;
    this.currentBatch = null;
    this.currentBatchTimer = null;
    this.batchBuffer = [];
    this.onopen = function() {
    };
    this.onerror = function() {
    };
    this.onmessage = function() {
    };
    this.onclose = function() {
    };
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;
    setTimeout(() => this.poll(), 0);
  }
  normalizeEndpoint(endPoint) {
    return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
  }
  endpointURL() {
    return Ajax.appendParams(this.pollEndpoint, { token: this.token });
  }
  closeAndRetry(code, reason, wasClean) {
    this.close(code, reason, wasClean);
    this.readyState = SOCKET_STATES.connecting;
  }
  ontimeout() {
    this.onerror("timeout");
    this.closeAndRetry(1005, "timeout", false);
  }
  isActive() {
    return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
  }
  poll() {
    const headers = { "Accept": "application/json" };
    if (this.authToken) {
      headers["X-Phoenix-AuthToken"] = this.authToken;
    }
    this.ajax("GET", headers, null, () => this.ontimeout(), (resp) => {
      if (resp) {
        var { status, token, messages } = resp;
        if (status === 410 && this.token !== null) {
          this.onerror(410);
          this.closeAndRetry(3410, "session_gone", false);
          return;
        }
        this.token = token;
      } else {
        status = 0;
      }
      switch (status) {
        case 200:
          messages.forEach((msg) => {
            setTimeout(() => this.onmessage({ data: msg }), 0);
          });
          this.poll();
          break;
        case 204:
          this.poll();
          break;
        case 410:
          this.readyState = SOCKET_STATES.open;
          this.onopen({});
          this.poll();
          break;
        case 403:
          this.onerror(403);
          this.close(1008, "forbidden", false);
          break;
        case 0:
        case 500:
          this.onerror(500);
          this.closeAndRetry(1011, "internal server error", 500);
          break;
        default:
          throw new Error(`unhandled poll status ${status}`);
      }
    });
  }
  // we collect all pushes within the current event loop by
  // setTimeout 0, which optimizes back-to-back procedural
  // pushes against an empty buffer
  send(body) {
    if (typeof body !== "string") {
      body = arrayBufferToBase64(body);
    }
    if (this.currentBatch) {
      this.currentBatch.push(body);
    } else if (this.awaitingBatchAck) {
      this.batchBuffer.push(body);
    } else {
      this.currentBatch = [body];
      this.currentBatchTimer = setTimeout(() => {
        this.batchSend(this.currentBatch);
        this.currentBatch = null;
      }, 0);
    }
  }
  batchSend(messages, offset = 0) {
    this.awaitingBatchAck = true;
    const next = offset + MAX_LONGPOLL_BATCH_SIZE;
    const batch = messages.slice(offset, next);
    this.ajax("POST", { "Content-Type": "application/x-ndjson" }, batch.join("\n"), () => this.onerror("timeout"), (resp) => {
      if (!resp || resp.status !== 200) {
        this.awaitingBatchAck = false;
        this.onerror(resp && resp.status);
        this.closeAndRetry(1011, "internal server error", false);
      } else if (next < messages.length) {
        this.batchSend(messages, next);
      } else if (this.batchBuffer.length > 0) {
        this.batchSend(this.batchBuffer);
        this.batchBuffer = [];
      } else {
        this.awaitingBatchAck = false;
      }
    });
  }
  close(code, reason, wasClean) {
    for (let req of this.reqs) {
      req.abort();
    }
    this.readyState = SOCKET_STATES.closed;
    let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
    this.batchBuffer = [];
    clearTimeout(this.currentBatchTimer);
    this.currentBatchTimer = null;
    if (typeof CloseEvent !== "undefined") {
      this.onclose(new CloseEvent("close", opts));
    } else {
      this.onclose(opts);
    }
  }
  ajax(method, headers, body, onCallerTimeout, callback) {
    let req;
    let ontimeout = () => {
      this.reqs.delete(req);
      onCallerTimeout();
    };
    req = Ajax.request(method, this.endpointURL(), headers, body, this.timeout, ontimeout, (resp) => {
      this.reqs.delete(req);
      if (this.isActive()) {
        callback(resp);
      }
    });
    this.reqs.add(req);
  }
};
var Presence = class _Presence {
  /**
   * Initializes the Presence
   * @param {Channel} channel - The Channel
   * @param {PresenceOptions} [opts] - The options, for example `{events: {state: "state", diff: "diff"}}`
   */
  constructor(channel, opts = {}) {
    let events = opts.events || /** @type {PresenceEvents} */
    { state: "presence_state", diff: "presence_diff" };
    this.state = /* @__PURE__ */ Object.create(null);
    this.pendingDiffs = [];
    this.channel = channel;
    this.joinRef = null;
    this.caller = {
      onJoin: function() {
      },
      onLeave: function() {
      },
      onSync: function() {
      }
    };
    this.channel.on(events.state, (newState) => {
      let { onJoin, onLeave, onSync } = this.caller;
      this.joinRef = this.channel.joinRef();
      this.state = _Presence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach((diff) => {
        this.state = _Presence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel.on(events.diff, (diff) => {
      let { onJoin, onLeave, onSync } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = _Presence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
  }
  /**
   * @param {PresenceOnJoin} callback
   */
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  /**
   * @param {PresenceOnLeave} callback
   */
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  /**
   * @param {PresenceOnSync} callback
   */
  onSync(callback) {
    this.caller.onSync = callback;
  }
  /**
   * Returns the array of presences, with selected metadata.
   *
   * @template [T=PresenceState]
   * @param {((key: string, obj: PresenceState) => T)} [by]
   *
   * @returns {T[]}
   */
  list(by) {
    return _Presence.list(this.state, by);
  }
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel.joinRef();
  }
  // lower-level public static API
  /**
   * Used to sync the list of presences on the server
   * with the client's state. An optional `onJoin` and `onLeave` callback can
   * be provided to react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @param {Record<string, PresenceState>} currentState
   * @param {Record<string, PresenceState>} newState
   * @param {PresenceOnJoin} onJoin
   * @param {PresenceOnLeave} onLeave
   *
   * @returns {Record<string, PresenceState>}
   */
  static syncState(currentState, newState, onJoin, onLeave) {
    let state2 = this.toNullProtoObj(this.clone(currentState));
    newState = this.toNullProtoObj(newState);
    let joins = /* @__PURE__ */ Object.create(null);
    let leaves = /* @__PURE__ */ Object.create(null);
    this.map(state2, (key, presence) => {
      if (!newState[key]) {
        leaves[key] = presence;
      }
    });
    this.map(newState, (key, newPresence) => {
      let currentPresence = state2[key];
      if (currentPresence) {
        let newRefs = newPresence.metas.map((m) => m.phx_ref);
        let curRefs = currentPresence.metas.map((m) => m.phx_ref);
        let joinedMetas = newPresence.metas.filter((m) => curRefs.indexOf(m.phx_ref) < 0);
        let leftMetas = currentPresence.metas.filter((m) => newRefs.indexOf(m.phx_ref) < 0);
        if (joinedMetas.length > 0) {
          joins[key] = newPresence;
          joins[key].metas = joinedMetas;
        }
        if (leftMetas.length > 0) {
          leaves[key] = this.clone(currentPresence);
          leaves[key].metas = leftMetas;
        }
      } else {
        joins[key] = newPresence;
      }
    });
    return this.syncDiff(state2, { joins, leaves }, onJoin, onLeave);
  }
  /**
   *
   * Used to sync a diff of presence join and leave
   * events from the server, as they happen. Like `syncState`, `syncDiff`
   * accepts optional `onJoin` and `onLeave` callbacks to react to a user
   * joining or leaving from a device.
   *
   * @param {Record<string, PresenceState>} state
   * @param {PresenceDiff} diff
   * @param {PresenceOnJoin} onJoin
   * @param {PresenceOnLeave} onLeave
   *
   * @returns {Record<string, PresenceState>}
   */
  static syncDiff(state2, diff, onJoin, onLeave) {
    state2 = this.toNullProtoObj(state2);
    let { joins, leaves } = this.clone(diff);
    if (!onJoin) {
      onJoin = function() {
      };
    }
    if (!onLeave) {
      onLeave = function() {
      };
    }
    this.map(joins, (key, newPresence) => {
      let currentPresence = state2[key];
      state2[key] = this.clone(newPresence);
      if (currentPresence) {
        let joinedRefs = state2[key].metas.map((m) => m.phx_ref);
        let curMetas = currentPresence.metas.filter((m) => joinedRefs.indexOf(m.phx_ref) < 0);
        state2[key].metas.unshift(...curMetas);
      }
      onJoin(key, currentPresence, newPresence);
    });
    this.map(leaves, (key, leftPresence) => {
      let currentPresence = state2[key];
      if (!currentPresence) {
        return;
      }
      let refsToRemove = leftPresence.metas.map((m) => m.phx_ref);
      currentPresence.metas = currentPresence.metas.filter((p) => {
        return refsToRemove.indexOf(p.phx_ref) < 0;
      });
      onLeave(key, currentPresence, leftPresence);
      if (currentPresence.metas.length === 0) {
        delete state2[key];
      }
    });
    return state2;
  }
  /**
   * Returns the array of presences, with selected metadata.
   *
   * @template [T=PresenceState]
   * @param {Record<string, PresenceState>} presences
   * @param {((key: string, obj: PresenceState) => T)} [chooser]
   *
   * @returns {T[]}
   */
  static list(presences, chooser) {
    if (!chooser) {
      chooser = function(key, pres) {
        return pres;
      };
    }
    return this.map(presences, (key, presence) => {
      return chooser(key, presence);
    });
  }
  // private
  /**
  * @template T
  * @param {Record<string, PresenceState>} obj
  * @param {(key: string, obj: PresenceState) => T} func
  */
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
  }
  // Presence keys are chosen on the server and may collide with
  // Object.prototype properties ("__proto__", "constructor", ...), so any
  // object indexed by presence key must not have a prototype chain
  //
  // TODO: replace the null-prototype objects with Maps in Phoenix 2.0
  // (breaking change for the lower-level static API)
  static toNullProtoObj(obj) {
    if (Object.getPrototypeOf(obj) === null) {
      return obj;
    }
    let cleaned = /* @__PURE__ */ Object.create(null);
    Object.getOwnPropertyNames(obj).forEach((key) => {
      cleaned[key] = obj[key];
    });
    return cleaned;
  }
  /**
  * @template T
  * @param {T} obj
  * @returns {T}
  */
  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};
var serializer_default = {
  HEADER_LENGTH: 1,
  META_LENGTH: 4,
  KINDS: { push: 0, reply: 1, broadcast: 2 },
  /**
  * @template T
  * @param {Message<Record<string, any>>} msg
  * @param {(msg: ArrayBuffer | string) => T} callback
  * @returns {T}
  */
  encode(msg, callback) {
    if (msg.payload.constructor === ArrayBuffer) {
      return callback(this.binaryEncode(msg));
    } else {
      let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
      return callback(JSON.stringify(payload));
    }
  },
  /**
  * @template T
  * @param {ArrayBuffer | string} rawPayload
  * @param {(msg: Message<unknown>) => T} callback
  * @returns {T}
  */
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this.binaryDecode(rawPayload));
    } else {
      let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
      return callback({ join_ref, ref, topic, event, payload });
    }
  },
  /** @private */
  binaryEncode(message) {
    let { join_ref, ref, event, topic, payload } = message;
    let encoder = new TextEncoder();
    let joinRefBytes = encoder.encode(join_ref);
    let refBytes = encoder.encode(ref);
    let topicBytes = encoder.encode(topic);
    let eventBytes = encoder.encode(event);
    this.assertFieldSize(joinRefBytes.byteLength, "join_ref");
    this.assertFieldSize(refBytes.byteLength, "ref");
    this.assertFieldSize(topicBytes.byteLength, "topic");
    this.assertFieldSize(eventBytes.byteLength, "event");
    let metaLength = this.META_LENGTH + joinRefBytes.byteLength + refBytes.byteLength + topicBytes.byteLength + eventBytes.byteLength;
    let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
    let headerBytes = new Uint8Array(header);
    let view = new DataView(header);
    let offset = 0;
    view.setUint8(offset++, this.KINDS.push);
    view.setUint8(offset++, joinRefBytes.byteLength);
    view.setUint8(offset++, refBytes.byteLength);
    view.setUint8(offset++, topicBytes.byteLength);
    view.setUint8(offset++, eventBytes.byteLength);
    headerBytes.set(joinRefBytes, offset);
    offset += joinRefBytes.byteLength;
    headerBytes.set(refBytes, offset);
    offset += refBytes.byteLength;
    headerBytes.set(topicBytes, offset);
    offset += topicBytes.byteLength;
    headerBytes.set(eventBytes, offset);
    offset += eventBytes.byteLength;
    var combined = new Uint8Array(header.byteLength + payload.byteLength);
    combined.set(headerBytes, 0);
    combined.set(new Uint8Array(payload), header.byteLength);
    return combined.buffer;
  },
  assertFieldSize(size, name) {
    if (size > 255) {
      throw new Error(`unable to convert ${name} to binary: must be less than or equal to 255 bytes, but is ${size} bytes`);
    }
  },
  /**
  * @private
  */
  binaryDecode(buffer) {
    let view = new DataView(buffer);
    let kind = view.getUint8(0);
    let decoder = new TextDecoder();
    switch (kind) {
      case this.KINDS.push:
        return this.decodePush(buffer, view, decoder);
      case this.KINDS.reply:
        return this.decodeReply(buffer, view, decoder);
      case this.KINDS.broadcast:
        return this.decodeBroadcast(buffer, view, decoder);
    }
  },
  /** @private */
  decodePush(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let topicSize = view.getUint8(2);
    let eventSize = view.getUint8(3);
    let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return { join_ref: joinRef, ref: null, topic, event, payload: data };
  },
  /** @private */
  decodeReply(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let refSize = view.getUint8(2);
    let topicSize = view.getUint8(3);
    let eventSize = view.getUint8(4);
    let offset = this.HEADER_LENGTH + this.META_LENGTH;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let ref = decoder.decode(buffer.slice(offset, offset + refSize));
    offset = offset + refSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    let payload = { status: event, response: data };
    return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS2.reply, payload };
  },
  /** @private */
  decodeBroadcast(buffer, view, decoder) {
    let topicSize = view.getUint8(1);
    let eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return { join_ref: null, ref: null, topic, event, payload: data };
  }
};
var Socket = class {
  /** Initializes the Socket *
   *
   * For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
   *
   * @constructor
   * @param {string} endPoint - The string WebSocket endpoint, ie, `"ws://example.com/socket"`,
   *                                               `"wss://example.com"`
   *                                               `"/socket"` (inherited host & protocol)
   * @param {SocketOptions} [opts] - Optional configuration
   */
  constructor(endPoint, opts = {}) {
    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.fallbackRef = null;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT2;
    this.transport = opts.transport || global2.WebSocket || LongPoll;
    this.conn = void 0;
    this.primaryPassedHealthCheck = false;
    this.longPollFallbackMs = opts.longPollFallbackMs;
    this.fallbackTimer = null;
    let envSessionStorage = null;
    try {
      envSessionStorage = global2 && global2.sessionStorage;
    } catch {
    }
    this.sessionStore = opts.sessionStorage || envSessionStorage;
    this.establishedConnections = 0;
    this.defaultEncoder = serializer_default.encode.bind(serializer_default);
    this.defaultDecoder = serializer_default.decode.bind(serializer_default);
    this.closeWasClean = true;
    this.disconnecting = false;
    this.binaryType = opts.binaryType || "arraybuffer";
    this.connectClock = 1;
    this.pageHidden = false;
    this.encode = void 0;
    this.decode = void 0;
    if (this.transport !== LongPoll) {
      this.encode = opts.encode || this.defaultEncoder;
      this.decode = opts.decode || this.defaultDecoder;
    } else {
      this.encode = this.defaultEncoder;
      this.decode = this.defaultDecoder;
    }
    let awaitingConnectionOnPageShow = null;
    if (phxWindow && phxWindow.addEventListener) {
      phxWindow.addEventListener("pagehide", (_e) => {
        if (this.conn) {
          this.disconnect();
          awaitingConnectionOnPageShow = this.connectClock;
        }
      });
      phxWindow.addEventListener("pageshow", (_e) => {
        if (awaitingConnectionOnPageShow === this.connectClock) {
          awaitingConnectionOnPageShow = null;
          this.connect();
        }
      });
      phxWindow.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.pageHidden = true;
        } else {
          this.pageHidden = false;
          if (!this.isConnected() && !this.closeWasClean) {
            this.teardown(() => this.connect());
          }
        }
      });
    }
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
    this.autoSendHeartbeat = opts.autoSendHeartbeat ?? true;
    this.heartbeatCallback = opts.heartbeatCallback ?? (() => {
    });
    this.rejoinAfterMs = (tries) => {
      if (opts.rejoinAfterMs) {
        return opts.rejoinAfterMs(tries);
      } else {
        return [1e3, 2e3, 5e3][tries - 1] || 1e4;
      }
    };
    this.reconnectAfterMs = (tries) => {
      if (opts.reconnectAfterMs) {
        return opts.reconnectAfterMs(tries);
      } else {
        return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
      }
    };
    this.logger = opts.logger || null;
    if (!this.logger && opts.debug) {
      this.logger = (kind, msg, data) => {
        console.log(`${kind}: ${msg}`, data);
      };
    }
    this.longpollerTimeout = opts.longpollerTimeout || 2e4;
    this.params = closure(opts.params || {});
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.vsn = opts.vsn || DEFAULT_VSN2;
    this.heartbeatTimeoutTimer = null;
    this.heartbeatTimer = null;
    this.heartbeatSentAt = null;
    this.pendingHeartbeatRef = null;
    this.reconnectTimer = new Timer(() => {
      if (this.pageHidden) {
        this.log("Not reconnecting as page is hidden!");
        this.teardown();
        return;
      }
      this.teardown(async () => {
        if (opts.beforeReconnect) await opts.beforeReconnect();
        this.connect();
      });
    }, this.reconnectAfterMs);
    this.authToken = opts.authToken && closure(opts.authToken);
  }
  /**
   * Returns the LongPoll transport reference
   */
  getLongPollTransport() {
    return LongPoll;
  }
  /**
   * Disconnects and replaces the active transport
   *
   * @param {SocketTransport} newTransport - The new transport class to instantiate
   *
   */
  replaceTransport(newTransport) {
    this.connectClock++;
    this.closeWasClean = true;
    clearTimeout(this.fallbackTimer);
    this.reconnectTimer.reset();
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    this.transport = newTransport;
  }
  /**
   * Returns the socket protocol
   *
   * @returns {"wss" | "ws"}
   */
  protocol() {
    return location.protocol.match(/^https/) ? "wss" : "ws";
  }
  /**
   * The fully qualified socket url
   *
   * @returns {string}
   */
  endPointURL() {
    let uri = Ajax.appendParams(
      Ajax.appendParams(this.endPoint, this.params()),
      { vsn: this.vsn }
    );
    if (uri.charAt(0) !== "/") {
      return uri;
    }
    if (uri.charAt(1) === "/") {
      return `${this.protocol()}:${uri}`;
    }
    return `${this.protocol()}://${location.host}${uri}`;
  }
  /**
   * Disconnects the socket
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
   *
   * @param {() => void} [callback] - Optional callback which is called after socket is disconnected.
   * @param {number} [code] - A status code for disconnection (Optional).
   * @param {string} [reason] - A textual description of the reason to disconnect. (Optional)
   */
  disconnect(callback, code, reason) {
    this.connectClock++;
    this.disconnecting = true;
    this.closeWasClean = true;
    clearTimeout(this.fallbackTimer);
    this.reconnectTimer.reset();
    this.teardown(() => {
      this.disconnecting = false;
      callback && callback();
    }, code, reason);
  }
  /**
   * @param {Params} [params] - [DEPRECATED] The params to send when connecting, for example `{user_id: userToken}`
   *
   * Passing params to connect is deprecated; pass them in the Socket constructor instead:
   * `new Socket("/socket", {params: {user_id: userToken}})`.
   */
  connect(params) {
    if (params) {
      console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
      this.params = closure(params);
    }
    if (this.conn && !this.disconnecting) {
      return;
    }
    if (this.longPollFallbackMs && this.transport !== LongPoll) {
      this.connectWithFallback(LongPoll, this.longPollFallbackMs);
    } else {
      this.transportConnect();
    }
  }
  /**
   * Logs the message. Override `this.logger` for specialized logging. noops by default
   * @param {string} kind
   * @param {string} msg
   * @param {Object} data
   */
  log(kind, msg, data) {
    this.logger && this.logger(kind, msg, data);
  }
  /**
   * Returns true if a logger has been set on this socket.
   */
  hasLogger() {
    return this.logger !== null;
  }
  /**
   * Registers callbacks for connection open events
   *
   * @example socket.onOpen(function(){ console.info("the socket was opened") })
   *
   * @param {SocketOnOpen} callback
   */
  onOpen(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.open.push([ref, callback]);
    return ref;
  }
  /**
   * Registers callbacks for connection close events
   * @param {SocketOnClose} callback
   * @returns {string}
   */
  onClose(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.close.push([ref, callback]);
    return ref;
  }
  /**
   * Registers callbacks for connection error events
   *
   * @example socket.onError(function(error){ alert("An error occurred") })
   *
   * @param {SocketOnError} callback
   * @returns {string}
   */
  onError(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.error.push([ref, callback]);
    return ref;
  }
  /**
   * Registers callbacks for connection message events
   * @param {SocketOnMessage} callback
   * @returns {string}
   */
  onMessage(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.message.push([ref, callback]);
    return ref;
  }
  /**
   * Sets a callback that receives lifecycle events for internal heartbeat messages.
   * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
   * @param {HeartbeatCallback} callback
   */
  onHeartbeat(callback) {
    this.heartbeatCallback = callback;
  }
  /**
   * Pings the server and invokes the callback with the RTT in milliseconds
   * @param {(timeDelta: number) => void} callback
   *
   * Returns true if the ping was pushed or false if unable to be pushed.
   */
  ping(callback) {
    if (!this.isConnected()) {
      return false;
    }
    let ref = this.makeRef();
    let startTime = Date.now();
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
    let onMsgRef = this.onMessage((msg) => {
      if (msg.ref === ref) {
        this.off([onMsgRef]);
        callback(Date.now() - startTime);
      }
    });
    return true;
  }
  /**
   * @private
   *
   * @param {Function}
   */
  transportName(transport) {
    switch (transport) {
      case LongPoll:
        return "LongPoll";
      default:
        return transport.name;
    }
  }
  /**
   * @private
   */
  transportConnect() {
    this.connectClock++;
    this.closeWasClean = false;
    let protocols = void 0;
    if (this.authToken) {
      protocols = ["phoenix", `${AUTH_TOKEN_PREFIX}${btoa(this.authToken()).replace(/=/g, "")}`];
    }
    this.conn = new this.transport(this.endPointURL(), protocols);
    this.conn.binaryType = this.binaryType;
    this.conn.timeout = this.longpollerTimeout;
    this.conn.onopen = () => this.onConnOpen();
    this.conn.onerror = (error) => this.onConnError(error);
    this.conn.onmessage = (event) => this.onConnMessage(event);
    this.conn.onclose = (event) => this.onConnClose(event);
  }
  getSession(key) {
    return this.sessionStore && this.sessionStore.getItem(key);
  }
  storeSession(key, val) {
    this.sessionStore && this.sessionStore.setItem(key, val);
  }
  connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
    clearTimeout(this.fallbackTimer);
    let established = false;
    let primaryTransport = true;
    let openRef, errorRef;
    let fallbackTransportName = this.transportName(fallbackTransport);
    let fallback = (reason) => {
      this.log("transport", `falling back to ${fallbackTransportName}...`, reason);
      this.off([openRef, errorRef]);
      primaryTransport = false;
      this.replaceTransport(fallbackTransport);
      this.transportConnect();
    };
    if (this.getSession(`phx:fallback:${fallbackTransportName}`)) {
      return fallback("memorized");
    }
    this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
    errorRef = this.onError((reason) => {
      this.log("transport", "error", reason);
      if (primaryTransport && !established) {
        clearTimeout(this.fallbackTimer);
        fallback(reason);
      }
    });
    if (this.fallbackRef) {
      this.off([this.fallbackRef]);
    }
    this.fallbackRef = this.onOpen(() => {
      established = true;
      if (!primaryTransport) {
        let fallbackTransportName2 = this.transportName(fallbackTransport);
        if (!this.primaryPassedHealthCheck) {
          this.storeSession(`phx:fallback:${fallbackTransportName2}`, "true");
        }
        return this.log("transport", `established ${fallbackTransportName2} fallback`);
      }
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      this.ping((rtt) => {
        this.log("transport", "connected to primary after", rtt);
        this.primaryPassedHealthCheck = true;
        clearTimeout(this.fallbackTimer);
      });
    });
    this.transportConnect();
  }
  clearHeartbeats() {
    clearTimeout(this.heartbeatTimer);
    clearTimeout(this.heartbeatTimeoutTimer);
  }
  onConnOpen() {
    if (this.hasLogger()) this.log("transport", `connected to ${this.endPointURL()}`);
    this.closeWasClean = false;
    this.disconnecting = false;
    this.establishedConnections++;
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    if (this.autoSendHeartbeat) {
      this.resetHeartbeat();
    }
    this.triggerStateCallbacks("open");
  }
  /**
   * @private
   */
  heartbeatTimeout() {
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.heartbeatSentAt = null;
      if (this.hasLogger()) {
        this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      }
      try {
        this.heartbeatCallback("timeout");
      } catch (e) {
        this.log("error", "error in heartbeat callback", e);
      }
      this.triggerChanError(new Error("heartbeat timeout"));
      this.closeWasClean = false;
      this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
    }
  }
  resetHeartbeat() {
    if (this.conn && this.conn.skipHeartbeat) {
      return;
    }
    this.pendingHeartbeatRef = null;
    this.clearHeartbeats();
    this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
  }
  teardown(callback, code, reason) {
    if (!this.conn) {
      return callback && callback();
    }
    const connToClose = this.conn;
    this.waitForBufferDone(connToClose, () => {
      if (code) {
        connToClose.close(code, reason || "");
      } else {
        connToClose.close();
      }
      this.waitForSocketClosed(connToClose, () => {
        if (this.conn === connToClose) {
          this.conn.onopen = function() {
          };
          this.conn.onerror = function() {
          };
          this.conn.onmessage = function() {
          };
          this.conn.onclose = function() {
          };
          this.conn = null;
        }
        callback && callback();
      });
    });
  }
  waitForBufferDone(conn, callback, tries = 1) {
    if (tries === 5 || !conn.bufferedAmount) {
      callback();
      return;
    }
    setTimeout(() => {
      this.waitForBufferDone(conn, callback, tries + 1);
    }, 150 * tries);
  }
  waitForSocketClosed(conn, callback, tries = 1) {
    if (tries === 5 || conn.readyState === SOCKET_STATES.closed) {
      callback();
      return;
    }
    setTimeout(() => {
      this.waitForSocketClosed(conn, callback, tries + 1);
    }, 150 * tries);
  }
  /**
  * @param {CloseEvent} event
  */
  onConnClose(event) {
    if (this.conn) this.conn.onclose = () => {
    };
    if (this.hasLogger()) this.log("transport", "close", event);
    this.triggerChanError(event);
    this.clearHeartbeats();
    if (!this.closeWasClean) {
      this.reconnectTimer.scheduleTimeout();
    }
    this.triggerStateCallbacks("close", event);
  }
  /**
   * @private
   * @param {Event} error
   */
  onConnError(error) {
    if (this.hasLogger()) this.log("transport", "error", error);
    let transportBefore = this.transport;
    let establishedBefore = this.establishedConnections;
    this.triggerStateCallbacks("error", error, transportBefore, establishedBefore);
    if (transportBefore === this.transport || establishedBefore > 0) {
      this.triggerChanError(error);
    }
  }
  /**
   * @private
   * @param {unknown} [reason] underlying close/error event forwarded to channel error listeners
   */
  triggerChanError(reason) {
    this.channels.forEach((channel) => {
      if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
        channel.trigger(CHANNEL_EVENTS2.error, reason);
      }
    });
  }
  /**
   * @returns {string}
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return "connecting";
      case SOCKET_STATES.open:
        return "open";
      case SOCKET_STATES.closing:
        return "closing";
      default:
        return "closed";
    }
  }
  /**
   * @returns {boolean}
   */
  isConnected() {
    return this.connectionState() === "open";
  }
  /**
   *
   * @param {Channel} channel
   */
  remove(channel) {
    this.off(channel.stateChangeRefs);
    this.channels = this.channels.filter((c) => c !== channel);
  }
  /**
   * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
   *
   * @param {string[]} refs - list of refs returned by calls to
   *                 `onOpen`, `onClose`, `onError,` and `onMessage`
   */
  off(refs) {
    for (let key in this.stateChangeCallbacks) {
      this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
        return refs.indexOf(ref) === -1;
      });
    }
  }
  /**
   * Initiates a new channel for the given topic
   *
   * @param {string} topic
   * @param {Params | (() => Params)} [chanParams]- Parameters for the channel
   * @returns {Channel}
   */
  channel(topic, chanParams = {}) {
    let chan = new Channel(topic, chanParams, this);
    this.channels.push(chan);
    return chan;
  }
  /**
   * @param {Message<Record<string, any>>} data
   */
  push(data) {
    if (this.hasLogger()) {
      let { topic, event, payload, ref, join_ref } = data;
      this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
    }
    if (this.isConnected()) {
      this.encode(data, (result) => this.conn.send(result));
    } else {
      this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
    }
  }
  /**
   * Return the next message ref, accounting for overflows
   * @returns {string}
   */
  makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  sendHeartbeat() {
    if (!this.isConnected()) {
      try {
        this.heartbeatCallback("disconnected");
      } catch (e) {
        this.log("error", "error in heartbeat callback", e);
      }
      return;
    }
    if (this.pendingHeartbeatRef) {
      this.heartbeatTimeout();
      return;
    }
    this.pendingHeartbeatRef = this.makeRef();
    this.heartbeatSentAt = Date.now();
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
    try {
      this.heartbeatCallback("sent");
    } catch (e) {
      this.log("error", "error in heartbeat callback", e);
    }
    this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
  }
  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  /**
  * @param {MessageEvent<any>} rawMessage
  */
  onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      let { topic, event, payload, ref, join_ref } = msg;
      if (ref && ref === this.pendingHeartbeatRef) {
        const latency = this.heartbeatSentAt ? Date.now() - this.heartbeatSentAt : void 0;
        this.clearHeartbeats();
        try {
          this.heartbeatCallback(payload.status === "ok" ? "ok" : "error", latency);
        } catch (e) {
          this.log("error", "error in heartbeat callback", e);
        }
        this.pendingHeartbeatRef = null;
        this.heartbeatSentAt = null;
        if (this.autoSendHeartbeat) {
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
      }
      if (this.hasLogger()) this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`.trim(), payload);
      for (let i = 0; i < this.channels.length; i++) {
        const channel = this.channels[i];
        if (!channel.isMember(topic, event, payload, join_ref)) {
          continue;
        }
        channel.trigger(event, payload, ref, join_ref);
      }
      this.triggerStateCallbacks("message", msg);
    });
  }
  /**
   * @private
   * @template {keyof SocketStateChangeCallbacks} K
   * @param {K} event
   * @param {...Parameters<SocketStateChangeCallbacks[K][number][1]>} args
   * @returns {void}
   */
  triggerStateCallbacks(event, ...args) {
    try {
      this.stateChangeCallbacks[event].forEach(([_, callback]) => {
        try {
          callback(...args);
        } catch (e) {
          this.log("error", `error in ${event} callback`, e);
        }
      });
    } catch (e) {
      this.log("error", `error triggering ${event} callbacks`, e);
    }
  }
  leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
    if (dupChannel) {
      if (this.hasLogger()) this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.leave();
    }
  }
};

// node_modules/@supabase/realtime-js/dist/module/phoenix/presenceAdapter.js
var PresenceAdapter = class _PresenceAdapter {
  constructor(channel, opts) {
    const phoenixOptions = phoenixPresenceOptions(opts);
    this.presence = new Presence(channel.getChannel(), phoenixOptions);
    this.presence.onJoin((key, currentPresence, newPresence) => {
      const onJoinPayload = _PresenceAdapter.onJoinPayload(key, currentPresence, newPresence);
      channel.getChannel().trigger("presence", onJoinPayload);
    });
    this.presence.onLeave((key, currentPresence, leftPresence) => {
      const onLeavePayload = _PresenceAdapter.onLeavePayload(key, currentPresence, leftPresence);
      channel.getChannel().trigger("presence", onLeavePayload);
    });
    this.presence.onSync(() => {
      channel.getChannel().trigger("presence", { event: "sync" });
    });
  }
  get state() {
    return _PresenceAdapter.transformState(this.presence.state);
  }
  /**
   * @private
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example Transform state
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   */
  static transformState(state2) {
    state2 = cloneState(state2);
    return Object.getOwnPropertyNames(state2).reduce((newState, key) => {
      const presences = state2[key];
      newState[key] = transformState(presences);
      return newState;
    }, {});
  }
  static onJoinPayload(key, currentPresence, newPresence) {
    const currentPresences = parseCurrentPresences(currentPresence);
    const newPresences = transformState(newPresence);
    return {
      event: "join",
      key,
      currentPresences,
      newPresences
    };
  }
  static onLeavePayload(key, currentPresence, leftPresence) {
    const currentPresences = parseCurrentPresences(currentPresence);
    const leftPresences = transformState(leftPresence);
    return {
      event: "leave",
      key,
      currentPresences,
      leftPresences
    };
  }
};
function transformState(presences) {
  return presences.metas.map((presence) => {
    const descriptors = Object.getOwnPropertyDescriptors(presence);
    const transformedPresence = Object.defineProperties({}, descriptors);
    transformedPresence["presence_ref"] = transformedPresence["phx_ref"];
    delete transformedPresence["phx_ref"];
    delete transformedPresence["phx_ref_prev"];
    return transformedPresence;
  });
}
function cloneState(state2) {
  return JSON.parse(JSON.stringify(state2));
}
function phoenixPresenceOptions(opts) {
  return (opts === null || opts === void 0 ? void 0 : opts.events) && { events: opts.events };
}
function parseCurrentPresences(currentPresences) {
  return (currentPresences === null || currentPresences === void 0 ? void 0 : currentPresences.metas) ? transformState(currentPresences) : [];
}

// node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
  REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
  REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
  REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
var RealtimePresence = class {
  get state() {
    return this.presenceAdapter.state;
  }
  /**
   * Creates a Presence helper that keeps the local presence state in sync with the server.
   *
   * @param channel - The realtime channel to bind to.
   * @param opts - Optional custom event names, e.g. `{ events: { state: 'state', diff: 'diff' } }`.
   *
   * @category Realtime
   *
   * @example Example for a presence channel
   * ```ts
   * const presence = new RealtimePresence(channel)
   *
   * channel.on('presence', ({ event, key }) => {
   *   console.log(`Presence ${event} on ${key}`)
   * })
   * ```
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.presenceAdapter = new PresenceAdapter(this.channel.channelAdapter, opts);
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/normalizeChannelError.js
function normalizeChannelError(reason) {
  if (reason instanceof Error) {
    return reason;
  }
  if (typeof reason === "string") {
    return new Error(reason);
  }
  if (reason && typeof reason === "object") {
    const obj = reason;
    if (typeof obj.code === "number") {
      const detail = typeof obj.reason === "string" && obj.reason ? ` (${obj.reason})` : "";
      return new Error(`socket closed: ${obj.code}${detail}`, { cause: reason });
    }
    return new Error("channel error: transport failure", { cause: reason });
  }
  return new Error("channel error: connection lost");
}

// node_modules/@supabase/realtime-js/dist/module/phoenix/channelAdapter.js
var ChannelAdapter = class {
  constructor(socket, topic, params) {
    const phoenixParams = phoenixChannelParams(params);
    this.channel = socket.getSocket().channel(topic, phoenixParams);
    this.socket = socket;
  }
  get state() {
    return this.channel.state;
  }
  set state(state2) {
    this.channel.state = state2;
  }
  get joinedOnce() {
    return this.channel.joinedOnce;
  }
  get joinPush() {
    return this.channel.joinPush;
  }
  get rejoinTimer() {
    return this.channel.rejoinTimer;
  }
  on(event, callback) {
    return this.channel.on(event, callback);
  }
  off(event, refNumber) {
    this.channel.off(event, refNumber);
  }
  subscribe(timeout) {
    return this.channel.join(timeout);
  }
  unsubscribe(timeout) {
    return this.channel.leave(timeout);
  }
  teardown() {
    this.channel.teardown();
  }
  onClose(callback) {
    this.channel.onClose(callback);
  }
  onError(callback) {
    return this.channel.onError(callback);
  }
  push(event, payload, timeout) {
    let push;
    try {
      push = this.channel.push(event, payload, timeout);
    } catch (error) {
      throw new Error(`tried to push '${event}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`);
    }
    if (this.channel.pushBuffer.length > MAX_PUSH_BUFFER_SIZE) {
      const removedPush = this.channel.pushBuffer.shift();
      removedPush.cancelTimeout();
      this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload());
    }
    return push;
  }
  updateJoinPayload(payload) {
    const oldPayload = this.channel.joinPush.payload();
    this.channel.joinPush.payload = () => Object.assign(Object.assign({}, oldPayload), payload);
  }
  canPush() {
    return this.socket.isConnected() && this.state === CHANNEL_STATES.joined;
  }
  isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
  updateFilterBindings(filterBindings) {
    this.channel.filterBindings = filterBindings;
  }
  updatePayloadTransform(callback) {
    this.channel.onMessage = callback;
  }
  /**
   * @internal
   */
  getChannel() {
    return this.channel;
  }
};
function phoenixChannelParams(options) {
  return {
    config: Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: "", enabled: false },
      private: false
    }, options.config)
  };
}

// node_modules/@supabase/realtime-js/dist/module/RealtimePostgresFilterBuilder.js
var PostgrestReservedCharsRegexp2 = /[,()"\\]/;
var needsQuoting = (value) => PostgrestReservedCharsRegexp2.test(value) || value !== value.trim();
var quote = (value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
var serializeScalar = (value) => {
  const serialized = value === null ? "null" : String(value);
  return needsQuoting(serialized) ? quote(serialized) : serialized;
};
var serializeIsValue = (value) => value === null ? "null" : String(value);
var serialize = (operator, value) => {
  if (operator === "in") {
    const values = Array.isArray(value) ? value : [value];
    if (values.length === 0) {
      throw new Error("Realtime `in` filter requires at least one value.");
    }
    const items = Array.from(new Set(values)).map((v) => serializeScalar(v)).join(",");
    return `in.(${items})`;
  }
  if (operator === "is") {
    return `is.${serializeIsValue(value)}`;
  }
  return `${operator}.${serializeScalar(value)}`;
};
var RealtimePostgresFilterBuilder = class {
  constructor() {
    this.filters = [];
  }
  add(column, operator, value, negate = false) {
    const prefix = negate ? "not." : "";
    this.filters.push(`${column}=${prefix}${serialize(operator, value)}`);
    return this;
  }
  /** Match rows where `column` equals `value` (`column=eq.value`). */
  eq(column, value) {
    return this.add(column, "eq", value);
  }
  /** Match rows where `column` does not equal `value` (`column=neq.value`). */
  neq(column, value) {
    return this.add(column, "neq", value);
  }
  /** Match rows where `column` is greater than `value` (`column=gt.value`). */
  gt(column, value) {
    return this.add(column, "gt", value);
  }
  /** Match rows where `column` is greater than or equal to `value` (`column=gte.value`). */
  gte(column, value) {
    return this.add(column, "gte", value);
  }
  /** Match rows where `column` is less than `value` (`column=lt.value`). */
  lt(column, value) {
    return this.add(column, "lt", value);
  }
  /** Match rows where `column` is less than or equal to `value` (`column=lte.value`). */
  lte(column, value) {
    return this.add(column, "lte", value);
  }
  /**
   * Match rows where `column` is one of `values` (`column=in.(a,b,c)`).
   * Requires at least one value; duplicates are removed. An element containing a
   * reserved character is double-quoted (`in.("a,b",c)`), so commas inside an
   * element are preserved. `null` is intentionally not accepted (`IN (null)`
   * never matches in SQL) — use `is`/`not('col','is',null)` for null checks.
   */
  in(column, values) {
    return this.add(column, "in", values);
  }
  /** Match rows where `column` matches the case-sensitive `pattern` (`column=like.pattern`). */
  like(column, pattern) {
    return this.add(column, "like", pattern);
  }
  /** Match rows where `column` matches the case-insensitive `pattern` (`column=ilike.pattern`). */
  ilike(column, pattern) {
    return this.add(column, "ilike", pattern);
  }
  /** Match rows where `column` matches the POSIX regex `pattern` (`column=match.pattern`). */
  match(column, pattern) {
    return this.add(column, "match", pattern);
  }
  /** Match rows where `column` matches the case-insensitive POSIX regex `pattern` (`column=imatch.pattern`). */
  imatch(column, pattern) {
    return this.add(column, "imatch", pattern);
  }
  /**
   * Match rows where `column` `IS` the given value (`column=is.null`).
   * Accepts `null`, a boolean, or the keywords `'null' | 'true' | 'false' | 'unknown'`.
   */
  is(column, value) {
    return this.add(column, "is", value);
  }
  /** Match rows where `column` is distinct from `value` (`column=isdistinct.value`). NULL-safe inequality. */
  isDistinct(column, value) {
    return this.add(column, "isdistinct", value);
  }
  not(column, operator, value) {
    return this.add(column, operator, value, true);
  }
  /**
   * Serialize all conditions into the comma-separated (AND) filter string.
   *
   * Conditions are joined by commas, which the server applies as `AND`. A scalar
   * value (or single `in` element) that contains a reserved character — `,`,
   * `(`, `)`, `"`, `\` — or surrounding whitespace is double-quoted and escaped
   * the way PostgREST does, so commas inside a value are preserved rather than
   * read as a condition boundary.
   */
  build() {
    return this.filters.join(",");
  }
  /** Alias for {@link build}; lets the builder be used wherever a string is expected. */
  toString() {
    return this.build();
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function(REALTIME_LISTEN_TYPES2) {
  REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
  REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
  REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
  REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function(REALTIME_SUBSCRIBE_STATES2) {
  REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
  REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
  REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
  REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
var RealtimeChannel = class _RealtimeChannel {
  get state() {
    return this.channelAdapter.state;
  }
  set state(state2) {
    this.channelAdapter.state = state2;
  }
  get joinedOnce() {
    return this.channelAdapter.joinedOnce;
  }
  get timeout() {
    return this.socket.timeout;
  }
  get joinPush() {
    return this.channelAdapter.joinPush;
  }
  get rejoinTimer() {
    return this.channelAdapter.rejoinTimer;
  }
  /**
   * Creates a channel that can broadcast messages, sync presence, and listen to Postgres changes.
   *
   * The topic determines which realtime stream you are subscribing to. Config options let you
   * enable acknowledgement for broadcasts, presence tracking, or private channels.
   *
   * @category Realtime
   *
   * @example Using supabase-js (recommended)
   * ```ts
   * import { createClient } from '@supabase/supabase-js'
   *
   * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
   * const channel = supabase.channel('room1')
   * channel
   *   .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
   *   .subscribe()
   * ```
   *
   * @example Standalone import for bundle-sensitive environments
   * ```ts
   * import RealtimeClient from '@supabase/realtime-js'
   *
   * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
   *   params: { apikey: 'your-publishable-key' },
   * })
   * const channel = new RealtimeChannel('realtime:public:messages', { config: {} }, client)
   * ```
   */
  constructor(topic, params = { config: {} }, socket) {
    var _a, _b;
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = {};
    this.subTopic = topic.replace(/^realtime:/i, "");
    this.params.config = Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: "", enabled: false },
      private: false
    }, params.config);
    this.channelAdapter = new ChannelAdapter(this.socket.socketAdapter, topic, this.params);
    this.presence = new RealtimePresence(this);
    this._onClose(() => {
      this.socket._remove(this);
    });
    this._updateFilterTransform();
    this.broadcastEndpointURL = httpEndpointURL(this.socket.socketAdapter.endPointURL());
    this.private = this.params.config.private || false;
    if (!this.private && ((_b = (_a = this.params.config) === null || _a === void 0 ? void 0 : _a.broadcast) === null || _b === void 0 ? void 0 : _b.replay)) {
      throw new Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`);
    }
  }
  /**
   * Subscribe registers your client with the server.
   *
   * The optional `callback` receives a `status` and, on failure, an `err` argument.
   * Log the full `err` so its `cause`, `name`, and any structured fields aren't hidden
   * behind `err.message`.
   *
   * @category Realtime
   *
   * @example Handling errors
   * ```js
   * supabase.channel('room1').subscribe((status, err) => {
   *   if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
   *     // Log the full error: its `cause` often holds the underlying reason.
   *     console.error(status, err)
   *   }
   * })
   * ```
   */
  subscribe(callback, timeout = this.timeout) {
    var _a, _b, _c, _d;
    if (!this.socket.isConnected()) {
      this.socket.connect();
    }
    if (this.channelAdapter.isClosed()) {
      const { config: { broadcast, presence, private: isPrivate, postgres_changes_options } } = this.params;
      const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [];
      const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0 || ((_c = this.params.config.presence) === null || _c === void 0 ? void 0 : _c.enabled) === true;
      const accessTokenPayload = {};
      const config = Object.assign({ broadcast, presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }), postgres_changes, private: isPrivate }, postgres_changes_options ? { postgres_changes_options } : {});
      if (this.socket.accessTokenValue) {
        accessTokenPayload.access_token = this.socket.accessTokenValue;
      }
      this._onError((reason) => {
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, normalizeChannelError(reason));
      });
      this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
      this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
      this._updateFilterMessage();
      const joinTimeout = (postgres_changes_options === null || postgres_changes_options === void 0 ? void 0 : postgres_changes_options.wait) && postgres_changes.length > 0 ? Math.max(timeout, ((_d = postgres_changes_options.timeout) !== null && _d !== void 0 ? _d : DEFAULT_POSTGRES_CHANGES_WAIT_TIMEOUT) + POSTGRES_CHANGES_WAIT_ERROR_GRACE) : timeout;
      this.channelAdapter.subscribe(joinTimeout).receive("ok", async ({ postgres_changes: postgres_changes2 }) => {
        if (!this.socket._isManualToken()) {
          this.socket.setAuth();
        }
        if (postgres_changes2 === void 0) {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        }
        this._updatePostgresBindings(postgres_changes2, callback);
      }).receive("error", (error) => {
        this.state = CHANNEL_STATES.errored;
        const message = Object.values(error).join(", ") || "error";
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(message, { cause: error }));
      }).receive("timeout", () => {
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
      });
    }
    return this;
  }
  _updatePostgresBindings(postgres_changes, callback) {
    var _a;
    const clientPostgresBindings = this.bindings.postgres_changes;
    const bindingsLen = (_a = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a !== void 0 ? _a : 0;
    const newPostgresBindings = [];
    for (let i = 0; i < bindingsLen; i++) {
      const clientPostgresBinding = clientPostgresBindings[i];
      const { filter: { event, schema, table, filter: filter2 } } = clientPostgresBinding;
      const serverPostgresFilter = postgres_changes && postgres_changes[i];
      if (serverPostgresFilter && serverPostgresFilter.event === event && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.schema, schema) && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.table, table) && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.filter, filter2)) {
        newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
      } else {
        this.unsubscribe();
        this.state = CHANNEL_STATES.errored;
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
        return;
      }
    }
    this.bindings.postgres_changes = newPostgresBindings;
    if (this.state != CHANNEL_STATES.errored && callback) {
      callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
    }
  }
  /**
   * Returns the current presence state for this channel.
   *
   * The shape is a map keyed by presence key (for example a user id) where each entry contains the
   * tracked metadata for that user.
   *
   * @category Realtime
   */
  presenceState() {
    return this.presence.state;
  }
  /**
   * Sends the supplied payload to the presence tracker so other subscribers can see that this
   * client is online. Use `untrack` to stop broadcasting presence for the same key.
   *
   * Tracking makes this client visible to other subscribers immediately, regardless of this
   * channel's `config.presence.enabled` setting or whether it has a `presence` listener — that
   * flag only affects whether *this* client receives presence updates from others (and, on
   * RLS-protected channels, whether it's authorized to do so).
   *
   * @category Realtime
   */
  async track(payload, opts = {}) {
    return await this.send({
      type: "presence",
      event: "track",
      payload
    }, opts);
  }
  /**
   * Removes the current presence state for this client.
   *
   * @category Realtime
   */
  async untrack(opts = {}) {
    return await this.send({
      type: "presence",
      event: "untrack"
    }, opts);
  }
  /**
   * Listen to realtime events on this channel.
   * @category Realtime
   *
   * @remarks
   * - By default, Broadcast and Presence are enabled for all projects.
   * - By default, listening to database changes is disabled for new projects due to database performance and security concerns. You can turn it on by managing Realtime's [replication](/docs/guides/api#realtime-api-overview).
   * - You can receive the "previous" data for updates and deletes by setting the table's `REPLICA IDENTITY` to `FULL` (e.g., `ALTER TABLE your_table REPLICA IDENTITY FULL;`).
   * - Row level security is not applied to delete statements. When RLS is enabled and replica identity is set to full, only the primary key is sent to clients.
   *
   * @example Listen to broadcast messages
   * ```js
   * const channel = supabase.channel("room1")
   *
   * channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
   *   console.log("Cursor position received!", payload);
   * }).subscribe((status) => {
   *   if (status === "SUBSCRIBED") {
   *     channel.send({
   *       type: "broadcast",
   *       event: "cursor-pos",
   *       payload: { x: Math.random(), y: Math.random() },
   *     });
   *   }
   * });
   * ```
   *
   * @example Listen to presence sync
   * ```js
   * const channel = supabase.channel('room1')
   * channel
   *   .on('presence', { event: 'sync' }, () => {
   *     console.log('Synced presence state: ', channel.presenceState())
   *   })
   *   .subscribe(async (status) => {
   *     if (status === 'SUBSCRIBED') {
   *       await channel.track({ online_at: new Date().toISOString() })
   *     }
   *   })
   * ```
   *
   * @example Listen to presence join
   * ```js
   * const channel = supabase.channel('room1')
   * channel
   *   .on('presence', { event: 'join' }, ({ newPresences }) => {
   *     console.log('Newly joined presences: ', newPresences)
   *   })
   *   .subscribe(async (status) => {
   *     if (status === 'SUBSCRIBED') {
   *       await channel.track({ online_at: new Date().toISOString() })
   *     }
   *   })
   * ```
   *
   * @example Listen to presence leave
   * ```js
   * const channel = supabase.channel('room1')
   * channel
   *   .on('presence', { event: 'leave' }, ({ leftPresences }) => {
   *     console.log('Newly left presences: ', leftPresences)
   *   })
   *   .subscribe(async (status) => {
   *     if (status === 'SUBSCRIBED') {
   *       await channel.track({ online_at: new Date().toISOString() })
   *       await channel.untrack()
   *     }
   *   })
   * ```
   *
   * Registering the same `postgres_changes` filter more than once on a channel is a no-op: the
   * duplicate is ignored and an error is logged, since the server only ever creates one
   * subscription per distinct filter.
   *
   * @example Listen to all database changes
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: '*', schema: '*' }, payload => {
   *     console.log('Change received!', payload)
   *   })
   *   .subscribe()
   * ```
   *
   * @example Listen to a specific table
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: '*', schema: 'public', table: 'countries' }, payload => {
   *     console.log('Change received!', payload)
   *   })
   *   .subscribe()
   * ```
   *
   * @example Listen to inserts
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, payload => {
   *     console.log('Change received!', payload)
   *   })
   *   .subscribe()
   * ```
   *
   * @exampleDescription Listen to updates
   * By default, Supabase will send only the updated record. If you want to receive the previous values as well you can
   * enable full replication for the table you are listening to:
   *
   * ```sql
   * alter table "your_table" replica identity full;
   * ```
   *
   * @example Listen to updates
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
   *     console.log('Change received!', payload)
   *   })
   *   .subscribe()
   * ```
   *
   * @exampleDescription Listen to deletes
   * By default, Supabase does not send deleted records. If you want to receive the deleted record you can
   * enable full replication for the table you are listening to:
   *
   * ```sql
   * alter table "your_table" replica identity full;
   * ```
   *
   * @example Listen to deletes
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, payload => {
   *     console.log('Change received!', payload)
   *   })
   *   .subscribe()
   * ```
   *
   * @exampleDescription Listen to multiple events
   * You can chain listeners if you want to listen to multiple events for each table.
   *
   * @example Listen to multiple events
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleRecordInserted)
   *   .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, handleRecordDeleted)
   *   .subscribe()
   * ```
   *
   * @exampleDescription Listen to row level changes
   * You can listen to individual rows using the format `{table}:{col}=eq.{val}` - where `{col}` is the column name, and `{val}` is the value which you want to match.
   *
   * @example Listen to row level changes
   * ```js
   * supabase
   *   .channel('room1')
   *   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries', filter: 'id=eq.200' }, handleRecordUpdated)
   *   .subscribe()
   * ```
   */
  on(type, filter2, callback) {
    const stateCheck = this.channelAdapter.isJoined() || this.channelAdapter.isJoining();
    const typeCheck = type === REALTIME_LISTEN_TYPES.PRESENCE || type === REALTIME_LISTEN_TYPES.POSTGRES_CHANGES;
    if (stateCheck && typeCheck) {
      this.socket.log("channel", `cannot add \`${type}\` callbacks for ${this.topic} after \`subscribe()\`.`);
      throw new Error(`cannot add \`${type}\` callbacks for ${this.topic} after \`subscribe()\`.`);
    }
    return this._on(type, filter2, callback);
  }
  /**
   * Sends a broadcast message explicitly via REST API.
   *
   * This method always uses the REST API endpoint regardless of WebSocket connection state.
   * Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
   *
   * Payloads that are `ArrayBuffer` or `ArrayBufferView` (e.g. `Uint8Array`) are sent as
   * `application/octet-stream`; all other payloads are JSON-encoded.
   *
   * @param event The name of the broadcast event
   * @param payload Payload to be sent (required)
   * @param opts Options including timeout
   * @returns Promise resolving to object with success status, and error details if failed
   *
   * @category Realtime
   */
  async httpSend(event, payload, opts = {}) {
    var _a;
    if (payload === void 0 || payload === null) {
      return Promise.reject(new Error("Payload is required for httpSend()"));
    }
    const isBinary = payload instanceof ArrayBuffer || ArrayBuffer.isView(payload);
    const headers = {
      apikey: this.socket.apiKey ? this.socket.apiKey : "",
      "Content-Type": isBinary ? "application/octet-stream" : "application/json"
    };
    if (this.socket.accessTokenValue) {
      headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
    }
    const url = new URL(this.broadcastEndpointURL);
    url.pathname += `/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(event)}`;
    if (this.private) {
      url.searchParams.set("private", "true");
    }
    const options = {
      method: "POST",
      headers,
      body: isBinary ? payload : JSON.stringify(payload)
    };
    const response = await this._fetchWithTimeout(url.toString(), options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
    if (response.status === 202) {
      return { success: true };
    }
    if (response.status === 404) {
      return Promise.reject(new Error("httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md"));
    }
    let errorMessage = response.statusText;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.error || errorBody.message || errorMessage;
    } catch (_b) {
    }
    return Promise.reject(new Error(errorMessage));
  }
  /**
   * Sends a message into the channel.
   *
   * @param args Arguments to send to channel
   * @param args.type The type of event to send
   * @param args.event The name of the event being sent
   * @param args.payload Payload to be sent
   * @param opts Options to be used during the send process
   *
   * @category Realtime
   *
   * @remarks
   * - When using REST you don't need to subscribe to the channel
   * - REST calls are only available from 2.37.0 onwards
   * - If you create a channel only to send a REST broadcast, remove it from
   *   the client when the send completes
   *
   * @example Send a message via websocket
   * ```js
   * const channel = supabase.channel('room1')
   *
   * channel.subscribe((status) => {
   *   if (status === 'SUBSCRIBED') {
   *     channel.send({
   *       type: 'broadcast',
   *       event: 'cursor-pos',
   *       payload: { x: Math.random(), y: Math.random() },
   *     })
   *   }
   * })
   * ```
   *
   * @exampleResponse Send a message via websocket
   * ```js
   * ok | timed out | error
   * ```
   *
   * @example Send a message via REST
   * ```js
   * const channel = supabase.channel('room1')
   *
   * try {
   *   await channel.httpSend('cursor-pos', { x: Math.random(), y: Math.random() })
   * } finally {
   *   await supabase.removeChannel(channel)
   * }
   * ```
   */
  async send(args, opts = {}) {
    var _a, _b;
    if (!this.channelAdapter.canPush() && args.type === "broadcast") {
      const fallbackWarning = "Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.";
      if (this.socket.hasLogger()) {
        this.socket.log("channel", fallbackWarning);
      } else {
        console.warn(fallbackWarning);
      }
      const { event, payload: endpoint_payload } = args;
      const headers = {
        apikey: this.socket.apiKey ? this.socket.apiKey : "",
        "Content-Type": "application/json"
      };
      if (this.socket.accessTokenValue) {
        headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
      }
      const options = {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event,
              payload: endpoint_payload,
              private: this.private
            }
          ]
        })
      };
      try {
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
        await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
        return response.ok ? "ok" : "error";
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return "timed out";
        } else {
          return "error";
        }
      }
    } else {
      return new Promise((resolve) => {
        var _a2, _b2, _c;
        const push = this.channelAdapter.push(args.type, args, opts.timeout || this.timeout);
        if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
          resolve("ok");
        }
        push.receive("ok", () => resolve("ok"));
        push.receive("error", () => resolve("error"));
        push.receive("timeout", () => resolve("timed out"));
      });
    }
  }
  /**
   * Updates the payload that will be sent the next time the channel joins (reconnects).
   * Useful for rotating access tokens or updating config without re-creating the channel.
   *
   * @category Realtime
   */
  updateJoinPayload(payload) {
    this.channelAdapter.updateJoinPayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   *
   * @category Realtime
   */
  async unsubscribe(timeout = this.timeout) {
    return new Promise((resolve) => {
      this.channelAdapter.unsubscribe(timeout).receive("ok", () => resolve("ok")).receive("timeout", () => resolve("timed out")).receive("error", () => resolve("error"));
    });
  }
  /**
   * Destroys and stops related timers.
   *
   * @category Realtime
   */
  teardown() {
    this.channelAdapter.teardown();
  }
  /** @internal */
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
    clearTimeout(id);
    return response;
  }
  /** @internal */
  _on(type, filter2, callback) {
    var _a;
    const typeLower = type.toLocaleLowerCase();
    const filterValue = filter2 === null || filter2 === void 0 ? void 0 : filter2.filter;
    if (filterValue instanceof RealtimePostgresFilterBuilder || typeof filterValue === "object" && filterValue !== null && typeof filterValue.build === "function") {
      filter2 = Object.assign(Object.assign({}, filter2), { filter: filterValue.build() });
    }
    if (typeLower === REALTIME_LISTEN_TYPES.POSTGRES_CHANGES) {
      const duplicate = (_a = this.bindings[typeLower]) === null || _a === void 0 ? void 0 : _a.find((bind) => _RealtimeChannel.isSamePostgresFilter(bind.filter, filter2));
      if (duplicate) {
        this.socket.log("error", `duplicate \`postgres_changes\` binding for ${this.topic} ignored`, filter2);
        return this;
      }
    }
    const ref = this.channelAdapter.on(type, callback);
    const binding = {
      type: typeLower,
      filter: filter2,
      callback,
      ref
    };
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding);
    } else {
      this.bindings[typeLower] = [binding];
    }
    this._updateFilterMessage();
    return this;
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(callback) {
    this.channelAdapter.onClose(callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(callback) {
    this.channelAdapter.onError(callback);
  }
  /** @internal */
  _updateFilterMessage() {
    this.channelAdapter.updateFilterBindings((binding, payload, ref) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const typeLower = binding.event.toLocaleLowerCase();
      if (this._notThisChannelEvent(typeLower, ref)) {
        return false;
      }
      const bind = (_a = this.bindings[typeLower]) === null || _a === void 0 ? void 0 : _a.find((bind2) => bind2.ref === binding.ref);
      if (!bind) {
        return true;
      }
      if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
        if ("id" in bind) {
          const bindId = bind.id;
          const bindEvent = (_b = bind.filter) === null || _b === void 0 ? void 0 : _b.event;
          return bindId && ((_c = payload.ids) === null || _c === void 0 ? void 0 : _c.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_d = payload.data) === null || _d === void 0 ? void 0 : _d.type.toLocaleLowerCase()));
        } else {
          const bindEvent = (_f = (_e = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _e === void 0 ? void 0 : _e.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase();
          return bindEvent === "*" || bindEvent === ((_g = payload === null || payload === void 0 ? void 0 : payload.event) === null || _g === void 0 ? void 0 : _g.toLocaleLowerCase());
        }
      } else {
        return bind.type.toLocaleLowerCase() === typeLower;
      }
    });
  }
  /** @internal */
  _notThisChannelEvent(event, ref) {
    const { close, error, leave, join } = CHANNEL_EVENTS;
    const events = [close, error, leave, join];
    return ref && events.includes(event) && ref !== this.joinPush.ref;
  }
  /** @internal */
  _updateFilterTransform() {
    this.channelAdapter.updatePayloadTransform((event, payload, ref) => {
      if (typeof payload === "object" && "ids" in payload) {
        const postgresChanges = payload.data;
        const { schema, table, commit_timestamp, type, errors } = postgresChanges;
        const enrichedPayload = {
          schema,
          table,
          commit_timestamp,
          eventType: type,
          new: {},
          old: {},
          errors
        };
        return Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
      }
      return payload;
    });
  }
  copyBindings(other) {
    if (this.joinedOnce) {
      throw new Error("cannot copy bindings into joined channel");
    }
    for (const kind in other.bindings) {
      for (const binding of other.bindings[kind]) {
        this._on(binding.type, binding.filter, binding.callback);
      }
    }
  }
  /**
   * Compares two optional filter values for equality.
   * Treats undefined, null, and empty string as equivalent empty values.
   * @internal
   */
  static isFilterValueEqual(serverValue, clientValue) {
    const normalizedServer = serverValue !== null && serverValue !== void 0 ? serverValue : void 0;
    const normalizedClient = clientValue !== null && clientValue !== void 0 ? clientValue : void 0;
    return normalizedServer === normalizedClient;
  }
  /**
   * Two `postgres_changes` filters are the same when the server would collapse them into a single
   * subscription.
   * @internal
   */
  static isSamePostgresFilter(a, b) {
    var _a, _b, _c, _d;
    const selectA = (_b = (_a = a === null || a === void 0 ? void 0 : a.select) === null || _a === void 0 ? void 0 : _a.join()) !== null && _b !== void 0 ? _b : void 0;
    const selectB = (_d = (_c = b === null || b === void 0 ? void 0 : b.select) === null || _c === void 0 ? void 0 : _c.join()) !== null && _d !== void 0 ? _d : void 0;
    return (a === null || a === void 0 ? void 0 : a.event) === (b === null || b === void 0 ? void 0 : b.event) && _RealtimeChannel.isFilterValueEqual(a === null || a === void 0 ? void 0 : a.schema, b === null || b === void 0 ? void 0 : b.schema) && _RealtimeChannel.isFilterValueEqual(a === null || a === void 0 ? void 0 : a.table, b === null || b === void 0 ? void 0 : b.table) && _RealtimeChannel.isFilterValueEqual(a === null || a === void 0 ? void 0 : a.filter, b === null || b === void 0 ? void 0 : b.filter) && selectA === selectB;
  }
  /** @internal */
  _getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };
    if (payload.type === "INSERT" || payload.type === "UPDATE") {
      records.new = convertChangeData(payload.columns, payload.record);
    }
    if (payload.type === "UPDATE" || payload.type === "DELETE") {
      records.old = convertChangeData(payload.columns, payload.old_record);
    }
    return records;
  }
};

// node_modules/@supabase/realtime-js/dist/module/phoenix/socketAdapter.js
var SocketAdapter = class {
  constructor(endPoint, options) {
    this.socket = new Socket(endPoint, options);
  }
  get timeout() {
    return this.socket.timeout;
  }
  get endPoint() {
    return this.socket.endPoint;
  }
  get transport() {
    return this.socket.transport;
  }
  get heartbeatIntervalMs() {
    return this.socket.heartbeatIntervalMs;
  }
  get heartbeatCallback() {
    return this.socket.heartbeatCallback;
  }
  set heartbeatCallback(callback) {
    this.socket.heartbeatCallback = callback;
  }
  get heartbeatTimer() {
    return this.socket.heartbeatTimer;
  }
  get pendingHeartbeatRef() {
    return this.socket.pendingHeartbeatRef;
  }
  get reconnectTimer() {
    return this.socket.reconnectTimer;
  }
  get vsn() {
    return this.socket.vsn;
  }
  get encode() {
    return this.socket.encode;
  }
  get decode() {
    return this.socket.decode;
  }
  get reconnectAfterMs() {
    return this.socket.reconnectAfterMs;
  }
  get sendBuffer() {
    return this.socket.sendBuffer;
  }
  get stateChangeCallbacks() {
    return this.socket.stateChangeCallbacks;
  }
  connect() {
    this.socket.connect();
  }
  disconnect(callback, code, reason, timeout = 1e4) {
    return new Promise((resolve) => {
      setTimeout(() => resolve("timeout"), timeout);
      this.socket.disconnect(() => {
        callback();
        resolve("ok");
      }, code, reason);
    });
  }
  push(data) {
    this.socket.push(data);
  }
  log(kind, msg, data) {
    this.socket.log(kind, msg, data);
  }
  hasLogger() {
    return this.socket.hasLogger();
  }
  makeRef() {
    return this.socket.makeRef();
  }
  onOpen(callback) {
    this.socket.onOpen(callback);
  }
  onClose(callback) {
    this.socket.onClose(callback);
  }
  onError(callback) {
    this.socket.onError(callback);
  }
  onMessage(callback) {
    this.socket.onMessage(callback);
  }
  isConnected() {
    return this.socket.isConnected();
  }
  isConnecting() {
    return this.socket.connectionState() == CONNECTION_STATE.connecting;
  }
  isDisconnecting() {
    return this.socket.connectionState() == CONNECTION_STATE.closing;
  }
  connectionState() {
    return this.socket.connectionState();
  }
  endPointURL() {
    return this.socket.endPointURL();
  }
  sendHeartbeat() {
    this.socket.sendHeartbeat();
  }
  /**
   * @internal
   */
  getSocket() {
    return this.socket;
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
var CONNECTION_TIMEOUTS = {
  HEARTBEAT_INTERVAL: 25e3,
  RECONNECT_DELAY: 10,
  HEARTBEAT_TIMEOUT_FALLBACK: 100
};
var RECONNECT_INTERVALS = [1e3, 2e3, 5e3, 1e4];
var DEFAULT_RECONNECT_FALLBACK = 1e4;
function createMemorySessionStorage() {
  const store = /* @__PURE__ */ new Map();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    key(index) {
      var _a;
      return (_a = Array.from(store.keys())[index]) !== null && _a !== void 0 ? _a : null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, String(value));
    }
  };
}
function resolveSessionStorage() {
  try {
    if (typeof globalThis !== "undefined" && globalThis.sessionStorage) {
      return globalThis.sessionStorage;
    }
  } catch (_a) {
  }
  return createMemorySessionStorage();
}
var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
var RealtimeClient = class {
  get endPoint() {
    return this.socketAdapter.endPoint;
  }
  get timeout() {
    return this.socketAdapter.timeout;
  }
  get transport() {
    return this.socketAdapter.transport;
  }
  get heartbeatCallback() {
    return this.socketAdapter.heartbeatCallback;
  }
  get heartbeatIntervalMs() {
    return this.socketAdapter.heartbeatIntervalMs;
  }
  get heartbeatTimer() {
    if (this.worker) {
      return this._workerHeartbeatTimer;
    }
    return this.socketAdapter.heartbeatTimer;
  }
  get pendingHeartbeatRef() {
    if (this.worker) {
      return this._pendingWorkerHeartbeatRef;
    }
    return this.socketAdapter.pendingHeartbeatRef;
  }
  get reconnectTimer() {
    return this.socketAdapter.reconnectTimer;
  }
  get vsn() {
    return this.socketAdapter.vsn;
  }
  get encode() {
    return this.socketAdapter.encode;
  }
  get decode() {
    return this.socketAdapter.decode;
  }
  get reconnectAfterMs() {
    return this.socketAdapter.reconnectAfterMs;
  }
  get sendBuffer() {
    return this.socketAdapter.sendBuffer;
  }
  get stateChangeCallbacks() {
    return this.socketAdapter.stateChangeCallbacks;
  }
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.heartbeatCallback The optional function to handle heartbeat status and latency.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.logLevel Sets the log level for Realtime
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   * @param options.worker Use Web Worker to set a side flow. Defaults to false.
   * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
   * @param options.vsn The protocol version to use when connecting. Supported versions are "1.0.0" and "2.0.0". Defaults to "2.0.0".
   *
   * @category Realtime
   *
   * @example Using supabase-js (recommended)
   * ```ts
   * import { createClient } from '@supabase/supabase-js'
   *
   * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
   * const channel = supabase.channel('room1')
   * channel
   *   .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
   *   .subscribe()
   * ```
   *
   * @example Standalone import for bundle-sensitive environments
   * ```ts
   * import RealtimeClient from '@supabase/realtime-js'
   *
   * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
   *   params: { apikey: 'your-publishable-key' },
   * })
   * client.connect()
   * ```
   */
  constructor(endPoint, options) {
    var _a;
    this.channels = new Array();
    this.accessTokenValue = null;
    this.accessToken = null;
    this.apiKey = null;
    this.httpEndpoint = "";
    this.headers = {};
    this.params = {};
    this.ref = 0;
    this.serializer = new Serializer();
    this._manuallySetToken = false;
    this._authPromise = null;
    this._authGeneration = 0;
    this._workerHeartbeatTimer = void 0;
    this._pendingWorkerHeartbeatRef = null;
    this._pendingDisconnectTimer = null;
    this._disconnectOnEmptyChannelsAfterMs = 0;
    this._resolveFetch = (customFetch) => {
      if (customFetch) {
        return (...args) => customFetch(...args);
      }
      return (...args) => fetch(...args);
    };
    if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
      throw new Error("API key is required to connect to Realtime");
    }
    this.apiKey = options.params.apikey;
    const socketAdapterOptions = this._initializeOptions(options);
    this.socketAdapter = new SocketAdapter(endPoint, socketAdapterOptions);
    this.httpEndpoint = httpEndpointURL(endPoint);
    this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
  }
  /**
   * Connects the socket, unless already connected.
   *
   * @category Realtime
   */
  connect() {
    if (this.isConnecting() || this.isDisconnecting() || this.isConnected()) {
      return;
    }
    if (this.accessToken && !this._authPromise) {
      this._setAuthSafely("connect");
    }
    this._setupConnectionHandlers();
    try {
      this.socketAdapter.connect();
    } catch (error) {
      const errorMessage = error.message;
      throw new Error(`WebSocket not available: ${errorMessage}`);
    }
    this._handleNodeJsRaceCondition();
  }
  /**
   * Returns the URL of the websocket.
   * @returns string The URL of the websocket.
   *
   * @category Realtime
   */
  endpointURL() {
    return this.socketAdapter.endPointURL();
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   *
   * @category Realtime
   */
  async disconnect(code, reason) {
    this._cancelPendingDisconnect();
    if (this.isDisconnecting()) {
      return "ok";
    }
    return await this.socketAdapter.disconnect(() => {
      clearInterval(this._workerHeartbeatTimer);
      this._terminateWorker();
    }, code, reason);
  }
  /**
   * Returns all created channels
   *
   * @category Realtime
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes, removes and tears down a single channel
   * @param channel A RealtimeChannel instance
   *
   * @category Realtime
   */
  async removeChannel(channel) {
    const status = await channel.unsubscribe();
    if (status === "ok") {
      channel.teardown();
    }
    return status;
  }
  /**
   * Unsubscribes, removes and tears down all channels
   *
   * @category Realtime
   */
  async removeAllChannels() {
    const promises = this.channels.map(async (channel) => {
      const result2 = await channel.unsubscribe();
      channel.teardown();
      return result2;
    });
    const result = await Promise.all(promises);
    await this.disconnect();
    return result;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden in Client constructor.
   *
   * @category Realtime
   */
  log(kind, msg, data) {
    this.socketAdapter.log(kind, msg, data);
  }
  /**
   * Returns true if a custom `logger` has been configured on this client.
   *
   * @category Realtime
   */
  hasLogger() {
    return this.socketAdapter.hasLogger();
  }
  /**
   * Returns the current state of the socket.
   *
   * @category Realtime
   */
  connectionState() {
    return this.socketAdapter.connectionState() || CONNECTION_STATE.closed;
  }
  /**
   * Returns `true` is the connection is open.
   *
   * @category Realtime
   */
  isConnected() {
    return this.socketAdapter.isConnected();
  }
  /**
   * Returns `true` if the connection is currently connecting.
   *
   * @category Realtime
   */
  isConnecting() {
    return this.socketAdapter.isConnecting();
  }
  /**
   * Returns `true` if the connection is currently disconnecting.
   *
   * @category Realtime
   */
  isDisconnecting() {
    return this.socketAdapter.isDisconnecting();
  }
  /**
   * Creates (or reuses) a {@link RealtimeChannel} for the provided topic.
   *
   * Topics are automatically prefixed with `realtime:` to match the Realtime service.
   * If a channel with the same topic already exists it will be returned instead of creating
   * a duplicate connection.
   *
   * @category Realtime
   */
  channel(topic, params = { config: {} }) {
    const realtimeTopic = `realtime:${topic}`;
    const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
    if (!exists) {
      const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
      this._cancelPendingDisconnect();
      this.channels.push(chan);
      return chan;
    } else {
      return exists;
    }
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   *
   * @category Realtime
   */
  push(data) {
    this.socketAdapter.push(data);
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * If param is null it will use the `accessToken` callback function or the token set on the client.
   *
   * On callback used, it will set the value of the token internal to the client.
   *
   * When a token is explicitly provided AND no `accessToken` callback is configured,
   * it will be preserved across channel operations (including removeChannel and
   * resubscribe) and the client stays in manual-token mode.
   *
   * When an `accessToken` callback IS configured, the callback is the source of truth:
   * the client remains in callback mode and continues to refresh from it on heartbeat,
   * even after a bootstrap/override `setAuth(token)` call.
   *
   * The callback is called on connect and on every heartbeat (`heartbeatIntervalMs`,
   * default 25000ms). Its token must stay valid past the next call, or the server closes
   * the channel at expiry with no automatic resubscribe.
   *
   * @param token A JWT string to override the token set on the client.
   *
   * @example Setting the authorization header
   * // Use a manual token (preserved across resubscribes when no accessToken callback is set)
   * client.realtime.setAuth('my-custom-jwt')
   *
   * // Switch back to using the accessToken callback
   * client.realtime.setAuth()
   *
   * @category Realtime
   */
  async setAuth(token = null) {
    const authGeneration = ++this._authGeneration;
    const authPromise = this._performAuth(token, authGeneration);
    if (authGeneration === this._authGeneration) {
      this._authPromise = authPromise;
    }
    try {
      await authPromise;
    } finally {
      if (this._authPromise === authPromise) {
        this._authPromise = null;
      }
    }
  }
  /**
   * Returns true if the current access token was explicitly set via setAuth(token),
   * false if it was obtained via the accessToken callback.
   * @internal
   */
  _isManualToken() {
    return this._manuallySetToken;
  }
  /**
   * Sends a heartbeat message if the socket is connected.
   *
   * @category Realtime
   */
  async sendHeartbeat() {
    this.socketAdapter.sendHeartbeat();
  }
  /**
   * Sets a callback that receives lifecycle events for internal heartbeat messages.
   * Useful for instrumenting connection health (e.g. sent/ok/timeout).
   *
   * @category Realtime
   */
  onHeartbeat(callback) {
    this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(callback);
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    return this.socketAdapter.makeRef();
  }
  /**
   * Removes a channel from RealtimeClient
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(channel) {
    this.channels = this.channels.filter((c) => c.topic !== channel.topic);
    if (this.channels.length === 0) {
      this.log("transport", "no channels remaining, scheduling disconnect");
      this._schedulePendingDisconnect();
    }
  }
  /** @internal */
  _schedulePendingDisconnect() {
    this._cancelPendingDisconnect();
    if (this._disconnectOnEmptyChannelsAfterMs === 0) {
      this.log("transport", "disconnecting immediately - no channels");
      this.disconnect();
      return;
    }
    this._pendingDisconnectTimer = setTimeout(() => {
      this._pendingDisconnectTimer = null;
      if (this.channels.length === 0) {
        this.log("transport", "deferred disconnect fired - no channels, disconnecting");
        this.disconnect();
      }
    }, this._disconnectOnEmptyChannelsAfterMs);
    this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`);
  }
  /** @internal */
  _cancelPendingDisconnect() {
    if (this._pendingDisconnectTimer !== null) {
      this.log("transport", "pending disconnect cancelled - channel activity detected");
      clearTimeout(this._pendingDisconnectTimer);
      this._pendingDisconnectTimer = null;
    }
  }
  /**
   * Perform the actual auth operation
   * @internal
   */
  async _performAuth(token, authGeneration) {
    let tokenToSend;
    let isManualToken = false;
    if (token) {
      tokenToSend = token;
      isManualToken = true;
    } else if (this.accessToken) {
      try {
        tokenToSend = await this.accessToken();
      } catch (e) {
        this.log("error", "Error fetching access token from callback", e);
        tokenToSend = this.accessTokenValue;
      }
    } else {
      tokenToSend = this.accessTokenValue;
    }
    if (authGeneration !== this._authGeneration) {
      return;
    }
    if (this.accessToken) {
      this._manuallySetToken = false;
    } else if (isManualToken) {
      this._manuallySetToken = true;
    }
    if (this.accessTokenValue != tokenToSend) {
      this.accessTokenValue = tokenToSend;
      this.channels.forEach((channel) => {
        const payload = {
          access_token: tokenToSend,
          version: DEFAULT_VERSION
        };
        channel.updateJoinPayload(payload);
        if (channel.joinedOnce && channel.channelAdapter.isJoined()) {
          channel.channelAdapter.push(CHANNEL_EVENTS.access_token, {
            access_token: tokenToSend
          });
        }
      });
    }
  }
  /**
   * Wait for any in-flight auth operations to complete
   * @internal
   */
  async _waitForAuthIfNeeded() {
    if (this._authPromise) {
      await this._authPromise;
    }
  }
  /**
   * Safely call setAuth with standardized error handling
   * @internal
   */
  _setAuthSafely(context = "general") {
    if (!this._isManualToken()) {
      this.setAuth().catch((e) => {
        this.log("error", `Error setting auth in ${context}`, e);
      });
    }
  }
  /** @internal */
  _setupConnectionHandlers() {
    this.socketAdapter.onOpen(() => {
      const authPromise = this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve());
      authPromise.catch((e) => {
        this.log("error", "error waiting for auth on connect", e);
      });
      if (this.worker && !this.workerRef) {
        this._startWorkerHeartbeat();
      }
    });
    this.socketAdapter.onClose(() => {
      if (this.worker && this.workerRef) {
        this._terminateWorker();
      }
    });
    this.socketAdapter.onMessage((message) => {
      if (message.ref && message.ref === this._pendingWorkerHeartbeatRef) {
        this._pendingWorkerHeartbeatRef = null;
      }
    });
  }
  /** @internal */
  _handleNodeJsRaceCondition() {
    if (this.socketAdapter.isConnected()) {
      this.socketAdapter.getSocket().onConnOpen();
    }
  }
  /** @internal */
  _wrapHeartbeatCallback(heartbeatCallback) {
    return (status, latency) => {
      if (status === "disconnected")
        return;
      if (status == "sent")
        this._setAuthSafely();
      if (heartbeatCallback)
        heartbeatCallback(status, latency);
    };
  }
  /** @internal */
  _startWorkerHeartbeat() {
    if (this.workerUrl) {
      this.log("worker", `starting worker for from ${this.workerUrl}`);
    } else {
      this.log("worker", `starting default worker`);
    }
    const objectUrl = this._workerObjectUrl(this.workerUrl);
    this.workerRef = new Worker(objectUrl);
    this.workerRef.onerror = (error) => {
      this.log("worker", "worker error", error.message);
      this._terminateWorker();
      this.disconnect();
    };
    this.workerRef.onmessage = (event) => {
      if (event.data.event === "keepAlive") {
        this.sendHeartbeat();
      }
    };
    this.workerRef.postMessage({
      event: "start",
      interval: this.heartbeatIntervalMs
    });
  }
  /**
   * Terminate the Web Worker and clear the reference
   * @internal
   */
  _terminateWorker() {
    if (this.workerRef) {
      this.log("worker", "terminating worker");
      this.workerRef.terminate();
      this.workerRef = void 0;
    }
  }
  /** @internal */
  _workerObjectUrl(url) {
    let result_url;
    if (url) {
      result_url = url;
    } else {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      result_url = URL.createObjectURL(blob);
    }
    return result_url;
  }
  /**
   * Initialize socket options with defaults
   * @internal
   */
  _initializeOptions(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    this.worker = (_a = options === null || options === void 0 ? void 0 : options.worker) !== null && _a !== void 0 ? _a : false;
    this.accessToken = (_b = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _b !== void 0 ? _b : null;
    const result = {};
    result.timeout = (_c = options === null || options === void 0 ? void 0 : options.timeout) !== null && _c !== void 0 ? _c : DEFAULT_TIMEOUT;
    result.heartbeatIntervalMs = (_d = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _d !== void 0 ? _d : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
    this._disconnectOnEmptyChannelsAfterMs = (_e = options === null || options === void 0 ? void 0 : options.disconnectOnEmptyChannelsAfterMs) !== null && _e !== void 0 ? _e : 2 * ((_f = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _f !== void 0 ? _f : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL);
    result.transport = (_g = options === null || options === void 0 ? void 0 : options.transport) !== null && _g !== void 0 ? _g : websocket_factory_default.getWebSocketConstructor();
    result.params = options === null || options === void 0 ? void 0 : options.params;
    result.logger = options === null || options === void 0 ? void 0 : options.logger;
    result.heartbeatCallback = this._wrapHeartbeatCallback(options === null || options === void 0 ? void 0 : options.heartbeatCallback);
    result.sessionStorage = (_h = options === null || options === void 0 ? void 0 : options.sessionStorage) !== null && _h !== void 0 ? _h : resolveSessionStorage();
    result.reconnectAfterMs = (_j = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _j !== void 0 ? _j : ((tries) => {
      return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
    });
    let defaultEncode;
    let defaultDecode;
    const vsn = (_k = options === null || options === void 0 ? void 0 : options.vsn) !== null && _k !== void 0 ? _k : DEFAULT_VSN;
    switch (vsn) {
      case VSN_1_0_0:
        defaultEncode = (payload, callback) => {
          return callback(JSON.stringify(payload));
        };
        defaultDecode = (payload, callback) => {
          return callback(JSON.parse(payload));
        };
        break;
      case VSN_2_0_0:
        defaultEncode = this.serializer.encode.bind(this.serializer);
        defaultDecode = this.serializer.decode.bind(this.serializer);
        break;
      default:
        throw new Error(`Unsupported serializer version: ${result.vsn}`);
    }
    result.vsn = vsn;
    result.encode = (_l = options === null || options === void 0 ? void 0 : options.encode) !== null && _l !== void 0 ? _l : defaultEncode;
    result.decode = (_m = options === null || options === void 0 ? void 0 : options.decode) !== null && _m !== void 0 ? _m : defaultDecode;
    result.beforeReconnect = this._reconnectAuth.bind(this);
    if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
      this.logLevel = options.logLevel || options.log_level;
      result.params = Object.assign(Object.assign({}, result.params), { log_level: this.logLevel });
    }
    if (this.worker) {
      if (typeof window !== "undefined" && !window.Worker) {
        throw new Error("Web Worker is not supported");
      }
      this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
      result.autoSendHeartbeat = !this.worker;
    }
    return result;
  }
  /** @internal */
  async _reconnectAuth() {
    await this._waitForAuthIfNeeded();
    if (!this.isConnected()) {
      this.connect();
    }
  }
};

// node_modules/iceberg-js/dist/index.mjs
var IcebergError = class extends Error {
  constructor(message, opts) {
    super(message);
    this.name = "IcebergError";
    this.status = opts.status;
    this.icebergType = opts.icebergType;
    this.icebergCode = opts.icebergCode;
    this.details = opts.details;
    this.isCommitStateUnknown = opts.icebergType === "CommitStateUnknownException" || [500, 502, 504].includes(opts.status) && opts.icebergType?.includes("CommitState") === true;
  }
  /**
   * Returns true if the error is a 404 Not Found error.
   */
  isNotFound() {
    return this.status === 404;
  }
  /**
   * Returns true if the error is a 409 Conflict error.
   */
  isConflict() {
    return this.status === 409;
  }
  /**
   * Returns true if the error is a 419 Authentication Timeout error.
   */
  isAuthenticationTimeout() {
    return this.status === 419;
  }
};
function buildUrl(baseUrl, path, query2) {
  const url = new URL(path, baseUrl);
  if (query2) {
    for (const [key, value] of Object.entries(query2)) {
      if (value !== void 0) {
        url.searchParams.set(key, value);
      }
    }
  }
  return url.toString();
}
async function buildAuthHeaders(auth) {
  if (!auth || auth.type === "none") {
    return {};
  }
  if (auth.type === "bearer") {
    return { Authorization: `Bearer ${auth.token}` };
  }
  if (auth.type === "header") {
    return { [auth.name]: auth.value };
  }
  if (auth.type === "custom") {
    return await auth.getHeaders();
  }
  return {};
}
function createFetchClient(options) {
  const fetchFn = options.fetchImpl ?? globalThis.fetch;
  return {
    async request({
      method,
      path,
      query: query2,
      body,
      headers
    }) {
      const url = buildUrl(options.baseUrl, path, query2);
      const authHeaders = await buildAuthHeaders(options.auth);
      const res = await fetchFn(url, {
        method,
        headers: {
          ...body ? { "Content-Type": "application/json" } : {},
          ...authHeaders,
          ...headers
        },
        body: body ? JSON.stringify(body) : void 0
      });
      const text = await res.text();
      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const data = isJson && text ? JSON.parse(text) : text;
      if (!res.ok) {
        const errBody = isJson ? data : void 0;
        const errorDetail = errBody?.error;
        throw new IcebergError(
          errorDetail?.message ?? `Request failed with status ${res.status}`,
          {
            status: res.status,
            icebergType: errorDetail?.type,
            icebergCode: errorDetail?.code,
            details: errBody
          }
        );
      }
      return { status: res.status, headers: res.headers, data };
    }
  };
}
function namespaceToPath(namespace) {
  return namespace.join("");
}
var NamespaceOperations = class {
  constructor(client, prefix = "") {
    this.client = client;
    this.prefix = prefix;
  }
  async listNamespaces(parent) {
    const query2 = parent ? { parent: namespaceToPath(parent.namespace) } : void 0;
    const response = await this.client.request({
      method: "GET",
      path: `${this.prefix}/namespaces`,
      query: query2
    });
    return response.data.namespaces.map((ns) => ({ namespace: ns }));
  }
  async createNamespace(id, metadata) {
    const request = {
      namespace: id.namespace,
      properties: metadata?.properties
    };
    const response = await this.client.request({
      method: "POST",
      path: `${this.prefix}/namespaces`,
      body: request
    });
    return response.data;
  }
  async dropNamespace(id) {
    await this.client.request({
      method: "DELETE",
      path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
    });
  }
  async loadNamespaceMetadata(id) {
    const response = await this.client.request({
      method: "GET",
      path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
    });
    return {
      properties: response.data.properties
    };
  }
  async namespaceExists(id) {
    try {
      await this.client.request({
        method: "HEAD",
        path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
      });
      return true;
    } catch (error) {
      if (error instanceof IcebergError && error.status === 404) {
        return false;
      }
      throw error;
    }
  }
  async createNamespaceIfNotExists(id, metadata) {
    try {
      return await this.createNamespace(id, metadata);
    } catch (error) {
      if (error instanceof IcebergError && error.status === 409) {
        return;
      }
      throw error;
    }
  }
};
function namespaceToPath2(namespace) {
  return namespace.join("");
}
var TableOperations = class {
  constructor(client, prefix = "", accessDelegation) {
    this.client = client;
    this.prefix = prefix;
    this.accessDelegation = accessDelegation;
  }
  async listTables(namespace) {
    const response = await this.client.request({
      method: "GET",
      path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`
    });
    return response.data.identifiers;
  }
  async createTable(namespace, request) {
    const headers = {};
    if (this.accessDelegation) {
      headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
    }
    const response = await this.client.request({
      method: "POST",
      path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`,
      body: request,
      headers
    });
    return response.data.metadata;
  }
  async updateTable(id, request) {
    const response = await this.client.request({
      method: "POST",
      path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
      body: request
    });
    return {
      "metadata-location": response.data["metadata-location"],
      metadata: response.data.metadata
    };
  }
  async dropTable(id, options) {
    await this.client.request({
      method: "DELETE",
      path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
      query: { purgeRequested: String(options?.purge ?? false) }
    });
  }
  async loadTable(id) {
    const headers = {};
    if (this.accessDelegation) {
      headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
    }
    const response = await this.client.request({
      method: "GET",
      path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
      headers
    });
    return response.data.metadata;
  }
  async tableExists(id) {
    const headers = {};
    if (this.accessDelegation) {
      headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
    }
    try {
      await this.client.request({
        method: "HEAD",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        headers
      });
      return true;
    } catch (error) {
      if (error instanceof IcebergError && error.status === 404) {
        return false;
      }
      throw error;
    }
  }
  async createTableIfNotExists(namespace, request) {
    try {
      return await this.createTable(namespace, request);
    } catch (error) {
      if (error instanceof IcebergError && error.status === 409) {
        return await this.loadTable({ namespace: namespace.namespace, name: request.name });
      }
      throw error;
    }
  }
};
var IcebergRestCatalog = class {
  /**
   * Creates a new Iceberg REST Catalog client.
   *
   * @param options - Configuration options for the catalog client
   */
  constructor(options) {
    let prefix = "v1";
    if (options.catalogName) {
      prefix += `/${options.catalogName}`;
    }
    const baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`;
    this.client = createFetchClient({
      baseUrl,
      auth: options.auth,
      fetchImpl: options.fetch
    });
    this.accessDelegation = options.accessDelegation?.join(",");
    this.namespaceOps = new NamespaceOperations(this.client, prefix);
    this.tableOps = new TableOperations(this.client, prefix, this.accessDelegation);
  }
  /**
   * Lists all namespaces in the catalog.
   *
   * @param parent - Optional parent namespace to list children under
   * @returns Array of namespace identifiers
   *
   * @example
   * ```typescript
   * // List all top-level namespaces
   * const namespaces = await catalog.listNamespaces();
   *
   * // List namespaces under a parent
   * const children = await catalog.listNamespaces({ namespace: ['analytics'] });
   * ```
   */
  async listNamespaces(parent) {
    return this.namespaceOps.listNamespaces(parent);
  }
  /**
   * Creates a new namespace in the catalog.
   *
   * @param id - Namespace identifier to create
   * @param metadata - Optional metadata properties for the namespace
   * @returns Response containing the created namespace and its properties
   *
   * @example
   * ```typescript
   * const response = await catalog.createNamespace(
   *   { namespace: ['analytics'] },
   *   { properties: { owner: 'data-team' } }
   * );
   * console.log(response.namespace); // ['analytics']
   * console.log(response.properties); // { owner: 'data-team', ... }
   * ```
   */
  async createNamespace(id, metadata) {
    return this.namespaceOps.createNamespace(id, metadata);
  }
  /**
   * Drops a namespace from the catalog.
   *
   * The namespace must be empty (contain no tables) before it can be dropped.
   *
   * @param id - Namespace identifier to drop
   *
   * @example
   * ```typescript
   * await catalog.dropNamespace({ namespace: ['analytics'] });
   * ```
   */
  async dropNamespace(id) {
    await this.namespaceOps.dropNamespace(id);
  }
  /**
   * Loads metadata for a namespace.
   *
   * @param id - Namespace identifier to load
   * @returns Namespace metadata including properties
   *
   * @example
   * ```typescript
   * const metadata = await catalog.loadNamespaceMetadata({ namespace: ['analytics'] });
   * console.log(metadata.properties);
   * ```
   */
  async loadNamespaceMetadata(id) {
    return this.namespaceOps.loadNamespaceMetadata(id);
  }
  /**
   * Lists all tables in a namespace.
   *
   * @param namespace - Namespace identifier to list tables from
   * @returns Array of table identifiers
   *
   * @example
   * ```typescript
   * const tables = await catalog.listTables({ namespace: ['analytics'] });
   * console.log(tables); // [{ namespace: ['analytics'], name: 'events' }, ...]
   * ```
   */
  async listTables(namespace) {
    return this.tableOps.listTables(namespace);
  }
  /**
   * Creates a new table in the catalog.
   *
   * @param namespace - Namespace to create the table in
   * @param request - Table creation request including name, schema, partition spec, etc.
   * @returns Table metadata for the created table
   *
   * @example
   * ```typescript
   * const metadata = await catalog.createTable(
   *   { namespace: ['analytics'] },
   *   {
   *     name: 'events',
   *     schema: {
   *       type: 'struct',
   *       fields: [
   *         { id: 1, name: 'id', type: 'long', required: true },
   *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
   *       ],
   *       'schema-id': 0
   *     },
   *     'partition-spec': {
   *       'spec-id': 0,
   *       fields: [
   *         { source_id: 2, field_id: 1000, name: 'ts_day', transform: 'day' }
   *       ]
   *     }
   *   }
   * );
   * ```
   */
  async createTable(namespace, request) {
    return this.tableOps.createTable(namespace, request);
  }
  /**
   * Updates an existing table's metadata.
   *
   * Can update the schema, partition spec, or properties of a table.
   *
   * @param id - Table identifier to update
   * @param request - Update request with fields to modify
   * @returns Response containing the metadata location and updated table metadata
   *
   * @example
   * ```typescript
   * const response = await catalog.updateTable(
   *   { namespace: ['analytics'], name: 'events' },
   *   {
   *     properties: { 'read.split.target-size': '134217728' }
   *   }
   * );
   * console.log(response['metadata-location']); // s3://...
   * console.log(response.metadata); // TableMetadata object
   * ```
   */
  async updateTable(id, request) {
    return this.tableOps.updateTable(id, request);
  }
  /**
   * Drops a table from the catalog.
   *
   * @param id - Table identifier to drop
   *
   * @example
   * ```typescript
   * await catalog.dropTable({ namespace: ['analytics'], name: 'events' });
   * ```
   */
  async dropTable(id, options) {
    await this.tableOps.dropTable(id, options);
  }
  /**
   * Loads metadata for a table.
   *
   * @param id - Table identifier to load
   * @returns Table metadata including schema, partition spec, location, etc.
   *
   * @example
   * ```typescript
   * const metadata = await catalog.loadTable({ namespace: ['analytics'], name: 'events' });
   * console.log(metadata.schema);
   * console.log(metadata.location);
   * ```
   */
  async loadTable(id) {
    return this.tableOps.loadTable(id);
  }
  /**
   * Checks if a namespace exists in the catalog.
   *
   * @param id - Namespace identifier to check
   * @returns True if the namespace exists, false otherwise
   *
   * @example
   * ```typescript
   * const exists = await catalog.namespaceExists({ namespace: ['analytics'] });
   * console.log(exists); // true or false
   * ```
   */
  async namespaceExists(id) {
    return this.namespaceOps.namespaceExists(id);
  }
  /**
   * Checks if a table exists in the catalog.
   *
   * @param id - Table identifier to check
   * @returns True if the table exists, false otherwise
   *
   * @example
   * ```typescript
   * const exists = await catalog.tableExists({ namespace: ['analytics'], name: 'events' });
   * console.log(exists); // true or false
   * ```
   */
  async tableExists(id) {
    return this.tableOps.tableExists(id);
  }
  /**
   * Creates a namespace if it does not exist.
   *
   * If the namespace already exists, returns void. If created, returns the response.
   *
   * @param id - Namespace identifier to create
   * @param metadata - Optional metadata properties for the namespace
   * @returns Response containing the created namespace and its properties, or void if it already exists
   *
   * @example
   * ```typescript
   * const response = await catalog.createNamespaceIfNotExists(
   *   { namespace: ['analytics'] },
   *   { properties: { owner: 'data-team' } }
   * );
   * if (response) {
   *   console.log('Created:', response.namespace);
   * } else {
   *   console.log('Already exists');
   * }
   * ```
   */
  async createNamespaceIfNotExists(id, metadata) {
    return this.namespaceOps.createNamespaceIfNotExists(id, metadata);
  }
  /**
   * Creates a table if it does not exist.
   *
   * If the table already exists, returns its metadata instead.
   *
   * @param namespace - Namespace to create the table in
   * @param request - Table creation request including name, schema, partition spec, etc.
   * @returns Table metadata for the created or existing table
   *
   * @example
   * ```typescript
   * const metadata = await catalog.createTableIfNotExists(
   *   { namespace: ['analytics'] },
   *   {
   *     name: 'events',
   *     schema: {
   *       type: 'struct',
   *       fields: [
   *         { id: 1, name: 'id', type: 'long', required: true },
   *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
   *       ],
   *       'schema-id': 0
   *     }
   *   }
   * );
   * ```
   */
  async createTableIfNotExists(namespace, request) {
    return this.tableOps.createTableIfNotExists(namespace, request);
  }
};

// node_modules/@supabase/storage-js/dist/index.mjs
function _typeof2(o) {
  "@babel/helpers - typeof";
  return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
    return typeof o$1;
  } : function(o$1) {
    return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
  }, _typeof2(o);
}
function toPrimitive2(t, r) {
  if ("object" != _typeof2(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof2(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function toPropertyKey2(t) {
  var i = toPrimitive2(t, "string");
  return "symbol" == _typeof2(i) ? i : i + "";
}
function _defineProperty2(e, r, t) {
  return (r = toPropertyKey2(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r$1) {
      return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread22(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys2(Object(t), true).forEach(function(r$1) {
      _defineProperty2(e, r$1, t[r$1]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r$1) {
      Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
    });
  }
  return e;
}
var StorageError = class extends Error {
  constructor(message, namespace = "storage", status, statusCode) {
    super(message);
    this.__isStorageError = true;
    this.namespace = namespace;
    this.name = namespace === "vectors" ? "StorageVectorsError" : "StorageError";
    this.status = status;
    this.statusCode = statusCode;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
};
function isStorageError(error) {
  return typeof error === "object" && error !== null && "__isStorageError" in error;
}
var StorageApiError = class extends StorageError {
  constructor(message, status, statusCode, namespace = "storage", code) {
    super(message, namespace, status, statusCode);
    this.name = namespace === "vectors" ? "StorageVectorsApiError" : "StorageApiError";
    this.status = status;
    this.statusCode = statusCode;
    this.code = code;
  }
  toJSON() {
    return _objectSpread22(_objectSpread22({}, super.toJSON()), {}, { code: this.code });
  }
};
var StorageUnknownError = class extends StorageError {
  constructor(message, originalError, namespace = "storage") {
    super(message, namespace);
    this.name = namespace === "vectors" ? "StorageVectorsUnknownError" : "StorageUnknownError";
    this.originalError = originalError;
  }
};
function setHeader(headers, name, value) {
  const result = _objectSpread22({}, headers);
  const nameLower = name.toLowerCase();
  for (const key of Object.keys(result)) if (key.toLowerCase() === nameLower) delete result[key];
  result[nameLower] = value;
  return result;
}
function normalizeHeaders(headers) {
  const result = {};
  for (const [key, value] of Object.entries(headers)) result[key.toLowerCase()] = value;
  return result;
}
var resolveFetch2 = (customFetch) => {
  if (customFetch) return (...args) => customFetch(...args);
  return (...args) => fetch(...args);
};
var isPlainObject = (value) => {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
};
var recursiveToCamel = (item) => {
  if (Array.isArray(item)) return item.map((el) => recursiveToCamel(el));
  else if (typeof item === "function" || item !== Object(item)) return item;
  const result = {};
  Object.entries(item).forEach(([key, value]) => {
    const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ""));
    result[newKey] = recursiveToCamel(value);
  });
  return result;
};
var isValidBucketName = (bucketName) => {
  if (!bucketName || typeof bucketName !== "string") return false;
  if (bucketName.length === 0 || bucketName.length > 100) return false;
  if (bucketName.trim() !== bucketName) return false;
  if (bucketName.includes("/") || bucketName.includes("\\")) return false;
  return /^[\w!.\*'() &$@=;:+,?-]+$/.test(bucketName);
};
var encodeStoragePath = (path) => path.split("/").map(encodeURIComponent).join("/");
var _getErrorMessage = (err) => {
  if (typeof err === "object" && err !== null) {
    const e = err;
    if (typeof e.msg === "string") return e.msg;
    if (typeof e.message === "string") return e.message;
    if (typeof e.error_description === "string") return e.error_description;
    if (typeof e.error === "string") return e.error;
    if (typeof e.error === "object" && e.error !== null) {
      const nested = e.error;
      if (typeof nested.message === "string") return nested.message;
    }
  }
  return JSON.stringify(err);
};
var handleError = async (error, reject, options, namespace) => {
  if (error !== null && typeof error === "object" && "json" in error && typeof error.json === "function") {
    const responseError = error;
    let status = parseInt(String(responseError.status), 10);
    if (!Number.isFinite(status)) status = 500;
    responseError.json().then((err) => {
      const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.code) || status + "";
      reject(new StorageApiError(_getErrorMessage(err), status, statusCode, namespace, err === null || err === void 0 ? void 0 : err.code));
    }).catch(() => {
      const statusCode = status + "";
      reject(new StorageApiError(responseError.statusText || `HTTP ${status} error`, status, statusCode, namespace));
    });
  } else reject(new StorageUnknownError(_getErrorMessage(error), error, namespace));
};
var _getRequestParams = (method, options, parameters, body) => {
  const params = {
    method,
    headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
  };
  if (method === "GET" || method === "HEAD" || !body) return _objectSpread22(_objectSpread22({}, params), parameters);
  if (isPlainObject(body)) {
    var _contentType;
    const headers = (options === null || options === void 0 ? void 0 : options.headers) || {};
    let contentType;
    for (const [key, value] of Object.entries(headers)) if (key.toLowerCase() === "content-type") contentType = value;
    params.headers = setHeader(headers, "Content-Type", (_contentType = contentType) !== null && _contentType !== void 0 ? _contentType : "application/json");
    params.body = JSON.stringify(body);
  } else params.body = body;
  if (options === null || options === void 0 ? void 0 : options.duplex) params.duplex = options.duplex;
  return _objectSpread22(_objectSpread22({}, params), parameters);
};
async function _handleRequest(fetcher, method, url, options, parameters, body, namespace) {
  return new Promise((resolve, reject) => {
    fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
      if (!result.ok) throw result;
      if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
      if (namespace === "vectors") {
        const contentType = result.headers.get("content-type");
        if (result.headers.get("content-length") === "0" || result.status === 204) return {};
        if (!contentType || !contentType.includes("application/json")) return {};
      }
      return result.json();
    }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options, namespace));
  });
}
function createFetchApi(namespace = "storage") {
  return {
    get: async (fetcher, url, options, parameters) => {
      return _handleRequest(fetcher, "GET", url, options, parameters, void 0, namespace);
    },
    post: async (fetcher, url, body, options, parameters) => {
      return _handleRequest(fetcher, "POST", url, options, parameters, body, namespace);
    },
    put: async (fetcher, url, body, options, parameters) => {
      return _handleRequest(fetcher, "PUT", url, options, parameters, body, namespace);
    },
    head: async (fetcher, url, options, parameters) => {
      return _handleRequest(fetcher, "HEAD", url, _objectSpread22(_objectSpread22({}, options), {}, { noResolveJson: true }), parameters, void 0, namespace);
    },
    remove: async (fetcher, url, body, options, parameters) => {
      return _handleRequest(fetcher, "DELETE", url, options, parameters, body, namespace);
    }
  };
}
var defaultApi = createFetchApi("storage");
var { get, post, put, head, remove } = defaultApi;
var vectorsApi = createFetchApi("vectors");
var BaseApiClient = class {
  /**
  * Creates a new BaseApiClient instance
  * @param url - Base URL for API requests
  * @param headers - Default headers for API requests
  * @param fetch - Optional custom fetch implementation
  * @param namespace - Error namespace ('storage' or 'vectors')
  */
  constructor(url, headers = {}, fetch$1, namespace = "storage") {
    this.shouldThrowOnError = false;
    this.url = url;
    this.headers = normalizeHeaders(headers);
    this.fetch = resolveFetch2(fetch$1);
    this.namespace = namespace;
  }
  /**
  * Enable throwing errors instead of returning them.
  * When enabled, errors are thrown instead of returned in { data, error } format.
  *
  * @returns this - For method chaining
  */
  throwOnError() {
    this.shouldThrowOnError = true;
    return this;
  }
  /**
  * Set an HTTP header for the request.
  * Creates a shallow copy of headers to avoid mutating shared state.
  *
  * @param name - Header name
  * @param value - Header value
  * @returns this - For method chaining
  */
  setHeader(name, value) {
    this.headers = setHeader(this.headers, name, value);
    return this;
  }
  /**
  * Handles API operation with standardized error handling
  * Eliminates repetitive try-catch blocks across all API methods
  *
  * This wrapper:
  * 1. Executes the operation
  * 2. Returns { data, error: null } on success
  * 3. Returns { data: null, error } on failure (if shouldThrowOnError is false)
  * 4. Throws error on failure (if shouldThrowOnError is true)
  *
  * @typeParam T - The expected data type from the operation
  * @param operation - Async function that performs the API call
  * @returns Promise with { data, error } tuple
  *
  * @example Handling an operation
  * ```typescript
  * async listBuckets() {
  *   return this.handleOperation(async () => {
  *     return await get(this.fetch, `${this.url}/bucket`, {
  *       headers: this.headers,
  *     })
  *   })
  * }
  * ```
  */
  async handleOperation(operation) {
    var _this = this;
    try {
      return {
        data: await operation(),
        error: null
      };
    } catch (error) {
      if (_this.shouldThrowOnError) throw error;
      if (isStorageError(error)) return {
        data: null,
        error
      };
      throw error;
    }
  }
};
var _Symbol$toStringTag$1;
_Symbol$toStringTag$1 = Symbol.toStringTag;
var StreamDownloadBuilder = class {
  constructor(downloadFn, shouldThrowOnError) {
    this.downloadFn = downloadFn;
    this.shouldThrowOnError = shouldThrowOnError;
    this[_Symbol$toStringTag$1] = "StreamDownloadBuilder";
    this.promise = null;
  }
  then(onfulfilled, onrejected) {
    return this.getPromise().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.getPromise().catch(onrejected);
  }
  finally(onfinally) {
    return this.getPromise().finally(onfinally);
  }
  getPromise() {
    if (!this.promise) this.promise = this.execute();
    return this.promise;
  }
  async execute() {
    var _this = this;
    try {
      return {
        data: (await _this.downloadFn()).body,
        error: null
      };
    } catch (error) {
      if (_this.shouldThrowOnError) throw error;
      if (isStorageError(error)) return {
        data: null,
        error
      };
      throw error;
    }
  }
};
var _Symbol$toStringTag;
_Symbol$toStringTag = Symbol.toStringTag;
var BlobDownloadBuilder = class {
  constructor(downloadFn, shouldThrowOnError) {
    this.downloadFn = downloadFn;
    this.shouldThrowOnError = shouldThrowOnError;
    this[_Symbol$toStringTag] = "BlobDownloadBuilder";
    this.promise = null;
  }
  asStream() {
    return new StreamDownloadBuilder(this.downloadFn, this.shouldThrowOnError);
  }
  then(onfulfilled, onrejected) {
    return this.getPromise().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.getPromise().catch(onrejected);
  }
  finally(onfinally) {
    return this.getPromise().finally(onfinally);
  }
  getPromise() {
    if (!this.promise) this.promise = this.execute();
    return this.promise;
  }
  async execute() {
    var _this = this;
    try {
      return {
        data: await (await _this.downloadFn()).blob(),
        error: null
      };
    } catch (error) {
      if (_this.shouldThrowOnError) throw error;
      if (isStorageError(error)) return {
        data: null,
        error
      };
      throw error;
    }
  }
};
var DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
};
var DEFAULT_FILE_OPTIONS = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: false
};
var StorageFileApi = class extends BaseApiClient {
  constructor(url, headers = {}, bucketId, fetch$1) {
    super(url, headers, fetch$1, "storage");
    this.bucketId = bucketId;
  }
  /**
  * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
  *
  * @param method HTTP method.
  * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
  * @param fileBody The body of the file to be stored in the bucket.
  */
  async uploadOrUpdate(method, path, fileBody, fileOptions) {
    var _this = this;
    return _this.handleOperation(async () => {
      let body;
      const options = _objectSpread22(_objectSpread22({}, DEFAULT_FILE_OPTIONS), fileOptions);
      let headers = _objectSpread22(_objectSpread22({}, _this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
      const metadata = options.metadata;
      if (typeof Blob !== "undefined" && fileBody instanceof Blob || typeof FormData !== "undefined" && fileBody instanceof FormData) body = _this.prepareUploadFormData(fileBody, options);
      else {
        body = fileBody;
        headers["cache-control"] = `max-age=${options.cacheControl}`;
        headers["content-type"] = options.contentType;
        if (metadata) headers["x-metadata"] = _this.toBase64(_this.encodeMetadata(metadata));
        if ((typeof ReadableStream !== "undefined" && body instanceof ReadableStream || body && typeof body === "object" && "pipe" in body && typeof body.pipe === "function") && !options.duplex) options.duplex = "half";
      }
      if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) for (const [key, value] of Object.entries(fileOptions.headers)) headers = setHeader(headers, key, value);
      const cleanPath = _this._removeEmptyFolders(path);
      const _path = _this._getFinalPath(cleanPath);
      const data = await (method == "PUT" ? put : post)(_this.fetch, `${_this.url}/object/${_path}`, body, _objectSpread22({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
      return {
        path: cleanPath,
        id: data.Id,
        fullPath: data.Key
      };
    });
  }
  /**
  * Uploads a file to an existing bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
  * @param fileBody The body of the file to be stored in the bucket.
  * @param fileOptions Optional file upload options including cacheControl, contentType, upsert, and metadata.
  * @returns Promise with response containing file path, id, and fullPath or error
  *
  * @example Upload file
  * ```js
  * const avatarFile = event.target.files[0]
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .upload('public/avatar1.png', avatarFile, {
  *     cacheControl: '3600',
  *     upsert: false
  *   })
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "path": "public/avatar1.png",
  *     "fullPath": "avatars/public/avatar1.png"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @example Upload file using `ArrayBuffer` from base64 file data
  * ```js
  * import { decode } from 'base64-arraybuffer'
  *
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .upload('public/avatar1.png', decode('base64FileData'), {
  *     contentType: 'image/png'
  *   })
  * ```
  *
  * @example Handling errors
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .upload('public/avatar1.png', avatarFile)
  *
  * if (error) {
  *   // Log the full error so fields like `statusCode` and `error` (the
  *   // Storage error name, e.g. "Duplicate") aren't hidden behind `error.message`.
  *   console.error(error)
  *   return
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: only `insert` when you are uploading new files and `select`, `insert` and `update` when you are upserting files
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  * - For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Upload file using `ArrayBuffer` from base64 file data instead, see example below.
  */
  async upload(path, fileBody, fileOptions) {
    return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
  }
  /**
  * Upload a file with a token generated from `createSignedUploadUrl`.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
  * @param token The token generated from `createSignedUploadUrl`
  * @param fileBody The body of the file to be stored in the bucket.
  * @param fileOptions HTTP headers (cacheControl, contentType, etc.).
  * **Note:** The `upsert` option has no effect here. To enable upsert behavior,
  * pass `{ upsert: true }` when calling `createSignedUploadUrl()` instead.
  * @returns Promise with response containing file path and fullPath or error
  *
  * @example Upload to a signed URL
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "path": "folder/cat.jpg",
  *     "fullPath": "avatars/folder/cat.jpg"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async uploadToSignedUrl(path, token, fileBody, fileOptions) {
    var _this3 = this;
    const cleanPath = _this3._removeEmptyFolders(path);
    const _path = _this3._getFinalPath(cleanPath);
    const url = new URL(_this3.url + `/object/upload/sign/${_path}`);
    url.searchParams.set("token", token);
    return _this3.handleOperation(async () => {
      let body;
      const options = _objectSpread22(_objectSpread22({}, DEFAULT_FILE_OPTIONS), fileOptions);
      let headers = _objectSpread22(_objectSpread22({}, _this3.headers), { "x-upsert": String(options.upsert) });
      const metadata = options.metadata;
      if (typeof Blob !== "undefined" && fileBody instanceof Blob || typeof FormData !== "undefined" && fileBody instanceof FormData) body = _this3.prepareUploadFormData(fileBody, options);
      else {
        body = fileBody;
        headers["cache-control"] = `max-age=${options.cacheControl}`;
        headers["content-type"] = options.contentType;
        if (metadata) headers["x-metadata"] = _this3.toBase64(_this3.encodeMetadata(metadata));
        if ((typeof ReadableStream !== "undefined" && body instanceof ReadableStream || body && typeof body === "object" && "pipe" in body && typeof body.pipe === "function") && !options.duplex) options.duplex = "half";
      }
      if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) for (const [key, value] of Object.entries(fileOptions.headers)) headers = setHeader(headers, key, value);
      return {
        path: cleanPath,
        fullPath: (await put(_this3.fetch, url.toString(), body, _objectSpread22({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}))).Key
      };
    });
  }
  /**
  * Creates a signed upload URL.
  * Signed upload URLs can be used to upload files to the bucket without further authentication.
  * They are valid for 2 hours.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The file path, including the current file name. For example `folder/image.png`.
  * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
  * @returns Promise with response containing signed upload URL, token, and path or error
  *
  * @example Create Signed Upload URL
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .createSignedUploadUrl('folder/cat.jpg')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "signedUrl": "https://example.supabase.co/storage/v1/object/upload/sign/avatars/folder/cat.jpg?token=<TOKEN>",
  *     "path": "folder/cat.jpg",
  *     "token": "<TOKEN>"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `insert`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async createSignedUploadUrl(path, options) {
    var _this4 = this;
    return _this4.handleOperation(async () => {
      let _path = _this4._getFinalPath(path);
      const headers = _objectSpread22({}, _this4.headers);
      if (options === null || options === void 0 ? void 0 : options.upsert) headers["x-upsert"] = "true";
      const data = await post(_this4.fetch, `${_this4.url}/object/upload/sign/${_path}`, {}, { headers });
      const url = new URL(_this4.url + data.url);
      const token = url.searchParams.get("token");
      if (!token) throw new StorageError("No token returned by API");
      return {
        signedUrl: url.toString(),
        path,
        token
      };
    });
  }
  /**
  * Replaces an existing file at the specified path with a new one.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
  * @param fileBody The body of the file to be stored in the bucket.
  * @param fileOptions Optional file upload options including cacheControl, contentType, and metadata.
  * **Note:** The `upsert` option has no effect here. `update()` always replaces the
  * file at the given path, so the `x-upsert` header is not sent. To control upsert
  * behavior, use `upload()` instead.
  * @returns Promise with response containing file path, id, and fullPath or error
  *
  * @example Update file
  * ```js
  * const avatarFile = event.target.files[0]
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .update('public/avatar1.png', avatarFile, {
  *     cacheControl: '3600'
  *   })
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "path": "public/avatar1.png",
  *     "fullPath": "avatars/public/avatar1.png"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @example Update file using `ArrayBuffer` from base64 file data
  * ```js
  * import {decode} from 'base64-arraybuffer'
  *
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .update('public/avatar1.png', decode('base64FileData'), {
  *     contentType: 'image/png'
  *   })
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `update` and `select`
  * - `update()` always replaces the file at the given path regardless of the `upsert` option.
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  * - For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Update file using `ArrayBuffer` from base64 file data instead, see example below.
  */
  async update(path, fileBody, fileOptions) {
    return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
  }
  /**
  * Moves an existing file to a new path in the same bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
  * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
  * @param options The destination options.
  * @param options.sourceVersionId The version id of the source object to move.
  * @returns Promise with response containing success message or error
  *
  * @example Move file
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .move('public/avatar1.png', 'private/avatar2.png')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "message": "Successfully moved"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `update` and `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async move(fromPath, toPath, options) {
    var _this6 = this;
    return _this6.handleOperation(async () => {
      return await post(_this6.fetch, `${_this6.url}/object/move`, {
        bucketId: _this6.bucketId,
        sourceKey: fromPath,
        destinationKey: toPath,
        destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket,
        sourceVersionId: options === null || options === void 0 ? void 0 : options.sourceVersionId
      }, { headers: _this6.headers });
    });
  }
  /**
  * Copies an existing file to a new path in the same bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
  * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
  * @param options The destination options.
  * @param options.sourceVersionId The version id of the source object to copy.
  * @returns Promise with response containing copied file path or error
  *
  * @example Copy file
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .copy('public/avatar1.png', 'private/avatar2.png')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "path": "avatars/private/avatar2.png"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `insert` and `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async copy(fromPath, toPath, options) {
    var _this7 = this;
    return _this7.handleOperation(async () => {
      return { path: (await post(_this7.fetch, `${_this7.url}/object/copy`, {
        bucketId: _this7.bucketId,
        sourceKey: fromPath,
        destinationKey: toPath,
        destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket,
        sourceVersionId: options === null || options === void 0 ? void 0 : options.sourceVersionId
      }, { headers: _this7.headers })).Key };
    });
  }
  /**
  * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The file path, including the current file name. For example `folder/image.png`.
  * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
  * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
  * @param options.transform Transform the asset before serving it to the client.
  * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
  * @param options.versionId Create a signed URL for a specific object version rather than the current one.
  * @returns Promise with response containing signed URL or error
  *
  * @example Create Signed URL
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .createSignedUrl('folder/avatar1.png', 60)
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @example Create a signed URL for an asset with transformations
  * ```js
  * const { data } = await supabase
  *   .storage
  *   .from('avatars')
  *   .createSignedUrl('folder/avatar1.png', 60, {
  *     transform: {
  *       width: 100,
  *       height: 100,
  *     }
  *   })
  * ```
  *
  * @example Create a signed URL which triggers the download of the asset
  * ```js
  * const { data } = await supabase
  *   .storage
  *   .from('avatars')
  *   .createSignedUrl('folder/avatar1.png', 60, {
  *     download: true,
  *   })
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async createSignedUrl(path, expiresIn, options) {
    var _this8 = this;
    return _this8.handleOperation(async () => {
      let _path = _this8._getFinalPath(path);
      const hasTransform = typeof (options === null || options === void 0 ? void 0 : options.transform) === "object" && options.transform !== null && Object.keys(options.transform).length > 0;
      let data = await post(_this8.fetch, `${_this8.url}/object/sign/${_path}`, _objectSpread22(_objectSpread22({ expiresIn }, hasTransform ? { transform: options.transform } : {}), (options === null || options === void 0 ? void 0 : options.versionId) != null ? { versionId: options.versionId } : {}), { headers: _this8.headers });
      const query2 = new URLSearchParams();
      if (options === null || options === void 0 ? void 0 : options.download) query2.set("download", options.download === true ? "" : options.download);
      if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query2.set("cacheNonce", String(options.cacheNonce));
      const queryString = query2.toString();
      return { signedUrl: encodeURI(`${_this8.url}${data.signedURL}${queryString ? `&${queryString}` : ""}`) };
    });
  }
  /**
  * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
  * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
  * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
  * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
  * @returns Promise with response containing array of objects with signedUrl, path, and error or error
  *
  * @example Create Signed URLs
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": [
  *     {
  *       "error": null,
  *       "path": "folder/avatar1.png",
  *       "signedURL": "/object/sign/avatars/folder/avatar1.png?token=<TOKEN>",
  *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
  *     },
  *     {
  *       "error": null,
  *       "path": "folder/avatar2.png",
  *       "signedURL": "/object/sign/avatars/folder/avatar2.png?token=<TOKEN>",
  *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar2.png?token=<TOKEN>"
  *     }
  *   ],
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async createSignedUrls(paths, expiresIn, options) {
    var _this9 = this;
    return _this9.handleOperation(async () => {
      const data = await post(_this9.fetch, `${_this9.url}/object/sign/${_this9.bucketId}`, {
        expiresIn,
        paths
      }, { headers: _this9.headers });
      const query2 = new URLSearchParams();
      if (options === null || options === void 0 ? void 0 : options.download) query2.set("download", options.download === true ? "" : options.download);
      if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query2.set("cacheNonce", String(options.cacheNonce));
      const queryString = query2.toString();
      return data.map((datum) => _objectSpread22(_objectSpread22({}, datum), {}, { signedUrl: datum.signedURL ? encodeURI(`${_this9.url}${datum.signedURL}${queryString ? `&${queryString}` : ""}`) : null }));
    });
  }
  /**
  * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
  * @param options Optional settings: `transform` to transform the asset before serving it to the client, `cacheNonce` to append a cache nonce parameter to the URL to invalidate the cache, and `versionId` to download a specific object version.
  * @param parameters Additional fetch parameters like signal for cancellation. Supports standard fetch options including cache control.
  * @returns BlobDownloadBuilder instance for downloading the file
  *
  * @example Download file
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .download('folder/avatar1.png')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": <BLOB>,
  *   "error": null
  * }
  * ```
  *
  * @example Download file with transformations
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .download('folder/avatar1.png', {
  *     transform: {
  *       width: 100,
  *       height: 100,
  *       quality: 80
  *     }
  *   })
  * ```
  *
  * @example Download with cache control (useful in Edge Functions)
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .download('folder/avatar1.png', {}, { cache: 'no-store' })
  * ```
  *
  * @example Download with abort signal
  * ```js
  * const controller = new AbortController()
  * setTimeout(() => controller.abort(), 5000)
  *
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .download('folder/avatar1.png', {}, { signal: controller.signal })
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  download(path, options, parameters) {
    const renderPath = typeof (options === null || options === void 0 ? void 0 : options.transform) === "object" && options.transform !== null && Object.keys(options.transform).length > 0 ? "render/image/authenticated" : "object";
    const query2 = new URLSearchParams();
    if (options === null || options === void 0 ? void 0 : options.transform) this.applyTransformOptsToQuery(query2, options.transform);
    if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query2.set("cacheNonce", String(options.cacheNonce));
    if ((options === null || options === void 0 ? void 0 : options.versionId) != null) query2.set("versionId", String(options.versionId));
    const queryString = query2.toString();
    const _path = this._getFinalPath(path);
    const downloadFn = () => get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString ? `?${queryString}` : ""}`, {
      headers: this.headers,
      noResolveJson: true
    }, parameters);
    return new BlobDownloadBuilder(downloadFn, this.shouldThrowOnError);
  }
  /**
  * Retrieves the details of an existing file.
  *
  * Returns detailed file metadata including size, content type, and timestamps.
  * Note: The API returns `last_modified` field, not `updated_at`.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The file path, including the file name. For example `folder/image.png`.
  * @param options Optional settings, including `versionId` to retrieve a specific object version.
  * @returns Promise with response containing file metadata or error
  *
  * @example Get file info
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .info('folder/avatar1.png')
  *
  * if (data) {
  *   console.log('Last modified:', data.lastModified)
  *   console.log('Size:', data.size)
  * }
  * ```
  */
  async info(path, options) {
    var _this10 = this;
    const _path = _this10._getFinalPath(path);
    const query2 = new URLSearchParams();
    if ((options === null || options === void 0 ? void 0 : options.versionId) != null) query2.set("versionId", String(options.versionId));
    const queryString = query2.toString();
    return _this10.handleOperation(async () => {
      return recursiveToCamel(await get(_this10.fetch, `${_this10.url}/object/info/${_path}${queryString ? `?${queryString}` : ""}`, { headers: _this10.headers }));
    });
  }
  /**
  * Checks the existence of a file.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The file path, including the file name. For example `folder/image.png`.
  * @returns Promise with response containing boolean indicating file existence or error
  *
  * @example Check file existence
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .exists('folder/avatar1.png')
  * ```
  */
  async exists(path) {
    var _this11 = this;
    const _path = _this11._getFinalPath(path);
    try {
      await head(_this11.fetch, `${_this11.url}/object/${_path}`, { headers: _this11.headers });
      return {
        data: true,
        error: null
      };
    } catch (error) {
      if (_this11.shouldThrowOnError) throw error;
      if (isStorageError(error)) {
        var _error$originalError;
        const status = error instanceof StorageApiError ? error.status : error instanceof StorageUnknownError ? (_error$originalError = error.originalError) === null || _error$originalError === void 0 ? void 0 : _error$originalError.status : void 0;
        if (status !== void 0 && [400, 404].includes(status)) return {
          data: false,
          error
        };
      }
      throw error;
    }
  }
  /**
  * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
  * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
  * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
  * @param options.transform Transform the asset before serving it to the client.
  * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
  * @param options.versionId Return the URL for a specific object version rather than the current one.
  * @returns Object with public URL
  *
  * @example Returns the URL for an asset in a public bucket
  * ```js
  * const { data } = supabase
  *   .storage
  *   .from('public-bucket')
  *   .getPublicUrl('folder/avatar1.png')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "publicUrl": "https://example.supabase.co/storage/v1/object/public/public-bucket/folder/avatar1.png"
  *   }
  * }
  * ```
  *
  * @example Returns the URL for an asset in a public bucket with transformations
  * ```js
  * const { data } = supabase
  *   .storage
  *   .from('public-bucket')
  *   .getPublicUrl('folder/avatar1.png', {
  *     transform: {
  *       width: 100,
  *       height: 100,
  *     }
  *   })
  * ```
  *
  * @example Returns the URL which triggers the download of an asset in a public bucket
  * ```js
  * const { data } = supabase
  *   .storage
  *   .from('public-bucket')
  *   .getPublicUrl('folder/avatar1.png', {
  *     download: true,
  *   })
  * ```
  *
  * @remarks
  * - The bucket needs to be set to public, either via [updateBucket()](/docs/reference/javascript/storage-updatebucket) or by going to Storage on [supabase.com/dashboard](https://supabase.com/dashboard), clicking the overflow menu on a bucket and choosing "Make public"
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  getPublicUrl(path, options) {
    const _path = this._getFinalPath(path);
    const query2 = new URLSearchParams();
    if (options === null || options === void 0 ? void 0 : options.download) query2.set("download", options.download === true ? "" : options.download);
    if (options === null || options === void 0 ? void 0 : options.transform) this.applyTransformOptsToQuery(query2, options.transform);
    if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query2.set("cacheNonce", String(options.cacheNonce));
    if ((options === null || options === void 0 ? void 0 : options.versionId) != null) query2.set("versionId", String(options.versionId));
    const queryString = query2.toString();
    const renderPath = typeof (options === null || options === void 0 ? void 0 : options.transform) === "object" && options.transform !== null && Object.keys(options.transform).length > 0 ? "render/image" : "object";
    return { data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}`) + (queryString ? `?${queryString}` : "") } };
  }
  /**
  * Deletes files within the same bucket
  *
  * Returns an array of FileObject entries for the deleted files. Note that deprecated
  * fields like `bucket_id` may or may not be present in the response - do not rely on them.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param paths An array of files to delete. Each entry is either a path (deletes whichever
  * version is currently at that path, e.g. `'folder/image.png'`), or `{ path, versionId }` to
  * delete an exact version current or archived (e.g. `{ path: 'folder/image.png', versionId: '...' }`).
  * @returns Promise with response containing array of deleted file objects or error
  *
  * @example Delete file
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .remove(['folder/avatar1.png'])
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": [],
  *   "error": null
  * }
  * ```
  *
  * @example Delete a specific object version
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .remove([{ path: 'folder/avatar1.png', versionId: 'noncurrent-version-id' }])
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `delete` and `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async remove(paths) {
    var _this12 = this;
    return _this12.handleOperation(async () => {
      return await remove(_this12.fetch, `${_this12.url}/object/${_this12.bucketId}`, { prefixes: paths }, { headers: _this12.headers });
    });
  }
  /**
  * Purges the CDN cache for a single object in this bucket.
  *
  * Maps to `DELETE /cdn/{bucket}/{path}` on the Storage API. The server
  * issues a CDN invalidation for the object and returns `{ message: 'success' }`.
  *
  * **Requires the `service_role` key.** The underlying endpoint enforces
  * `service_role` JWT — calls made with the anon key or a user JWT will be
  * rejected by the server.
  *
  * **Hosted CDN feature.** On self-hosted Supabase, the Storage service must
  * have `CDN_PURGE_ENDPOINT_URL` configured and the `purgeCache` tenant
  * feature enabled, otherwise the server returns an error.
  *
  * Operates on a single object path. There is no wildcard or recursion: pass
  * the exact path of the object you want invalidated.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The path (relative to the bucket) of the object to purge, e.g. `folder/avatar.png`.
  * @param options Optional purge cache options.
  * @param options.transformations If true, purges only transformations (resized/formatted variants), leaving the original cached file intact.
  * @param parameters Optional fetch parameters such as an `AbortController` signal.
  * @returns Promise with `{ data: { message }, error: null }` on success or `{ data: null, error }` on failure.
  *
  * @example Purge a single cached object
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .purgeCache('folder/avatar1.png')
  * ```
  *
  * @example Purge only transformations for a single object
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .purgeCache('folder/avatar1.png', { transformations: true })
  * ```
  */
  async purgeCache(path, options, parameters) {
    var _this13 = this;
    return _this13.handleOperation(async () => {
      const _path = encodeStoragePath(_this13._getFinalPath(path));
      const query2 = new URLSearchParams();
      if (options === null || options === void 0 ? void 0 : options.transformations) query2.set("transformations", "true");
      const queryString = query2.toString();
      return await remove(_this13.fetch, `${_this13.url}/cdn/${_path}${queryString ? `?${queryString}` : ""}`, {}, { headers: _this13.headers }, parameters);
    });
  }
  /**
  * Get file metadata
  * @param id the file id to retrieve metadata
  */
  /**
  * Update file metadata
  * @param id the file id to update metadata
  * @param meta the new file metadata
  */
  /**
  * Lists all the files and folders within a path of the bucket.
  *
  * **Important:** For folder entries, fields like `id`, `updated_at`, `created_at`,
  * `last_accessed_at`, and `metadata` will be `null`. Only files have these fields populated.
  * Additionally, deprecated fields like `bucket_id`, `owner`, and `buckets` are NOT returned
  * by this method.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param path The folder path.
  * @param options Search options including limit (defaults to 100), offset, sortBy, and search
  * @param parameters Optional fetch parameters including signal for cancellation
  * @returns Promise with response containing array of files/folders or error
  *
  * @example List files in a bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .list('folder', {
  *     limit: 100,
  *     offset: 0,
  *     sortBy: { column: 'name', order: 'asc' },
  *   })
  *
  * // Handle files vs folders
  * data?.forEach(item => {
  *   if (item.id !== null) {
  *     // It's a file
  *     console.log('File:', item.name, 'Size:', item.metadata?.size)
  *   } else {
  *     // It's a folder
  *     console.log('Folder:', item.name)
  *   }
  * })
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "avatar1.png",
  *       "id": "e668cf7f-821b-4a2f-9dce-7dfa5dd1cfd2",
  *       "updated_at": "2024-05-22T23:06:05.580Z",
  *       "created_at": "2024-05-22T23:04:34.443Z",
  *       "last_accessed_at": "2024-05-22T23:04:34.443Z",
  *       "metadata": {
  *         "eTag": "\"c5e8c553235d9af30ef4f6e280790b92\"",
  *         "size": 32175,
  *         "mimetype": "image/png",
  *         "cacheControl": "max-age=3600",
  *         "lastModified": "2024-05-22T23:06:05.574Z",
  *         "contentLength": 32175,
  *         "httpStatusCode": 200
  *       }
  *     }
  *   ],
  *   "error": null
  * }
  * ```
  *
  * @example Search files in a bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .list('folder', {
  *     limit: 100,
  *     offset: 0,
  *     sortBy: { column: 'name', order: 'asc' },
  *     search: 'jon'
  *   })
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: none
  *   - `objects` table permissions: `select`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async list(path, options, parameters) {
    var _this14 = this;
    return _this14.handleOperation(async () => {
      const sortBy = (options === null || options === void 0 ? void 0 : options.sortBy) ? _objectSpread22(_objectSpread22({}, DEFAULT_SEARCH_OPTIONS.sortBy), options.sortBy) : DEFAULT_SEARCH_OPTIONS.sortBy;
      const body = _objectSpread22(_objectSpread22(_objectSpread22({}, DEFAULT_SEARCH_OPTIONS), options), {}, {
        sortBy,
        prefix: path || ""
      });
      return await post(_this14.fetch, `${_this14.url}/object/list/${_this14.bucketId}`, body, { headers: _this14.headers }, parameters);
    });
  }
  /**
  * Lists all the files and folders within a bucket using the V2 API with pagination support.
  *
  * **Important:** Folder entries in the `folders` array only contain `name` and optionally `key` —
  * they have no `id`, timestamps, or `metadata` fields. Full file metadata is only available
  * on entries in the `objects` array.
  *
  * @experimental this method signature might change in the future
  *
  * @category Storage
  * @subcategory File Buckets
  * @param options Search options including prefix, cursor for pagination, limit, with_delimiter
  * @param parameters Optional fetch parameters including signal for cancellation
  * @returns Promise with response containing folders/objects arrays with pagination info or error
  *
  * @example List files with pagination
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .from('avatars')
  *   .listV2({
  *     prefix: 'folder/',
  *     limit: 100,
  *   })
  *
  * // Handle pagination
  * if (data?.hasNext) {
  *   const nextPage = await supabase
  *     .storage
  *     .from('avatars')
  *     .listV2({
  *       prefix: 'folder/',
  *       cursor: data.nextCursor,
  *     })
  * }
  *
  * // Handle files vs folders
  * data?.objects.forEach(file => {
  *   if (file.id !== null) {
  *     console.log('File:', file.name, 'Size:', file.metadata?.size)
  *   }
  * })
  * data?.folders.forEach(folder => {
  *   console.log('Folder:', folder.name)
  * })
  * ```
  */
  async listV2(options, parameters) {
    var _this15 = this;
    return _this15.handleOperation(async () => {
      const body = _objectSpread22({}, options);
      return await post(_this15.fetch, `${_this15.url}/object/list-v2/${_this15.bucketId}`, body, { headers: _this15.headers }, parameters);
    });
  }
  prepareUploadFormData(fileBody, options) {
    const body = new FormData();
    const files = [];
    if (fileBody instanceof FormData) fileBody.forEach((value, name) => {
      if (typeof value === "string") body.append(name, value);
      else files.push([name, value]);
    });
    else files.push(["", fileBody]);
    if (!body.has("cacheControl")) body.append("cacheControl", options.cacheControl);
    if (options.metadata && !body.has("metadata")) body.append("metadata", this.encodeMetadata(options.metadata));
    for (const [name, file] of files) body.append(name, file);
    return body;
  }
  encodeMetadata(metadata) {
    return JSON.stringify(metadata);
  }
  toBase64(data) {
    if (typeof Buffer !== "undefined") return Buffer.from(data).toString("base64");
    return btoa(data);
  }
  _getFinalPath(path) {
    return `${this.bucketId}/${path.replace(/^\/+/, "")}`;
  }
  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  /** Modifies the `query`, appending values the from `transform` */
  applyTransformOptsToQuery(query2, transform) {
    if (transform.width) query2.set("width", transform.width.toString());
    if (transform.height) query2.set("height", transform.height.toString());
    if (transform.resize) query2.set("resize", transform.resize);
    if (transform.format) query2.set("format", transform.format);
    if (transform.quality) query2.set("quality", transform.quality.toString());
    return query2;
  }
};
var version2 = "2.117.3";
var DEFAULT_HEADERS = { "X-Client-Info": `storage-js/${version2}` };
var StorageBucketApi = class extends BaseApiClient {
  constructor(url, headers = {}, fetch$1, opts) {
    const baseUrl = new URL(url);
    if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
      if (/supabase\.(co|in|red)$/.test(baseUrl.hostname) && !baseUrl.hostname.includes("storage.supabase.")) baseUrl.hostname = baseUrl.hostname.replace("supabase.", "storage.supabase.");
    }
    const finalUrl = baseUrl.href.replace(/\/$/, "");
    const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), headers);
    super(finalUrl, finalHeaders, fetch$1, "storage");
  }
  /**
  * Retrieves the details of all Storage buckets within an existing project.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param options Query parameters for listing buckets
  * @param options.limit Maximum number of buckets to return
  * @param options.offset Number of buckets to skip
  * @param options.sortColumn Column to sort by ('id', 'name', 'created_at', 'updated_at')
  * @param options.sortOrder Sort order ('asc' or 'desc')
  * @param options.search Search term to filter bucket names
  * @returns Promise with response containing array of buckets or error
  *
  * @example List buckets
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .listBuckets()
  * ```
  *
  * @example List buckets with options
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .listBuckets({
  *     limit: 10,
  *     offset: 0,
  *     sortColumn: 'created_at',
  *     sortOrder: 'desc',
  *     search: 'prod'
  *   })
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async listBuckets(options) {
    var _this = this;
    return _this.handleOperation(async () => {
      const queryString = _this.listBucketOptionsToQueryString(options);
      return await get(_this.fetch, `${_this.url}/bucket${queryString}`, { headers: _this.headers });
    });
  }
  /**
  * Retrieves the details of an existing Storage bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket you would like to retrieve.
  * @returns Promise with response containing bucket details or error
  *
  * @example Get bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .getBucket('avatars')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "id": "avatars",
  *     "name": "avatars",
  *     "owner": "",
  *     "public": false,
  *     "file_size_limit": 1024,
  *     "allowed_mime_types": [
  *       "image/png"
  *     ],
  *     "created_at": "2024-05-22T22:26:05.100Z",
  *     "updated_at": "2024-05-22T22:26:05.100Z"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async getBucket(id) {
    var _this2 = this;
    return _this2.handleOperation(async () => {
      return await get(_this2.fetch, `${_this2.url}/bucket/${id}`, { headers: _this2.headers });
    });
  }
  /**
  * Creates a new Storage bucket
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id A unique identifier for the bucket you are creating.
  * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
  * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
  * The global file size limit takes precedence over this value.
  * The default value is null, which doesn't set a per bucket file size limit.
  * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
  * The default value is null, which allows files with all mime types to be uploaded.
  * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
  * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
  *   - default bucket type is `STANDARD`
  * @param options.versioningStatus the bucket's initial object versioning status.
  * The default value is `DISABLED`
  * @returns Promise with response containing newly created bucket name or error
  *
  * @example Create bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .createBucket('avatars', {
  *     public: false,
  *     allowedMimeTypes: ['image/png'],
  *     fileSizeLimit: 1024
  *   })
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "name": "avatars"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `insert`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async createBucket(id, options = { public: false }) {
    var _this3 = this;
    return _this3.handleOperation(async () => {
      return await post(_this3.fetch, `${_this3.url}/bucket`, {
        id,
        name: id,
        type: options.type,
        public: options.public,
        file_size_limit: options.fileSizeLimit,
        allowed_mime_types: options.allowedMimeTypes,
        versioning_status: options.versioningStatus
      }, { headers: _this3.headers });
    });
  }
  /**
  * Updates a Storage bucket
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id A unique identifier for the bucket you are updating.
  * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
  * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
  * The global file size limit takes precedence over this value.
  * The default value is null, which doesn't set a per bucket file size limit.
  * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
  * The default value is null, which allows files with all mime types to be uploaded.
  * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
  * @param options.versioningStatus the bucket's new object versioning status. `DISABLED` is not
  * valid here, there's no transition back to it once versioning has been touched.
  * @returns Promise with response containing success message or error
  *
  * @example Update bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .updateBucket('avatars', {
  *     public: false,
  *     allowedMimeTypes: ['image/png'],
  *     fileSizeLimit: 1024
  *   })
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "message": "Successfully updated"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select` and `update`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async updateBucket(id, options) {
    var _this4 = this;
    return _this4.handleOperation(async () => {
      return await put(_this4.fetch, `${_this4.url}/bucket/${id}`, {
        id,
        name: id,
        public: options.public,
        file_size_limit: options.fileSizeLimit,
        allowed_mime_types: options.allowedMimeTypes,
        versioning_status: options.versioningStatus
      }, { headers: _this4.headers });
    });
  }
  /**
  * Removes all objects inside a single bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket you would like to empty.
  * @returns Promise with success message or error
  *
  * @example Empty bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .emptyBucket('avatars')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "message": "Successfully emptied"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select`
  *   - `objects` table permissions: `select` and `delete`
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async emptyBucket(id) {
    var _this5 = this;
    return _this5.handleOperation(async () => {
      return await post(_this5.fetch, `${_this5.url}/bucket/${id}/empty`, {}, { headers: _this5.headers });
    });
  }
  /**
  * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
  * You must first `empty()` the bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket you would like to delete.
  * @returns Promise with success message or error
  *
  * @example Delete bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .deleteBucket('avatars')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "message": "Successfully deleted"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select` and `delete`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async deleteBucket(id) {
    var _this6 = this;
    return _this6.handleOperation(async () => {
      return await remove(_this6.fetch, `${_this6.url}/bucket/${id}`, {}, { headers: _this6.headers });
    });
  }
  /**
  * Returns the lifecycle policy stored on a bucket.
  *
  * Fails with `NoSuchLifecycleConfiguration` when the bucket has no policy.
  *
  * These rules expire previous versions of objects, not the current one.
  * Turn versioning on or there is nothing for the policy to act on.
  * Standard buckets only. Returns `FeatureNotEnabled` if lifecycle is off
  * for the project.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket.
  * @returns Promise with the lifecycle configuration or error
  *
  * @example Get lifecycle configuration
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .getBucketLifecycle('avatars')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "rules": [
  *       {
  *         "id": "expire-history",
  *         "status": "Enabled",
  *         "filter": {},
  *         "noncurrentVersionExpiration": {
  *           "noncurrentDays": 30,
  *           "newerNoncurrentVersions": 2
  *         }
  *       }
  *     ]
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async getBucketLifecycle(id) {
    var _this7 = this;
    return _this7.handleOperation(async () => {
      return await get(_this7.fetch, _this7.bucketLifecycleUrl(id), { headers: _this7.headers });
    });
  }
  /**
  * Replaces the lifecycle policy on a bucket.
  *
  * The `rules` array you send is the whole policy. Anything previously stored
  * is overwritten. Send at least one rule. Call {@link deleteBucketLifecycle}
  * to remove the policy.
  *
  * Each rule currently supports only `noncurrentVersionExpiration`. `filter`
  * is required and must be `{}`. Prefix filters, tag filters, and current-object
  * expiration are rejected. Rule IDs must be unique. Omit `id` and the
  * server generates one.
  *
  * Standard buckets only. Returns `FeatureNotEnabled` if lifecycle is off
  * for the project.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket.
  * @param configuration The full lifecycle configuration to store.
  * @returns Promise with the stored configuration or error
  *
  * @example Replace lifecycle configuration
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .updateBucketLifecycle('avatars', {
  *     rules: [
  *       {
  *         id: 'expire-history',
  *         status: 'Enabled',
  *         filter: {},
  *         noncurrentVersionExpiration: {
  *           noncurrentDays: 30,
  *           newerNoncurrentVersions: 2,
  *         },
  *       },
  *     ],
  *   })
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select` and `update`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async updateBucketLifecycle(id, configuration) {
    var _this8 = this;
    return _this8.handleOperation(async () => {
      return await put(_this8.fetch, _this8.bucketLifecycleUrl(id), configuration, { headers: _this8.headers });
    });
  }
  /**
  * Removes the lifecycle policy from a bucket.
  *
  * Safe to call when no policy is stored. The response is still success.
  * Standard buckets only. Returns `FeatureNotEnabled` if lifecycle is off
  * for the project.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket.
  * @returns Promise with success message or error
  *
  * @example Delete lifecycle configuration
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .deleteBucketLifecycle('avatars')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "message": "Successfully deleted"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - RLS policy permissions required:
  *   - `buckets` table permissions: `select` and `update`
  *   - `objects` table permissions: none
  * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
  */
  async deleteBucketLifecycle(id) {
    var _this9 = this;
    return _this9.handleOperation(async () => {
      return await remove(_this9.fetch, _this9.bucketLifecycleUrl(id), {}, { headers: _this9.headers });
    });
  }
  /**
  * Purges the CDN cache for an entire bucket.
  *
  * Maps to `DELETE /cdn/{bucket}` on the Storage API. The server
  * issues a CDN invalidation for the bucket and returns `{ message: 'success' }`.
  *
  * **Requires the `service_role` key.** The underlying endpoint enforces
  * `service_role` JWT — calls made with the anon key or a user JWT will be
  * rejected by the server.
  *
  * **Hosted CDN feature.** On self-hosted Supabase, the Storage service must
  * have `CDN_PURGE_ENDPOINT_URL` configured and the `purgeCache` tenant
  * feature enabled, otherwise the server returns an error.
  *
  * @category Storage
  * @subcategory File Buckets
  * @param id The unique identifier of the bucket you would like to purge from cache.
  * @param options Optional purge cache options.
  * @param options.transformations If true, purges only transformations (resized/formatted variants), leaving original cached files intact.
  * @param parameters Optional fetch parameters such as an `AbortController` signal.
  * @returns Promise with `{ data: { message }, error: null }` on success or `{ data: null, error }` on failure.
  *
  * @example Purge cache for an entire bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .purgeBucketCache('avatars')
  * ```
  *
  * @example Purge only transformations for an entire bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .purgeBucketCache('avatars', { transformations: true })
  * ```
  */
  async purgeBucketCache(id, options, parameters) {
    var _this10 = this;
    return _this10.handleOperation(async () => {
      const query2 = new URLSearchParams();
      if (options === null || options === void 0 ? void 0 : options.transformations) query2.set("transformations", "true");
      const queryString = query2.toString();
      return await remove(_this10.fetch, `${_this10.url}/cdn/${encodeStoragePath(id)}${queryString ? `?${queryString}` : ""}`, {}, { headers: _this10.headers }, parameters);
    });
  }
  bucketLifecycleUrl(id) {
    return `${this.url}/bucket/${encodeStoragePath(id)}/lifecycle`;
  }
  listBucketOptionsToQueryString(options) {
    const params = {};
    if (options) {
      if ("limit" in options) params.limit = String(options.limit);
      if ("offset" in options) params.offset = String(options.offset);
      if (options.search) params.search = options.search;
      if (options.sortColumn) params.sortColumn = options.sortColumn;
      if (options.sortOrder) params.sortOrder = options.sortOrder;
    }
    return Object.keys(params).length > 0 ? "?" + new URLSearchParams(params).toString() : "";
  }
};
var StorageAnalyticsClient = class extends BaseApiClient {
  /**
  * @alpha
  *
  * Creates a new StorageAnalyticsClient instance
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Analytics Buckets
  * @param url - The base URL for the storage API
  * @param headers - HTTP headers to include in requests
  * @param fetch - Optional custom fetch implementation
  *
  * @example Using supabase-js (recommended)
  * ```typescript
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * const { data, error } = await supabase.storage.analytics.listBuckets()
  * ```
  *
  * @example Standalone import for bundle-sensitive environments
  * ```typescript
  * import { StorageAnalyticsClient } from '@supabase/storage-js'
  *
  * const client = new StorageAnalyticsClient(url, headers)
  * ```
  */
  constructor(url, headers = {}, fetch$1) {
    const finalUrl = url.replace(/\/$/, "");
    const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), headers);
    super(finalUrl, finalHeaders, fetch$1, "storage");
  }
  /**
  * @alpha
  *
  * Creates a new analytics bucket using Iceberg tables
  * Analytics buckets are optimized for analytical queries and data processing
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Analytics Buckets
  * @param name A unique name for the bucket you are creating
  * @returns Promise with response containing newly created analytics bucket or error
  *
  * @example Create analytics bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .analytics
  *   .createBucket('analytics-data')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "name": "analytics-data",
  *     "type": "ANALYTICS",
  *     "format": "iceberg",
  *     "created_at": "2024-05-22T22:26:05.100Z",
  *     "updated_at": "2024-05-22T22:26:05.100Z"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - Creates a new analytics bucket using Iceberg tables
  * - Analytics buckets are optimized for analytical queries and data processing
  */
  async createBucket(name) {
    var _this = this;
    return _this.handleOperation(async () => {
      return await post(_this.fetch, `${_this.url}/bucket`, { name }, { headers: _this.headers });
    });
  }
  /**
  * @alpha
  *
  * Retrieves the details of all Analytics Storage buckets within an existing project
  * Only returns buckets of type 'ANALYTICS'
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Analytics Buckets
  * @param options Query parameters for listing buckets
  * @param options.limit Maximum number of buckets to return
  * @param options.offset Number of buckets to skip
  * @param options.sortColumn Column to sort by ('name', 'created_at', 'updated_at')
  * @param options.sortOrder Sort order ('asc' or 'desc')
  * @param options.search Search term to filter bucket names
  * @returns Promise with response containing array of analytics buckets or error
  *
  * @example List analytics buckets
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .analytics
  *   .listBuckets({
  *     limit: 10,
  *     offset: 0,
  *     sortColumn: 'created_at',
  *     sortOrder: 'desc'
  *   })
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": [
  *     {
  *       "name": "analytics-data",
  *       "type": "ANALYTICS",
  *       "format": "iceberg",
  *       "created_at": "2024-05-22T22:26:05.100Z",
  *       "updated_at": "2024-05-22T22:26:05.100Z"
  *     }
  *   ],
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - Retrieves the details of all Analytics Storage buckets within an existing project
  * - Only returns buckets of type 'ANALYTICS'
  */
  async listBuckets(options) {
    var _this2 = this;
    return _this2.handleOperation(async () => {
      const queryParams = new URLSearchParams();
      if ((options === null || options === void 0 ? void 0 : options.limit) !== void 0) queryParams.set("limit", options.limit.toString());
      if ((options === null || options === void 0 ? void 0 : options.offset) !== void 0) queryParams.set("offset", options.offset.toString());
      if (options === null || options === void 0 ? void 0 : options.sortColumn) queryParams.set("sortColumn", options.sortColumn);
      if (options === null || options === void 0 ? void 0 : options.sortOrder) queryParams.set("sortOrder", options.sortOrder);
      if (options === null || options === void 0 ? void 0 : options.search) queryParams.set("search", options.search);
      const queryString = queryParams.toString();
      const url = queryString ? `${_this2.url}/bucket?${queryString}` : `${_this2.url}/bucket`;
      return await get(_this2.fetch, url, { headers: _this2.headers });
    });
  }
  /**
  * @alpha
  *
  * Deletes an existing analytics bucket
  * A bucket can't be deleted with existing objects inside it
  * You must first empty the bucket before deletion
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Analytics Buckets
  * @param bucketName The unique identifier of the bucket you would like to delete
  * @returns Promise with response containing success message or error
  *
  * @example Delete analytics bucket
  * ```js
  * const { data, error } = await supabase
  *   .storage
  *   .analytics
  *   .deleteBucket('analytics-data')
  * ```
  *
  * Response:
  * ```json
  * {
  *   "data": {
  *     "message": "Successfully deleted"
  *   },
  *   "error": null
  * }
  * ```
  *
  * @remarks
  * - Deletes an analytics bucket
  */
  async deleteBucket(bucketName) {
    var _this3 = this;
    return _this3.handleOperation(async () => {
      return await remove(_this3.fetch, `${_this3.url}/bucket/${bucketName}`, {}, { headers: _this3.headers });
    });
  }
  /**
  * @alpha
  *
  * Get an Iceberg REST Catalog client configured for a specific analytics bucket
  * Use this to perform advanced table and namespace operations within the bucket
  * The returned client provides full access to the Apache Iceberg REST Catalog API
  * with the Supabase `{ data, error }` pattern for consistent error handling on all operations.
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Analytics Buckets
  * @param bucketName - The name of the analytics bucket (warehouse) to connect to
  * @returns The wrapped Iceberg catalog client
  * @throws {StorageError} If the bucket name is invalid
  *
  * @example Get catalog and create table
  * ```js
  * // First, create an analytics bucket
  * const { data: bucket, error: bucketError } = await supabase
  *   .storage
  *   .analytics
  *   .createBucket('analytics-data')
  *
  * // Get the Iceberg catalog for that bucket
  * const catalog = supabase.storage.analytics.from('analytics-data')
  *
  * // Create a namespace
  * const { error: nsError } = await catalog.createNamespace({ namespace: ['default'] })
  *
  * // Create a table with schema
  * const { data: tableMetadata, error: tableError } = await catalog.createTable(
  *   { namespace: ['default'] },
  *   {
  *     name: 'events',
  *     schema: {
  *       type: 'struct',
  *       fields: [
  *         { id: 1, name: 'id', type: 'long', required: true },
  *         { id: 2, name: 'timestamp', type: 'timestamp', required: true },
  *         { id: 3, name: 'user_id', type: 'string', required: false }
  *       ],
  *       'schema-id': 0,
  *       'identifier-field-ids': [1]
  *     },
  *     'partition-spec': {
  *       'spec-id': 0,
  *       fields: []
  *     },
  *     'write-order': {
  *       'order-id': 0,
  *       fields: []
  *     },
  *     properties: {
  *       'write.format.default': 'parquet'
  *     }
  *   }
  * )
  * ```
  *
  * @example List tables in namespace
  * ```js
  * const catalog = supabase.storage.analytics.from('analytics-data')
  *
  * // List all tables in the default namespace
  * const { data: tables, error: listError } = await catalog.listTables({ namespace: ['default'] })
  * if (listError) {
  *   if (listError.isNotFound()) {
  *     console.log('Namespace not found')
  *   }
  *   return
  * }
  * console.log(tables) // [{ namespace: ['default'], name: 'events' }]
  * ```
  *
  * @example Working with namespaces
  * ```js
  * const catalog = supabase.storage.analytics.from('analytics-data')
  *
  * // List all namespaces
  * const { data: namespaces } = await catalog.listNamespaces()
  *
  * // Create namespace with properties
  * await catalog.createNamespace(
  *   { namespace: ['production'] },
  *   { properties: { owner: 'data-team', env: 'prod' } }
  * )
  * ```
  *
  * @example Cleanup operations
  * ```js
  * const catalog = supabase.storage.analytics.from('analytics-data')
  *
  * // Drop table with purge option (removes all data)
  * const { error: dropError } = await catalog.dropTable(
  *   { namespace: ['default'], name: 'events' },
  *   { purge: true }
  * )
  *
  * if (dropError?.isNotFound()) {
  *   console.log('Table does not exist')
  * }
  *
  * // Drop namespace (must be empty)
  * await catalog.dropNamespace({ namespace: ['default'] })
  * ```
  *
  * @remarks
  * This method provides a bridge between Supabase's bucket management and the standard
  * Apache Iceberg REST Catalog API. The bucket name maps to the Iceberg warehouse parameter.
  * All authentication and configuration is handled automatically using your Supabase credentials.
  *
  * **Error Handling**: Invalid bucket names throw immediately. All catalog
  * operations return `{ data, error }` where errors are `IcebergError` instances from iceberg-js.
  * Use helper methods like `error.isNotFound()` or check `error.status` for specific error handling.
  * Use `.throwOnError()` on the analytics client if you prefer exceptions for catalog operations.
  *
  * **Cleanup Operations**: When using `dropTable`, the `purge: true` option permanently
  * deletes all table data. Without it, the table is marked as deleted but data remains.
  *
  * **Library Dependency**: The returned catalog wraps `IcebergRestCatalog` from iceberg-js.
  * For complete API documentation and advanced usage, refer to the
  * [iceberg-js documentation](https://supabase.github.io/iceberg-js/).
  */
  from(bucketName) {
    var _this4 = this;
    if (!isValidBucketName(bucketName)) throw new StorageError("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
    const catalog = new IcebergRestCatalog({
      baseUrl: this.url,
      catalogName: bucketName,
      auth: {
        type: "custom",
        getHeaders: async () => _this4.headers
      },
      fetch: this.fetch
    });
    const shouldThrowOnError = this.shouldThrowOnError;
    return new Proxy(catalog, { get(target, prop) {
      const value = target[prop];
      if (typeof value !== "function") return value;
      return async (...args) => {
        try {
          return {
            data: await value.apply(target, args),
            error: null
          };
        } catch (error) {
          if (shouldThrowOnError) throw error;
          return {
            data: null,
            error
          };
        }
      };
    } });
  }
};
var VectorIndexApi = class extends BaseApiClient {
  /** Creates a new VectorIndexApi instance */
  constructor(url, headers = {}, fetch$1) {
    const finalUrl = url.replace(/\/$/, "");
    const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), {}, { "Content-Type": "application/json" }, headers);
    super(finalUrl, finalHeaders, fetch$1, "vectors");
  }
  /** Creates a new vector index within a bucket */
  async createIndex(options) {
    var _this = this;
    return _this.handleOperation(async () => {
      return await vectorsApi.post(_this.fetch, `${_this.url}/CreateIndex`, options, { headers: _this.headers }) || {};
    });
  }
  /** Retrieves metadata for a specific vector index */
  async getIndex(vectorBucketName, indexName) {
    var _this2 = this;
    return _this2.handleOperation(async () => {
      return await vectorsApi.post(_this2.fetch, `${_this2.url}/GetIndex`, {
        vectorBucketName,
        indexName
      }, { headers: _this2.headers });
    });
  }
  /** Lists vector indexes within a bucket with optional filtering and pagination */
  async listIndexes(options) {
    var _this3 = this;
    return _this3.handleOperation(async () => {
      return await vectorsApi.post(_this3.fetch, `${_this3.url}/ListIndexes`, options, { headers: _this3.headers });
    });
  }
  /** Deletes a vector index and all its data */
  async deleteIndex(vectorBucketName, indexName) {
    var _this4 = this;
    return _this4.handleOperation(async () => {
      return await vectorsApi.post(_this4.fetch, `${_this4.url}/DeleteIndex`, {
        vectorBucketName,
        indexName
      }, { headers: _this4.headers }) || {};
    });
  }
};
var VectorDataApi = class extends BaseApiClient {
  /** Creates a new VectorDataApi instance */
  constructor(url, headers = {}, fetch$1) {
    const finalUrl = url.replace(/\/$/, "");
    const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), {}, { "Content-Type": "application/json" }, headers);
    super(finalUrl, finalHeaders, fetch$1, "vectors");
  }
  /** Inserts or updates vectors in batch (1-500 per request) */
  async putVectors(options) {
    var _this = this;
    if (options.vectors.length < 1 || options.vectors.length > 500) throw new Error("Vector batch size must be between 1 and 500 items");
    return _this.handleOperation(async () => {
      return await vectorsApi.post(_this.fetch, `${_this.url}/PutVectors`, options, { headers: _this.headers }) || {};
    });
  }
  /** Retrieves vectors by their keys in batch */
  async getVectors(options) {
    var _this2 = this;
    return _this2.handleOperation(async () => {
      return await vectorsApi.post(_this2.fetch, `${_this2.url}/GetVectors`, options, { headers: _this2.headers });
    });
  }
  /** Lists vectors in an index with pagination */
  async listVectors(options) {
    var _this3 = this;
    if (options.segmentCount !== void 0) {
      if (options.segmentCount < 1 || options.segmentCount > 16) throw new Error("segmentCount must be between 1 and 16");
      if (options.segmentIndex !== void 0) {
        if (options.segmentIndex < 0 || options.segmentIndex >= options.segmentCount) throw new Error(`segmentIndex must be between 0 and ${options.segmentCount - 1}`);
      }
    }
    return _this3.handleOperation(async () => {
      return await vectorsApi.post(_this3.fetch, `${_this3.url}/ListVectors`, options, { headers: _this3.headers });
    });
  }
  /** Queries for similar vectors using approximate nearest neighbor search */
  async queryVectors(options) {
    var _this4 = this;
    return _this4.handleOperation(async () => {
      return await vectorsApi.post(_this4.fetch, `${_this4.url}/QueryVectors`, options, { headers: _this4.headers });
    });
  }
  /** Deletes vectors by their keys in batch (1-500 per request) */
  async deleteVectors(options) {
    var _this5 = this;
    if (options.keys.length < 1 || options.keys.length > 500) throw new Error("Keys batch size must be between 1 and 500 items");
    return _this5.handleOperation(async () => {
      return await vectorsApi.post(_this5.fetch, `${_this5.url}/DeleteVectors`, options, { headers: _this5.headers }) || {};
    });
  }
};
var VectorBucketApi = class extends BaseApiClient {
  /** Creates a new VectorBucketApi instance */
  constructor(url, headers = {}, fetch$1) {
    const finalUrl = url.replace(/\/$/, "");
    const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), {}, { "Content-Type": "application/json" }, headers);
    super(finalUrl, finalHeaders, fetch$1, "vectors");
  }
  /** Creates a new vector bucket */
  async createBucket(vectorBucketName) {
    var _this = this;
    return _this.handleOperation(async () => {
      return await vectorsApi.post(_this.fetch, `${_this.url}/CreateVectorBucket`, { vectorBucketName }, { headers: _this.headers }) || {};
    });
  }
  /** Retrieves metadata for a specific vector bucket */
  async getBucket(vectorBucketName) {
    var _this2 = this;
    return _this2.handleOperation(async () => {
      return await vectorsApi.post(_this2.fetch, `${_this2.url}/GetVectorBucket`, { vectorBucketName }, { headers: _this2.headers });
    });
  }
  /** Lists vector buckets with optional filtering and pagination */
  async listBuckets(options = {}) {
    var _this3 = this;
    return _this3.handleOperation(async () => {
      return await vectorsApi.post(_this3.fetch, `${_this3.url}/ListVectorBuckets`, options, { headers: _this3.headers });
    });
  }
  /** Deletes a vector bucket (must be empty first) */
  async deleteBucket(vectorBucketName) {
    var _this4 = this;
    return _this4.handleOperation(async () => {
      return await vectorsApi.post(_this4.fetch, `${_this4.url}/DeleteVectorBucket`, { vectorBucketName }, { headers: _this4.headers }) || {};
    });
  }
};
var StorageVectorsClient = class extends VectorBucketApi {
  /**
  * @alpha
  *
  * Creates a StorageVectorsClient that can manage buckets, indexes, and vectors.
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param url - Base URL of the Storage Vectors REST API.
  * @param options.headers - Optional headers (for example `Authorization`) applied to every request.
  * @param options.fetch - Optional custom `fetch` implementation for non-browser runtimes.
  *
  * @example Using supabase-js (recommended)
  * ```typescript
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * ```
  *
  * @example Standalone import for bundle-sensitive environments
  * ```typescript
  * import { StorageVectorsClient } from '@supabase/storage-js'
  *
  * const client = new StorageVectorsClient(url, options)
  * ```
  */
  constructor(url, options = {}) {
    super(url, options.headers || {}, options.fetch);
  }
  /**
  *
  * @alpha
  *
  * Access operations for a specific vector bucket
  * Returns a scoped client for index and vector operations within the bucket
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param vectorBucketName - Name of the vector bucket
  * @returns Bucket-scoped client with index and vector operations
  *
  * @example Accessing a vector bucket
  * ```typescript
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * ```
  */
  from(vectorBucketName) {
    return new VectorBucketScope(this.url, this.headers, vectorBucketName, this.fetch);
  }
  /**
  *
  * @alpha
  *
  * Creates a new vector bucket
  * Vector buckets are containers for vector indexes and their data
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param vectorBucketName - Unique name for the vector bucket
  * @returns Promise with empty response on success or error
  *
  * @example Creating a vector bucket
  * ```typescript
  * const { data, error } = await supabase
  *   .storage
  *   .vectors
  *   .createBucket('embeddings-prod')
  * ```
  */
  async createBucket(vectorBucketName) {
    var _superprop_getCreateBucket = () => super.createBucket, _this = this;
    return _superprop_getCreateBucket().call(_this, vectorBucketName);
  }
  /**
  *
  * @alpha
  *
  * Retrieves metadata for a specific vector bucket
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param vectorBucketName - Name of the vector bucket
  * @returns Promise with bucket metadata or error
  *
  * @example Get bucket metadata
  * ```typescript
  * const { data, error } = await supabase
  *   .storage
  *   .vectors
  *   .getBucket('embeddings-prod')
  *
  * console.log('Bucket created:', data?.vectorBucket.creationTime)
  * ```
  */
  async getBucket(vectorBucketName) {
    var _superprop_getGetBucket = () => super.getBucket, _this2 = this;
    return _superprop_getGetBucket().call(_this2, vectorBucketName);
  }
  /**
  *
  * @alpha
  *
  * Lists all vector buckets with optional filtering and pagination
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Optional filters (prefix, maxResults, nextToken)
  * @returns Promise with list of buckets or error
  *
  * @example List vector buckets
  * ```typescript
  * const { data, error } = await supabase
  *   .storage
  *   .vectors
  *   .listBuckets({ prefix: 'embeddings-' })
  *
  * data?.vectorBuckets.forEach(bucket => {
  *   console.log(bucket.vectorBucketName)
  * })
  * ```
  */
  async listBuckets(options = {}) {
    var _superprop_getListBuckets = () => super.listBuckets, _this3 = this;
    return _superprop_getListBuckets().call(_this3, options);
  }
  /**
  *
  * @alpha
  *
  * Deletes a vector bucket (bucket must be empty)
  * All indexes must be deleted before deleting the bucket
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param vectorBucketName - Name of the vector bucket to delete
  * @returns Promise with empty response on success or error
  *
  * @example Delete a vector bucket
  * ```typescript
  * const { data, error } = await supabase
  *   .storage
  *   .vectors
  *   .deleteBucket('embeddings-old')
  * ```
  */
  async deleteBucket(vectorBucketName) {
    var _superprop_getDeleteBucket = () => super.deleteBucket, _this4 = this;
    return _superprop_getDeleteBucket().call(_this4, vectorBucketName);
  }
};
var VectorBucketScope = class extends VectorIndexApi {
  /**
  * @alpha
  *
  * Creates a helper that automatically scopes all index operations to the provided bucket.
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @example Creating a vector bucket scope
  * ```typescript
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * ```
  */
  constructor(url, headers, vectorBucketName, fetch$1) {
    super(url, headers, fetch$1);
    this.vectorBucketName = vectorBucketName;
  }
  /**
  *
  * @alpha
  *
  * Creates a new vector index in this bucket
  * Convenience method that automatically includes the bucket name
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Index configuration (vectorBucketName is automatically set)
  * @returns Promise with empty response on success or error
  *
  * @example Creating a vector index
  * ```typescript
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * await bucket.createIndex({
  *   indexName: 'documents-openai',
  *   dataType: 'float32',
  *   dimension: 1536,
  *   distanceMetric: 'cosine',
  *   metadataConfiguration: {
  *     nonFilterableMetadataKeys: ['raw_text']
  *   }
  * })
  * ```
  */
  async createIndex(options) {
    var _superprop_getCreateIndex = () => super.createIndex, _this5 = this;
    return _superprop_getCreateIndex().call(_this5, _objectSpread22(_objectSpread22({}, options), {}, { vectorBucketName: _this5.vectorBucketName }));
  }
  /**
  *
  * @alpha
  *
  * Lists indexes in this bucket
  * Convenience method that automatically includes the bucket name
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Listing options (vectorBucketName is automatically set)
  * @returns Promise with response containing indexes array and pagination token or error
  *
  * @example List indexes
  * ```typescript
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * const { data } = await bucket.listIndexes({ prefix: 'documents-' })
  * ```
  */
  async listIndexes(options = {}) {
    var _superprop_getListIndexes = () => super.listIndexes, _this6 = this;
    return _superprop_getListIndexes().call(_this6, _objectSpread22(_objectSpread22({}, options), {}, { vectorBucketName: _this6.vectorBucketName }));
  }
  /**
  *
  * @alpha
  *
  * Retrieves metadata for a specific index in this bucket
  * Convenience method that automatically includes the bucket name
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param indexName - Name of the index to retrieve
  * @returns Promise with index metadata or error
  *
  * @example Get index metadata
  * ```typescript
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * const { data } = await bucket.getIndex('documents-openai')
  * console.log('Dimension:', data?.index.dimension)
  * ```
  */
  async getIndex(indexName) {
    var _superprop_getGetIndex = () => super.getIndex, _this7 = this;
    return _superprop_getGetIndex().call(_this7, _this7.vectorBucketName, indexName);
  }
  /**
  *
  * @alpha
  *
  * Deletes an index from this bucket
  * Convenience method that automatically includes the bucket name
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param indexName - Name of the index to delete
  * @returns Promise with empty response on success or error
  *
  * @example Delete an index
  * ```typescript
  * const bucket = supabase.storage.vectors.from('embeddings-prod')
  * await bucket.deleteIndex('old-index')
  * ```
  */
  async deleteIndex(indexName) {
    var _superprop_getDeleteIndex = () => super.deleteIndex, _this8 = this;
    return _superprop_getDeleteIndex().call(_this8, _this8.vectorBucketName, indexName);
  }
  /**
  *
  * @alpha
  *
  * Access operations for a specific index within this bucket
  * Returns a scoped client for vector data operations
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param indexName - Name of the index
  * @returns Index-scoped client with vector data operations
  *
  * @example Accessing an index
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  *
  * // Insert vectors
  * await index.putVectors({
  *   vectors: [
  *     { key: 'doc-1', data: { float32: [...] }, metadata: { title: 'Intro' } }
  *   ]
  * })
  *
  * // Query similar vectors
  * const { data } = await index.queryVectors({
  *   queryVector: { float32: [...] },
  *   topK: 5
  * })
  * ```
  */
  index(indexName) {
    return new VectorIndexScope(this.url, this.headers, this.vectorBucketName, indexName, this.fetch);
  }
};
var VectorIndexScope = class extends VectorDataApi {
  /**
  *
  * @alpha
  *
  * Creates a helper that automatically scopes all vector operations to the provided bucket/index names.
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @example Creating a vector index scope
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  * ```
  */
  constructor(url, headers, vectorBucketName, indexName, fetch$1) {
    super(url, headers, fetch$1);
    this.vectorBucketName = vectorBucketName;
    this.indexName = indexName;
  }
  /**
  *
  * @alpha
  *
  * Inserts or updates vectors in this index
  * Convenience method that automatically includes bucket and index names
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Vector insertion options (bucket and index names automatically set)
  * @returns Promise with empty response on success or error
  *
  * @example Insert vectors into an index
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  * await index.putVectors({
  *   vectors: [
  *     {
  *       key: 'doc-1',
  *       data: { float32: [0.1, 0.2, ...] },
  *       metadata: { title: 'Introduction', page: 1 }
  *     }
  *   ]
  * })
  * ```
  */
  async putVectors(options) {
    var _superprop_getPutVectors = () => super.putVectors, _this9 = this;
    return _superprop_getPutVectors().call(_this9, _objectSpread22(_objectSpread22({}, options), {}, {
      vectorBucketName: _this9.vectorBucketName,
      indexName: _this9.indexName
    }));
  }
  /**
  *
  * @alpha
  *
  * Retrieves vectors by keys from this index
  * Convenience method that automatically includes bucket and index names
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Vector retrieval options (bucket and index names automatically set)
  * @returns Promise with response containing vectors array or error
  *
  * @example Get vectors by keys
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  * const { data } = await index.getVectors({
  *   keys: ['doc-1', 'doc-2'],
  *   returnMetadata: true
  * })
  * ```
  */
  async getVectors(options) {
    var _superprop_getGetVectors = () => super.getVectors, _this10 = this;
    return _superprop_getGetVectors().call(_this10, _objectSpread22(_objectSpread22({}, options), {}, {
      vectorBucketName: _this10.vectorBucketName,
      indexName: _this10.indexName
    }));
  }
  /**
  *
  * @alpha
  *
  * Lists vectors in this index with pagination
  * Convenience method that automatically includes bucket and index names
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Listing options (bucket and index names automatically set)
  * @returns Promise with response containing vectors array and pagination token or error
  *
  * @example List vectors with pagination
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  * const { data } = await index.listVectors({
  *   maxResults: 500,
  *   returnMetadata: true
  * })
  * ```
  */
  async listVectors(options = {}) {
    var _superprop_getListVectors = () => super.listVectors, _this11 = this;
    return _superprop_getListVectors().call(_this11, _objectSpread22(_objectSpread22({}, options), {}, {
      vectorBucketName: _this11.vectorBucketName,
      indexName: _this11.indexName
    }));
  }
  /**
  *
  * @alpha
  *
  * Queries for similar vectors in this index
  * Convenience method that automatically includes bucket and index names
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Query options (bucket and index names automatically set)
  * @returns Promise with response containing vectors ordered by distance, an optional pagination token, or an error
  *
  * @example Query similar vectors
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  * const { data } = await index.queryVectors({
  *   queryVector: { float32: [0.1, 0.2, ...] },
  *   topK: 5,
  *   filter: { category: 'technical' },
  *   returnDistance: true,
  *   returnMetadata: true
  * })
  * ```
  */
  async queryVectors(options) {
    var _superprop_getQueryVectors = () => super.queryVectors, _this12 = this;
    return _superprop_getQueryVectors().call(_this12, _objectSpread22(_objectSpread22({}, options), {}, {
      vectorBucketName: _this12.vectorBucketName,
      indexName: _this12.indexName
    }));
  }
  /**
  *
  * @alpha
  *
  * Deletes vectors by keys from this index
  * Convenience method that automatically includes bucket and index names
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  * @param options - Deletion options (bucket and index names automatically set)
  * @returns Promise with empty response on success or error
  *
  * @example Delete vectors by keys
  * ```typescript
  * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
  * await index.deleteVectors({
  *   keys: ['doc-1', 'doc-2', 'doc-3']
  * })
  * ```
  */
  async deleteVectors(options) {
    var _superprop_getDeleteVectors = () => super.deleteVectors, _this13 = this;
    return _superprop_getDeleteVectors().call(_this13, _objectSpread22(_objectSpread22({}, options), {}, {
      vectorBucketName: _this13.vectorBucketName,
      indexName: _this13.indexName
    }));
  }
};
var StorageClient = class extends StorageBucketApi {
  /**
  * Creates a client for Storage buckets, files, analytics, and vectors.
  *
  * @category Storage
  * @subcategory File Buckets
  *
  * @example Using supabase-js (recommended)
  * ```ts
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * const avatars = supabase.storage.from('avatars')
  * ```
  *
  * @example Standalone import for bundle-sensitive environments
  * ```ts
  * import { StorageClient } from '@supabase/storage-js'
  *
  * const storage = new StorageClient('https://xyzcompany.supabase.co/storage/v1', {
  *   apikey: 'your-publishable-key',
  * })
  * const avatars = storage.from('avatars')
  * ```
  */
  constructor(url, headers = {}, fetch$1, opts) {
    super(url, headers, fetch$1, opts);
  }
  /**
  * Perform file operation in a bucket.
  *
  * @category Storage
  * @subcategory File Buckets
  *
  * @param id The bucket id to operate on.
  *
  * @example Accessing a bucket
  * ```typescript
  * const avatars = supabase.storage.from('avatars')
  * ```
  */
  from(id) {
    return new StorageFileApi(this.url, this.headers, id, this.fetch);
  }
  /**
  *
  * @alpha
  *
  * Access vector storage operations.
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Vector Buckets
  *
  * @returns A StorageVectorsClient instance configured with the current storage settings.
  */
  get vectors() {
    return new StorageVectorsClient(this.url + "/vector", {
      headers: this.headers,
      fetch: this.fetch
    });
  }
  /**
  *
  * @alpha
  *
  * Access analytics storage operations using Iceberg tables.
  *
  * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
  *
  * @category Storage
  * @subcategory Analytics Buckets
  *
  * @returns A StorageAnalyticsClient instance configured with the current storage settings.
  */
  get analytics() {
    return new StorageAnalyticsClient(this.url + "/iceberg", this.headers, this.fetch);
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/version.js
var version3 = "2.117.3";

// node_modules/@supabase/auth-js/dist/module/lib/constants.js
var AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
var AUTO_REFRESH_TICK_THRESHOLD = 3;
var EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
var REFRESH_FAILURE_COOLDOWN_MS = 2 * AUTO_REFRESH_TICK_DURATION_MS;
var GOTRUE_URL = "http://localhost:9999";
var STORAGE_KEY = "supabase.auth.token";
var DEFAULT_HEADERS2 = { "X-Client-Info": `gotrue-js/${version3}` };
var API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
var API_VERSIONS = {
  "2024-01-01": {
    timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
    name: "2024-01-01"
  }
};
var BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
var PKCE_FLOW_ID_PARAM = "sb_flow_id";
var PKCE_MAX_CONCURRENT_FLOWS = 5;
var JWKS_TTL = 10 * 60 * 1e3;

// node_modules/@supabase/auth-js/dist/module/lib/errors.js
var AuthError = class extends Error {
  constructor(message, status, code) {
    super(message);
    this.__isAuthError = true;
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code
    };
  }
};
function isAuthError(error) {
  return typeof error === "object" && error !== null && "__isAuthError" in error;
}
var AuthApiError = class extends AuthError {
  constructor(message, status, code) {
    super(message, status, code);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
};
function isAuthApiError(error) {
  return isAuthError(error) && error.name === "AuthApiError";
}
var AuthUnknownError = class extends AuthError {
  constructor(message, originalError) {
    super(message);
    this.name = "AuthUnknownError";
    this.originalError = originalError;
  }
};
var CustomAuthError = class extends AuthError {
  constructor(message, name, status, code) {
    super(message, status, code);
    this.name = name;
    this.status = status;
  }
};
var AuthSessionMissingError = class extends CustomAuthError {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
  }
};
function isAuthSessionMissingError(error) {
  return isAuthError(error) && error.name === "AuthSessionMissingError";
}
var AuthInvalidTokenResponseError = class extends CustomAuthError {
  constructor() {
    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
  }
};
var AuthInvalidCredentialsError = class extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidCredentialsError", 400, void 0);
  }
};
var AuthImplicitGrantRedirectError = class extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthImplicitGrantRedirectError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
  }
};
function isAuthImplicitGrantRedirectError(error) {
  return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
}
var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
  }
};
var AuthPKCECodeVerifierMissingError = class extends CustomAuthError {
  constructor() {
    super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
  }
};
var AuthRetryableFetchError = class extends CustomAuthError {
  constructor(message, status) {
    super(message, "AuthRetryableFetchError", status, void 0);
  }
};
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
var AuthRefreshDiscardedError = class extends CustomAuthError {
  constructor(message = "Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)") {
    super(message, "AuthRefreshDiscardedError", 409, void 0);
  }
};
function isAuthRefreshDiscardedError(error) {
  return isAuthError(error) && error.name === "AuthRefreshDiscardedError";
}
var AuthWeakPasswordError = class extends CustomAuthError {
  constructor(message, status, reasons) {
    super(message, "AuthWeakPasswordError", status, "weak_password");
    this.reasons = reasons;
  }
  toJSON() {
    return Object.assign(Object.assign({}, super.toJSON()), { reasons: this.reasons });
  }
};
var AuthInvalidJwtError = class extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/base64url.js
var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
var IGNORE_BASE64URL = " 	\n\r=".split("");
var FROM_BASE64URL = (() => {
  const charMap = new Array(128);
  for (let i = 0; i < charMap.length; i += 1) {
    charMap[i] = -1;
  }
  for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
    charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
  }
  for (let i = 0; i < TO_BASE64URL.length; i += 1) {
    charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
  }
  return charMap;
})();
function byteToBase64URL(byte, state2, emit) {
  if (byte !== null) {
    state2.queue = state2.queue << 8 | byte;
    state2.queuedBits += 8;
    while (state2.queuedBits >= 6) {
      const pos = state2.queue >> state2.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state2.queuedBits -= 6;
    }
  } else if (state2.queuedBits > 0) {
    state2.queue = state2.queue << 6 - state2.queuedBits;
    state2.queuedBits = 6;
    while (state2.queuedBits >= 6) {
      const pos = state2.queue >> state2.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state2.queuedBits -= 6;
    }
  }
}
function byteFromBase64URL(charCode, state2, emit) {
  const bits = FROM_BASE64URL[charCode];
  if (bits > -1) {
    state2.queue = state2.queue << 6 | bits;
    state2.queuedBits += 6;
    while (state2.queuedBits >= 8) {
      emit(state2.queue >> state2.queuedBits - 8 & 255);
      state2.queuedBits -= 8;
    }
  } else if (bits === -2) {
    return;
  } else {
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
  }
}
function stringFromBase64URL(str) {
  const conv = [];
  const utf8Emit = (codepoint) => {
    conv.push(String.fromCodePoint(codepoint));
  };
  const utf8State = {
    utf8seq: 0,
    codepoint: 0
  };
  const b64State = { queue: 0, queuedBits: 0 };
  const byteEmit = (byte) => {
    stringFromUTF8(byte, utf8State, utf8Emit);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
  }
  return conv.join("");
}
function codepointToUTF8(codepoint, emit) {
  if (codepoint <= 127) {
    emit(codepoint);
    return;
  } else if (codepoint <= 2047) {
    emit(192 | codepoint >> 6);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 65535) {
    emit(224 | codepoint >> 12);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 1114111) {
    emit(240 | codepoint >> 18);
    emit(128 | codepoint >> 12 & 63);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
}
function stringToUTF8(str, emit) {
  for (let i = 0; i < str.length; i += 1) {
    let codepoint = str.charCodeAt(i);
    if (codepoint > 55295 && codepoint <= 56319) {
      const highSurrogate = (codepoint - 55296) * 1024 & 65535;
      const lowSurrogate = str.charCodeAt(i + 1) - 56320 & 65535;
      codepoint = (lowSurrogate | highSurrogate) + 65536;
      i += 1;
    }
    codepointToUTF8(codepoint, emit);
  }
}
function stringFromUTF8(byte, state2, emit) {
  if (state2.utf8seq === 0) {
    if (byte <= 127) {
      emit(byte);
      return;
    }
    for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
      if ((byte >> 7 - leadingBit & 1) === 0) {
        state2.utf8seq = leadingBit;
        break;
      }
    }
    if (state2.utf8seq === 2) {
      state2.codepoint = byte & 31;
    } else if (state2.utf8seq === 3) {
      state2.codepoint = byte & 15;
    } else if (state2.utf8seq === 4) {
      state2.codepoint = byte & 7;
    } else {
      throw new Error("Invalid UTF-8 sequence");
    }
    state2.utf8seq -= 1;
  } else if (state2.utf8seq > 0) {
    if (byte <= 127) {
      throw new Error("Invalid UTF-8 sequence");
    }
    state2.codepoint = state2.codepoint << 6 | byte & 63;
    state2.utf8seq -= 1;
    if (state2.utf8seq === 0) {
      emit(state2.codepoint);
    }
  }
}
function base64UrlToUint8Array(str) {
  const result = [];
  const state2 = { queue: 0, queuedBits: 0 };
  const onByte = (byte) => {
    result.push(byte);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), state2, onByte);
  }
  return new Uint8Array(result);
}
function stringToUint8Array(str) {
  const result = [];
  stringToUTF8(str, (byte) => result.push(byte));
  return new Uint8Array(result);
}
function bytesToBase64URL(bytes) {
  const result = [];
  const state2 = { queue: 0, queuedBits: 0 };
  const onChar = (char) => {
    result.push(char);
  };
  bytes.forEach((byte) => byteToBase64URL(byte, state2, onChar));
  byteToBase64URL(null, state2, onChar);
  return result.join("");
}

// node_modules/@supabase/auth-js/dist/module/lib/helpers.js
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
function generateCallbackId() {
  return /* @__PURE__ */ Symbol("auth-callback");
}
var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
var localStorageWriteTests = {
  tested: false,
  writable: false
};
var supportsLocalStorage = () => {
  if (!isBrowser()) {
    return false;
  }
  try {
    if (typeof globalThis.localStorage !== "object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable;
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(randomKey, randomKey);
    globalThis.localStorage.removeItem(randomKey);
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = true;
  } catch (e) {
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = false;
  }
  return localStorageWriteTests.writable;
};
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (_e) {
    }
  }
  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
var resolveFetch3 = (customFetch) => {
  if (customFetch) {
    return (...args) => customFetch(...args);
  }
  return (...args) => fetch(...args);
};
var looksLikeFetchResponse = (maybeResponse) => {
  return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
};
var setItemAsync = async (storage, key, data) => {
  await storage.setItem(key, JSON.stringify(data));
};
var getItemAsync = async (storage, key) => {
  const value = await storage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (_a) {
    return null;
  }
};
var removeItemAsync = async (storage, key) => {
  await storage.removeItem(key);
};
var Deferred = class _Deferred {
  constructor() {
    ;
    this.promise = new _Deferred.promiseConstructor((res, rej) => {
      ;
      this.resolve = res;
      this.reject = rej;
    });
  }
};
Deferred.promiseConstructor = Promise;
function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthInvalidJwtError("Invalid JWT structure");
  }
  for (let i = 0; i < parts.length; i++) {
    if (!BASE64URL_REGEX.test(parts[i])) {
      throw new AuthInvalidJwtError("JWT not in base64url format");
    }
  }
  const data = {
    // using base64url lib
    header: JSON.parse(stringFromBase64URL(parts[0])),
    payload: JSON.parse(stringFromBase64URL(parts[1])),
    signature: base64UrlToUint8Array(parts[2]),
    raw: {
      header: parts[0],
      payload: parts[1]
    }
  };
  return data;
}
async function sleep2(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    ;
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
  if (!hasCryptoSupport) {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var PKCE_FLOW_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;
function validatePKCEFlowId(flowId) {
  return typeof flowId === "string" && PKCE_FLOW_ID_PATTERN.test(flowId) ? flowId : null;
}
function generatePKCEFlowId() {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, dec2hex).join("");
  }
  let flowId = "";
  for (let i = 0; i < 32; i++) {
    flowId += Math.floor(Math.random() * 16).toString(16);
  }
  return flowId;
}
var pkceVerifierSlotKey = (storageKey, flowId) => `${storageKey}-flow-${flowId}-code-verifier`;
var pkceFlowIndexKey = (storageKey) => `${storageKey}-flows-code-verifier`;
async function getPKCEFlowIndex(storage, storageKey) {
  const index = await getItemAsync(storage, pkceFlowIndexKey(storageKey));
  return Array.isArray(index) ? index.filter((id) => validatePKCEFlowId(id) !== null) : [];
}
async function storePKCEVerifier(storage, storageKey, flowId, verifier, onEvictFlow) {
  await setItemAsync(storage, pkceVerifierSlotKey(storageKey, flowId), verifier);
  const index = (await getPKCEFlowIndex(storage, storageKey)).filter((id) => id !== flowId);
  index.push(flowId);
  while (index.length > PKCE_MAX_CONCURRENT_FLOWS) {
    const evicted = index.shift();
    await removeItemAsync(storage, pkceVerifierSlotKey(storageKey, evicted));
    onEvictFlow === null || onEvictFlow === void 0 ? void 0 : onEvictFlow(evicted);
  }
  await setItemAsync(storage, pkceFlowIndexKey(storageKey), index);
  await setItemAsync(storage, `${storageKey}-code-verifier`, verifier);
}
async function retrievePKCEVerifier(storage, storageKey, flowId) {
  if (flowId) {
    const verifier2 = await getItemAsync(storage, pkceVerifierSlotKey(storageKey, flowId));
    return { verifier: typeof verifier2 === "string" ? verifier2 : null, flowId };
  }
  const verifier = await getItemAsync(storage, `${storageKey}-code-verifier`);
  return { verifier: typeof verifier === "string" ? verifier : null, flowId: null };
}
async function removePKCEVerifier(storage, storageKey, flowId) {
  const legacyKey = `${storageKey}-code-verifier`;
  if (!flowId) {
    await removeItemAsync(storage, legacyKey);
    return;
  }
  const slotKey = pkceVerifierSlotKey(storageKey, flowId);
  const slotValue = await getItemAsync(storage, slotKey);
  await removeItemAsync(storage, slotKey);
  const index = await getPKCEFlowIndex(storage, storageKey);
  const remaining = index.filter((id) => id !== flowId);
  if (remaining.length !== index.length) {
    if (remaining.length > 0) {
      await setItemAsync(storage, pkceFlowIndexKey(storageKey), remaining);
    } else {
      await removeItemAsync(storage, pkceFlowIndexKey(storageKey));
    }
  }
  if (slotValue != null && slotValue === await getItemAsync(storage, legacyKey)) {
    await removeItemAsync(storage, legacyKey);
  }
}
async function removeAllPKCEVerifiers(storage, storageKey) {
  const index = await getPKCEFlowIndex(storage, storageKey);
  for (const flowId of index) {
    await removeItemAsync(storage, pkceVerifierSlotKey(storageKey, flowId));
  }
  await removeItemAsync(storage, pkceFlowIndexKey(storageKey));
  await removeItemAsync(storage, `${storageKey}-code-verifier`);
}
function appendFlowIdToRedirectTo(redirectTo, flowId) {
  const hashIndex = redirectTo.indexOf("#");
  let base = hashIndex === -1 ? redirectTo : redirectTo.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : redirectTo.slice(hashIndex);
  const queryIndex = base.indexOf("?");
  if (queryIndex !== -1) {
    const path = base.slice(0, queryIndex);
    const remaining = base.slice(queryIndex + 1).split("&").filter((pair) => pair !== "" && pair !== PKCE_FLOW_ID_PARAM && !pair.startsWith(`${PKCE_FLOW_ID_PARAM}=`));
    base = remaining.length > 0 ? `${path}?${remaining.join("&")}` : path;
  }
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${PKCE_FLOW_ID_PARAM}=${encodeURIComponent(flowId)}${fragment}`;
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false, onEvictFlow) {
  const codeVerifier = generatePKCEVerifier();
  let storedCodeVerifier = codeVerifier;
  if (isPasswordRecovery) {
    storedCodeVerifier += "/recovery";
  }
  const flowId = generatePKCEFlowId();
  await storePKCEVerifier(storage, storageKey, flowId, storedCodeVerifier, onEvictFlow);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
  return [codeChallenge, codeChallengeMethod, flowId];
}
var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
  if (!apiVersion) {
    return null;
  }
  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null;
  }
  try {
    const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
    return date;
  } catch (_e) {
    return null;
  }
}
function validateExp(exp) {
  if (!exp) {
    throw new Error("Missing exp claim");
  }
  const timeNow = Math.floor(Date.now() / 1e3);
  if (exp <= timeNow) {
    throw new Error("JWT has expired");
  }
}
function getAlgorithm(alg) {
  switch (alg) {
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      };
    case "ES256":
      return {
        name: "ECDSA",
        namedCurve: "P-256",
        hash: { name: "SHA-256" }
      };
    default:
      throw new Error("Invalid alg claim");
  }
}
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validateUUID(str) {
  if (!UUID_REGEX.test(str)) {
    throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
  }
}
function assertRecoveryCodesExperimentalEnabled(experimental) {
  if (!experimental.recoveryCodes) {
    throw new Error("@supabase/auth-js: the MFA recovery codes API is experimental and disabled by default. Enable it by passing `auth: { experimental: { recoveryCodes: true } }` to createClient (or to the GoTrueClient constructor).");
  }
}
function userNotAvailableProxy() {
  const proxyTarget = {};
  return new Proxy(proxyTarget, {
    get: (target, prop) => {
      if (prop === "__isUserNotAvailableProxy") {
        return true;
      }
      if (typeof prop === "symbol") {
        const sProp = prop.toString();
        if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") {
          return void 0;
        }
      }
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
    },
    set: (_target, prop) => {
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
    },
    deleteProperty: (_target, prop) => {
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
    }
  });
}
function insecureUserWarningProxy(user, suppressWarningRef) {
  return new Proxy(user, {
    get: (target, prop, receiver) => {
      if (prop === "__isInsecureUserWarningProxy") {
        return true;
      }
      if (typeof prop === "symbol") {
        const sProp = prop.toString();
        if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)" || sProp === "Symbol(nodejs.util.inspect.custom)") {
          return Reflect.get(target, prop, receiver);
        }
      }
      if (!suppressWarningRef.value && typeof prop === "string") {
        console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
        suppressWarningRef.value = true;
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// node_modules/@supabase/auth-js/dist/module/lib/fetch.js
var _getErrorMessage2 = (err) => {
  if (typeof err === "object" && err !== null) {
    const e = err;
    if (typeof e.msg === "string")
      return e.msg;
    if (typeof e.message === "string")
      return e.message;
    if (typeof e.error_description === "string")
      return e.error_description;
    if (typeof e.error === "string")
      return e.error;
  }
  return JSON.stringify(err);
};
var NETWORK_ERROR_CODES = [
  500,
  501,
  502,
  503,
  504,
  520,
  521,
  522,
  523,
  524,
  525,
  526,
  527,
  528,
  529,
  530
];
async function handleError2(error) {
  var _a;
  if (!looksLikeFetchResponse(error)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), 0);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    if (NETWORK_ERROR_CODES.includes(error.status)) {
      throw new AuthRetryableFetchError(error.statusText || `HTTP ${error.status}`, error.status);
    }
    throw new AuthUnknownError(_getErrorMessage2(e), e);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(data), error.status);
  }
  let errorCode = void 0;
  const responseAPIVersion = parseResponseAPIVersion(error);
  if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
    errorCode = data.code;
  } else if (typeof data === "object" && data && typeof data.error_code === "string") {
    errorCode = data.error_code;
  }
  if (!errorCode) {
    if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
      throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, data.weak_password.reasons);
    }
  } else if (errorCode === "weak_password") {
    throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
  } else if (errorCode === "session_not_found") {
    throw new AuthSessionMissingError();
  }
  throw new AuthApiError(_getErrorMessage2(data), error.status || 500, errorCode);
}
var _getRequestParams2 = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (!headers[API_VERSION_HEADER_NAME]) {
    headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
  }
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs["redirect_to"] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest2(fetcher, method, url + queryString, {
    headers,
    noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
  }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest2(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams2(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, Object.assign({}, requestParams));
  } catch (e) {
    throw new AuthRetryableFetchError(_getErrorMessage2(e), 0);
  }
  if (!result.ok) {
    await handleError2(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError2(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : typeof (data === null || data === void 0 ? void 0 : data.id) === "string" ? data : null;
  return { data: { session, user }, error: null };
}
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
function _ssoResponse(data) {
  return { data, error: null };
}
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
function hasSession(data) {
  return !!data.access_token && !!data.refresh_token && !!data.expires_in;
}

// node_modules/@supabase/auth-js/dist/module/lib/types.js
var SIGN_OUT_SCOPES = ["global", "local", "others"];

// node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js
var GoTrueAdminApi = class {
  /**
   * Creates an admin API client that can be used to manage users and OAuth clients.
   *
   * @example Using supabase-js (recommended)
   * ```ts
   * import { createClient } from '@supabase/supabase-js'
   *
   * const supabase = createClient('https://xyzcompany.supabase.co', 'your-secret-key')
   * const { data, error } = await supabase.auth.admin.listUsers()
   * ```
   *
   * @example Standalone import for bundle-sensitive environments
   * ```ts
   * import { GoTrueAdminApi } from '@supabase/auth-js'
   *
   * const admin = new GoTrueAdminApi({
   *   url: 'https://xyzcompany.supabase.co/auth/v1',
   *   headers: { Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}` },
   * })
   * ```
   */
  constructor({ url = "", headers = {}, fetch: fetch2, experimental }) {
    this.url = url;
    this.headers = headers;
    this.fetch = resolveFetch3(fetch2);
    this.experimental = experimental !== null && experimental !== void 0 ? experimental : {};
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
    this.oauth = {
      listClients: this._listOAuthClients.bind(this),
      createClient: this._createOAuthClient.bind(this),
      getClient: this._getOAuthClient.bind(this),
      updateClient: this._updateOAuthClient.bind(this),
      deleteClient: this._deleteOAuthClient.bind(this),
      regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this)
    };
    this.customProviders = {
      listProviders: this._listCustomProviders.bind(this),
      createProvider: this._createCustomProvider.bind(this),
      getProvider: this._getCustomProvider.bind(this),
      updateProvider: this._updateCustomProvider.bind(this),
      deleteProvider: this._deleteCustomProvider.bind(this)
    };
    this.passkey = {
      listPasskeys: this._adminListPasskeys.bind(this),
      deletePasskey: this._adminDeletePasskey.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   *
   * @category Auth
   * @subcategory Auth Admin
   */
  async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
    if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
      throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
    }
    try {
      await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @remarks
   * - Sends an invite link to the user's email address.
   * - The `inviteUserByEmail()` method is typically used by administrators to invite users to join the application.
   * - Note that PKCE is not supported when using `inviteUserByEmail`. This is because the browser initiating the invite is often different from the browser accepting the invite which makes it difficult to provide the security guarantees required of the PKCE flow.
   *
   * @example Invite a user
   * ```js
   * const { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')
   * ```
   *
   * @exampleResponse Invite a user
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "invited_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmation_sent_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {},
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     }
   *   },
   *   "error": null
   * }
   * ```
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param params The parameters for generating the link, including the link `type`, the user's `email`, and type-specific options such as `password`, `data`, and `redirectTo`.
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @remarks
   * - The following types can be passed into `generateLink()`: `signup`, `magiclink`, `invite`, `recovery`, `email_change_current`, `email_change_new`, `phone_change`.
   * - `generateLink()` only generates the email link for `email_change_email` if the **Secure email change** is enabled in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
   * - `generateLink()` handles the creation of the user for `signup`, `invite` and `magiclink`.
   *
   * @example Generate a signup link
   * ```js
   * const { data, error } = await supabase.auth.admin.generateLink({
   *   type: 'signup',
   *   email: 'email@example.com',
   *   password: 'secret'
   * })
   * ```
   *
   * @exampleResponse Generate a signup link
   * ```json
   * {
   *   "data": {
   *     "properties": {
   *       "action_link": "<LINK_TO_SEND_TO_USER>",
   *       "email_otp": "999999",
   *       "hashed_token": "<HASHED_TOKEN",
   *       "redirect_to": "<REDIRECT_URL>",
   *       "verification_type": "signup"
   *     },
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "email@example.com",
   *       "phone": "",
   *       "confirmation_sent_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {},
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "email@example.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "email@example.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Generate an invite link
   * ```js
   * const { data, error } = await supabase.auth.admin.generateLink({
   *   type: 'invite',
   *   email: 'email@example.com'
   * })
   * ```
   *
   * @example Generate a magic link
   * ```js
   * const { data, error } = await supabase.auth.admin.generateLink({
   *   type: 'magiclink',
   *   email: 'email@example.com'
   * })
   * ```
   *
   * @example Generate a recovery link
   * ```js
   * const { data, error } = await supabase.auth.admin.generateLink({
   *   type: 'recovery',
   *   email: 'email@example.com'
   * })
   * ```
   *
   * @example Generate links to change current email address
   * ```js
   * // generate an email change link to be sent to the current email address
   * const { data, error } = await supabase.auth.admin.generateLink({
   *   type: 'email_change_current',
   *   email: 'current.email@example.com',
   *   newEmail: 'new.email@example.com'
   * })
   *
   * // generate an email change link to be sent to the new email address
   * const { data, error } = await supabase.auth.admin.generateLink({
   *   type: 'email_change_new',
   *   email: 'current.email@example.com',
   *   newEmail: 'new.email@example.com'
   * })
   * ```
   */
  async generateLink(params) {
    try {
      const { options } = params, rest = __rest(params, ["options"]);
      const body = Object.assign(Object.assign({}, rest), options);
      if ("newEmail" in rest) {
        body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
        delete body["newEmail"];
      }
      return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
        body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @remarks
   * - To confirm the user's email address or phone number, set `email_confirm` or `phone_confirm` to true. Both arguments default to false.
   * - `createUser()` will not send a confirmation email to the user. You can use [`inviteUserByEmail()`](/docs/reference/javascript/auth-admin-inviteuserbyemail) if you want to send them an email invite instead.
   * - If you are sure that the created user's email or phone number is legitimate and verified, you can set the `email_confirm` or `phone_confirm` param to `true`.
   *
   * @example With custom user metadata
   * ```js
   * const { data, error } = await supabase.auth.admin.createUser({
   *   email: 'user@email.com',
   *   password: 'password',
   *   user_metadata: { name: 'Yoda' }
   * })
   * ```
   *
   * @exampleResponse With custom user metadata
   * ```json
   * {
   *   data: {
   *     user: {
   *       id: '1',
   *       aud: 'authenticated',
   *       role: 'authenticated',
   *       email: 'example@email.com',
   *       email_confirmed_at: '2024-01-01T00:00:00Z',
   *       phone: '',
   *       confirmation_sent_at: '2024-01-01T00:00:00Z',
   *       confirmed_at: '2024-01-01T00:00:00Z',
   *       last_sign_in_at: '2024-01-01T00:00:00Z',
   *       app_metadata: {},
   *       user_metadata: {},
   *       identities: [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "1",
   *           "user_id": "1",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": true,
   *             "phone_verified": false,
   *             "sub": "1"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "email@example.com"
   *         },
   *       ],
   *       created_at: '2024-01-01T00:00:00Z',
   *       updated_at: '2024-01-01T00:00:00Z',
   *       is_anonymous: false,
   *     }
   *   }
   *   error: null
   * }
   * ```
   *
   * @example Auto-confirm the user's email
   * ```js
   * const { data, error } = await supabase.auth.admin.createUser({
   *   email: 'user@email.com',
   *   email_confirm: true
   * })
   * ```
   *
   * @example Auto-confirm the user's phone number
   * ```js
   * const { data, error } = await supabase.auth.admin.createUser({
   *   phone: '1234567890',
   *   phone_confirm: true
   * })
   * ```
   */
  async createUser(attributes) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @remarks
   * - Defaults to return 50 users per page.
   *
   * @example Get a page of users
   * ```js
   * const { data: { users }, error } = await supabase.auth.admin.listUsers()
   * ```
   *
   * @example Paginated list of users
   * ```js
   * const { data: { users }, error } = await supabase.auth.admin.listUsers({
   *   page: 1,
   *   perPage: 1000
   * })
   * ```
   */
  async listUsers(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 };
      const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
          per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
        },
        xform: _noResolveJsonResponse
      });
      if (response.error)
        throw response.error;
      const users = await response.json();
      const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach((link) => {
          const page2 = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
          const rel = JSON.parse(link.split(";")[1].split("=")[1]);
          pagination[`${rel}Page`] = page2;
        });
        pagination.total = parseInt(total);
      }
      return { data: Object.assign(Object.assign({}, users), pagination), error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @remarks
   * - Fetches the user object from the database based on the user's id.
   * - The `getUserById()` method requires the user's id which maps to the `auth.users.id` column.
   *
   * @example Fetch the user object using the access_token jwt
   * ```js
   * const { data, error } = await supabase.auth.admin.getUserById(1)
   * ```
   *
   * @exampleResponse Fetch the user object using the access_token jwt
   * ```json
   * {
   *   data: {
   *     user: {
   *       id: '1',
   *       aud: 'authenticated',
   *       role: 'authenticated',
   *       email: 'example@email.com',
   *       email_confirmed_at: '2024-01-01T00:00:00Z',
   *       phone: '',
   *       confirmation_sent_at: '2024-01-01T00:00:00Z',
   *       confirmed_at: '2024-01-01T00:00:00Z',
   *       last_sign_in_at: '2024-01-01T00:00:00Z',
   *       app_metadata: {},
   *       user_metadata: {},
   *       identities: [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "1",
   *           "user_id": "1",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": true,
   *             "phone_verified": false,
   *             "sub": "1"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "email@example.com"
   *         },
   *       ],
   *       created_at: '2024-01-01T00:00:00Z',
   *       updated_at: '2024-01-01T00:00:00Z',
   *       is_anonymous: false,
   *     }
   *   }
   *   error: null
   * }
   * ```
   */
  async getUserById(uid) {
    validateUUID(uid);
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates the user data. Changes are applied directly without confirmation flows.
   *
   * @param uid The user's unique identifier
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   *
   * @remarks
   * **Important:** This is a server-side operation and does **not** trigger client-side
   * `onAuthStateChange` listeners. The admin API has no connection to client state.
   *
   * To sync changes to the client after calling this method:
   * 1. On the client, call `supabase.auth.refreshSession()` to fetch the updated user data
   * 2. This will trigger the `TOKEN_REFRESHED` event and notify all listeners
   *
   * @example
   * ```typescript
   * // Server-side (Edge Function)
   * const { data, error } = await supabase.auth.admin.updateUserById(
   *   userId,
   *   { user_metadata: { preferences: { theme: 'dark' } } }
   * )
   *
   * // Client-side (to sync the changes)
   * const { data, error } = await supabase.auth.refreshSession()
   * // onAuthStateChange listeners will now be notified with updated user
   * ```
   *
   * @see {@link GoTrueClient.refreshSession} for syncing admin changes to the client
   * @see {@link GoTrueClient.updateUser} for client-side user updates (triggers listeners automatically)
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @example Updates a user's email
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '11111111-1111-1111-1111-111111111111',
   *   { email: 'new@email.com' }
   * )
   * ```
   *
   * @exampleResponse Updates a user's email
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "new@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmed_at": "2024-01-01T00:00:00Z",
   *       "recovery_sent_at": "2024-01-01T00:00:00Z",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {
   *         "email": "example@email.com",
   *         "email_verified": false,
   *         "phone_verified": false,
   *         "sub": "11111111-1111-1111-1111-111111111111"
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Updates a user's password
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
   *   { password: 'new_password' }
   * )
   * ```
   *
   * @example Updates a user's metadata
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
   *   { user_metadata: { hello: 'world' } }
   * )
   * ```
   *
   * @example Updates a user's app_metadata
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
   *   { app_metadata: { plan: 'trial' } }
   * )
   * ```
   *
   * @example Confirms a user's email address
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
   *   { email_confirm: true }
   * )
   * ```
   *
   * @example Confirms a user's phone number
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
   *   { phone_confirm: true }
   * )
   * ```
   *
   * @example Ban a user for 100 years
   * ```js
   * const { data: user, error } = await supabase.auth.admin.updateUserById(
   *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
   *   { ban_duration: '876000h' }
   * )
   * ```
   */
  async updateUserById(uid, attributes) {
    validateUUID(uid);
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   *
   * @category Auth
   * @subcategory Auth Admin
   *
   * @remarks
   * - The `deleteUser()` method requires the user's ID, which maps to the `auth.users.id` column.
   *
   * @example Removes a user
   * ```js
   * const { data, error } = await supabase.auth.admin.deleteUser(
   *   '715ed5db-f090-4b8c-a067-640ecee36aa0'
   * )
   * ```
   *
   * @exampleResponse Removes a user
   * ```json
   * {
   *   "data": {
   *     "user": {}
   *   },
   *   "error": null
   * }
   * ```
   */
  async deleteUser(id, shouldSoftDelete = false) {
    validateUUID(id);
    try {
      return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete
        },
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  async _listFactors(params) {
    validateUUID(params.userId);
    try {
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
        headers: this.headers,
        xform: (factors) => {
          return { data: { factors }, error: null };
        }
      });
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _deleteFactor(params) {
    validateUUID(params.userId);
    validateUUID(params.id);
    try {
      const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
        headers: this.headers
      });
      return { data, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Lists all OAuth clients with optional pagination.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _listOAuthClients(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 };
      const response = await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
          per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
        },
        xform: _noResolveJsonResponse
      });
      if (response.error)
        throw response.error;
      const clients = await response.json();
      const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach((link) => {
          const page2 = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
          const rel = JSON.parse(link.split(";")[1].split("=")[1]);
          pagination[`${rel}Page`] = page2;
        });
        pagination.total = parseInt(total);
      }
      return { data: Object.assign(Object.assign({}, clients), pagination), error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { clients: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Creates a new OAuth client.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _createOAuthClient(params) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
        body: params,
        headers: this.headers,
        xform: (client) => {
          return { data: client, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Gets details of a specific OAuth client.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _getOAuthClient(clientId) {
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients/${clientId}`, {
        headers: this.headers,
        xform: (client) => {
          return { data: client, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Updates an existing OAuth client.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _updateOAuthClient(clientId, params) {
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${clientId}`, {
        body: params,
        headers: this.headers,
        xform: (client) => {
          return { data: client, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Deletes an OAuth client.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _deleteOAuthClient(clientId) {
    try {
      await _request(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${clientId}`, {
        headers: this.headers,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Regenerates the secret for an OAuth client.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _regenerateOAuthClientSecret(clientId) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients/${clientId}/regenerate_secret`, {
        headers: this.headers,
        xform: (client) => {
          return { data: client, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Lists all custom providers with optional type filter.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _listCustomProviders(params) {
    try {
      const query2 = {};
      if (params === null || params === void 0 ? void 0 : params.type) {
        query2.type = params.type;
      }
      return await _request(this.fetch, "GET", `${this.url}/admin/custom-providers`, {
        headers: this.headers,
        query: query2,
        xform: (data) => {
          var _a;
          return { data: { providers: (_a = data === null || data === void 0 ? void 0 : data.providers) !== null && _a !== void 0 ? _a : [] }, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { providers: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Creates a new custom OIDC/OAuth provider.
   *
   * For OIDC providers, the server fetches and validates the OpenID Connect discovery document
   * from the issuer's well-known endpoint (or the provided `discovery_url`) at creation time.
   * This may return a validation error (`error_code: "validation_failed"`) if the discovery
   * document is unreachable, not valid JSON, missing required fields, or if the issuer
   * in the document does not match the expected issuer.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _createCustomProvider(params) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/custom-providers`, {
        body: params,
        headers: this.headers,
        xform: (provider) => {
          return { data: provider, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Gets details of a specific custom provider by identifier.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _getCustomProvider(identifier) {
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/custom-providers/${identifier}`, {
        headers: this.headers,
        xform: (provider) => {
          return { data: provider, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Updates an existing custom provider.
   *
   * When `issuer` or `discovery_url` is changed on an OIDC provider, the server re-fetches and
   * validates the discovery document before persisting. This may return a validation error
   * (`error_code: "validation_failed"`) if the discovery document is unreachable, invalid, or
   * the issuer does not match.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _updateCustomProvider(identifier, params) {
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/custom-providers/${identifier}`, {
        body: params,
        headers: this.headers,
        xform: (provider) => {
          return { data: provider, error: null };
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Deletes a custom provider.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async _deleteCustomProvider(identifier) {
    try {
      await _request(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${identifier}`, {
        headers: this.headers,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Lists all passkeys for a user.
   *
   * This function should only be called on a server. Never expose your secret key in the browser.
   */
  async _adminListPasskeys(params) {
    validateUUID(params.userId);
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/passkeys`, { headers: this.headers, xform: (data) => ({ data, error: null }) });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Deletes a user's passkey.
   *
   * This function should only be called on a server. Never expose your secret key in the browser.
   */
  async _adminDeletePasskey(params) {
    validateUUID(params.userId);
    validateUUID(params.passkeyId);
    try {
      await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/passkeys/${params.passkeyId}`, { headers: this.headers, noResolveJson: true });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/local-storage.js
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
}

// node_modules/@supabase/auth-js/dist/module/lib/locks.js
var internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
var LockAcquireTimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/polyfills.js
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function() {
        return this;
      },
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}

// node_modules/@supabase/auth-js/dist/module/lib/web3/ethereum.js
function getAddress(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error(`@supabase/auth-js: Address "${address}" is invalid.`);
  }
  return address.toLowerCase();
}
function fromHex(hex) {
  return parseInt(hex, 16);
}
function toHex(value) {
  const bytes = new TextEncoder().encode(value);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return "0x" + hex;
}
function createSiweMessage(parameters) {
  var _a;
  const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version: version5 } = parameters;
  {
    if (!Number.isInteger(chainId))
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${chainId}`);
    if (!domain)
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);
    if (nonce && nonce.length < 8)
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${nonce}`);
    if (!uri)
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);
    if (version5 !== "1")
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${version5}`);
    if ((_a = parameters.statement) === null || _a === void 0 ? void 0 : _a.includes("\n"))
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${parameters.statement}`);
  }
  const address = getAddress(parameters.address);
  const origin = scheme ? `${scheme}://${domain}` : domain;
  const statement = parameters.statement ? `${parameters.statement}
` : "";
  const prefix = `${origin} wants you to sign in with your Ethereum account:
${address}

${statement}`;
  let suffix = `URI: ${uri}
Version: ${version5}
Chain ID: ${chainId}${nonce ? `
Nonce: ${nonce}` : ""}
Issued At: ${issuedAt.toISOString()}`;
  if (expirationTime)
    suffix += `
Expiration Time: ${expirationTime.toISOString()}`;
  if (notBefore)
    suffix += `
Not Before: ${notBefore.toISOString()}`;
  if (requestId)
    suffix += `
Request ID: ${requestId}`;
  if (resources) {
    let content = "\nResources:";
    for (const resource of resources) {
      if (!resource || typeof resource !== "string")
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${resource}`);
      content += `
- ${resource}`;
    }
    suffix += content;
  }
  return `${prefix}
${suffix}`;
}

// node_modules/@supabase/auth-js/dist/module/lib/webauthn.errors.js
var WebAuthnError = class extends Error {
  constructor({ message, code, cause, name }) {
    var _a;
    super(message, { cause });
    this.__isWebAuthnError = true;
    this.name = (_a = name !== null && name !== void 0 ? name : cause instanceof Error ? cause.name : void 0) !== null && _a !== void 0 ? _a : "Unknown Error";
    this.code = code;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code
    };
  }
};
var WebAuthnUnknownError = class extends WebAuthnError {
  constructor(message, originalError) {
    super({
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: originalError,
      message
    });
    this.name = "WebAuthnUnknownError";
    this.originalError = originalError;
  }
};
function identifyRegistrationError({ error, options }) {
  var _a, _b, _c;
  const { publicKey } = options;
  if (!publicKey) {
    throw Error("options was missing required publicKey property");
  }
  if (error.name === "AbortError") {
    if (options.signal instanceof AbortSignal) {
      return new WebAuthnError({
        message: "Registration ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: error
      });
    }
  } else if (error.name === "ConstraintError") {
    if (((_a = publicKey.authenticatorSelection) === null || _a === void 0 ? void 0 : _a.requireResidentKey) === true) {
      return new WebAuthnError({
        message: "Discoverable credentials were required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
        cause: error
      });
    } else if (
      // @ts-ignore: `mediation` doesn't yet exist on CredentialCreationOptions but it's possible as of Sept 2024
      options.mediation === "conditional" && ((_b = publicKey.authenticatorSelection) === null || _b === void 0 ? void 0 : _b.userVerification) === "required"
    ) {
      return new WebAuthnError({
        message: "User verification was required during automatic registration but it could not be performed",
        code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
        cause: error
      });
    } else if (((_c = publicKey.authenticatorSelection) === null || _c === void 0 ? void 0 : _c.userVerification) === "required") {
      return new WebAuthnError({
        message: "User verification was required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
        cause: error
      });
    }
  } else if (error.name === "InvalidStateError") {
    return new WebAuthnError({
      message: "The authenticator was previously registered",
      code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
      cause: error
    });
  } else if (error.name === "NotAllowedError") {
    return new WebAuthnError({
      message: error.message,
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  } else if (error.name === "NotSupportedError") {
    const validPubKeyCredParams = publicKey.pubKeyCredParams.filter((param) => param.type === "public-key");
    if (validPubKeyCredParams.length === 0) {
      return new WebAuthnError({
        message: 'No entry in pubKeyCredParams was of type "public-key"',
        code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
        cause: error
      });
    }
    return new WebAuthnError({
      message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
      code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
      cause: error
    });
  } else if (error.name === "SecurityError") {
    const effectiveDomain = window.location.hostname;
    if (!isValidDomain(effectiveDomain)) {
      return new WebAuthnError({
        message: `${window.location.hostname} is an invalid domain`,
        code: "ERROR_INVALID_DOMAIN",
        cause: error
      });
    } else if (publicKey.rp.id !== effectiveDomain) {
      return new WebAuthnError({
        message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
        code: "ERROR_INVALID_RP_ID",
        cause: error
      });
    }
  } else if (error.name === "TypeError") {
    if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) {
      return new WebAuthnError({
        message: "User ID was not between 1 and 64 characters",
        code: "ERROR_INVALID_USER_ID_LENGTH",
        cause: error
      });
    }
  } else if (error.name === "UnknownError") {
    return new WebAuthnError({
      message: "The authenticator was unable to process the specified options, or could not create a new credential",
      code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
      cause: error
    });
  }
  return new WebAuthnError({
    message: "a Non-Webauthn related error has occurred",
    code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
    cause: error
  });
}
function identifyAuthenticationError({ error, options }) {
  const { publicKey } = options;
  if (!publicKey) {
    throw Error("options was missing required publicKey property");
  }
  if (error.name === "AbortError") {
    if (options.signal instanceof AbortSignal) {
      return new WebAuthnError({
        message: "Authentication ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: error
      });
    }
  } else if (error.name === "NotAllowedError") {
    return new WebAuthnError({
      message: error.message,
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  } else if (error.name === "SecurityError") {
    const effectiveDomain = window.location.hostname;
    if (!isValidDomain(effectiveDomain)) {
      return new WebAuthnError({
        message: `${window.location.hostname} is an invalid domain`,
        code: "ERROR_INVALID_DOMAIN",
        cause: error
      });
    } else if (publicKey.rpId !== effectiveDomain) {
      return new WebAuthnError({
        message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
        code: "ERROR_INVALID_RP_ID",
        cause: error
      });
    }
  } else if (error.name === "UnknownError") {
    return new WebAuthnError({
      message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
      code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
      cause: error
    });
  }
  return new WebAuthnError({
    message: "a Non-Webauthn related error has occurred",
    code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
    cause: error
  });
}

// node_modules/@supabase/auth-js/dist/module/lib/webauthn.js
var WebAuthnAbortService = class {
  /**
   * Create an abort signal for a new WebAuthn operation.
   * Automatically cancels any existing operation.
   *
   * @returns {AbortSignal} Signal to pass to navigator.credentials.create() or .get()
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal MDN - AbortSignal}
   */
  createNewAbortSignal() {
    if (this.controller) {
      const abortError = new Error("Cancelling existing WebAuthn API call for new one");
      abortError.name = "AbortError";
      this.controller.abort(abortError);
    }
    const newController = new AbortController();
    this.controller = newController;
    return newController.signal;
  }
  /**
   * Manually cancel the current WebAuthn operation.
   * Useful for cleaning up when user cancels or navigates away.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort MDN - AbortController.abort}
   */
  cancelCeremony() {
    if (this.controller) {
      const abortError = new Error("Manually cancelling existing WebAuthn API call");
      abortError.name = "AbortError";
      this.controller.abort(abortError);
      this.controller = void 0;
    }
  }
};
var webAuthnAbortService = new WebAuthnAbortService();
function deserializeCredentialCreationOptions(options) {
  if (!options) {
    throw new Error("Credential creation options are required");
  }
  if (typeof PublicKeyCredential !== "undefined" && "parseCreationOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseCreationOptionsFromJSON === "function") {
    return PublicKeyCredential.parseCreationOptionsFromJSON(
      /** we assert the options here as typescript still doesn't know about future webauthn types */
      options
    );
  }
  const { challenge: challengeStr, user: userOpts, excludeCredentials } = options, restOptions = __rest(
    options,
    ["challenge", "user", "excludeCredentials"]
  );
  const challenge2 = base64UrlToUint8Array(challengeStr).buffer;
  const user = Object.assign(Object.assign({}, userOpts), { id: base64UrlToUint8Array(userOpts.id).buffer });
  const result = Object.assign(Object.assign({}, restOptions), {
    challenge: challenge2,
    user
  });
  if (excludeCredentials && excludeCredentials.length > 0) {
    result.excludeCredentials = new Array(excludeCredentials.length);
    for (let i = 0; i < excludeCredentials.length; i++) {
      const cred = excludeCredentials[i];
      result.excludeCredentials[i] = Object.assign(Object.assign({}, cred), {
        id: base64UrlToUint8Array(cred.id).buffer,
        type: cred.type || "public-key",
        // Cast transports to handle future transport types like "cable"
        transports: cred.transports
      });
    }
  }
  return result;
}
function deserializeCredentialRequestOptions(options) {
  if (!options) {
    throw new Error("Credential request options are required");
  }
  if (typeof PublicKeyCredential !== "undefined" && "parseRequestOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseRequestOptionsFromJSON === "function") {
    return PublicKeyCredential.parseRequestOptionsFromJSON(options);
  }
  const { challenge: challengeStr, allowCredentials } = options, restOptions = __rest(
    options,
    ["challenge", "allowCredentials"]
  );
  const challenge2 = base64UrlToUint8Array(challengeStr).buffer;
  const result = Object.assign(Object.assign({}, restOptions), { challenge: challenge2 });
  if (allowCredentials && allowCredentials.length > 0) {
    result.allowCredentials = new Array(allowCredentials.length);
    for (let i = 0; i < allowCredentials.length; i++) {
      const cred = allowCredentials[i];
      result.allowCredentials[i] = Object.assign(Object.assign({}, cred), {
        id: base64UrlToUint8Array(cred.id).buffer,
        type: cred.type || "public-key",
        // Cast transports to handle future transport types like "cable"
        transports: cred.transports
      });
    }
  }
  return result;
}
function serializeCredentialCreationResponse(credential) {
  var _a;
  if ("toJSON" in credential && typeof credential.toJSON === "function") {
    return credential.toJSON();
  }
  const credentialWithAttachment = credential;
  return {
    id: credential.id,
    rawId: credential.id,
    response: {
      attestationObject: bytesToBase64URL(new Uint8Array(credential.response.attestationObject)),
      clientDataJSON: bytesToBase64URL(new Uint8Array(credential.response.clientDataJSON))
    },
    type: "public-key",
    clientExtensionResults: credential.getClientExtensionResults(),
    // Convert null to undefined and cast to AuthenticatorAttachment type
    authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
  };
}
function serializeCredentialRequestResponse(credential) {
  var _a;
  if ("toJSON" in credential && typeof credential.toJSON === "function") {
    return credential.toJSON();
  }
  const credentialWithAttachment = credential;
  const clientExtensionResults = credential.getClientExtensionResults();
  const assertionResponse = credential.response;
  return {
    id: credential.id,
    rawId: credential.id,
    // W3C spec expects rawId to match id for JSON format
    response: {
      authenticatorData: bytesToBase64URL(new Uint8Array(assertionResponse.authenticatorData)),
      clientDataJSON: bytesToBase64URL(new Uint8Array(assertionResponse.clientDataJSON)),
      signature: bytesToBase64URL(new Uint8Array(assertionResponse.signature)),
      userHandle: assertionResponse.userHandle ? bytesToBase64URL(new Uint8Array(assertionResponse.userHandle)) : void 0
    },
    type: "public-key",
    clientExtensionResults,
    // Convert null to undefined and cast to AuthenticatorAttachment type
    authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
  };
}
function isValidDomain(hostname) {
  return (
    // Consider localhost valid as well since it's okay wrt Secure Contexts
    hostname === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(hostname)
  );
}
function browserSupportsWebAuthn() {
  var _a, _b;
  return !!(isBrowser() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && typeof ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _a === void 0 ? void 0 : _a.create) === "function" && typeof ((_b = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _b === void 0 ? void 0 : _b.get) === "function");
}
async function createCredential(options) {
  try {
    const response = await navigator.credentials.create(
      /** we assert the type here until typescript types are updated */
      options
    );
    if (!response) {
      return {
        data: null,
        error: new WebAuthnUnknownError("Empty credential response", response)
      };
    }
    if (!(response instanceof PublicKeyCredential)) {
      return {
        data: null,
        error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
      };
    }
    return { data: response, error: null };
  } catch (err) {
    return {
      data: null,
      error: identifyRegistrationError({
        error: err,
        options
      })
    };
  }
}
async function getCredential(options) {
  try {
    const response = await navigator.credentials.get(
      /** we assert the type here until typescript types are updated */
      options
    );
    if (!response) {
      return {
        data: null,
        error: new WebAuthnUnknownError("Empty credential response", response)
      };
    }
    if (!(response instanceof PublicKeyCredential)) {
      return {
        data: null,
        error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
      };
    }
    return { data: response, error: null };
  } catch (err) {
    return {
      data: null,
      error: identifyAuthenticationError({
        error: err,
        options
      })
    };
  }
}
var DEFAULT_CREATION_OPTIONS = {
  hints: ["security-key"],
  authenticatorSelection: {
    authenticatorAttachment: "cross-platform",
    requireResidentKey: false,
    /** set to preferred because older yubikeys don't have PIN/Biometric */
    userVerification: "preferred",
    residentKey: "discouraged"
  },
  attestation: "direct"
};
var DEFAULT_REQUEST_OPTIONS = {
  /** set to preferred because older yubikeys don't have PIN/Biometric */
  userVerification: "preferred",
  hints: ["security-key"],
  attestation: "direct"
};
function deepMerge(...sources) {
  const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  const isArrayBufferLike = (val) => val instanceof ArrayBuffer || ArrayBuffer.isView(val);
  const result = {};
  for (const source of sources) {
    if (!source)
      continue;
    for (const key in source) {
      const value = source[key];
      if (value === void 0)
        continue;
      if (Array.isArray(value)) {
        result[key] = value;
      } else if (isArrayBufferLike(value)) {
        result[key] = value;
      } else if (isObject(value)) {
        const existing = result[key];
        if (isObject(existing)) {
          result[key] = deepMerge(existing, value);
        } else {
          result[key] = deepMerge(value);
        }
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
function mergeCredentialCreationOptions(baseOptions, overrides) {
  return deepMerge(DEFAULT_CREATION_OPTIONS, baseOptions, overrides || {});
}
function mergeCredentialRequestOptions(baseOptions, overrides) {
  return deepMerge(DEFAULT_REQUEST_OPTIONS, baseOptions, overrides || {});
}
var WebAuthnApi = class {
  constructor(client) {
    this.client = client;
    this.enroll = this._enroll.bind(this);
    this.challenge = this._challenge.bind(this);
    this.verify = this._verify.bind(this);
    this.authenticate = this._authenticate.bind(this);
    this.register = this._register.bind(this);
  }
  /**
   * Enroll a new WebAuthn factor.
   * Creates an unverified WebAuthn factor that must be verified with a credential.
   *
   * @experimental This method is experimental and may change in future releases
   * @param {Omit<MFAEnrollWebauthnParams, 'factorType'>} params - Enrollment parameters (friendlyName required)
   * @returns {Promise<AuthMFAEnrollWebauthnResponse>} Enrolled factor details or error
   * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registering a New Credential}
   */
  async _enroll(params) {
    return this.client.mfa.enroll(Object.assign(Object.assign({}, params), { factorType: "webauthn" }));
  }
  /**
   * Challenge for WebAuthn credential creation or authentication.
   * Combines server challenge with browser credential operations.
   * Handles both registration (create) and authentication (request) flows.
   *
   * @experimental This method is experimental and may change in future releases
   * @param {MFAChallengeWebauthnParams & { friendlyName?: string; signal?: AbortSignal }} params - Challenge parameters including factorId
   * @param {Object} overrides - Allows you to override the parameters passed to navigator.credentials
   * @param {PublicKeyCredentialCreationOptionsFuture} overrides.create - Override options for credential creation
   * @param {PublicKeyCredentialRequestOptionsFuture} overrides.request - Override options for credential request
   * @returns {Promise<RequestResult>} Challenge response with credential or error
   * @see {@link https://w3c.github.io/webauthn/#sctn-credential-creation W3C WebAuthn Spec - Credential Creation}
   * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying Assertion}
   */
  async _challenge({ factorId, webauthn, friendlyName, signal }, overrides) {
    var _a;
    try {
      const { data: challengeResponse, error: challengeError } = await this.client.mfa.challenge({
        factorId,
        webauthn
      });
      if (!challengeResponse) {
        return { data: null, error: challengeError };
      }
      const abortSignal = signal !== null && signal !== void 0 ? signal : webAuthnAbortService.createNewAbortSignal();
      if (challengeResponse.webauthn.type === "create") {
        const { user } = challengeResponse.webauthn.credential_options.publicKey;
        if (!user.name) {
          const nameToUse = friendlyName;
          if (!nameToUse) {
            const currentUser = await this.client.getUser();
            const userData = currentUser.data.user;
            const fallbackName = ((_a = userData === null || userData === void 0 ? void 0 : userData.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || (userData === null || userData === void 0 ? void 0 : userData.email) || (userData === null || userData === void 0 ? void 0 : userData.id) || "User";
            user.name = `${user.id}:${fallbackName}`;
          } else {
            user.name = `${user.id}:${nameToUse}`;
          }
        }
        if (!user.displayName) {
          user.displayName = user.name;
        }
      }
      switch (challengeResponse.webauthn.type) {
        case "create": {
          const options = mergeCredentialCreationOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.create);
          const { data, error } = await createCredential({
            publicKey: options,
            signal: abortSignal
          });
          if (data) {
            return {
              data: {
                factorId,
                challengeId: challengeResponse.id,
                webauthn: {
                  type: challengeResponse.webauthn.type,
                  credential_response: data
                }
              },
              error: null
            };
          }
          return { data: null, error };
        }
        case "request": {
          const options = mergeCredentialRequestOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.request);
          const { data, error } = await getCredential(Object.assign(Object.assign({}, challengeResponse.webauthn.credential_options), { publicKey: options, signal: abortSignal }));
          if (data) {
            return {
              data: {
                factorId,
                challengeId: challengeResponse.id,
                webauthn: {
                  type: challengeResponse.webauthn.type,
                  credential_response: data
                }
              },
              error: null
            };
          }
          return { data: null, error };
        }
      }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      return {
        data: null,
        error: new AuthUnknownError("Unexpected error in challenge", error)
      };
    }
  }
  /**
   * Verify a WebAuthn credential with the server.
   * Completes the WebAuthn ceremony by sending the credential to the server for verification.
   *
   * @experimental This method is experimental and may change in future releases
   * @param {Object} params - Verification parameters
   * @param {string} params.challengeId - ID of the challenge being verified
   * @param {string} params.factorId - ID of the WebAuthn factor
   * @param {MFAVerifyWebauthnParams<T>['webauthn']} params.webauthn - WebAuthn credential response
   * @returns {Promise<AuthMFAVerifyResponse>} Verification result with session or error
   * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying an Authentication Assertion}
   * */
  async _verify({ challengeId, factorId, webauthn }) {
    return this.client.mfa.verify({
      factorId,
      challengeId,
      webauthn
    });
  }
  /**
   * Complete WebAuthn authentication flow.
   * Performs challenge and verification in a single operation for existing credentials.
   *
   * @experimental This method is experimental and may change in future releases
   * @param {Object} params - Authentication parameters
   * @param {string} params.factorId - ID of the WebAuthn factor to authenticate with
   * @param {Object} params.webauthn - WebAuthn configuration
   * @param {string} params.webauthn.rpId - Relying Party ID (defaults to current hostname)
   * @param {string[]} params.webauthn.rpOrigins - Allowed origins (defaults to current origin)
   * @param {AbortSignal} params.webauthn.signal - Optional abort signal
   * @param {PublicKeyCredentialRequestOptionsFuture} overrides - Override options for navigator.credentials.get
   * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Authentication result
   * @see {@link https://w3c.github.io/webauthn/#sctn-authentication W3C WebAuthn Spec - Authentication Ceremony}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions MDN - PublicKeyCredentialRequestOptions}
   */
  async _authenticate({ factorId, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
    if (!rpId) {
      return {
        data: null,
        error: new AuthError("rpId is required for WebAuthn authentication")
      };
    }
    try {
      if (!browserSupportsWebAuthn()) {
        return {
          data: null,
          error: new AuthUnknownError("Browser does not support WebAuthn", null)
        };
      }
      const { data: challengeResponse, error: challengeError } = await this.challenge({
        factorId,
        webauthn: { rpId, rpOrigins },
        signal
      }, { request: overrides });
      if (!challengeResponse) {
        return { data: null, error: challengeError };
      }
      const { webauthn } = challengeResponse;
      return this._verify({
        factorId,
        challengeId: challengeResponse.challengeId,
        webauthn: {
          type: webauthn.type,
          rpId,
          rpOrigins,
          credential_response: webauthn.credential_response
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      return {
        data: null,
        error: new AuthUnknownError("Unexpected error in authenticate", error)
      };
    }
  }
  /**
   * Complete WebAuthn registration flow.
   * Performs enrollment, challenge, and verification in a single operation for new credentials.
   *
   * @experimental This method is experimental and may change in future releases
   * @param {Object} params - Registration parameters
   * @param {string} params.friendlyName - User-friendly name for the credential
   * @param {string} params.rpId - Relying Party ID (defaults to current hostname)
   * @param {string[]} params.rpOrigins - Allowed origins (defaults to current origin)
   * @param {AbortSignal} params.signal - Optional abort signal
   * @param {PublicKeyCredentialCreationOptionsFuture} overrides - Override options for navigator.credentials.create
   * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Registration result
   * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registration Ceremony}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions MDN - PublicKeyCredentialCreationOptions}
   */
  async _register({ friendlyName, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
    if (!rpId) {
      return {
        data: null,
        error: new AuthError("rpId is required for WebAuthn registration")
      };
    }
    try {
      if (!browserSupportsWebAuthn()) {
        return {
          data: null,
          error: new AuthUnknownError("Browser does not support WebAuthn", null)
        };
      }
      const { data: factor, error: enrollError } = await this._enroll({
        friendlyName
      });
      if (!factor) {
        await this.client.mfa.listFactors().then((factors) => {
          var _a;
          return (_a = factors.data) === null || _a === void 0 ? void 0 : _a.all.find((v) => v.factor_type === "webauthn" && v.friendly_name === friendlyName && v.status === "unverified");
        }).then((factor2) => factor2 ? this.client.mfa.unenroll({ factorId: factor2 === null || factor2 === void 0 ? void 0 : factor2.id }) : void 0);
        return { data: null, error: enrollError };
      }
      const { data: challengeResponse, error: challengeError } = await this._challenge({
        factorId: factor.id,
        friendlyName: factor.friendly_name,
        webauthn: { rpId, rpOrigins },
        signal
      }, {
        create: overrides
      });
      if (!challengeResponse) {
        return { data: null, error: challengeError };
      }
      return this._verify({
        factorId: factor.id,
        challengeId: challengeResponse.challengeId,
        webauthn: {
          rpId,
          rpOrigins,
          type: challengeResponse.webauthn.type,
          credential_response: challengeResponse.webauthn.credential_response
        }
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      return {
        data: null,
        error: new AuthUnknownError("Unexpected error in register", error)
      };
    }
  }
};

// node_modules/@supabase/auth-js/dist/module/GoTrueClient.js
polyfillGlobalThis();
var DEFAULT_OPTIONS = {
  url: GOTRUE_URL,
  storageKey: STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS2,
  flowType: "implicit",
  debug: false,
  hasCustomAuthorizationHeader: false,
  throwOnError: false,
  lockAcquireTimeout: 5e3,
  // 5 seconds. Only used when a custom `lock` is supplied. TODO(v3): remove.
  skipAutoInitialize: false,
  experimental: {}
};
var GLOBAL_JWKS = {};
var deprecatedLockWarned = false;
var GoTrueClient = class _GoTrueClient {
  /**
   * The JWKS used for verifying asymmetric JWTs
   */
  get jwks() {
    var _a, _b;
    return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
  }
  set jwks(value) {
    GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
  }
  get jwks_cached_at() {
    var _a, _b;
    return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
  }
  set jwks_cached_at(value) {
    GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
  }
  /**
   * Create a new client for use in the browser.
   *
   * @example Using supabase-js (recommended)
   * ```ts
   * import { createClient } from '@supabase/supabase-js'
   *
   * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
   * const { data, error } = await supabase.auth.getUser()
   * ```
   *
   * @example Standalone import for bundle-sensitive environments
   * ```ts
   * import { GoTrueClient } from '@supabase/auth-js'
   *
   * const auth = new GoTrueClient({
   *   url: 'https://xyzcompany.supabase.co/auth/v1',
   *   headers: { apikey: 'your-publishable-key' },
   *   storageKey: 'supabase-auth',
   * })
   * ```
   */
  constructor(options) {
    var _a, _b, _c;
    this.userStorage = null;
    this.memoryStorage = null;
    this.stateChangeEmitters = /* @__PURE__ */ new Map();
    this.autoRefreshTicker = null;
    this.autoRefreshTickTimeout = null;
    this.visibilityChangedCallback = null;
    this.refreshingDeferred = null;
    this.lastRefreshFailure = null;
    this._sessionRemovalEpoch = 0;
    this.initializePromise = null;
    this._pendingInitNotifications = null;
    this.detectSessionInUrl = true;
    this.hasCustomAuthorizationHeader = false;
    this.suppressGetSessionWarning = false;
    this.lock = null;
    this.lockAcquired = false;
    this.pendingInLock = [];
    this.broadcastChannel = null;
    this.logger = console.log;
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.storageKey = settings.storageKey;
    this.instanceID = (_a = _GoTrueClient.nextInstanceID[this.storageKey]) !== null && _a !== void 0 ? _a : 0;
    _GoTrueClient.nextInstanceID[this.storageKey] = this.instanceID + 1;
    this.logDebugMessages = !!settings.debug;
    if (typeof settings.debug === "function") {
      this.logger = settings.debug;
    }
    if (this.instanceID > 0 && isBrowser()) {
      const message = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
      console.warn(message);
      if (this.logDebugMessages) {
        console.trace(message);
      }
    }
    this.persistSession = settings.persistSession;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.experimental = (_b = settings.experimental) !== null && _b !== void 0 ? _b : {};
    this.admin = new GoTrueAdminApi({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch,
      experimental: this.experimental
    });
    this.url = settings.url;
    this.headers = settings.headers;
    this.fetch = resolveFetch3(settings.fetch);
    this.detectSessionInUrl = settings.detectSessionInUrl;
    this.flowType = settings.flowType;
    this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
    this.throwOnError = settings.throwOnError;
    this.lockAcquireTimeout = settings.lockAcquireTimeout;
    if (settings.lock != null) {
      this.lock = settings.lock;
      if (!deprecatedLockWarned) {
        deprecatedLockWarned = true;
        console.warn(`${this._logPrefix()} The "lock" option is deprecated and will be removed in v3. The client now coordinates session refreshes without a lock, so most apps can drop the option. See https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/migrations/lockless-coordination.md`);
      }
    }
    if (!this.jwks) {
      this.jwks = { keys: [] };
      this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
    }
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
      webauthn: new WebAuthnApi(this),
      recoveryCodes: {
        getStatus: this._getRecoveryCodesStatus.bind(this),
        generate: this._generateRecoveryCodes.bind(this),
        verify: this._verifyRecoveryCode.bind(this),
        regenerate: this._regenerateRecoveryCodes.bind(this),
        unenroll: this._unenrollRecoveryCodes.bind(this)
      }
    };
    this.oauth = {
      getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
      approveAuthorization: this._approveAuthorization.bind(this),
      denyAuthorization: this._denyAuthorization.bind(this),
      listGrants: this._listOAuthGrants.bind(this),
      revokeGrant: this._revokeOAuthGrant.bind(this)
    };
    this.passkey = {
      startRegistration: this._startPasskeyRegistration.bind(this),
      verifyRegistration: this._verifyPasskeyRegistration.bind(this),
      startAuthentication: this._startPasskeyAuthentication.bind(this),
      verifyAuthentication: this._verifyPasskeyAuthentication.bind(this),
      list: this._listPasskeys.bind(this),
      update: this._updatePasskey.bind(this),
      delete: this._deletePasskey.bind(this)
    };
    if (this.persistSession) {
      if (settings.storage) {
        this.storage = settings.storage;
      } else {
        if (supportsLocalStorage()) {
          this.storage = globalThis.localStorage;
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
      }
      if (settings.userStorage) {
        this.userStorage = settings.userStorage;
      }
    } else {
      this.memoryStorage = {};
      this.storage = memoryLocalStorageAdapter(this.memoryStorage);
    }
    if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (e) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
      }
      (_c = this.broadcastChannel) === null || _c === void 0 ? void 0 : _c.addEventListener("message", async (event) => {
        this._debug("received broadcast notification from other tab or client", event);
        if (event.data.event === "TOKEN_REFRESHED" || event.data.event === "SIGNED_IN") {
          this.lastRefreshFailure = null;
        }
        try {
          await this._notifyAllSubscribers(event.data.event, event.data.session, false);
        } catch (error) {
          this._debug("#broadcastChannel", "error", error);
        }
      });
    }
    if (!settings.skipAutoInitialize) {
      this.initialize().catch((error) => {
        this._debug("#initialize()", "error", error);
      });
    }
  }
  /**
   * Returns whether error throwing mode is enabled for this client.
   */
  isThrowOnErrorEnabled() {
    return this.throwOnError;
  }
  /**
   * Centralizes return handling with optional error throwing. When `throwOnError` is enabled
   * and the provided result contains a non-nullish error, the error is thrown instead of
   * being returned. This ensures consistent behavior across all public API methods.
   */
  _returnResult(result) {
    if (this.throwOnError && result && result.error) {
      throw result.error;
    }
    return result;
  }
  _logPrefix() {
    return `GoTrueClient@${this.storageKey}:${this.instanceID} (${version3}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
  }
  _debug(...args) {
    if (this.logDebugMessages) {
      this.logger(this._logPrefix(), ...args);
    }
    return this;
  }
  /**
   * Initialize the auth client by loading the session from storage or
   * detecting it from the URL after an OAuth, magic-link, or password-recovery
   * redirect.
   *
   * **Most callers do not need to invoke this directly.** The client calls it
   * automatically during construction, and to react to sign-in events (including
   * post-redirect events) you should subscribe to `onAuthStateChange` rather
   * than awaiting `initialize()`.
   *
   * You only need to call it manually when you have opted out of the automatic
   * call by passing `skipAutoInitialize: true` — for example, in an SSR context
   * where you need to control initialization timing. In that case, awaiting
   * `initialize()` returns the resolved session result (or any error encountered
   * while detecting it from the URL).
   *
   * @category Auth
   */
  async initialize() {
    var _a;
    if (this.initializePromise) {
      return await this.initializePromise;
    }
    this._pendingInitNotifications = [];
    this.initializePromise = (async () => {
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._initialize();
        });
      }
      return await this._initialize();
    })();
    const result = await this.initializePromise;
    const queue = (_a = this._pendingInitNotifications) !== null && _a !== void 0 ? _a : [];
    this._pendingInitNotifications = null;
    for (const n of queue) {
      await this._notifyAllSubscribers(n.event, n.session, n.broadcast);
    }
    return result;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    var _a;
    try {
      let params = {};
      let callbackUrlType = "none";
      if (isBrowser()) {
        params = parseParametersFromURL(window.location.href);
        if (this._isImplicitGrantCallback(params)) {
          callbackUrlType = "implicit";
        } else if (await this._isPKCECallback(params)) {
          callbackUrlType = "pkce";
        }
      }
      if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
        const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
        if (error) {
          this._debug("#_initialize()", "error detecting session from URL", error);
          if (isAuthImplicitGrantRedirectError(error)) {
            const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
            if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
              return { error };
            }
          }
          return { error };
        }
        const { session, redirectType } = data;
        this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
        await this._saveSession(session);
        setTimeout(async () => {
          if (redirectType === "recovery") {
            await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
        }, 0);
        return { error: null };
      }
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ error });
      }
      return this._returnResult({
        error: new AuthUnknownError("Unexpected error during initialization", error)
      });
    } finally {
      await this._handleVisibilityChange();
      this._debug("#_initialize()", "end");
    }
  }
  /**
   * Creates a new anonymous user.
   *
   * @returns A session where the is_anonymous claim in the access token JWT set to true
   *
   * @category Auth
   *
   * @remarks
   * - Returns an anonymous user
   * - It is recommended to set up captcha for anonymous sign-ins to prevent abuse. You can pass in the captcha token in the `options` param.
   *
   * @example Create an anonymous user
   * ```js
   * const { data, error } = await supabase.auth.signInAnonymously({
   *   options: {
   *     captchaToken
   *   }
   * });
   * ```
   *
   * @exampleResponse Create an anonymous user
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "",
   *       "phone": "",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {},
   *       "user_metadata": {},
   *       "identities": [],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": true
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "",
   *         "phone": "",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {},
   *         "user_metadata": {},
   *         "identities": [],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *         "is_anonymous": true
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Create an anonymous user with custom user metadata
   * ```js
   * const { data, error } = await supabase.auth.signInAnonymously({
   *   options: {
   *     data
   *   }
   * })
   * ```
   */
  async signInAnonymously(credentials) {
    var _a, _b, _c;
    try {
      const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
        headers: this.headers,
        body: {
          data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
          gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error || !data) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return this._returnResult({ data: { user, session }, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   *
   * @category Auth
   *
   * @remarks
   * - By default, the user needs to verify their email address before logging in. To turn this off, disable **Confirm email** in [your project](/dashboard/project/_/auth/providers).
   * - **Confirm email** determines if users need to confirm their email address after signing up.
   *   - If **Confirm email** is enabled, a `user` is returned but `session` is null.
   *   - If **Confirm email** is disabled, both a `user` and a `session` are returned.
   * - When the user confirms their email address, they are redirected to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) by default. You can modify your `SITE_URL` or add additional redirect URLs in [your project](/dashboard/project/_/auth/url-configuration).
   * - If signUp() is called for an existing confirmed user:
   *   - When both **Confirm email** and **Confirm phone** (even when phone provider is disabled) are enabled in [your project](/dashboard/project/_/auth/providers), an obfuscated/fake user object is returned.
   *   - When either **Confirm email** or **Confirm phone** (even when phone provider is disabled) is disabled, the error message, `User already registered` is returned.
   * - To fetch the currently logged-in user, refer to [`getUser()`](/docs/reference/javascript/auth-getuser).
   *
   * @example Sign up with an email and password
   * ```js
   * const { data, error } = await supabase.auth.signUp({
   *   email: 'example@email.com',
   *   password: 'example-password',
   * })
   * ```
   *
   * @exampleResponse Sign up with an email and password
   * ```json
   * // Some fields may be null if "confirm email" is enabled.
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {},
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z"
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "example@email.com",
   *         "email_confirmed_at": "2024-01-01T00:00:00Z",
   *         "phone": "",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {
   *           "provider": "email",
   *           "providers": [
   *             "email"
   *           ]
   *         },
   *         "user_metadata": {},
   *         "identities": [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z"
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Sign up with a phone number and password (SMS)
   * ```js
   * const { data, error } = await supabase.auth.signUp({
   *   phone: '123456789',
   *   password: 'example-password',
   *   options: {
   *     channel: 'sms'
   *   }
   * })
   * ```
   *
   * @exampleDescription Sign up with a phone number and password (whatsapp)
   * The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.
   *
   * @example Sign up with a phone number and password (whatsapp)
   * ```js
   * const { data, error } = await supabase.auth.signUp({
   *   phone: '123456789',
   *   password: 'example-password',
   *   options: {
   *     channel: 'whatsapp'
   *   }
   * })
   * ```
   *
   * @example Sign up with additional user metadata
   * ```js
   * const { data, error } = await supabase.auth.signUp(
   *   {
   *     email: 'example@email.com',
   *     password: 'example-password',
   *     options: {
   *       data: {
   *         first_name: 'John',
   *         age: 27,
   *       }
   *     }
   *   }
   * )
   * ```
   *
   * @exampleDescription Sign up with a redirect URL
   * - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
   *
   * @example Sign up with a redirect URL
   * ```js
   * const { data, error } = await supabase.auth.signUp(
   *   {
   *     email: 'example@email.com',
   *     password: 'example-password',
   *     options: {
   *       emailRedirectTo: 'https://example.com/welcome'
   *     }
   *   }
   * )
   * ```
   */
  async signUp(credentials) {
    var _a, _b, _c;
    let flowId = null;
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
        }
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId),
          body: {
            email,
            password,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          xform: _sessionResponse
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone,
            password,
            data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
            channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error || !data) {
        await removePKCEVerifier(this.storage, this.storageKey, flowId);
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return this._returnResult({ data: { user, session }, error: null });
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   *
   * @category Auth
   *
   * @remarks
   * - Requires either an email and password or a phone number and password.
   *
   * @example Sign in with email and password
   * ```js
   * const { data, error } = await supabase.auth.signInWithPassword({
   *   email: 'example@email.com',
   *   password: 'example-password',
   * })
   * ```
   *
   * @exampleResponse Sign in with email and password
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {},
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z"
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "example@email.com",
   *         "email_confirmed_at": "2024-01-01T00:00:00Z",
   *         "phone": "",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {
   *           "provider": "email",
   *           "providers": [
   *             "email"
   *           ]
   *         },
   *         "user_metadata": {},
   *         "identities": [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z"
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Sign in with phone and password
   * ```js
   * const { data, error } = await supabase.auth.signInWithPassword({
   *   phone: '+13334445555',
   *   password: 'some-password',
   * })
   * ```
   *
   * @exampleDescription Handling errors
   * Log the full `error` object so fields like `code`, `status`, and `name` aren't hidden. The `error.code` (e.g. `'invalid_credentials'`, `'email_not_confirmed'`) is often more useful for branching than `error.message`, and the full object surfaces both.
   *
   * @example Handling errors
   * ```js
   * const { data, error } = await supabase.auth.signInWithPassword({
   *   email: 'example@email.com',
   *   password: 'example-password',
   * })
   * if (error) {
   *   console.error(error)
   *   return
   * }
   * ```
   */
  async signInWithPassword(credentials) {
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error) {
        return this._returnResult({ data: { user: null, session: null }, error });
      } else if (!data || !data.session || !data.user) {
        const invalidTokenError = new AuthInvalidTokenResponseError();
        return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return this._returnResult({
        data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
        error
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   *
   * @category Auth
   *
   * @remarks
   * - This method is used for signing in using [Social Login (OAuth) providers](/docs/guides/auth#configure-third-party-providers).
   * - It works by redirecting your application to the provider's authorization screen, before bringing back the user to your app.
   *
   * @example Sign in using a third-party provider
   * ```js
   * const { data, error } = await supabase.auth.signInWithOAuth({
   *   provider: 'github'
   * })
   * ```
   *
   * @exampleResponse Sign in using a third-party provider
   * ```json
   * {
   *   data: {
   *     provider: 'github',
   *     url: <PROVIDER_URL_TO_REDIRECT_TO>,
   *     flowId: <PKCE_FLOW_ID_OR_NULL>
   *   },
   *   error: null
   * }
   * ```
   *
   * @exampleDescription Sign in using a third-party provider with redirect
   * - When the OAuth provider successfully authenticates the user, they are redirected to the URL specified in the `redirectTo` parameter. This parameter defaults to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls). It does not redirect the user immediately after invoking this method.
   * - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
   *
   * @example Sign in using a third-party provider with redirect
   * ```js
   * const { data, error } = await supabase.auth.signInWithOAuth({
   *   provider: 'github',
   *   options: {
   *     redirectTo: 'https://example.com/welcome'
   *   }
   * })
   * ```
   *
   * @exampleDescription Sign in with scopes and access provider tokens
   * If you need additional access from an OAuth provider, in order to access provider specific APIs in the name of the user, you can do this by passing in the scopes the user should authorize for your application. Note that the `scopes` option takes in **a space-separated list** of scopes.
   *
   * Because OAuth sign-in often includes redirects, you should register an `onAuthStateChange` callback immediately after you create the Supabase client. This callback will listen for the presence of `provider_token` and `provider_refresh_token` properties on the `session` object and store them in local storage. The client library will emit these values **only once** immediately after the user signs in. You can then access them by looking them up in local storage, or send them to your backend servers for further processing.
   *
   * Finally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.
   *
   * @example Sign in with scopes and access provider tokens
   * ```js
   * // Register this immediately after calling createClient!
   * // Because signInWithOAuth causes a redirect, you need to fetch the
   * // provider tokens from the callback.
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (session && session.provider_token) {
   *     window.localStorage.setItem('oauth_provider_token', session.provider_token)
   *   }
   *
   *   if (session && session.provider_refresh_token) {
   *     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
   *   }
   *
   *   if (event === 'SIGNED_OUT') {
   *     window.localStorage.removeItem('oauth_provider_token')
   *     window.localStorage.removeItem('oauth_provider_refresh_token')
   *   }
   * })
   *
   * // Call this on your Sign in with GitHub button to initiate OAuth
   * // with GitHub with the requested elevated scopes.
   * await supabase.auth.signInWithOAuth({
   *   provider: 'github',
   *   options: {
   *     scopes: 'repo gist notifications'
   *   }
   * })
   * ```
   */
  async signInWithOAuth(credentials) {
    var _a, _b, _c, _d;
    return await this._handleProviderSignIn(credentials.provider, {
      redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
      scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
      queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
      skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   *
   * @category Auth
   *
   * @remarks
   * - Used when `flowType` is set to `pkce` in client options.
   * - When several PKCE flows are in flight at once, pass `options.flowId` so
   *   the code is exchanged with the verifier created by that specific flow.
   *   The flow id is returned by `signInWithOAuth`, and with
   *   `experimental.appendPkceFlowIdToRedirects` enabled it also arrives on
   *   your callback URL as the reserved `sb_flow_id` query parameter (read
   *   automatically in a browser).
   * - When a flow id is present but its stored verifier is gone (evicted,
   *   already used, or from another device), the call fails with a verifier
   *   missing error instead of trying another flow's verifier — a mismatched
   *   verifier would consume the single-use code. Without any flow id the
   *   most recently stored verifier is used, as before.
   *
   * @example Exchange Auth Code
   * ```js
   * supabase.auth.exchangeCodeForSession('34e770dd-9ff9-416c-87fa-43b31d7ef225')
   * ```
   *
   * @example Exchange Auth Code for a specific flow (e.g. in a server-side callback handler)
   * ```js
   * const flowId = requestUrl.searchParams.get('sb_flow_id')
   * supabase.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined)
   * ```
   *
   * @exampleResponse Exchange Auth Code
   * ```json
   * {
   *   "data": {
   *     session: {
   *       access_token: '<ACCESS_TOKEN>',
   *       token_type: 'bearer',
   *       expires_in: 3600,
   *       expires_at: 1700000000,
   *       refresh_token: '<REFRESH_TOKEN>',
   *       user: {
   *         id: '11111111-1111-1111-1111-111111111111',
   *         aud: 'authenticated',
   *         role: 'authenticated',
   *         email: 'example@email.com'
   *         email_confirmed_at: '2024-01-01T00:00:00Z',
   *         phone: '',
   *         confirmation_sent_at: '2024-01-01T00:00:00Z',
   *         confirmed_at: '2024-01-01T00:00:00Z',
   *         last_sign_in_at: '2024-01-01T00:00:00Z',
   *         app_metadata: {
   *           "provider": "email",
   *           "providers": [
   *             "email",
   *             "<OTHER_PROVIDER>"
   *           ]
   *         },
   *         user_metadata: {
   *           email: 'email@email.com',
   *           email_verified: true,
   *           full_name: 'User Name',
   *           iss: '<ISS>',
   *           name: 'User Name',
   *           phone_verified: false,
   *           provider_id: '<PROVIDER_ID>',
   *           sub: '<SUB>'
   *         },
   *         identities: [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "email@example.com"
   *           },
   *           {
   *             "identity_id": "33333333-3333-3333-3333-333333333333",
   *             "id": "<ID>",
   *             "user_id": "<USER_ID>",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": true,
   *               "full_name": "User Name",
   *               "iss": "<ISS>",
   *               "name": "User Name",
   *               "phone_verified": false,
   *               "provider_id": "<PROVIDER_ID>",
   *               "sub": "<SUB>"
   *             },
   *             "provider": "<PROVIDER>",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         created_at: '2024-01-01T00:00:00Z',
   *         updated_at: '2024-01-01T00:00:00Z',
   *         is_anonymous: false
   *       },
   *       provider_token: '<PROVIDER_TOKEN>',
   *       provider_refresh_token: '<PROVIDER_REFRESH_TOKEN>'
   *     },
   *     user: {
   *       id: '11111111-1111-1111-1111-111111111111',
   *       aud: 'authenticated',
   *       role: 'authenticated',
   *       email: 'example@email.com',
   *       email_confirmed_at: '2024-01-01T00:00:00Z',
   *       phone: '',
   *       confirmation_sent_at: '2024-01-01T00:00:00Z',
   *       confirmed_at: '2024-01-01T00:00:00Z',
   *       last_sign_in_at: '2024-01-01T00:00:00Z',
   *       app_metadata: {
   *         provider: 'email',
   *         providers: [
   *           "email",
   *           "<OTHER_PROVIDER>"
   *         ]
   *       },
   *       user_metadata: {
   *         email: 'email@email.com',
   *         email_verified: true,
   *         full_name: 'User Name',
   *         iss: '<ISS>',
   *         name: 'User Name',
   *         phone_verified: false,
   *         provider_id: '<PROVIDER_ID>',
   *         sub: '<SUB>'
   *       },
   *       identities: [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "email@example.com"
   *         },
   *         {
   *           "identity_id": "33333333-3333-3333-3333-333333333333",
   *           "id": "<ID>",
   *           "user_id": "<USER_ID>",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": true,
   *             "full_name": "User Name",
   *             "iss": "<ISS>",
   *             "name": "User Name",
   *             "phone_verified": false,
   *             "provider_id": "<PROVIDER_ID>",
   *             "sub": "<SUB>"
   *           },
   *           "provider": "<PROVIDER>",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       created_at: '2024-01-01T00:00:00Z',
   *       updated_at: '2024-01-01T00:00:00Z',
   *       is_anonymous: false
   *     },
   *     redirectType: null
   *   },
   *   "error": null
   * }
   * ```
   */
  async exchangeCodeForSession(authCode, options) {
    await this.initializePromise;
    if (this.lock != null) {
      return this._acquireLock(this.lockAcquireTimeout, async () => {
        return this._exchangeCodeForSession(authCode, options);
      });
    }
    return this._exchangeCodeForSession(authCode, options);
  }
  /**
   * Signs in a user by verifying a message signed by the user's private key.
   * Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
   * both of which derive from the EIP-4361 standard
   * With slight variation on Solana's side.
   * @reference https://eips.ethereum.org/EIPS/eip-4361
   *
   * @category Auth
   *
   * @remarks
   * - Uses a Web3 (Ethereum, Solana) wallet to sign a user in.
   * - Read up on the [potential for abuse](/docs/guides/auth/auth-web3#potential-for-abuse) before using it.
   *
   * @example Sign in with Solana or Ethereum (Window API)
   * ```js
   *   // uses window.ethereum for the wallet
   *   const { data, error } = await supabase.auth.signInWithWeb3({
   *     chain: 'ethereum',
   *     statement: 'I accept the Terms of Service at https://example.com/tos'
   *   })
   *
   *   // uses window.solana for the wallet
   *   const { data, error } = await supabase.auth.signInWithWeb3({
   *     chain: 'solana',
   *     statement: 'I accept the Terms of Service at https://example.com/tos'
   *   })
   * ```
   *
   * @example Sign in with Ethereum (Message and Signature)
   * ```js
   *   const { data, error } = await supabase.auth.signInWithWeb3({
   *     chain: 'ethereum',
   *     message: '<sign in with ethereum message>',
   *     signature: '<hex of the ethereum signature over the message>',
   *   })
   * ```
   *
   * @example Sign in with Solana (Brave)
   * ```js
   *   const { data, error } = await supabase.auth.signInWithWeb3({
   *     chain: 'solana',
   *     statement: 'I accept the Terms of Service at https://example.com/tos',
   *     wallet: window.braveSolana
   *   })
   * ```
   *
   * @example Sign in with Solana (Wallet Adapter)
   * ```jsx
   *   function SignInButton() {
   *   const wallet = useWallet()
   *
   *   return (
   *     <>
   *       {wallet.connected ? (
   *         <button
   *           onClick={() => {
   *             supabase.auth.signInWithWeb3({
   *               chain: 'solana',
   *               statement: 'I accept the Terms of Service at https://example.com/tos',
   *               wallet,
   *             })
   *           }}
   *         >
   *           Sign in with Solana
   *         </button>
   *       ) : (
   *         <WalletMultiButton />
   *       )}
   *     </>
   *   )
   * }
   *
   * function App() {
   *   const endpoint = clusterApiUrl('devnet')
   *   const wallets = useMemo(() => [], [])
   *
   *   return (
   *     <ConnectionProvider endpoint={endpoint}>
   *       <WalletProvider wallets={wallets}>
   *         <WalletModalProvider>
   *           <SignInButton />
   *         </WalletModalProvider>
   *       </WalletProvider>
   *     </ConnectionProvider>
   *   )
   * }
   * ```
   */
  async signInWithWeb3(credentials) {
    const { chain } = credentials;
    switch (chain) {
      case "ethereum":
        return await this.signInWithEthereum(credentials);
      case "solana":
        return await this.signInWithSolana(credentials);
      default:
        throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
    }
  }
  async signInWithEthereum(credentials) {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m;
    let message;
    let signature;
    if ("message" in credentials) {
      message = credentials.message;
      signature = credentials.signature;
    } else {
      const { chain, wallet, statement, options } = credentials;
      let resolvedWallet;
      if (!isBrowser()) {
        if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
          throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
        }
        resolvedWallet = wallet;
      } else if (typeof wallet === "object") {
        resolvedWallet = wallet;
      } else {
        const windowAny = window;
        if ("ethereum" in windowAny && typeof windowAny.ethereum === "object" && "request" in windowAny.ethereum && typeof windowAny.ethereum.request === "function") {
          resolvedWallet = windowAny.ethereum;
        } else {
          throw new Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`);
        }
      }
      const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
      const accounts = await resolvedWallet.request({
        method: "eth_requestAccounts"
      }).then((accs) => accs).catch(() => {
        throw new Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`);
      });
      if (!accounts || accounts.length === 0) {
        throw new Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);
      }
      const address = getAddress(accounts[0]);
      let chainId = (_b = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _b === void 0 ? void 0 : _b.chainId;
      if (!chainId) {
        const chainIdHex = await resolvedWallet.request({
          method: "eth_chainId"
        });
        chainId = fromHex(chainIdHex);
      }
      const siweMessage = {
        domain: url.host,
        address,
        statement,
        uri: url.href,
        version: "1",
        chainId,
        nonce: (_c = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _c === void 0 ? void 0 : _c.nonce,
        issuedAt: (_f = (_d = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _d === void 0 ? void 0 : _d.issuedAt) !== null && _f !== void 0 ? _f : /* @__PURE__ */ new Date(),
        expirationTime: (_g = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _g === void 0 ? void 0 : _g.expirationTime,
        notBefore: (_h = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _h === void 0 ? void 0 : _h.notBefore,
        requestId: (_j = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _j === void 0 ? void 0 : _j.requestId,
        resources: (_k = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _k === void 0 ? void 0 : _k.resources
      };
      message = createSiweMessage(siweMessage);
      signature = await resolvedWallet.request({
        method: "personal_sign",
        params: [toHex(message), address]
      });
    }
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
        headers: this.headers,
        body: Object.assign({
          chain: "ethereum",
          message,
          signature
        }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        const invalidTokenError = new AuthInvalidTokenResponseError();
        return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return this._returnResult({ data: Object.assign({}, data), error });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  async signInWithSolana(credentials) {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o;
    let message;
    let signature;
    if ("message" in credentials) {
      message = credentials.message;
      signature = credentials.signature;
    } else {
      const { chain, wallet, statement, options } = credentials;
      let resolvedWallet;
      if (!isBrowser()) {
        if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
          throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
        }
        resolvedWallet = wallet;
      } else if (typeof wallet === "object") {
        resolvedWallet = wallet;
      } else {
        const windowAny = window;
        if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
          resolvedWallet = windowAny.solana;
        } else {
          throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
        }
      }
      const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
      if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
        const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
          // non-overridable properties
          version: "1",
          domain: url.host,
          uri: url.href
        }), statement ? { statement } : null));
        let outputToProcess;
        if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
          outputToProcess = output[0];
        } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
          outputToProcess = output;
        } else {
          throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
        }
        if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
          message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
          signature = outputToProcess.signature;
        } else {
          throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
        }
      } else {
        if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
          throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
        }
        message = [
          `${url.host} wants you to sign in with your Solana account:`,
          resolvedWallet.publicKey.toBase58(),
          ...statement ? ["", statement, ""] : [""],
          "Version: 1",
          `URI: ${url.href}`,
          `Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
          ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
          ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
          ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
          ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
          ...((_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
          ...((_l = (_k = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _k === void 0 ? void 0 : _k.resources) === null || _l === void 0 ? void 0 : _l.length) ? [
            "Resources",
            ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
          ] : []
        ].join("\n");
        const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
        if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
          throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
        }
        signature = maybeSignature;
      }
    }
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
        headers: this.headers,
        body: Object.assign({ chain: "solana", message, signature: bytesToBase64URL(signature) }, ((_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken) ? { gotrue_meta_security: { captcha_token: (_o = credentials.options) === null || _o === void 0 ? void 0 : _o.captchaToken } } : null),
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        const invalidTokenError = new AuthInvalidTokenResponseError();
        return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return this._returnResult({ data: Object.assign({}, data), error });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  async _exchangeCodeForSession(authCode, options) {
    const hasExplicitFlowId = (options === null || options === void 0 ? void 0 : options.flowId) != null;
    const requestedFlowId = hasExplicitFlowId ? validatePKCEFlowId(options === null || options === void 0 ? void 0 : options.flowId) : isBrowser() ? validatePKCEFlowId(parseParametersFromURL(window.location.href)[PKCE_FLOW_ID_PARAM]) : null;
    if (hasExplicitFlowId && !requestedFlowId) {
      this._debug("#_exchangeCodeForSession()", "provided flowId is not a valid flow id", options === null || options === void 0 ? void 0 : options.flowId);
    }
    const { verifier: storageItem, flowId } = hasExplicitFlowId && !requestedFlowId ? { verifier: null, flowId: null } : await retrievePKCEVerifier(this.storage, this.storageKey, requestedFlowId);
    const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
    try {
      if (!codeVerifier && this.flowType === "pkce") {
        throw new AuthPKCECodeVerifierMissingError();
      }
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
        headers: this.headers,
        body: {
          auth_code: authCode,
          code_verifier: codeVerifier
        },
        xform: _sessionResponse
      });
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        const invalidTokenError = new AuthInvalidTokenResponseError();
        return this._returnResult({
          data: { user: null, session: null, redirectType: null },
          error: invalidTokenError
        });
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers(redirectType === "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", data.session);
      }
      return this._returnResult({ data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error });
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({
          data: { user: null, session: null, redirectType: null },
          error
        });
      }
      throw error;
    }
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   *
   * @category Auth
   *
   * @remarks
   * - Use an ID token to sign in.
   * - Especially useful when implementing sign in using native platform dialogs in mobile or desktop apps using Sign in with Apple or Sign in with Google on iOS and Android.
   * - You can also use Google's [One Tap](https://developers.google.com/identity/gsi/web/guides/display-google-one-tap) and [Automatic sign-in](https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out) via this API.
   *
   * @example Sign In using ID Token
   * ```js
   * const { data, error } = await supabase.auth.signInWithIdToken({
   *   provider: 'google',
   *   token: 'your-id-token'
   * })
   * ```
   *
   * @exampleResponse Sign In using ID Token
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         ...
   *       },
   *       "user_metadata": {
   *         ...
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "provider": "google",
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {
   *           ...
   *         },
   *         "user_metadata": {
   *           ...
   *         },
   *         "identities": [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "provider": "google",
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   */
  async signInWithIdToken(credentials) {
    try {
      const { options, provider, token, access_token, nonce } = credentials;
      const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider,
          id_token: token,
          access_token,
          nonce,
          gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error) {
        return this._returnResult({ data: { user: null, session: null }, error });
      } else if (!data || !data.session || !data.user) {
        const invalidTokenError = new AuthInvalidTokenResponseError();
        return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return this._returnResult({ data, error });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   * This method supports PKCE when an email is passed.
   *
   * @category Auth
   *
   * @remarks
   * - Requires either an email or phone number.
   * - This method is used for passwordless sign-ins where a OTP is sent to the user's email or phone number.
   * - If the user doesn't exist, `signInWithOtp()` will signup the user instead. To restrict this behavior, you can set `shouldCreateUser` in `SignInWithPasswordlessCredentials.options` to `false`.
   * - If you're using an email, you can configure whether you want the user to receive a magiclink or a OTP.
   * - If you're using phone, you can configure whether you want the user to receive a OTP.
   * - The magic link's destination URL is determined by the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls).
   * - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
   * - Magic links and OTPs share the same implementation. To send users a one-time code instead of a magic link, [modify the magic link email template](/dashboard/project/_/auth/templates) to include `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.
   * - See our [Twilio Phone Auth Guide](/docs/guides/auth/phone-login?showSMSProvider=Twilio) for details about configuring WhatsApp sign in.
   *
   * @exampleDescription Sign in with email
   * The user will be sent an email which contains either a magiclink or a OTP or both. By default, a given user can only request a OTP once every 60 seconds.
   *
   * @example Sign in with email
   * ```js
   * const { data, error } = await supabase.auth.signInWithOtp({
   *   email: 'example@email.com',
   *   options: {
   *     emailRedirectTo: 'https://example.com/welcome'
   *   }
   * })
   * ```
   *
   * @exampleResponse Sign in with email
   * ```json
   * {
   *   "data": {
   *     "user": null,
   *     "session": null
   *   },
   *   "error": null
   * }
   * ```
   *
   * @exampleDescription Sign in with SMS OTP
   * The user will be sent a SMS which contains a OTP. By default, a given user can only request a OTP once every 60 seconds.
   *
   * @example Sign in with SMS OTP
   * ```js
   * const { data, error } = await supabase.auth.signInWithOtp({
   *   phone: '+13334445555',
   * })
   * ```
   *
   * @exampleDescription Sign in with WhatsApp OTP
   * The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.
   *
   * @example Sign in with WhatsApp OTP
   * ```js
   * const { data, error } = await supabase.auth.signInWithOtp({
   *   phone: '+13334445555',
   *   options: {
   *     channel:'whatsapp',
   *   }
   * })
   * ```
   */
  async signInWithOtp(credentials) {
    var _a, _b, _c, _d, _f;
    let flowId = null;
    try {
      if ("email" in credentials) {
        const { email, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
        }
        const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId)
        });
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      if ("phone" in credentials) {
        const { phone, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone,
            data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
            create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            channel: (_f = options === null || options === void 0 ? void 0 : options.channel) !== null && _f !== void 0 ? _f : "sms"
          }
        });
        return this._returnResult({
          data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
          error
        });
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   *
   * @category Auth
   *
   * @remarks
   * - The `verifyOtp` method takes in different verification types.
   * - If a phone number is used, the type can either be:
   *   1. `sms` – Used when verifying a one-time password (OTP) sent via SMS during sign-up or sign-in.
   *   2. `phone_change` – Used when verifying an OTP sent to a new phone number during a phone number update process.
   * - If an email address is used, the type can be one of the following (note: `signup` and `magiclink` types are deprecated):
   *   1. `email` – Used when verifying an OTP sent to the user's email during sign-up or sign-in.
   *   2. `recovery` – Used when verifying an OTP sent for account recovery, typically after a password reset request.
   *   3. `invite` – Used when verifying an OTP sent as part of an invitation to join a project or organization.
   *   4. `email_change` – Used when verifying an OTP sent to a new email address during an email update process.
   * - The verification type used should be determined based on the corresponding auth method called before `verifyOtp` to sign up / sign-in a user.
   * - The `TokenHash` is contained in the [email templates](/docs/guides/auth/auth-email-templates) and can be used to sign in.  You may wish to use the hash for the PKCE flow for Server Side Auth. Read [the Password-based Auth guide](/docs/guides/auth/passwords) for more details.
   *
   * @example Verify Signup One-Time Password (OTP)
   * ```js
   * const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})
   * ```
   *
   * @exampleResponse Verify Signup One-Time Password (OTP)
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmed_at": "2024-01-01T00:00:00Z",
   *       "recovery_sent_at": "2024-01-01T00:00:00Z",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {
   *         "email": "example@email.com",
   *         "email_verified": false,
   *         "phone_verified": false,
   *         "sub": "11111111-1111-1111-1111-111111111111"
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "example@email.com",
   *         "email_confirmed_at": "2024-01-01T00:00:00Z",
   *         "phone": "",
   *         "confirmed_at": "2024-01-01T00:00:00Z",
   *         "recovery_sent_at": "2024-01-01T00:00:00Z",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {
   *           "provider": "email",
   *           "providers": [
   *             "email"
   *           ]
   *         },
   *         "user_metadata": {
   *           "email": "example@email.com",
   *           "email_verified": false,
   *           "phone_verified": false,
   *           "sub": "11111111-1111-1111-1111-111111111111"
   *         },
   *         "identities": [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *         "is_anonymous": false
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Verify SMS One-Time Password (OTP)
   * ```js
   * const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})
   * ```
   *
   * @example Verify Email Auth (Token Hash)
   * ```js
   * const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email'})
   * ```
   */
  async verifyOtp(params) {
    var _a, _b;
    try {
      let redirectTo = void 0;
      let captchaToken = void 0;
      if ("options" in params) {
        redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
        captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
      }
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
        redirectTo,
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data) {
        const tokenVerificationError = new Error("An error occurred on token verification.");
        throw tokenVerificationError;
      }
      const session = data.session;
      const user = data.user;
      if (session === null || session === void 0 ? void 0 : session.access_token) {
        await this._saveSession(session);
        await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
      }
      return this._returnResult({ data: { user, session }, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   *
   * @category Auth
   *
   * @remarks
   * - Before you can call this method you need to [establish a connection](/docs/guides/auth/sso/auth-sso-saml#managing-saml-20-connections) to an identity provider. Use the [CLI commands](/docs/reference/cli/supabase-sso) to do this.
   * - If you've associated an email domain to the identity provider, you can use the `domain` property to start a sign-in flow.
   * - In case you need to use a different way to start the authentication flow with an identity provider, you can use the `providerId` property. For example:
   *     - Mapping specific user email addresses with an identity provider.
   *     - Using different hints to identity the identity provider to be used by the user, like a company-specific page, IP address or other tracking information.
   *
   * @example Sign in with email domain
   * ```js
   *   // You can extract the user's email domain and use it to trigger the
   *   // authentication flow with the correct identity provider.
   *
   *   const { data, error } = await supabase.auth.signInWithSSO({
   *     domain: 'company.com'
   *   })
   *
   *   if (data?.url) {
   *     // redirect the user to the identity provider's authentication flow
   *     window.location.href = data.url
   *   }
   * ```
   *
   * @example Sign in with provider UUID
   * ```js
   *   // Useful when you need to map a user's sign in request according
   *   // to different rules that can't use email domains.
   *
   *   const { data, error } = await supabase.auth.signInWithSSO({
   *     providerId: '21648a9d-8d5a-4555-a9d1-d6375dc14e92'
   *   })
   *
   *   if (data?.url) {
   *     // redirect the user to the identity provider's authentication flow
   *     window.location.href = data.url
   *   }
   * ```
   */
  async signInWithSSO(params) {
    var _a, _b, _c, _d;
    let flowId = null;
    try {
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        ;
        [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
      }
      const result = await _request(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: this._maybeAppendFlowIdToRedirect((_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo, flowId) }), ((_b = params === null || params === void 0 ? void 0 : params.options) === null || _b === void 0 ? void 0 : _b.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
        headers: this.headers,
        xform: _ssoResponse
      });
      if (((_c = result.data) === null || _c === void 0 ? void 0 : _c.url) && isBrowser() && !((_d = params.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect)) {
        window.location.assign(result.data.url);
      }
      return this._returnResult(result);
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Sends a reauthentication OTP to the user's email or phone number.
   * Requires the user to be signed-in.
   *
   * @category Auth
   *
   * @remarks
   * - This method is used together with `updateUser()` when a user's password needs to be updated.
   * - If you require your user to reauthenticate before updating their password, you need to enable the **Secure password change** option in your [project's email provider settings](/dashboard/project/_/auth/providers).
   * - A user is only require to reauthenticate before updating their password if **Secure password change** is enabled and the user **hasn't recently signed in**. A user is deemed recently signed in if the session was created in the last 24 hours.
   * - This method will send a nonce to the user's email. If the user doesn't have a confirmed email address, the method will send the nonce to the user's confirmed phone number instead.
   * - After receiving the OTP, include it as the `nonce` in your `updateUser()` call to finalize the password change.
   *
   * @exampleDescription Send reauthentication nonce
   * Sends a reauthentication nonce to the user's email or phone number.
   *
   * @example Send reauthentication nonce
   * ```js
   * const { error } = await supabase.auth.reauthenticate()
   * ```
   */
  async reauthenticate() {
    await this.initializePromise;
    if (this.lock != null) {
      return await this._acquireLock(this.lockAcquireTimeout, async () => {
        return await this._reauthenticate();
      });
    }
    return await this._reauthenticate();
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError)
          throw sessionError;
        if (!session)
          throw new AuthSessionMissingError();
        const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: session.access_token
        });
        return this._returnResult({ data: { user: null, session: null }, error });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   *
   * @category Auth
   *
   * @remarks
   * - Resends a signup confirmation, email change or phone change email to the user.
   * - Passwordless sign-ins can be resent by calling the `signInWithOtp()` method again.
   * - Password recovery emails can be resent by calling the `resetPasswordForEmail()` method again.
   * - This method will only resend an email or phone OTP to the user if there was an initial signup, email change or phone change request being made(note: For existing users signing in with OTP, you should use `signInWithOtp()` again to resend the OTP).
   * - You can specify a redirect url when you resend an email link using the `emailRedirectTo` option.
   *
   * @exampleDescription Resend an email signup confirmation
   * Resends the email signup confirmation to the user
   *
   * @example Resend an email signup confirmation
   * ```js
   * const { error } = await supabase.auth.resend({
   *   type: 'signup',
   *   email: 'email@example.com',
   *   options: {
   *     emailRedirectTo: 'https://example.com/welcome'
   *   }
   * })
   * ```
   *
   * @exampleDescription Resend a phone signup confirmation
   * Resends the phone signup confirmation email to the user
   *
   * @example Resend a phone signup confirmation
   * ```js
   * const { error } = await supabase.auth.resend({
   *   type: 'sms',
   *   phone: '1234567890'
   * })
   * ```
   *
   * @exampleDescription Resend email change email
   * Resends the email change email to the user
   *
   * @example Resend email change email
   * ```js
   * const { error } = await supabase.auth.resend({
   *   type: 'email_change',
   *   email: 'email@example.com'
   * })
   * ```
   *
   * @exampleDescription Resend phone change OTP
   * Resends the phone change OTP to the user
   *
   * @example Resend phone change OTP
   * ```js
   * const { error } = await supabase.auth.resend({
   *   type: 'phone_change',
   *   phone: '1234567890'
   * })
   * ```
   */
  async resend(credentials) {
    let flowId = null;
    try {
      const endpoint = `${this.url}/resend`;
      if ("email" in credentials) {
        const { email, type, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
        }
        const { error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            email,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId)
        });
        if (error) {
          await removePKCEVerifier(this.storage, this.storageKey, flowId);
        }
        return this._returnResult({ data: { user: null, session: null }, error });
      } else if ("phone" in credentials) {
        const { phone, type, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            phone,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          }
        });
        return this._returnResult({
          data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
          error
        });
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   *
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   *
   * **IMPORTANT:** This method loads values directly from the storage attached
   * to the client. If that storage is based on request cookies for example,
   * the values in it may not be authentic and therefore it's strongly advised
   * against using this method and its results in such circumstances. A warning
   * will be emitted if this is detected. Use {@link GoTrueClient.getUser} instead.
   *
   * @category Auth
   *
   * @remarks
   * - Since the introduction of [asymmetric JWT signing keys](/docs/guides/auth/signing-keys), this method is considered low-level and we encourage you to use `getClaims()` or `getUser()` instead.
   * - Retrieves the current [user session](/docs/guides/auth/sessions) from the storage medium (local storage, cookies).
   * - The session contains an access token (signed JWT), a refresh token and the user object.
   * - If the session's access token is expired or is about to expire, this method will use the refresh token to refresh the session.
   * - When using in a browser, or you've called `startAutoRefresh()` in your environment (React Native, etc.) this function always returns a valid access token without refreshing the session itself, as this is done in the background. This function returns very fast.
   * - **IMPORTANT SECURITY NOTICE:** If using an insecure storage medium, such as cookies or request headers, the user object returned by this function **must not be trusted**. Always verify the JWT using `getClaims()` or your own JWT verification library to securely establish the user's identity and access. You can also use `getUser()` to fetch the user object directly from the Auth server for this purpose.
   * - Cross-tab refresh races are handled by the GoTrue server (the rotated token from the first tab is returned to subsequent tabs via the parent-of-active mechanism), so no client-side serialization is needed.
   *
   * @example Get the session data
   * ```js
   * const { data, error } = await supabase.auth.getSession()
   * ```
   *
   * @exampleResponse Get the session data
   * ```json
   * {
   *   "data": {
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "example@email.com",
   *         "email_confirmed_at": "2024-01-01T00:00:00Z",
   *         "phone": "",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {
   *           "provider": "email",
   *           "providers": [
   *             "email"
   *           ]
   *         },
   *         "user_metadata": {
   *           "email": "example@email.com",
   *           "email_verified": false,
   *           "phone_verified": false,
   *           "sub": "11111111-1111-1111-1111-111111111111"
   *         },
   *         "identities": [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *         "is_anonymous": false
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   */
  async getSession() {
    await this.initializePromise;
    if (this.lock != null) {
      return await this._acquireLock(this.lockAcquireTimeout, async () => {
        return this._useSession(async (result) => {
          return result;
        });
      });
    }
    return await this._useSession(async (result) => {
      return result;
    });
  }
  /**
   * Acquires a global lock based on the storage key.
   *
   * TODO(v3): remove along with the legacy lock path. Only called when
   * `this.lock` is non-null (custom lock supplied via constructor). The
   * default lockless path bypasses this entirely.
   */
  async _acquireLock(acquireTimeout, fn) {
    this._debug("#_acquireLock", "begin", acquireTimeout);
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
        const result = (async () => {
          await last;
          return await fn();
        })();
        this.pendingInLock.push((async () => {
          try {
            await result;
          } catch (_e) {
          }
        })());
        return result;
      }
      return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
        try {
          this.lockAcquired = true;
          const result = fn();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e) {
            }
          })());
          await result;
          while (this.pendingInLock.length) {
            const waitOn = [...this.pendingInLock];
            await Promise.all(waitOn);
            this.pendingInLock.splice(0, waitOn.length);
          }
          return await result;
        } finally {
          this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
          this.lockAcquired = false;
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  /**
   * Use instead of {@link GoTrueClient.getSession} inside the library. Loads the session
   * via `__loadSession` (which may trigger a refresh if the access token is
   * within the expiry margin) and runs `fn` with the result.
   */
  async _useSession(fn) {
    this._debug("#_useSession", "begin");
    try {
      const result = await this.__loadSession();
      return await fn(result);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  /**
   * NEVER USE DIRECTLY!
   *
   * Always use `_useSession`.
   */
  async __loadSession() {
    this._debug("#__loadSession()", "begin");
    if (this.lock != null && !this.lockAcquired) {
      this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
    }
    try {
      let currentSession = null;
      const maybeSession = await getItemAsync(this.storage, this.storageKey);
      this._debug("#getSession()", "session from storage", maybeSession);
      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          this._debug("#getSession()", "session from storage is not valid");
          await this._removeSession();
        }
      }
      if (!currentSession) {
        return { data: { session: null }, error: null };
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
      this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
      if (!hasExpired) {
        return { data: { session: await this._hydrateSessionUser(currentSession) }, error: null };
      }
      const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
      if (error) {
        const stored = await getItemAsync(this.storage, this.storageKey);
        if (stored && this._isValidSession(stored) && stored.expires_at && stored.expires_at * 1e3 > Date.now()) {
          return this._returnResult({
            data: { session: await this._hydrateSessionUser(stored) },
            error: null
          });
        }
        return this._returnResult({ data: { session: null }, error });
      }
      return this._returnResult({ data: { session }, error: null });
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  /**
   * Completes a session read back from storage so it matches what callers of
   * `getSession()` expect: fills in `session.user` from `userStorage` when the
   * client keeps the user in split storage, and wraps the user in the
   * insecure-access warning proxy on the server.
   */
  async _hydrateSessionUser(session) {
    if (this.userStorage) {
      const maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
      session.user = (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) ? maybeUser.user : userNotAvailableProxy();
    }
    if (this.storage.isServer && session.user && !session.user.__isUserNotAvailableProxy) {
      const suppressWarningRef = { value: this.suppressGetSessionWarning };
      session.user = insecureUserWarningProxy(session.user, suppressWarningRef);
      if (suppressWarningRef.value) {
        this.suppressGetSessionWarning = true;
      }
    }
    return session;
  }
  /**
   * Gets the current user details if there is an existing session. This method
   * performs a network request to the Supabase Auth server, so the returned
   * value is authentic and can be used to base authorization rules on.
   *
   * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
   *
   * @category Auth
   *
   * @remarks
   * - This method fetches the user object from the database instead of local session.
   * - This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.
   * - Should always be used when checking for user authorization on the server. On the client, you can instead use `getSession().session.user` for faster results. `getSession` is insecure on the server.
   *
   * @example Get the logged in user with the current existing session
   * ```js
   * const { data: { user } } = await supabase.auth.getUser()
   * ```
   *
   * @exampleResponse Get the logged in user with the current existing session
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmed_at": "2024-01-01T00:00:00Z",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {
   *         "email": "example@email.com",
   *         "email_verified": false,
   *         "phone_verified": false,
   *         "sub": "11111111-1111-1111-1111-111111111111"
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Get the logged in user with a custom access token jwt
   * ```js
   * const { data: { user } } = await supabase.auth.getUser(jwt)
   * ```
   */
  async getUser(jwt) {
    if (jwt) {
      return await this._getUser(jwt);
    }
    await this.initializePromise;
    let result;
    if (this.lock != null) {
      result = await this._acquireLock(this.lockAcquireTimeout, async () => {
        return await this._getUser();
      });
    } else {
      result = await this._getUser();
    }
    if (result.data.user) {
      this.suppressGetSessionWarning = true;
    }
    return result;
  }
  async _getUser(jwt) {
    try {
      if (jwt) {
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt,
          xform: _userResponse
        });
      }
      return await this._useSession(async (result) => {
        var _a, _b, _c;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
          return { data: { user: null }, error: new AuthSessionMissingError() };
        }
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
          xform: _userResponse
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        if (isAuthSessionMissingError(error)) {
          await this._removeSession();
        }
        return this._returnResult({ data: { user: null }, error });
      }
      throw error;
    }
  }
  /**
   * Updates user data for a logged in user.
   *
   * @category Auth
   *
   * @remarks
   * - In order to use the `updateUser()` method, the user needs to be signed in first.
   * - By default, email updates sends a confirmation link to both the user's current and new email.
   * To only send a confirmation link to the user's new email, disable **Secure email change** in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
   *
   * @exampleDescription Update the email for an authenticated user
   * Sends a "Confirm Email Change" email to the new address. If **Secure Email Change** is enabled (default), confirmation is also required from the **old email** before the change is applied. To skip dual confirmation and apply the change after only the new email is verified, disable **Secure Email Change** in the [Email Auth Provider settings](/dashboard/project/_/auth/providers?provider=Email).
   *
   * @example Update the email for an authenticated user
   * ```js
   * const { data, error } = await supabase.auth.updateUser({
   *   email: 'new@email.com'
   * })
   * ```
   *
   * @exampleResponse Update the email for an authenticated user
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmed_at": "2024-01-01T00:00:00Z",
   *       "new_email": "new@email.com",
   *       "email_change_sent_at": "2024-01-01T00:00:00Z",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {
   *         "email": "example@email.com",
   *         "email_verified": false,
   *         "phone_verified": false,
   *         "sub": "11111111-1111-1111-1111-111111111111"
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @exampleDescription Update the phone number for an authenticated user
   * Sends a one-time password (OTP) to the new phone number.
   *
   * @example Update the phone number for an authenticated user
   * ```js
   * const { data, error } = await supabase.auth.updateUser({
   *   phone: '123456789'
   * })
   * ```
   *
   * @example Update the password for an authenticated user
   * ```js
   * const { data, error } = await supabase.auth.updateUser({
   *   password: 'new password'
   * })
   * ```
   *
   * @exampleDescription Update the user's metadata
   * Updates the user's custom metadata.
   *
   * **Note**: The `data` field maps to the `auth.users.raw_user_meta_data` column in your Supabase database. When calling `getUser()`, the data will be available as `user.user_metadata`.
   *
   * @example Update the user's metadata
   * ```js
   * const { data, error } = await supabase.auth.updateUser({
   *   data: { hello: 'world' }
   * })
   * ```
   *
   * @exampleDescription Update the user's password with a nonce
   * If **Secure password change** is enabled in your [project's email provider settings](/dashboard/project/_/auth/providers), updating the user's password would require a nonce if the user **hasn't recently signed in**. The nonce is sent to the user's email or phone number. A user is deemed recently signed in if the session was created in the last 24 hours.
   *
   * @example Update the user's password with a nonce
   * ```js
   * const { data, error } = await supabase.auth.updateUser({
   *   password: 'new password',
   *   nonce: '123456'
   * })
   * ```
   */
  async updateUser(attributes, options = {}) {
    await this.initializePromise;
    if (this.lock != null) {
      return await this._acquireLock(this.lockAcquireTimeout, async () => {
        return await this._updateUser(attributes, options);
      });
    }
    return await this._updateUser(attributes, options);
  }
  async _updateUser(attributes, options = {}) {
    let flowId = null;
    try {
      return await this._useSession(async (result) => {
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          throw new AuthSessionMissingError();
        }
        const session = sessionData.session;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce" && attributes.email != null) {
          ;
          [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
        }
        const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId),
          body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          jwt: session.access_token,
          xform: _userResponse
        });
        if (userError) {
          throw userError;
        }
        session.user = data.user;
        await this._saveSession(session);
        await this._notifyAllSubscribers("USER_UPDATED", session);
        return this._returnResult({ data: { user: session.user }, error: null });
      });
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null }, error });
      }
      throw error;
    }
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   *
   * @category Auth
   *
   * @remarks
   * - This method sets the session using an `access_token` and `refresh_token`.
   * - If successful, a `SIGNED_IN` event is emitted.
   *
   * @exampleDescription Set the session
   * Sets the session data from an access_token and refresh_token, then returns an auth response or error.
   *
   * @example Set the session
   * ```js
   *   const { data, error } = await supabase.auth.setSession({
   *     access_token,
   *     refresh_token
   *   })
   * ```
   *
   * @exampleResponse Set the session
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmed_at": "2024-01-01T00:00:00Z",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {
   *         "email": "example@email.com",
   *         "email_verified": false,
   *         "phone_verified": false,
   *         "sub": "11111111-1111-1111-1111-111111111111"
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "example@email.com",
   *         "email_confirmed_at": "2024-01-01T00:00:00Z",
   *         "phone": "",
   *         "confirmed_at": "2024-01-01T00:00:00Z",
   *         "last_sign_in_at": "11111111-1111-1111-1111-111111111111",
   *         "app_metadata": {
   *           "provider": "email",
   *           "providers": [
   *             "email"
   *           ]
   *         },
   *         "user_metadata": {
   *           "email": "example@email.com",
   *           "email_verified": false,
   *           "phone_verified": false,
   *           "sub": "11111111-1111-1111-1111-111111111111"
   *         },
   *         "identities": [
   *           {
   *             "identity_id": "2024-01-01T00:00:00Z",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *         "is_anonymous": false
   *       },
   *       "token_type": "bearer",
   *       "expires_in": 3500,
   *       "expires_at": 1700000000
   *     }
   *   },
   *   "error": null
   * }
   * ```
   */
  async setSession(currentSession) {
    await this.initializePromise;
    if (this.lock != null) {
      return await this._acquireLock(this.lockAcquireTimeout, async () => {
        return await this._setSession(currentSession);
      });
    }
    return await this._setSession(currentSession);
  }
  async _setSession(currentSession) {
    try {
      if (!currentSession.access_token || !currentSession.refresh_token) {
        throw new AuthSessionMissingError();
      }
      const timeNow = Date.now() / 1e3;
      let expiresAt2 = timeNow;
      let hasExpired = true;
      let session = null;
      const { payload } = decodeJWT(currentSession.access_token);
      if (payload.exp) {
        expiresAt2 = payload.exp;
        hasExpired = expiresAt2 <= timeNow;
      }
      if (hasExpired) {
        const { data: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        if (!refreshedSession) {
          return { data: { user: null, session: null }, error: null };
        }
        session = refreshedSession;
      } else {
        const { data, error } = await this._getUser(currentSession.access_token);
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        session = {
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
          user: data.user,
          token_type: "bearer",
          expires_in: expiresAt2 - timeNow,
          expires_at: expiresAt2
        };
        await this._saveSession(session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return this._returnResult({ data: { user: session.user, session }, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { session: null, user: null }, error });
      }
      throw error;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   *
   * @category Auth
   *
   * @remarks
   * - This method will refresh and return a new session whether the current one is expired or not.
   *
   * @example Refresh session using the current session
   * ```js
   * const { data, error } = await supabase.auth.refreshSession()
   * const { session, user } = data
   * ```
   *
   * @exampleResponse Refresh session using the current session
   * ```json
   * {
   *   "data": {
   *     "user": {
   *       "id": "11111111-1111-1111-1111-111111111111",
   *       "aud": "authenticated",
   *       "role": "authenticated",
   *       "email": "example@email.com",
   *       "email_confirmed_at": "2024-01-01T00:00:00Z",
   *       "phone": "",
   *       "confirmed_at": "2024-01-01T00:00:00Z",
   *       "last_sign_in_at": "2024-01-01T00:00:00Z",
   *       "app_metadata": {
   *         "provider": "email",
   *         "providers": [
   *           "email"
   *         ]
   *       },
   *       "user_metadata": {
   *         "email": "example@email.com",
   *         "email_verified": false,
   *         "phone_verified": false,
   *         "sub": "11111111-1111-1111-1111-111111111111"
   *       },
   *       "identities": [
   *         {
   *           "identity_id": "22222222-2222-2222-2222-222222222222",
   *           "id": "11111111-1111-1111-1111-111111111111",
   *           "user_id": "11111111-1111-1111-1111-111111111111",
   *           "identity_data": {
   *             "email": "example@email.com",
   *             "email_verified": false,
   *             "phone_verified": false,
   *             "sub": "11111111-1111-1111-1111-111111111111"
   *           },
   *           "provider": "email",
   *           "last_sign_in_at": "2024-01-01T00:00:00Z",
   *           "created_at": "2024-01-01T00:00:00Z",
   *           "updated_at": "2024-01-01T00:00:00Z",
   *           "email": "example@email.com"
   *         }
   *       ],
   *       "created_at": "2024-01-01T00:00:00Z",
   *       "updated_at": "2024-01-01T00:00:00Z",
   *       "is_anonymous": false
   *     },
   *     "session": {
   *       "access_token": "<ACCESS_TOKEN>",
   *       "token_type": "bearer",
   *       "expires_in": 3600,
   *       "expires_at": 1700000000,
   *       "refresh_token": "<REFRESH_TOKEN>",
   *       "user": {
   *         "id": "11111111-1111-1111-1111-111111111111",
   *         "aud": "authenticated",
   *         "role": "authenticated",
   *         "email": "example@email.com",
   *         "email_confirmed_at": "2024-01-01T00:00:00Z",
   *         "phone": "",
   *         "confirmed_at": "2024-01-01T00:00:00Z",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "app_metadata": {
   *           "provider": "email",
   *           "providers": [
   *             "email"
   *           ]
   *         },
   *         "user_metadata": {
   *           "email": "example@email.com",
   *           "email_verified": false,
   *           "phone_verified": false,
   *           "sub": "11111111-1111-1111-1111-111111111111"
   *         },
   *         "identities": [
   *           {
   *             "identity_id": "22222222-2222-2222-2222-222222222222",
   *             "id": "11111111-1111-1111-1111-111111111111",
   *             "user_id": "11111111-1111-1111-1111-111111111111",
   *             "identity_data": {
   *               "email": "example@email.com",
   *               "email_verified": false,
   *               "phone_verified": false,
   *               "sub": "11111111-1111-1111-1111-111111111111"
   *             },
   *             "provider": "email",
   *             "last_sign_in_at": "2024-01-01T00:00:00Z",
   *             "created_at": "2024-01-01T00:00:00Z",
   *             "updated_at": "2024-01-01T00:00:00Z",
   *             "email": "example@email.com"
   *           }
   *         ],
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *         "is_anonymous": false
   *       }
   *     }
   *   },
   *   "error": null
   * }
   * ```
   *
   * @example Refresh session using a refresh token
   * ```js
   * const { data, error } = await supabase.auth.refreshSession({ refresh_token })
   * const { session, user } = data
   * ```
   */
  async refreshSession(currentSession) {
    await this.initializePromise;
    if (this.lock != null) {
      return await this._acquireLock(this.lockAcquireTimeout, async () => {
        return await this._refreshSession(currentSession);
      });
    }
    return await this._refreshSession(currentSession);
  }
  async _refreshSession(currentSession) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        if (!currentSession) {
          const { data, error: error2 } = result;
          if (error2) {
            throw error2;
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new AuthSessionMissingError();
        }
        const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        if (!session) {
          return this._returnResult({ data: { user: null, session: null }, error: null });
        }
        return this._returnResult({ data: { user: session.user, session }, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { user: null, session: null }, error });
      }
      throw error;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(params, callbackUrlType) {
    var _a;
    try {
      if (!isBrowser())
        throw new AuthImplicitGrantRedirectError("No browser detected.");
      if (params.error || params.error_description || params.error_code) {
        throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
          error: params.error || "unspecified_error",
          code: params.error_code || "unspecified_code"
        });
      }
      switch (callbackUrlType) {
        case "implicit":
          if (this.flowType === "pkce") {
            throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
          }
          break;
        case "pkce":
          if (this.flowType === "implicit") {
            throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
          }
          break;
        default:
      }
      if (callbackUrlType === "pkce") {
        this._debug("#_initialize()", "begin", "is PKCE flow", true);
        if (!params.code)
          throw new AuthPKCEGrantCodeExchangeError("No code detected.");
        const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code, {
          flowId: params[PKCE_FLOW_ID_PARAM]
        });
        if (error2)
          throw error2;
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete(PKCE_FLOW_ID_PARAM);
        window.history.replaceState(window.history.state, "", url.toString());
        return {
          data: { session: data2.session, redirectType: (_a = data2.redirectType) !== null && _a !== void 0 ? _a : null },
          error: null
        };
      }
      const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
      if (!access_token || !expires_in || !refresh_token || !token_type) {
        throw new AuthImplicitGrantRedirectError("No session defined in URL");
      }
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresIn = parseInt(expires_in);
      let expiresAt2 = timeNow + expiresIn;
      if (expires_at) {
        expiresAt2 = parseInt(expires_at);
      }
      const actuallyExpiresIn = expiresAt2 - timeNow;
      if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
        console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
      }
      const issuedAt = expiresAt2 - expiresIn;
      if (timeNow - issuedAt >= 120) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
      } else if (timeNow - issuedAt < 0) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
      }
      const { data, error } = await this._getUser(access_token);
      if (error)
        throw error;
      const session = {
        provider_token,
        provider_refresh_token,
        access_token,
        expires_in: expiresIn,
        expires_at: expiresAt2,
        refresh_token,
        token_type,
        user: data.user
      };
      window.location.hash = "";
      this._debug("#_getSessionFromURL()", "clearing window.location.hash");
      return this._returnResult({ data: { session, redirectType: params.type }, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: { session: null, redirectType: null }, error });
      }
      throw error;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   *
   * If `detectSessionInUrl` is a function, it will be called with the URL and params to determine
   * if the URL should be processed as a Supabase auth callback. This allows users to exclude
   * URLs from other OAuth providers (e.g., Facebook Login) that also return access_token in the fragment.
   */
  _isImplicitGrantCallback(params) {
    if (typeof this.detectSessionInUrl === "function") {
      return this.detectSessionInUrl(new URL(window.location.href), params);
    }
    return Boolean(params.access_token || params.error || params.error_description || params.error_code);
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCECallback(params) {
    if (!params.code) {
      return false;
    }
    const flowId = validatePKCEFlowId(params[PKCE_FLOW_ID_PARAM]);
    if (flowId && await getItemAsync(this.storage, pkceVerifierSlotKey(this.storageKey, flowId))) {
      return true;
    }
    const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    return !!currentStorageContent;
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   *
   * **Warning:** the default `scope` is `'global'`. This signs the user out of
   * **every device they are currently signed in on**, not just the current
   * tab/session. If you only want to sign the user out of the current session
   * (the behavior most other auth libraries default to), pass
   * `{ scope: 'local' }` explicitly.
   *
   * @category Auth
   *
   * @remarks
   * - In order to use the `signOut()` method, the user needs to be signed in first.
   * - By default, `signOut()` uses the **global** scope, which signs out the user
   *   on every device they are signed in on (not just the current one). Pass
   *   `{ scope: 'local' }` to only sign out the current session. This is
   *   usually what apps want on a "Sign out" button, especially when users
   *   sign in from multiple devices and do not expect signing out of one to
   *   terminate the others.
   * - Since Supabase Auth uses JWTs for authentication, the access token JWT will be valid until it's expired. When the user signs out, Supabase revokes the refresh token and deletes the JWT from the client-side. This does not revoke the JWT and it will still be valid until it expires.
   *
   * @example Sign out of every device (global – default)
   * ```js
   * const { error } = await supabase.auth.signOut()
   * ```
   *
   * @example Sign out only the current session (recommended for most apps)
   * ```js
   * const { error } = await supabase.auth.signOut({ scope: 'local' })
   * ```
   *
   * @example Sign out of all other sessions, keep the current one
   * ```js
   * const { error } = await supabase.auth.signOut({ scope: 'others' })
   * ```
   */
  async signOut(options = { scope: "global" }) {
    await this.initializePromise;
    if (this.lock != null) {
      return await this._acquireLock(this.lockAcquireTimeout, async () => {
        return await this._signOut(options);
      });
    }
    return await this._signOut(options);
  }
  async _signOut({ scope } = { scope: "global" }) {
    return await this._useSession(async (result) => {
      var _a;
      const removeCurrentSession = async () => {
        await this._removeSession();
      };
      const { data, error: sessionError } = result;
      if (sessionError && !isAuthSessionMissingError(sessionError)) {
        return this._returnResult({ error: sessionError });
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
      if (accessToken) {
        const { error } = await this.admin.signOut(accessToken, scope);
        if (error) {
          if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403) || isAuthSessionMissingError(error))) {
            if (scope !== "others") {
              await removeCurrentSession();
            }
            return this._returnResult({ error });
          }
        }
      }
      if (scope !== "others") {
        await removeCurrentSession();
      }
      return this._returnResult({ error: null });
    });
  }
  /**  *
   * @category Auth
   *
   * @remarks
   * - Subscribes to important events occurring on the user's session.
   * - Use on the frontend/client. It is less useful on the server.
   * - Events are emitted across tabs to keep your application's UI up-to-date. Some events can fire very frequently, based on the number of tabs open. Use a quick and efficient callback function, and defer or debounce as many operations as you can to be performed outside of the callback.
   * - Callbacks can be `async` and can safely call other Supabase auth methods (`getUser`, `setSession`, etc.) from inside the callback.
   * - Keep callbacks quick. Events are awaited in order, so a slow callback delays subsequent events to subscribers in this tab.
   * - Emitted events:
   *   - `INITIAL_SESSION`
   *     - Emitted right after the Supabase client is constructed and the initial session from storage is loaded.
   *   - `SIGNED_IN`
   *     - Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab.
   *     - Avoid making assumptions as to when this event is fired, this may occur even when the user is already signed in. Instead, check the user object attached to the event to see if a new user has signed in and update your application's UI.
   *     - This event can fire very frequently depending on the number of tabs open in your application.
   *   - `SIGNED_OUT`
   *     - Emitted when the user signs out. This can be after:
   *       - A call to `supabase.auth.signOut()`.
   *       - After the user's session has expired for any reason:
   *         - User has signed out on another device.
   *         - The session has reached its timebox limit or inactivity timeout.
   *         - User has signed in on another device with single session per user enabled.
   *         - Check the [User Sessions](/docs/guides/auth/sessions) docs for more information.
   *     - Use this to clean up any local storage your application has associated with the user.
   *   - `TOKEN_REFRESHED`
   *     - Emitted each time a new access and refresh token are fetched for the signed in user.
   *     - It's best practice and highly recommended to extract the access token (JWT) and store it in memory for further use in your application.
   *       - Avoid frequent calls to `supabase.auth.getSession()` for the same purpose.
   *     - There is a background process that keeps track of when the session should be refreshed so you will always receive valid tokens by listening to this event.
   *     - The frequency of this event is related to the JWT expiry limit configured on your project.
   *   - `USER_UPDATED`
   *     - Emitted each time the `supabase.auth.updateUser()` method finishes successfully. Listen to it to update your application's UI based on new profile information.
   *   - `PASSWORD_RECOVERY`
   *     - Emitted instead of the `SIGNED_IN` event when the user lands on a page that includes a password recovery link in the URL.
   *     - Use it to show a UI to the user where they can [reset their password](/docs/guides/auth/passwords#resetting-a-users-password-forgot-password).
   *
   * @example Listen to auth changes
   * ```js
   * const { data } = supabase.auth.onAuthStateChange((event, session) => {
   *   console.log(event, session)
   *
   *   if (event === 'INITIAL_SESSION') {
   *     // handle initial session
   *   } else if (event === 'SIGNED_IN') {
   *     // handle sign in event
   *   } else if (event === 'SIGNED_OUT') {
   *     // handle sign out event
   *   } else if (event === 'PASSWORD_RECOVERY') {
   *     // handle password recovery event
   *   } else if (event === 'TOKEN_REFRESHED') {
   *     // handle token refreshed event
   *   } else if (event === 'USER_UPDATED') {
   *     // handle user updated event
   *   }
   * })
   *
   * // call unsubscribe to remove the callback
   * data.subscription.unsubscribe()
   * ```
   *
   * @exampleDescription Listen to sign out
   * Make sure you clear out any local data, such as local and session storage, after the client library has detected the user's sign out.
   *
   * @example Listen to sign out
   * ```js
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (event === 'SIGNED_OUT') {
   *     console.log('SIGNED_OUT', session)
   *
   *     // clear local and session storage
   *     [
   *       window.localStorage,
   *       window.sessionStorage,
   *     ].forEach((storage) => {
   *       Object.entries(storage)
   *         .forEach(([key]) => {
   *           storage.removeItem(key)
   *         })
   *     })
   *   }
   * })
   * ```
   *
   * @exampleDescription Store OAuth provider tokens on sign in
   * When using [OAuth (Social Login)](/docs/guides/auth/social-login) you sometimes wish to get access to the provider's access token and refresh token, in order to call provider APIs in the name of the user.
   *
   * For example, if you are using [Sign in with Google](/docs/guides/auth/social-login/auth-google) you may want to use the provider token to call Google APIs on behalf of the user. Supabase Auth does not keep track of the provider access and refresh token, but does return them for you once, immediately after sign in. You can use the `onAuthStateChange` method to listen for the presence of the provider tokens and store them in local storage. You can further send them to your server's APIs for use on the backend.
   *
   * Finally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.
   *
   * @example Store OAuth provider tokens on sign in
   * ```js
   * // Register this immediately after calling createClient!
   * // Because signInWithOAuth causes a redirect, you need to fetch the
   * // provider tokens from the callback.
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (session && session.provider_token) {
   *     window.localStorage.setItem('oauth_provider_token', session.provider_token)
   *   }
   *
   *   if (session && session.provider_refresh_token) {
   *     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
   *   }
   *
   *   if (event === 'SIGNED_OUT') {
   *     window.localStorage.removeItem('oauth_provider_token')
   *     window.localStorage.removeItem('oauth_provider_refresh_token')
   *   }
   * })
   * ```
   *
   * @exampleDescription Use React Context for the User's session
   * Instead of relying on `supabase.auth.getSession()` within your React components, you can use a [React Context](https://react.dev/reference/react/createContext) to store the latest session information from the `onAuthStateChange` callback and access it that way.
   *
   * @example Use React Context for the User's session
   * ```js
   * const SessionContext = React.createContext(null)
   *
   * function main() {
   *   const [session, setSession] = React.useState(null)
   *
   *   React.useEffect(() => {
   *     const {data: { subscription }} = supabase.auth.onAuthStateChange(
   *       (event, session) => {
   *         if (event === 'SIGNED_OUT') {
   *           setSession(null)
   *         } else if (session) {
   *           setSession(session)
   *         }
   *       })
   *
   *     return () => {
   *       subscription.unsubscribe()
   *     }
   *   }, [])
   *
   *   return (
   *     <SessionContext.Provider value={session}>
   *       <App />
   *     </SessionContext.Provider>
   *   )
   * }
   * ```
   *
   * @example Listen to password recovery events
   * ```js
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (event === 'PASSWORD_RECOVERY') {
   *     console.log('PASSWORD_RECOVERY', session)
   *     // show screen to update user's password
   *     showPasswordResetScreen(true)
   *   }
   * })
   * ```
   *
   * @example Listen to sign in
   * ```js
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (event === 'SIGNED_IN') console.log('SIGNED_IN', session)
   * })
   * ```
   *
   * @example Listen to token refresh
   * ```js
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (event === 'TOKEN_REFRESHED') console.log('TOKEN_REFRESHED', session)
   * })
   * ```
   *
   * @example Listen to user updates
   * ```js
   * supabase.auth.onAuthStateChange((event, session) => {
   *   if (event === 'USER_UPDATED') console.log('USER_UPDATED', session)
   * })
   * ```
   */
  onAuthStateChange(callback) {
    const id = generateCallbackId();
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this._debug("#unsubscribe()", "state change callback with id removed", id);
        this.stateChangeEmitters.delete(id);
      }
    };
    this._debug("#onAuthStateChange()", "registered callback with id", id);
    this.stateChangeEmitters.set(id, subscription);
    (async () => {
      await this.initializePromise;
      if (this.lock != null) {
        await this._acquireLock(this.lockAcquireTimeout, async () => {
          this._emitInitialSession(id);
        });
      } else {
        await this._emitInitialSession(id);
      }
    })();
    return { data: { subscription } };
  }
  async _emitInitialSession(id) {
    return await this._useSession(async (result) => {
      var _a, _b;
      try {
        const { data: { session }, error } = result;
        if (error)
          throw error;
        await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
        this._debug("INITIAL_SESSION", "callback id", id, "session", session);
      } catch (err) {
        await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
        this._debug("INITIAL_SESSION", "callback id", id, "error", err);
        if (isAuthRefreshDiscardedError(err)) {
          return;
        }
        if (isAuthSessionMissingError(err) || isAuthRetryableFetchError(err) || isAuthApiError(err) && (err.code === "refresh_token_not_found" || err.code === "refresh_token_already_used" || err.code === "session_expired")) {
          console.warn(err);
        } else {
          console.error(err);
        }
      }
    });
  }
  /**
   * Sends a password reset request to an email address. This method supports the PKCE flow.
   *
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   *
   * @category Auth
   *
   * @remarks
   * - The password reset flow consist of 2 broad steps: (i) Allow the user to login via the password reset link; (ii) Update the user's password.
   * - The `resetPasswordForEmail()` only sends a password reset link to the user's email.
   * To update the user's password, see [`updateUser()`](/docs/reference/javascript/auth-updateuser).
   * - A `PASSWORD_RECOVERY` event will be emitted when the password recovery link is clicked.
   * You can use [`onAuthStateChange()`](/docs/reference/javascript/auth-onauthstatechange) to listen and invoke a callback function on these events.
   * - When the user clicks the reset link in the email they are redirected back to your application.
   * You can configure the URL that the user is redirected to with the `redirectTo` parameter.
   * See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
   * - After the user has been redirected successfully, prompt them for a new password and call `updateUser()`:
   * ```js
   * const { data, error } = await supabase.auth.updateUser({
   *   password: new_password
   * })
   * ```
   *
   * @example Reset password
   * ```js
   * const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
   *   redirectTo: 'https://example.com/update-password',
   * })
   * ```
   *
   * @exampleResponse Reset password
   * ```json
   * {
   *   data: {}
   *   error: null
   * }
   * ```
   *
   * @example Reset password (React)
   * ```js
   * /**
   *  * Step 1: Send the user an email to get a password reset token.
   *  * This email contains a link which sends the user back to your application.
   *  *\/
   * const { data, error } = await supabase.auth
   *   .resetPasswordForEmail('user@email.com')
   *
   * /**
   *  * Step 2: Once the user is redirected back to your application,
   *  * ask the user to reset their password.
   *  *\/
   *  useEffect(() => {
   *    supabase.auth.onAuthStateChange(async (event, session) => {
   *      if (event == "PASSWORD_RECOVERY") {
   *        const newPassword = prompt("What would you like your new password to be?");
   *        const { data, error } = await supabase.auth
   *          .updateUser({ password: newPassword })
   *
   *        if (data) alert("Password updated successfully!")
   *        if (error) alert("There was an error updating your password.")
   *      }
   *    })
   *  }, [])
   * ```
   */
  async resetPasswordForEmail(email, options = {}) {
    let codeChallenge = null;
    let codeChallengeMethod = null;
    let flowId = null;
    if (this.flowType === "pkce") {
      ;
      [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod(
        true
        // isPasswordRecovery
      );
    }
    try {
      return await _request(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          gotrue_meta_security: { captcha_token: options.captchaToken }
        },
        headers: this.headers,
        redirectTo: this._maybeAppendFlowIdToRedirect(options.redirectTo, flowId)
      });
    } catch (error) {
      await removePKCEVerifier(this.storage, this.storageKey, flowId);
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Gets all the identities linked to a user.
   *
   * @category Auth
   *
   * @remarks
   * - The user needs to be signed in to call `getUserIdentities()`.
   *
   * @example Returns a list of identities linked to the user
   * ```js
   * const { data, error } = await supabase.auth.getUserIdentities()
   * ```
   *
   * @exampleResponse Returns a list of identities linked to the user
   * ```json
   * {
   *   "data": {
   *     "identities": [
   *       {
   *         "identity_id": "22222222-2222-2222-2222-222222222222",
   *         "id": "2024-01-01T00:00:00Z",
   *         "user_id": "2024-01-01T00:00:00Z",
   *         "identity_data": {
   *           "email": "example@email.com",
   *           "email_verified": false,
   *           "phone_verified": false,
   *           "sub": "11111111-1111-1111-1111-111111111111"
   *         },
   *         "provider": "email",
   *         "last_sign_in_at": "2024-01-01T00:00:00Z",
   *         "created_at": "2024-01-01T00:00:00Z",
   *         "updated_at": "2024-01-01T00:00:00Z",
   *         "email": "example@email.com"
   *       }
   *     ]
   *   },
   *   "error": null
   * }
   * ```
   */
  async getUserIdentities() {
    var _a;
    try {
      const { data, error } = await this.getUser();
      if (error)
        throw error;
      return this._returnResult({ data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**  *
   * @category Auth
   *
   * @remarks
   * - The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
   * - The user needs to be signed in to call `linkIdentity()`.
   * - If the candidate identity is already linked to the existing user or another user, `linkIdentity()` will fail.
   * - If `linkIdentity` is run in the browser, the user is automatically redirected to the returned URL. On the server, you should handle the redirect.
   *
   * @example Link an identity to a user
   * ```js
   * const { data, error } = await supabase.auth.linkIdentity({
   *   provider: 'github'
   * })
   * ```
   *
   * @exampleResponse Link an identity to a user
   * ```json
   * {
   *   data: {
   *     provider: 'github',
   *     url: <PROVIDER_URL_TO_REDIRECT_TO>,
   *     flowId: <PKCE_FLOW_ID_OR_NULL>
   *   },
   *   error: null
   * }
   * ```
   */
  async linkIdentity(credentials) {
    if ("token" in credentials) {
      return this.linkIdentityIdToken(credentials);
    }
    return this.linkIdentityOAuth(credentials);
  }
  async linkIdentityOAuth(credentials) {
    var _a;
    let flowId = null;
    try {
      const { data, error } = await this._useSession(async (result) => {
        var _a2, _b, _c, _d, _f;
        const { data: data2, error: error2 } = result;
        if (error2)
          throw error2;
        const { url, flowId: urlFlowId } = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
          redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: true
        });
        flowId = urlFlowId;
        return await _request(this.fetch, "GET", url, {
          headers: this.headers,
          jwt: (_f = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _f !== void 0 ? _f : void 0
        });
      });
      if (error)
        throw error;
      if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
        window.location.assign(data === null || data === void 0 ? void 0 : data.url);
      }
      return this._returnResult({
        data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url, flowId },
        error: null
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({
          data: { provider: credentials.provider, url: null, flowId },
          error
        });
      }
      throw error;
    }
  }
  async linkIdentityIdToken(credentials) {
    return await this._useSession(async (result) => {
      var _a;
      try {
        const { error: sessionError, data: { session } } = result;
        if (sessionError)
          throw sessionError;
        const { options, provider, token, access_token, nonce } = credentials;
        const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
          headers: this.headers,
          jwt: (_a = session === null || session === void 0 ? void 0 : session.access_token) !== null && _a !== void 0 ? _a : void 0,
          body: {
            provider,
            id_token: token,
            access_token,
            nonce,
            link_identity: true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
        const { data, error } = res;
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if (!data || !data.session || !data.user) {
          return this._returnResult({
            data: { user: null, session: null },
            error: new AuthInvalidTokenResponseError()
          });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("USER_UPDATED", data.session);
        }
        return this._returnResult({ data, error });
      } catch (error) {
        await removePKCEVerifier(this.storage, this.storageKey, null);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    });
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   *
   * @category Auth
   *
   * @remarks
   * - The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
   * - The user needs to be signed in to call `unlinkIdentity()`.
   * - The user must have at least 2 identities in order to unlink an identity.
   * - The identity to be unlinked must belong to the user.
   *
   * @example Unlink an identity
   * ```js
   * // retrieve all identities linked to a user
   * const identities = await supabase.auth.getUserIdentities()
   *
   * // find the google identity
   * const googleIdentity = identities.find(
   *   identity => identity.provider === 'google'
   * )
   *
   * // unlink the google identity
   * const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
   * ```
   */
  async unlinkIdentity(identity) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(refreshToken) {
    const debugName = `#_refreshAccessToken()`;
    this._debug(debugName, "begin");
    try {
      const startedAt = Date.now();
      return await retryable(async (attempt) => {
        if (attempt > 0) {
          await sleep2(200 * Math.pow(2, attempt - 1));
        }
        this._debug(debugName, "refreshing attempt", attempt);
        return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
          body: { refresh_token: refreshToken },
          headers: this.headers,
          xform: _sessionResponse
        });
      }, (attempt, error) => {
        const nextBackOffInterval = 200 * Math.pow(2, attempt);
        return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
      });
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        return this._returnResult({ data: { session: null, user: null }, error });
      }
      throw error;
    } finally {
      this._debug(debugName, "end");
    }
  }
  _isValidSession(maybeSession) {
    const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
    return isValidSession;
  }
  async _handleProviderSignIn(provider, options) {
    const { url, flowId } = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });
    this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
    if (isBrowser() && !options.skipBrowserRedirect) {
      window.location.assign(url);
    }
    return { data: { provider, url, flowId }, error: null };
  }
  /**
   * Recovers the session from LocalStorage and refreshes the token
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var _a, _b;
    const debugName = "#_recoverAndRefresh()";
    this._debug(debugName, "begin");
    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      if (currentSession && this.userStorage) {
        let maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
        if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
          maybeUser = { user: currentSession.user };
          await setItemAsync(this.userStorage, this.storageKey + "-user", maybeUser);
        }
        currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : userNotAvailableProxy();
      } else if (currentSession && !currentSession.user) {
        if (!currentSession.user) {
          const separateUser = await getItemAsync(this.storage, this.storageKey + "-user");
          if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
            currentSession.user = separateUser.user;
            await removeItemAsync(this.storage, this.storageKey + "-user");
            await setItemAsync(this.storage, this.storageKey, currentSession);
          } else {
            currentSession.user = userNotAvailableProxy();
          }
        }
      }
      this._debug(debugName, "session from storage", currentSession);
      if (!this._isValidSession(currentSession)) {
        this._debug(debugName, "session is not valid");
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }
      const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
      this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            if (isAuthRefreshDiscardedError(error)) {
              this._debug(debugName, "refresh discarded by commit guard", error);
            } else {
              this._debug(debugName, "refresh failed", error);
            }
          }
        }
      } else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) {
        try {
          const { data, error: userError } = await this._getUser(currentSession.access_token);
          if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
            currentSession.user = data.user;
            await this._saveSession(currentSession);
            await this._notifyAllSubscribers("SIGNED_IN", currentSession);
          } else {
            this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
          }
        } catch (getUserError) {
          console.error("Error getting user data:", getUserError);
          this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
        }
      } else {
        await this._notifyAllSubscribers("SIGNED_IN", currentSession);
      }
    } catch (err) {
      this._debug(debugName, "error", err);
      if (isAuthRetryableFetchError(err)) {
        console.warn(err);
      } else {
        console.error(err);
      }
      return;
    } finally {
      this._debug(debugName, "end");
    }
  }
  async _callRefreshToken(refreshToken) {
    var _a, _b;
    if (!refreshToken) {
      throw new AuthSessionMissingError();
    }
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }
    if (this.lastRefreshFailure && this.lastRefreshFailure.refreshToken === refreshToken && Date.now() < this.lastRefreshFailure.expiresAt) {
      this._debug("#_callRefreshToken()", "returning cached failure (cooldown active)");
      return this.lastRefreshFailure.result;
    }
    const debugName = `#_callRefreshToken()`;
    this._debug(debugName, "begin");
    try {
      this.refreshingDeferred = new Deferred();
      this.refreshingDeferred.promise.then(void 0, () => {
      });
      const storedAtStart = await getItemAsync(this.storage, this.storageKey);
      const { data, error } = await this._refreshAccessToken(refreshToken);
      if (error)
        throw error;
      if (!data.session)
        throw new AuthSessionMissingError();
      const storedAfter = await getItemAsync(this.storage, this.storageKey);
      const storageChangedUnderUs = storedAtStart !== null && (storedAfter === null || storedAfter.refresh_token !== storedAtStart.refresh_token);
      if (storageChangedUnderUs) {
        this._debug(debugName, "commit guard: storage changed since refresh started, discarding rotated tokens", {
          // Presence indicators only — never log refresh token fragments,
          // even partial. Logs may be forwarded to third-party services.
          startedWith: "present",
          nowHolds: storedAfter ? "replaced" : "cleared"
        });
        const discarded = {
          data: null,
          error: new AuthRefreshDiscardedError()
        };
        this.refreshingDeferred.resolve(discarded);
        return discarded;
      }
      const epochBeforeSave = this._sessionRemovalEpoch;
      await this._saveSession(data.session);
      if (this._sessionRemovalEpoch !== epochBeforeSave) {
        this._debug(debugName, "commit guard (post-save): _removeSession ran during _saveSession, undoing write");
        await removeItemAsync(this.storage, this.storageKey);
        if (this.userStorage) {
          await removeItemAsync(this.userStorage, this.storageKey + "-user");
        }
        const discarded = {
          data: null,
          error: new AuthRefreshDiscardedError()
        };
        this.refreshingDeferred.resolve(discarded);
        return discarded;
      }
      await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
      const result = { data: data.session, error: null };
      this.lastRefreshFailure = null;
      this.refreshingDeferred.resolve(result);
      return result;
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        const result = { data: null, error };
        if (!isAuthRetryableFetchError(error)) {
          const storedNow = await getItemAsync(this.storage, this.storageKey);
          const accessTokenStillValid = !!((storedNow === null || storedNow === void 0 ? void 0 : storedNow.expires_at) && storedNow.expires_at * 1e3 > Date.now());
          if (accessTokenStillValid) {
            this._debug(debugName, "proactive refresh failed, access token still valid \u2014 preserving session");
          } else {
            await this._removeSession();
          }
        }
        this.lastRefreshFailure = {
          refreshToken,
          result,
          expiresAt: Date.now() + REFRESH_FAILURE_COOLDOWN_MS
        };
        (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
        return result;
      }
      (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this._debug(debugName, "end");
    }
  }
  async _notifyAllSubscribers(event, session, broadcast = true) {
    if (this._pendingInitNotifications !== null && broadcast) {
      this._pendingInitNotifications.push({ event, session, broadcast });
      return;
    }
    const debugName = `#_notifyAllSubscribers(${event})`;
    this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }
      const errors = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
        try {
          await x.callback(event, session);
        } catch (e) {
          errors.push(e);
        }
      });
      await Promise.all(promises);
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i += 1) {
          console.error(errors[i]);
        }
        throw errors[0];
      }
    } finally {
      this._debug(debugName, "end");
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(session) {
    this._debug("#_saveSession()", session);
    this.suppressGetSessionWarning = true;
    const sessionToProcess = Object.assign({}, session);
    const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
    if (this.userStorage) {
      if (!userIsProxy && sessionToProcess.user) {
        await setItemAsync(this.userStorage, this.storageKey + "-user", {
          user: sessionToProcess.user
        });
      } else if (userIsProxy) {
      }
      const mainSessionData = Object.assign({}, sessionToProcess);
      delete mainSessionData.user;
      const clonedMainSessionData = deepClone(mainSessionData);
      await setItemAsync(this.storage, this.storageKey, clonedMainSessionData);
    } else {
      const clonedSession = deepClone(sessionToProcess);
      await setItemAsync(this.storage, this.storageKey, clonedSession);
    }
  }
  async _removeSession() {
    this._sessionRemovalEpoch += 1;
    this._debug("#_removeSession()");
    this.lastRefreshFailure = null;
    this.suppressGetSessionWarning = false;
    await removeItemAsync(this.storage, this.storageKey);
    await removeAllPKCEVerifiers(this.storage, this.storageKey);
    await removeItemAsync(this.storage, this.storageKey + "-user");
    if (this.userStorage) {
      await removeItemAsync(this.userStorage, this.storageKey + "-user");
    }
    await this._notifyAllSubscribers("SIGNED_OUT", null);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@link GoTrueClient.startAutoRefresh}
   * {@link GoTrueClient.stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      console.error("removing visibilitychange callback failed", e);
    }
  }
  /**
   * This is the private implementation of {@link GoTrueClient.startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh();
    this._debug("#_startAutoRefresh()");
    const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
    this.autoRefreshTicker = ticker;
    if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
      ticker.unref();
    } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
      Deno.unrefTimer(ticker);
    }
    const timeout = setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
    this.autoRefreshTickTimeout = timeout;
    if (timeout && typeof timeout === "object" && typeof timeout.unref === "function") {
      timeout.unref();
    } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
      Deno.unrefTimer(timeout);
    }
  }
  /**
   * This is the private implementation of {@link GoTrueClient.stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;
    if (ticker) {
      clearInterval(ticker);
    }
    const timeout = this.autoRefreshTickTimeout;
    this.autoRefreshTickTimeout = null;
    if (timeout) {
      clearTimeout(timeout);
    }
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desirable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@link GoTrueClient.stopAutoRefresh}
   *
   * @category Auth
   *
   * @remarks
   * - Only useful in non-browser environments such as React Native or Electron.
   * - The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
   * - On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.
   * - To give this hint to the application, you should be calling this method when the app is in focus and calling `supabase.auth.stopAutoRefresh()` when it's out of focus.
   *
   * @example Start and stop auto refresh in React Native
   * ```js
   * import { AppState } from 'react-native'
   *
   * // make sure you register this only once!
   * AppState.addEventListener('change', (state) => {
   *   if (state === 'active') {
   *     supabase.auth.startAutoRefresh()
   *   } else {
   *     supabase.auth.stopAutoRefresh()
   *   }
   * })
   * ```
   */
  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link GoTrueClient.startAutoRefresh} for more details.
   *
   * @category Auth
   *
   * @remarks
   * - Only useful in non-browser environments such as React Native or Electron.
   * - The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
   * - On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.
   * - When your application goes in the background or out of focus, call this method to stop the proactive refreshing of the session.
   *
   * @example Start and stop auto refresh in React Native
   * ```js
   * import { AppState } from 'react-native'
   *
   * // make sure you register this only once!
   * AppState.addEventListener('change', (state) => {
   *   if (state === 'active') {
   *     supabase.auth.startAutoRefresh()
   *   } else {
   *     supabase.auth.stopAutoRefresh()
   *   }
   * })
   * ```
   */
  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }
  /**
   * Tears down the client's background work: stops the auto-refresh interval,
   * removes the `visibilitychange` listener, closes the cross-tab
   * `BroadcastChannel`, and clears registered `onAuthStateChange` subscribers.
   *
   * Call this from cleanup hooks when the client is being replaced before
   * its JS realm is destroyed. React Strict Mode and HMR are the common
   * cases. Any in-flight `fetch` calls continue to completion and may still
   * write to storage; dispose doesn't abort them or erase storage.
   *
   * Lifecycle caveat: because in-flight refreshes are not aborted, a
   * disposed instance can still persist a rotated session to storage after
   * `dispose()` returns. A subsequent `createClient` against the same
   * `storageKey` will pick up that session on its next read. If you need
   * strict isolation between client lifecycles, await any pending auth
   * operation before calling `dispose()` (or change the `storageKey` for
   * the replacement client).
   *
   * Safe to call repeatedly.
   *
   * @category Auth
   *
   * @example Cleanup on React unmount
   * ```ts
   * useEffect(() => {
   *   const client = createClient(...)
   *   return () => { client.auth.dispose() }
   * }, [])
   * ```
   */
  async dispose() {
    var _a;
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
    (_a = this.broadcastChannel) === null || _a === void 0 ? void 0 : _a.close();
    this.broadcastChannel = null;
    this.stateChangeEmitters.clear();
  }
  /**
   * Runs the auto refresh token tick.
   */
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    if (this.lock != null) {
      try {
        await this._acquireLock(0, async () => {
          try {
            const now = Date.now();
            try {
              return await this._useSession(async (result) => {
                const { data: { session } } = result;
                if (!session || !session.refresh_token || !session.expires_at) {
                  this._debug("#_autoRefreshTokenTick()", "no session");
                  return;
                }
                const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
                this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                  await this._callRefreshToken(session.refresh_token);
                }
              });
            } catch (e) {
              console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
            }
          } finally {
            this._debug("#_autoRefreshTokenTick()", "end");
          }
        });
      } catch (e) {
        if (e instanceof LockAcquireTimeoutError) {
          this._debug("auto refresh token tick lock not available");
        } else {
          throw e;
        }
      }
      return;
    }
    if (this.refreshingDeferred !== null) {
      this._debug("#_autoRefreshTokenTick()", "refresh already in flight, skipping");
      return;
    }
    try {
      const now = Date.now();
      try {
        await this._useSession(async (result) => {
          const { data: { session } } = result;
          if (!session || !session.refresh_token || !session.expires_at) {
            this._debug("#_autoRefreshTokenTick()", "no session");
            return;
          }
          const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
          this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
          if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
            await this._callRefreshToken(session.refresh_token);
          }
        });
      } catch (e) {
        console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
      }
    } finally {
      this._debug("#_autoRefreshTokenTick()", "end");
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    this._debug("#_handleVisibilityChange()");
    if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      if (this.autoRefreshToken) {
        this.startAutoRefresh();
      }
      return false;
    }
    try {
      this.visibilityChangedCallback = async () => {
        try {
          await this._onVisibilityChanged(false);
        } catch (error) {
          this._debug("#visibilityChangedCallback", "error", error);
        }
      };
      window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
      await this._onVisibilityChanged(true);
    } catch (error) {
      console.error("_handleVisibilityChange", error);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(calledFromInitialize) {
    const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
    this._debug(methodName, "visibilityState", document.visibilityState);
    if (document.visibilityState === "visible") {
      if (this.autoRefreshToken) {
        this._startAutoRefresh();
      }
      if (!calledFromInitialize) {
        await this.initializePromise;
        if (this.lock != null) {
          await this._acquireLock(this.lockAcquireTimeout, async () => {
            if (document.visibilityState !== "visible") {
              this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
              return;
            }
            await this._recoverAndRefresh();
          });
        } else {
          if (document.visibilityState !== "visible") {
            this._debug(methodName, "visibilityState is no longer visible, skipping recovery");
            return;
          }
          await this._recoverAndRefresh();
        }
      }
    } else if (document.visibilityState === "hidden") {
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(url, provider, options) {
    let redirectTo = options === null || options === void 0 ? void 0 : options.redirectTo;
    let codeChallenge = null;
    let codeChallengeMethod = null;
    let flowId = null;
    if (this.flowType === "pkce") {
      ;
      [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
      redirectTo = this._maybeAppendFlowIdToRedirect(redirectTo, flowId);
    }
    const urlParams = [`provider=${encodeURIComponent(provider)}`];
    if (redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(redirectTo)}`);
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }
    if (codeChallenge != null && codeChallengeMethod != null) {
      const flowParams = new URLSearchParams({
        code_challenge: `${encodeURIComponent(codeChallenge)}`,
        code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
      });
      urlParams.push(flowParams.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query2 = new URLSearchParams(options.queryParams);
      urlParams.push(query2.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
      urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
    }
    return { url: `${url}?${urlParams.join("&")}`, flowId };
  }
  /**
   * Appends the reserved flow id parameter to a redirect URL so the callback
   * can be matched to the verifier stored for its flow. Opt-in via
   * `experimental.appendPkceFlowIdToRedirects`: redirect URLs are validated
   * against the project's allow list including the query string, so an extra
   * parameter can stop exact (non-wildcard) entries from matching.
   */
  _maybeAppendFlowIdToRedirect(redirectTo, flowId) {
    if (!redirectTo || !flowId || !this.experimental.appendPkceFlowIdToRedirects) {
      return redirectTo !== null && redirectTo !== void 0 ? redirectTo : void 0;
    }
    return appendFlowIdToRedirectTo(redirectTo, flowId);
  }
  /**
   * Generates and stores a PKCE challenge/verifier pair for a new flow,
   * logging any pending verifier the bounded slot ring evicts.
   */
  async _getCodeChallengeAndMethod(isPasswordRecovery = false) {
    return getCodeChallengeAndMethod(this.storage, this.storageKey, isPasswordRecovery, (evictedFlowId) => this._debug("#_getCodeChallengeAndMethod()", "evicted oldest pending PKCE verifier slot", evictedFlowId));
  }
  async _unenroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  async _enroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : params.factorType === "totp" ? { issuer: params.issuer } : {});
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
          body,
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        if (params.factorType === "totp" && data.type === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  async _verify(params) {
    const run = async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          const body = Object.assign({ challenge_id: params.challengeId }, "webauthn" in params ? {
            webauthn: Object.assign(Object.assign({}, params.webauthn), { credential_response: params.webauthn.type === "create" ? serializeCredentialCreationResponse(params.webauthn.credential_response) : serializeCredentialRequestResponse(params.webauthn.credential_response) })
          } : { code: params.code });
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
            body,
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
          await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
          return this._returnResult({ data, error });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    };
    if (this.lock != null) {
      return this._acquireLock(this.lockAcquireTimeout, run);
    }
    return run();
  }
  async _challenge(params) {
    const run = async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          const response = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
            body: params,
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (response.error) {
            return response;
          }
          const { data } = response;
          if (data.type !== "webauthn") {
            return { data, error: null };
          }
          switch (data.webauthn.type) {
            case "create":
              return {
                data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialCreationOptions(data.webauthn.credential_options.publicKey) }) }) }),
                error: null
              };
            case "request":
              return {
                data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialRequestOptions(data.webauthn.credential_options.publicKey) }) }) }),
                error: null
              };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    };
    if (this.lock != null) {
      return this._acquireLock(this.lockAcquireTimeout, run);
    }
    return run();
  }
  /**
   * {@link GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(params) {
    const { data: challengeData, error: challengeError } = await this._challenge({
      factorId: params.factorId
    });
    if (challengeError) {
      return this._returnResult({ data: null, error: challengeError });
    }
    return await this._verify({
      factorId: params.factorId,
      challengeId: challengeData.id,
      code: params.code
    });
  }
  /**
   * {@link GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    var _a;
    const { data: { user }, error: userError } = await this.getUser();
    if (userError) {
      return { data: null, error: userError };
    }
    const data = {
      all: [],
      phone: [],
      totp: [],
      webauthn: [],
      recovery_code: []
    };
    for (const factor of (_a = user === null || user === void 0 ? void 0 : user.factors) !== null && _a !== void 0 ? _a : []) {
      data.all.push(factor);
      if (factor.status === "verified" && factor.factor_type in data && Array.isArray(data[factor.factor_type])) {
        ;
        data[factor.factor_type].push(factor);
      }
    }
    return {
      data,
      error: null
    };
  }
  /**
   * {@link GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel(jwt) {
    var _a, _b, _c, _d;
    if (jwt) {
      try {
        const { payload: payload2 } = decodeJWT(jwt);
        let currentLevel2 = null;
        if (payload2.aal) {
          currentLevel2 = payload2.aal;
        }
        let nextLevel2 = currentLevel2;
        const { data: { user }, error: userError } = await this.getUser(jwt);
        if (userError) {
          return this._returnResult({ data: null, error: userError });
        }
        const verifiedFactors2 = (_b = (_a = user === null || user === void 0 ? void 0 : user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors2.length > 0) {
          nextLevel2 = "aal2";
        }
        const currentAuthenticationMethods2 = payload2.amr || [];
        return { data: { currentLevel: currentLevel2, nextLevel: nextLevel2, currentAuthenticationMethods: currentAuthenticationMethods2 }, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    const { data: { session }, error: sessionError } = await this.getSession();
    if (sessionError) {
      return this._returnResult({ data: null, error: sessionError });
    }
    if (!session) {
      return {
        data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
        error: null
      };
    }
    const { payload } = decodeJWT(session.access_token);
    let currentLevel = null;
    if (payload.aal) {
      currentLevel = payload.aal;
    }
    let nextLevel = currentLevel;
    const verifiedFactors = (_d = (_c = session.user.factors) === null || _c === void 0 ? void 0 : _c.filter((factor) => factor.status === "verified")) !== null && _d !== void 0 ? _d : [];
    if (verifiedFactors.length > 0) {
      nextLevel = "aal2";
    }
    const currentAuthenticationMethods = payload.amr || [];
    return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
  }
  /**
   * {@link AuthMFARecoveryCodesApi#getStatus}
   */
  async _getRecoveryCodesStatus() {
    assertRecoveryCodesExperimentalEnabled(this.experimental);
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        const { data, error } = await _request(this.fetch, "GET", `${this.url}/factors/recovery-codes`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * {@link AuthMFARecoveryCodesApi#generate}
   */
  async _generateRecoveryCodes(params) {
    assertRecoveryCodesExperimentalEnabled(this.experimental);
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/recovery-codes`, {
          // The body is optional server-side; only send one when a name was given.
          body: (params === null || params === void 0 ? void 0 : params.friendlyName) ? { friendly_name: params.friendlyName } : void 0,
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * {@link AuthMFARecoveryCodesApi#verify}
   */
  async _verifyRecoveryCode(params) {
    assertRecoveryCodesExperimentalEnabled(this.experimental);
    const run = async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/recovery-codes/verify`, {
            body: { code: params.code },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          const session = Object.assign({ expires_at: expiresAt(data.expires_in) }, data);
          await this._saveSession(session);
          await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", session);
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    };
    if (this.lock != null) {
      return this._acquireLock(this.lockAcquireTimeout, run);
    }
    return run();
  }
  /**
   * {@link AuthMFARecoveryCodesApi#regenerate}
   */
  async _regenerateRecoveryCodes() {
    assertRecoveryCodesExperimentalEnabled(this.experimental);
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/recovery-codes/regenerate`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * {@link AuthMFARecoveryCodesApi#unenroll}
   */
  async _unenrollRecoveryCodes() {
    assertRecoveryCodesExperimentalEnabled(this.experimental);
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        const { data, error } = await _request(this.fetch, "DELETE", `${this.url}/factors/recovery-codes`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Retrieves details about an OAuth authorization request.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   *
   * Returns authorization details including client info, scopes, and user information.
   * If the response includes only a redirect_url field, it means consent was already given - the caller
   * should handle the redirect manually if needed.
   */
  async _getAuthorizationDetails(authorizationId) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        return await _request(this.fetch, "GET", `${this.url}/oauth/authorizations/${authorizationId}`, {
          headers: this.headers,
          jwt: session.access_token,
          xform: (data) => ({ data, error: null })
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Approves an OAuth authorization request.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   */
  async _approveAuthorization(authorizationId, options) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
          headers: this.headers,
          jwt: session.access_token,
          body: { action: "approve" },
          xform: (data) => ({ data, error: null })
        });
        if (response.data && response.data.redirect_url) {
          if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
            window.location.assign(response.data.redirect_url);
          }
        }
        return response;
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Denies an OAuth authorization request.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   */
  async _denyAuthorization(authorizationId, options) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
          headers: this.headers,
          jwt: session.access_token,
          body: { action: "deny" },
          xform: (data) => ({ data, error: null })
        });
        if (response.data && response.data.redirect_url) {
          if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
            window.location.assign(response.data.redirect_url);
          }
        }
        return response;
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Lists all OAuth grants that the authenticated user has authorized.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   */
  async _listOAuthGrants() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        return await _request(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
          headers: this.headers,
          jwt: session.access_token,
          xform: (data) => ({ data, error: null })
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Revokes a user's OAuth grant for a specific client.
   * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
   */
  async _revokeOAuthGrant(options) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        await _request(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
          headers: this.headers,
          jwt: session.access_token,
          query: { client_id: options.clientId },
          noResolveJson: true
        });
        return { data: {}, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  async fetchJwk(kid, jwks = { keys: [] }) {
    let jwk = jwks.keys.find((key) => key.kid === kid);
    if (jwk) {
      return jwk;
    }
    const now = Date.now();
    jwk = this.jwks.keys.find((key) => key.kid === kid);
    if (jwk && this.jwks_cached_at + JWKS_TTL > now) {
      return jwk;
    }
    const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
      headers: this.headers
    });
    if (error) {
      throw error;
    }
    if (!data.keys || data.keys.length === 0) {
      return null;
    }
    this.jwks = data;
    this.jwks_cached_at = now;
    jwk = data.keys.find((key) => key.kid === kid);
    if (!jwk) {
      return null;
    }
    return jwk;
  }
  /**
   * Extracts the JWT claims present in the access token by first verifying the
   * JWT against the server's JSON Web Key Set endpoint
   * `/.well-known/jwks.json` which is often cached, resulting in significantly
   * faster responses. Prefer this method over {@link GoTrueClient.getUser} which always
   * sends a request to the Auth server for each JWT.
   *
   * If the project is not using an asymmetric JWT signing key (like ECC or
   * RSA) it always sends a request to the Auth server (similar to
   * {@link GoTrueClient.getUser}) to verify the JWT.
   *
   * @param jwt An optional specific JWT you wish to verify, not the one you
   *            can obtain from {@link GoTrueClient.getSession}.
   * @param options Various additional options that allow you to customize the
   *                behavior of this method.
   *
   * @category Auth
   *
   * @remarks
   * - Parses the user's [access token](/docs/guides/auth/sessions#access-token-jwt-claims) as a [JSON Web Token (JWT)](/docs/guides/auth/jwts) and returns its components if valid and not expired.
   * - If your project is using asymmetric JWT signing keys, then the verification is done locally usually without a network request using the [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).
   * - A network request is sent to your project's JWT signing key discovery endpoint `https://project-id.supabase.co/auth/v1/.well-known/jwks.json`, which is cached locally. If your environment is ephemeral, such as a Lambda function that is destroyed after every request, a network request will be sent for each new invocation. Supabase provides a network-edge cache providing fast responses for these situations.
   * - If the user's access token is about to expire when calling this function, the user's session will first be refreshed before validating the JWT.
   * - If your project is using a symmetric secret to sign the JWT, it always sends a request similar to `getUser()` to validate the JWT at the server before returning the decoded token. This is also used if the WebCrypto API is not available in the environment. Make sure you polyfill it in such situations.
   * - The returned claims can be customized per project using the [Custom Access Token Hook](/docs/guides/auth/auth-hooks/custom-access-token-hook).
   *
   * @example Get JWT claims, header and signature
   * ```js
   * const { data, error } = await supabase.auth.getClaims()
   * ```
   *
   * @exampleResponse Get JWT claims, header and signature
   * ```json
   * {
   *   "data": {
   *     "claims": {
   *       "aal": "aal1",
   *       "amr": [{
   *         "method": "email",
   *         "timestamp": 1715766000
   *       }],
   *       "app_metadata": {},
   *       "aud": "authenticated",
   *       "email": "example@email.com",
   *       "exp": 1715769600,
   *       "iat": 1715766000,
   *       "is_anonymous": false,
   *       "iss": "https://project-id.supabase.co/auth/v1",
   *       "phone": "+13334445555",
   *       "role": "authenticated",
   *       "session_id": "11111111-1111-1111-1111-111111111111",
   *       "sub": "11111111-1111-1111-1111-111111111111",
   *       "user_metadata": {}
   *     },
   *     "header": {
   *       "alg": "RS256",
   *       "typ": "JWT",
   *       "kid": "11111111-1111-1111-1111-111111111111"
   *     },
   *     "signature": [/** Uint8Array *\/],
   *   },
   *   "error": null
   * }
   * ```
   */
  async getClaims(jwt, options = {}) {
    try {
      let token = jwt;
      if (!token) {
        const { data, error } = await this.getSession();
        if (error || !data.session) {
          return this._returnResult({ data: null, error });
        }
        token = data.session.access_token;
      }
      const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
      if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) {
        try {
          validateExp(payload.exp);
        } catch (e) {
          throw new AuthInvalidJwtError(e instanceof Error ? e.message : "JWT validation failed");
        }
      }
      const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
      if (!signingKey) {
        const { error } = await this.getUser(token);
        if (error) {
          throw error;
        }
        return {
          data: {
            claims: payload,
            header,
            signature
          },
          error: null
        };
      }
      const algorithm = getAlgorithm(header.alg);
      const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
        "verify"
      ]);
      const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
      if (!isValid) {
        throw new AuthInvalidJwtError("Invalid JWT signature");
      }
      return {
        data: {
          claims: payload,
          header,
          signature
        },
        error: null
      };
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  // --- Passkey Methods ---
  /**
   * Sign in with a passkey. Handles the full WebAuthn ceremony:
   * 1. Fetches authentication challenge from server
   * 2. Prompts user via navigator.credentials.get()
   * 3. Verifies credential with server and creates session
   *
   * Pass `options.mediation: 'conditional'` to use WebAuthn Conditional UI
   * (passkey autofill) instead of the modal picker; the value is forwarded to
   * `navigator.credentials.get()` unchanged.
   *
   * The challenge fetched in step 1 expires after the server's
   * GOTRUE_WEBAUTHN_CHALLENGE_EXPIRY_DURATION (5 minutes by default). With
   * `mediation: 'conditional'` the autofill prompt can stay pending for longer
   * than that: the browser ceremony then still succeeds, but verification fails
   * with `error_code: "webauthn_challenge_expired"`. Recover by calling
   * `signInWithPasskey()` again. It fetches a fresh challenge and, unless you
   * passed your own `options.signal`, cancels the pending ceremony first, so
   * the browser never sees two concurrent WebAuthn requests; the earlier call
   * resolves with a `WebAuthnError` whose code is `ERROR_CEREMONY_ABORTED`. If
   * you pass your own `signal`, abort it before retrying.
   *
   * @category Auth
   *
   * @example Sign in with Conditional UI (passkey autofill)
   * ```js
   * // <input autocomplete="username webauthn" /> somewhere on the page
   * const { data, error } = await supabase.auth.signInWithPasskey({
   *   options: {
   *     mediation: 'conditional'
   *   }
   * });
   * ```
   */
  async signInWithPasskey(credentials) {
    var _a, _b, _c, _d;
    try {
      if (!browserSupportsWebAuthn()) {
        return this._returnResult({
          data: null,
          error: new AuthUnknownError("Browser does not support WebAuthn", null)
        });
      }
      const { data: options, error: optionsError } = await this._startPasskeyAuthentication({
        options: { captchaToken: (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.captchaToken }
      });
      if (optionsError || !options) {
        return this._returnResult({ data: null, error: optionsError });
      }
      const publicKeyOptions = deserializeCredentialRequestOptions(options.options);
      const signal = (_c = (_b = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _b === void 0 ? void 0 : _b.signal) !== null && _c !== void 0 ? _c : webAuthnAbortService.createNewAbortSignal();
      const { data: credential, error: credentialError } = await getCredential({
        publicKey: publicKeyOptions,
        signal,
        mediation: (_d = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _d === void 0 ? void 0 : _d.mediation
      });
      if (credentialError || !credential) {
        return this._returnResult({
          data: null,
          error: credentialError !== null && credentialError !== void 0 ? credentialError : new AuthUnknownError("WebAuthn ceremony failed", null)
        });
      }
      const serialized = serializeCredentialRequestResponse(credential);
      return this._verifyPasskeyAuthentication({
        challengeId: options.challenge_id,
        credential: serialized
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Register a passkey for the current authenticated user. Handles the full WebAuthn ceremony:
   * 1. Fetches registration challenge from server
   * 2. Prompts user via navigator.credentials.create()
   * 3. Verifies credential with server
   *
   * Requires an active session.
   *
   * @category Auth
   */
  async registerPasskey(credentials) {
    var _a, _b;
    try {
      if (!browserSupportsWebAuthn()) {
        return this._returnResult({
          data: null,
          error: new AuthUnknownError("Browser does not support WebAuthn", null)
        });
      }
      const { data: options, error: optionsError } = await this._startPasskeyRegistration();
      if (optionsError || !options) {
        return this._returnResult({ data: null, error: optionsError });
      }
      const publicKeyOptions = deserializeCredentialCreationOptions(options.options);
      const signal = (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.signal) !== null && _b !== void 0 ? _b : webAuthnAbortService.createNewAbortSignal();
      const { data: credential, error: credentialError } = await createCredential({
        publicKey: publicKeyOptions,
        signal
      });
      if (credentialError || !credential) {
        return this._returnResult({
          data: null,
          error: credentialError !== null && credentialError !== void 0 ? credentialError : new AuthUnknownError("WebAuthn ceremony failed", null)
        });
      }
      const serialized = serializeCredentialCreationResponse(credential);
      return this._verifyPasskeyRegistration({
        challengeId: options.challenge_id,
        credential: serialized
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Start passkey registration for the current authenticated user.
   * Returns WebAuthn credential creation options to pass to navigator.credentials.create().
   */
  async _startPasskeyRegistration() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/registration/options`, {
          headers: this.headers,
          jwt: session.access_token,
          body: {}
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Verify passkey registration with the credential response.
   * The credentialResponse should be the serialized output of navigator.credentials.create().
   */
  async _verifyPasskeyRegistration(params) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, {
          headers: this.headers,
          jwt: session.access_token,
          body: {
            challenge_id: params.challengeId,
            credential: params.credential
          }
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Start passkey authentication.
   * Returns WebAuthn credential request options to pass to navigator.credentials.get().
   */
  async _startPasskeyAuthentication(params) {
    var _a;
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, {
        headers: this.headers,
        body: {
          gotrue_meta_security: { captcha_token: (_a = params === null || params === void 0 ? void 0 : params.options) === null || _a === void 0 ? void 0 : _a.captchaToken }
        }
      });
      if (error) {
        return this._returnResult({ data: null, error });
      }
      return this._returnResult({ data, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Verify passkey authentication and create a session.
   * The credential should be the serialized output of navigator.credentials.get().
   */
  async _verifyPasskeyAuthentication(params) {
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, {
        headers: this.headers,
        body: {
          challenge_id: params.challengeId,
          credential: params.credential
        },
        xform: _sessionResponse
      });
      if (error) {
        return this._returnResult({ data: null, error });
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return this._returnResult({ data, error: null });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * List all passkeys for the current user.
   */
  async _listPasskeys() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const { data, error } = await _request(this.fetch, "GET", `${this.url}/passkeys`, {
          headers: this.headers,
          jwt: session.access_token,
          xform: (data2) => ({ data: data2, error: null })
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Update a passkey.
   */
  async _updatePasskey(params) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const { data, error } = await _request(this.fetch, "PATCH", `${this.url}/passkeys/${params.passkeyId}`, {
          headers: this.headers,
          jwt: session.access_token,
          body: { friendly_name: params.friendlyName }
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
  /**
   * Delete a passkey.
   */
  async _deletePasskey(params) {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return this._returnResult({ data: null, error: new AuthSessionMissingError() });
        }
        const { error } = await _request(this.fetch, "DELETE", `${this.url}/passkeys/${params.passkeyId}`, {
          headers: this.headers,
          jwt: session.access_token,
          noResolveJson: true
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data: null, error: null });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return this._returnResult({ data: null, error });
      }
      throw error;
    }
  }
};
GoTrueClient.nextInstanceID = {};
var GoTrueClient_default = GoTrueClient;

// node_modules/@supabase/auth-js/dist/module/AuthClient.js
var AuthClient = GoTrueClient_default;
var AuthClient_default = AuthClient;

// node_modules/@supabase/supabase-js/dist/index.mjs
var version4 = "2.117.3";
var JS_ENV = "";
var JS_RUNTIME_VERSION;
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
  JS_RUNTIME_VERSION = (_Deno$version = Deno.version) === null || _Deno$version === void 0 ? void 0 : _Deno$version.deno;
} else if (typeof document !== "undefined") JS_ENV = "web";
else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") JS_ENV = "react-native";
else {
  JS_ENV = "node";
  const _process = globalThis["process"];
  JS_RUNTIME_VERSION = _process === null || _process === void 0 || (_process$version = _process["version"]) === null || _process$version === void 0 ? void 0 : _process$version.replace(/^v/, "");
}
var _Deno$version;
var _process$version;
var _runtimeMeta = [`runtime=${JS_ENV}`];
if (JS_RUNTIME_VERSION) _runtimeMeta.push(`runtime-version=${JS_RUNTIME_VERSION}`);
var DEFAULT_HEADERS3 = { "X-Client-Info": `supabase-js/${version4}; ${_runtimeMeta.join("; ")}` };
var DEFAULT_GLOBAL_OPTIONS = { headers: DEFAULT_HEADERS3 };
var DEFAULT_DB_OPTIONS = { schema: "public" };
var DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
var DEFAULT_REALTIME_OPTIONS = {};
var DEFAULT_TRACE_PROPAGATION_OPTIONS = {
  enabled: false,
  respectSamplingDecision: true
};
function parseTraceParent(traceparent) {
  if (!traceparent || typeof traceparent !== "string") return null;
  const parts = traceparent.split("-");
  if (parts.length !== 4) return null;
  const [version$1, traceId, parentId, traceFlags] = parts;
  if (version$1.length !== 2 || traceId.length !== 32 || parentId.length !== 16 || traceFlags.length !== 2) return null;
  const hexRegex = /^[0-9a-f]+$/i;
  if (!hexRegex.test(version$1) || !hexRegex.test(traceId) || !hexRegex.test(parentId) || !hexRegex.test(traceFlags)) return null;
  if (traceId === "00000000000000000000000000000000" || parentId === "0000000000000000") return null;
  return {
    version: version$1,
    traceId,
    parentId,
    traceFlags,
    isSampled: (parseInt(traceFlags, 16) & 1) === 1
  };
}
function shouldPropagateToTarget(targetUrl, targets) {
  if (!targetUrl || !targets || targets.length === 0) return false;
  let url;
  if (targetUrl instanceof URL) url = targetUrl;
  else try {
    url = new URL(targetUrl);
  } catch (error) {
    return false;
  }
  for (const target of targets) try {
    if (typeof target === "string") {
      if (matchStringTarget(url.hostname, target)) return true;
    } else if (target instanceof RegExp) {
      if (target.test(url.hostname)) return true;
    } else if (typeof target === "function") {
      if (target(url)) return true;
    }
  } catch (error) {
    continue;
  }
  return false;
}
function matchStringTarget(hostname, target) {
  if (target === hostname) return true;
  if (target.startsWith("*.")) {
    const domain = target.slice(2);
    if (hostname.endsWith(domain)) {
      if (hostname === domain || hostname.endsWith("." + domain)) return true;
    }
  }
  return false;
}
function getDefaultPropagationTargets(supabaseUrl) {
  const targets = [];
  try {
    const url = new URL(supabaseUrl);
    targets.push(url.hostname);
  } catch (error) {
  }
  targets.push("*.supabase.co", "*.supabase.in");
  targets.push("localhost", "127.0.0.1", "[::1]");
  return targets;
}
function _typeof3(o) {
  "@babel/helpers - typeof";
  return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
    return typeof o$1;
  } : function(o$1) {
    return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
  }, _typeof3(o);
}
function toPrimitive3(t, r) {
  if ("object" != _typeof3(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof3(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function toPropertyKey3(t) {
  var i = toPrimitive3(t, "string");
  return "symbol" == _typeof3(i) ? i : i + "";
}
function _defineProperty3(e, r, t) {
  return (r = toPropertyKey3(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r$1) {
      return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread23(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys3(Object(t), true).forEach(function(r$1) {
      _defineProperty3(e, r$1, t[r$1]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys3(Object(t)).forEach(function(r$1) {
      Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
    });
  }
  return e;
}
var resolveFetch4 = (customFetch) => {
  if (customFetch) return (...args) => customFetch(...args);
  return (...args) => fetch(...args);
};
var resolveHeadersConstructor = () => {
  return Headers;
};
var isNewApiKey = (key) => key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");
var TEMP_KEY_PREFIX = "sb_temp_";
var warnedKeySubtypes = /* @__PURE__ */ new Set();
var checkApiKeyFormat = (key) => {
  var _key$match$, _key$match;
  if (!key.startsWith("sb_") || isNewApiKey(key) || key.startsWith(TEMP_KEY_PREFIX)) return;
  const subtype = (_key$match$ = (_key$match = key.match(/^sb_[a-zA-Z0-9]+_/)) === null || _key$match === void 0 ? void 0 : _key$match[0]) !== null && _key$match$ !== void 0 ? _key$match$ : "unknown";
  if (warnedKeySubtypes.has(subtype)) return;
  warnedKeySubtypes.add(subtype);
  console.warn("@supabase/supabase-js: Unrecognized Supabase API key format. The client will proceed and send this key as-is; if you see authentication errors you may need to upgrade @supabase/supabase-js to a version that recognizes this key type.");
};
var fetchWithAuth = (supabaseKey, supabaseUrl, getAccessToken, customFetch, tracePropagationOptions, options) => {
  const fetch$1 = resolveFetch4(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  const traceEnabled = (tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.enabled) === true;
  const respectSampling = (tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.respectSamplingDecision) !== false;
  const traceTargets = traceEnabled ? getDefaultPropagationTargets(supabaseUrl) : null;
  const allowKeyAsBearer = !((options === null || options === void 0 ? void 0 : options.omitApiKeyAsBearer) && isNewApiKey(supabaseKey));
  return async (input, init) => {
    const realToken = await getAccessToken();
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) headers.set("apikey", supabaseKey);
    if (!headers.has("Authorization")) {
      const bearer = realToken !== null && realToken !== void 0 ? realToken : allowKeyAsBearer ? supabaseKey : null;
      if (bearer) headers.set("Authorization", `Bearer ${bearer}`);
    }
    if (traceTargets) {
      const traceHeaders = getTraceHeaders(input, traceTargets, respectSampling);
      if (traceHeaders) {
        if (traceHeaders.traceparent && !headers.has("traceparent")) headers.set("traceparent", traceHeaders.traceparent);
        if (traceHeaders.tracestate && !headers.has("tracestate")) headers.set("tracestate", traceHeaders.tracestate);
        if (traceHeaders.baggage && !headers.has("baggage")) headers.set("baggage", traceHeaders.baggage);
      }
    }
    return fetch$1(input, _objectSpread23(_objectSpread23({}, init), {}, { headers }));
  };
};
var warnedMissingTracingRuntime = false;
var warnedNonW3CPropagator = false;
function getTraceHeaders(input, targets, respectSampling) {
  const extractTraceContext = getTraceContextExtractor();
  if (!extractTraceContext) {
    if (!warnedMissingTracingRuntime) {
      warnedMissingTracingRuntime = true;
      console.warn("@supabase/supabase-js: tracePropagation is enabled but the tracing runtime is not loaded, so trace headers will not be attached. Add `import '@supabase/supabase-js/tracing'` at your application entry point (requires the OpenTelemetry API package to be installed). The CDN/UMD build does not support trace propagation.");
    }
    return null;
  }
  if (!shouldPropagateToTarget(typeof input === "string" ? input : input instanceof URL ? input : input.url, targets)) return null;
  const traceContext = extractTraceContext();
  if (!traceContext || !traceContext.traceparent) {
    var _traceContext$carrier;
    if ((traceContext === null || traceContext === void 0 || (_traceContext$carrier = traceContext.carrierKeys) === null || _traceContext$carrier === void 0 ? void 0 : _traceContext$carrier.length) && !warnedNonW3CPropagator) {
      warnedNonW3CPropagator = true;
      const sentryHint = traceContext.carrierKeys.includes("sentry-trace") ? " Sentry detected: set `propagateTraceparent: true` in Sentry.init() to emit it." : " Configure your tracing SDK to emit W3C trace context on outgoing requests.";
      console.warn(`@supabase/supabase-js: tracePropagation is enabled and a tracing SDK is active, but its propagator wrote [${traceContext.carrierKeys.join(", ")}] and no W3C traceparent header, so trace headers will not be attached.` + sentryHint);
    }
    return null;
  }
  if (respectSampling) {
    const parsed = parseTraceParent(traceContext.traceparent);
    if (parsed && !parsed.isSampled) return { traceparent: traceContext.traceparent };
  }
  return traceContext;
}
function normalizeTracePropagation(value) {
  return typeof value === "boolean" ? { enabled: value } : value;
}
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
var warnedTopLevelSchema = false;
function checkTopLevelSchemaOption(options) {
  if (warnedTopLevelSchema) return;
  if (typeof options !== "object" || options === null || !("schema" in options) || options.schema === void 0) return;
  warnedTopLevelSchema = true;
  console.warn(`@supabase/supabase-js: The "schema" option must be nested under "db", e.g. createClient(url, key, { db: { schema: 'myschema' } }). A top-level "schema" is ignored and queries go to the default schema.`);
}
function applySettingDefaults(options, defaults) {
  var _DEFAULT_GLOBAL_OPTIO, _globalOptions$header, _ref, _tracePropagationOpti, _ref2, _tracePropagationOpti2;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS$1, auth: DEFAULT_AUTH_OPTIONS$1, realtime: DEFAULT_REALTIME_OPTIONS$1, global: DEFAULT_GLOBAL_OPTIONS$1 } = defaults;
  const tracePropagationOptions = normalizeTracePropagation(options.tracePropagation);
  const DEFAULT_TRACE_PROPAGATION_OPTIONS$1 = normalizeTracePropagation(defaults.tracePropagation);
  const result = {
    db: _objectSpread23(_objectSpread23({}, DEFAULT_DB_OPTIONS$1), dbOptions),
    auth: _objectSpread23(_objectSpread23({}, DEFAULT_AUTH_OPTIONS$1), authOptions),
    realtime: _objectSpread23(_objectSpread23({}, DEFAULT_REALTIME_OPTIONS$1), realtimeOptions),
    storage: {},
    global: _objectSpread23(_objectSpread23(_objectSpread23({}, DEFAULT_GLOBAL_OPTIONS$1), globalOptions), {}, { headers: _objectSpread23(_objectSpread23({}, (_DEFAULT_GLOBAL_OPTIO = DEFAULT_GLOBAL_OPTIONS$1 === null || DEFAULT_GLOBAL_OPTIONS$1 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS$1.headers) !== null && _DEFAULT_GLOBAL_OPTIO !== void 0 ? _DEFAULT_GLOBAL_OPTIO : {}), (_globalOptions$header = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _globalOptions$header !== void 0 ? _globalOptions$header : {}) }),
    tracePropagation: {
      enabled: (_ref = (_tracePropagationOpti = tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.enabled) !== null && _tracePropagationOpti !== void 0 ? _tracePropagationOpti : DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === null || DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === void 0 ? void 0 : DEFAULT_TRACE_PROPAGATION_OPTIONS$1.enabled) !== null && _ref !== void 0 ? _ref : false,
      respectSamplingDecision: (_ref2 = (_tracePropagationOpti2 = tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.respectSamplingDecision) !== null && _tracePropagationOpti2 !== void 0 ? _tracePropagationOpti2 : DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === null || DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === void 0 ? void 0 : DEFAULT_TRACE_PROPAGATION_OPTIONS$1.respectSamplingDecision) !== null && _ref2 !== void 0 ? _ref2 : true
    },
    accessToken: async () => ""
  };
  if (options.accessToken) result.accessToken = options.accessToken;
  else delete result.accessToken;
  return result;
}
function validateSupabaseUrl(supabaseUrl) {
  const trimmedUrl = supabaseUrl === null || supabaseUrl === void 0 ? void 0 : supabaseUrl.trim();
  if (!trimmedUrl) throw new Error("supabaseUrl is required.");
  if (!trimmedUrl.match(/^https?:\/\//i)) throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
  try {
    return new URL(ensureTrailingSlash(trimmedUrl));
  } catch (_unused) {
    throw Error("Invalid supabaseUrl: Provided URL is malformed.");
  }
}
var SupabaseAuthClient = class extends AuthClient_default {
  constructor(options) {
    super(options);
  }
};
var SupabaseClient = class {
  /**
  * Create a new client for use in the browser.
  *
  * @category Initializing
  *
  * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
  * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
  * @param options Optional configuration for the client:
  * - `db.schema` — You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
  * - `auth.autoRefreshToken` — Set to `true` if you want to automatically refresh the token before expiring.
  * - `auth.persistSession` — Set to `true` if you want to automatically save the user session into local storage.
  * - `auth.detectSessionInUrl` — Set to `true` if you want to automatically detect OAuth grants in the URL and sign in the user.
  * - `realtime` — Options passed along to the realtime-js constructor.
  * - `storage` — Options passed along to the storage-js constructor.
  * - `global.fetch` — A custom fetch implementation.
  * - `global.headers` — Any additional headers to send with each network request.
  *
  * @example Creating a client
  * ```js
  * import { createClient } from '@supabase/supabase-js'
  *
  * // Create a single supabase client for interacting with your database
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  * ```
  *
  * @example With a custom domain
  * ```js
  * import { createClient } from '@supabase/supabase-js'
  *
  * // Use a custom domain as the supabase URL
  * const supabase = createClient('https://my-custom-domain.com', 'your-publishable-key')
  * ```
  *
  * @example With additional parameters
  * ```js
  * import { createClient } from '@supabase/supabase-js'
  *
  * const options = {
  *   db: {
  *     schema: 'public',
  *   },
  *   auth: {
  *     autoRefreshToken: true,
  *     persistSession: true,
  *     detectSessionInUrl: true
  *   },
  *   global: {
  *     headers: { 'x-my-custom-header': 'my-app-name' },
  *   },
  * }
  * const supabase = createClient("https://xyzcompany.supabase.co", "your-publishable-key", options)
  * ```
  *
  * @exampleDescription With custom schemas
  * By default the API server points to the `public` schema. You can enable other database schemas within the Dashboard.
  * Go to [Settings > API > Exposed schemas](/dashboard/project/_/settings/api) and add the schema which you want to expose to the API.
  *
  * Note: each client connection can only access a single schema, so the code above can access the `other_schema` schema but cannot access the `public` schema.
  *
  * @example With custom schemas
  * ```js
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key', {
  *   // Provide a custom schema. Defaults to "public".
  *   db: { schema: 'other_schema' }
  * })
  * ```
  *
  * @exampleDescription Custom fetch implementation
  * `supabase-js` uses the runtime's global `fetch` to make HTTP requests,
  * but an alternative `fetch` implementation can be provided as an option.
  * This is useful in environments where the global `fetch` is unavailable or where you want to customize request behavior.
  *
  * @example Custom fetch implementation
  * ```js
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key', {
  *   global: { fetch: fetch.bind(globalThis) }
  * })
  * ```
  *
  * @exampleDescription React Native options with AsyncStorage
  * For React Native we recommend using `AsyncStorage` as the storage implementation for Supabase Auth.
  *
  * @example React Native options with AsyncStorage
  * ```js
  * import 'react-native-url-polyfill/auto'
  * import { createClient } from '@supabase/supabase-js'
  * import AsyncStorage from "@react-native-async-storage/async-storage";
  *
  * const supabase = createClient("https://xyzcompany.supabase.co", "your-publishable-key", {
  *   auth: {
  *     storage: AsyncStorage,
  *     autoRefreshToken: true,
  *     persistSession: true,
  *     detectSessionInUrl: false,
  *   },
  * });
  * ```
  *
  * @exampleDescription React Native options with Expo SecureStore
  * If you wish to encrypt the user's session information, you can use `aes-js` and store the encryption key in Expo SecureStore.
  * The `aes-js` library, a reputable JavaScript-only implementation of the AES encryption algorithm in CTR mode.
  * A new 256-bit encryption key is generated using the `react-native-get-random-values` library.
  * This key is stored inside Expo's SecureStore, while the value is encrypted and placed inside AsyncStorage.
  *
  * Please make sure that:
  * - You keep the `expo-secure-store`, `aes-js` and `react-native-get-random-values` libraries up-to-date.
  * - Choose the correct [`SecureStoreOptions`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestoreoptions) for your app's needs.
  *   E.g. [`SecureStore.WHEN_UNLOCKED`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestorewhen_unlocked) regulates when the data can be accessed.
  * - Carefully consider optimizations or other modifications to the above example, as those can lead to introducing subtle security vulnerabilities.
  *
  * @example React Native options with Expo SecureStore
  * ```ts
  * import 'react-native-url-polyfill/auto'
  * import { createClient } from '@supabase/supabase-js'
  * import AsyncStorage from '@react-native-async-storage/async-storage';
  * import * as SecureStore from 'expo-secure-store';
  * import * as aesjs from 'aes-js';
  * import 'react-native-get-random-values';
  *
  * // As Expo's SecureStore does not support values larger than 2048
  * // bytes, an AES-256 key is generated and stored in SecureStore, while
  * // it is used to encrypt/decrypt values stored in AsyncStorage.
  * class LargeSecureStore {
  *   private async _encrypt(key: string, value: string) {
  *     const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
  *
  *     const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
  *     const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
  *
  *     await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));
  *
  *     return aesjs.utils.hex.fromBytes(encryptedBytes);
  *   }
  *
  *   private async _decrypt(key: string, value: string) {
  *     const encryptionKeyHex = await SecureStore.getItemAsync(key);
  *     if (!encryptionKeyHex) {
  *       return encryptionKeyHex;
  *     }
  *
  *     const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
  *     const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
  *
  *     return aesjs.utils.utf8.fromBytes(decryptedBytes);
  *   }
  *
  *   async getItem(key: string) {
  *     const encrypted = await AsyncStorage.getItem(key);
  *     if (!encrypted) { return encrypted; }
  *
  *     return await this._decrypt(key, encrypted);
  *   }
  *
  *   async removeItem(key: string) {
  *     await AsyncStorage.removeItem(key);
  *     await SecureStore.deleteItemAsync(key);
  *   }
  *
  *   async setItem(key: string, value: string) {
  *     const encrypted = await this._encrypt(key, value);
  *
  *     await AsyncStorage.setItem(key, encrypted);
  *   }
  * }
  *
  * const supabase = createClient("https://xyzcompany.supabase.co", "your-publishable-key", {
  *   auth: {
  *     storage: new LargeSecureStore(),
  *     autoRefreshToken: true,
  *     persistSession: true,
  *     detectSessionInUrl: false,
  *   },
  * });
  * ```
  *
  * @example With a database query
  * ```ts
  * import { createClient } from '@supabase/supabase-js'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
  *
  * const { data } = await supabase.from('profiles').select('*')
  * ```
  *
  * @exampleDescription With OpenTelemetry tracing
  * Opt in to W3C trace context propagation so the `trace_id` from your
  * client-side spans is attached to Supabase requests and appears in API
  * Gateway and Edge Function logs. Requires `@opentelemetry/api` to be
  * installed in your application and the tracing runtime to be loaded via
  * `import '@supabase/supabase-js/tracing'`. See [Tracing with the JS SDK](https://supabase.com/docs/guides/telemetry/client-side-tracing).
  *
  * @example With OpenTelemetry tracing
  * ```ts
  * import '@supabase/supabase-js/tracing'
  * import { createClient } from '@supabase/supabase-js'
  * import { trace } from '@opentelemetry/api'
  *
  * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key', {
  *   tracePropagation: true,
  * })
  *
  * const tracer = trace.getTracer('my-app')
  *
  * await tracer.startActiveSpan('fetch-users', async (span) => {
  *   // Outgoing request carries the active trace context.
  *   const { data, error } = await supabase.from('users').select('*')
  *   span.end()
  * })
  * ```
  */
  constructor(supabaseUrl, supabaseKey, options) {
    var _settings$auth$storag, _settings$global$head;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    const baseUrl = validateSupabaseUrl(supabaseUrl);
    if (!supabaseKey) throw new Error("supabaseKey is required.");
    checkApiKeyFormat(supabaseKey);
    checkTopLevelSchemaOption(options);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: _objectSpread23(_objectSpread23({}, DEFAULT_AUTH_OPTIONS), {}, { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS,
      tracePropagation: DEFAULT_TRACE_PROPAGATION_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.settings = settings;
    this.storageKey = (_settings$auth$storag = settings.auth.storageKey) !== null && _settings$auth$storag !== void 0 ? _settings$auth$storag : "";
    this.headers = (_settings$global$head = settings.global.headers) !== null && _settings$global$head !== void 0 ? _settings$global$head : {};
    if (!settings.accessToken) {
      var _settings$auth;
      this.auth = this._initSupabaseAuthClient((_settings$auth = settings.auth) !== null && _settings$auth !== void 0 ? _settings$auth : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, { get: (_, prop) => {
        throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
      } });
    }
    this.fetch = fetchWithAuth(supabaseKey, supabaseUrl, this._getSessionToken.bind(this), settings.global.fetch, settings.tracePropagation);
    this.functionsFetch = fetchWithAuth(supabaseKey, supabaseUrl, this._getSessionToken.bind(this), settings.global.fetch, settings.tracePropagation, { omitApiKeyAsBearer: true });
    this.realtime = this._initRealtimeClient(_objectSpread23({
      headers: this.headers,
      accessToken: this._getAccessToken.bind(this),
      fetch: this.fetch
    }, settings.realtime));
    if (this.accessToken) Promise.resolve(this.accessToken()).then((token) => this.realtime.setAuth(token)).catch((e) => console.warn("Failed to set initial Realtime auth token:", e));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch,
      timeout: settings.db.timeout,
      urlLengthLimit: settings.db.urlLengthLimit,
      retry: settings.db.retry
    });
    this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
    if (!settings.accessToken) this._listenForAuthEvents();
  }
  /**
  * Supabase Functions allows you to deploy and invoke edge functions.
  */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.functionsFetch
    });
  }
  /**
  * Perform a query on a table or a view.
  *
  * @param relation - The table or view name to query
  */
  from(relation) {
    return this.rest.from(relation);
  }
  /**
  * Select a schema to query or perform an function (rpc) call.
  *
  * The schema needs to be on the list of exposed schemas inside Supabase.
  *
  * @param schema - The schema to query
  */
  schema(schema) {
    return this.rest.schema(schema);
  }
  /**
  * Fetch the OpenAPI description PostgREST publishes for this client's schema.
  *
  * The document lists only the tables, views and functions the caller's role
  * holds privileges on. The request carries the same `apikey` and
  * `Authorization` headers as every other query, so the description is scoped
  * to the signed-in user. Call `.schema()` first to describe a schema other
  * than the client default.
  *
  * @example
  * ```ts
  * const { data, error } = await supabase.getOpenApiSpec()
  * ```
  */
  getOpenApiSpec() {
    return this.rest.getOpenApiSpec();
  }
  /**
  * Perform a function call.
  *
  * @param fn - The function name to call
  * @param args - The arguments to pass to the function call
  * @param options - Named parameters
  * @param options.head - When set to `true`, `data` will not be returned.
  * Useful if you only need the count.
  * @param options.get - When set to `true`, the function will be called with
  * read-only access mode.
  * @param options.count - Count algorithm to use to count rows returned by the
  * function. Only applicable for [set-returning
  * functions](https://www.postgresql.org/docs/current/functions-srf.html).
  *
  * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
  * hood.
  *
  * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
  * statistics under the hood.
  *
  * `"estimated"`: Uses exact count for low numbers and planned count for high
  * numbers.
  */
  rpc(fn, args = {}, options = {
    head: false,
    get: false,
    count: void 0
  }) {
    return this.rest.rpc(fn, args, options);
  }
  /**
  * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
  *
  * @param {string} name - The name of the Realtime channel.
  * @param {Object} opts - The options to pass to the Realtime channel.
  *
  * @category Realtime
  */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
  * Returns all Realtime channels.
  *
  * @category Realtime
  *
  * @example Get all channels
  * ```js
  * const channels = supabase.getChannels()
  * ```
  */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
  * Unsubscribes and removes Realtime channel from Realtime client.
  *
  * @param {RealtimeChannel} channel - The name of the Realtime channel.
  *
  *
  * @category Realtime
  *
  * @remarks
  * - Removing a channel is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.
  *
  * @example Removes a channel
  * ```js
  * supabase.removeChannel(myChannel)
  * ```
  */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
  * Unsubscribes and removes all Realtime channels from Realtime client.
  *
  * @category Realtime
  *
  * @remarks
  * - Removing channels is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.
  *
  * @example Remove all channels
  * ```js
  * supabase.removeAllChannels()
  * ```
  */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  /**
  * The raw session token — the custom `accessToken` result or the signed-in user's JWT —
  * or `null` when there is no session. Unlike {@link _getAccessToken} it does not fall back
  * to `supabaseKey`, so callers can distinguish "no session" from "has session".
  */
  async _getSessionToken() {
    var _this = this;
    var _data$session$access_, _data$session;
    if (_this.accessToken) return await _this.accessToken();
    const { data } = await _this.auth.getSession();
    return (_data$session$access_ = (_data$session = data.session) === null || _data$session === void 0 ? void 0 : _data$session.access_token) !== null && _data$session$access_ !== void 0 ? _data$session$access_ : null;
  }
  async _getAccessToken() {
    var _this2 = this;
    var _await$this$_getSessi;
    return (_await$this$_getSessi = await _this2._getSessionToken()) !== null && _await$this$_getSessi !== void 0 ? _await$this$_getSessi : _this2.supabaseKey;
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, userStorage, storageKey, flowType, lock, debug, throwOnError, experimental, lockAcquireTimeout, skipAutoInitialize }, headers, fetch$1) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: _objectSpread23(_objectSpread23({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      userStorage,
      flowType,
      lock,
      debug,
      throwOnError,
      experimental,
      fetch: fetch$1,
      lockAcquireTimeout,
      skipAutoInitialize,
      hasCustomAuthorizationHeader: Object.keys(this.headers).some((key) => key.toLowerCase() === "authorization")
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, _objectSpread23(_objectSpread23({}, options), {}, { params: _objectSpread23(_objectSpread23({}, { apikey: this.supabaseKey }), options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    return this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN" || event === "INITIAL_SESSION") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
      this.realtime.setAuth(token);
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE") this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
};
var createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
function shouldShowDeprecationWarning() {
  if (typeof window !== "undefined" || globalThis["Deno"] !== void 0) return false;
  const _process = globalThis["process"];
  if (!_process) return false;
  const processVersion = _process["version"];
  if (processVersion === void 0 || processVersion === null) return false;
  const versionMatch = processVersion.match(/^v(\d+)\./);
  if (!versionMatch) return false;
  return parseInt(versionMatch[1], 10) <= 20;
}
if (shouldShowDeprecationWarning()) console.warn("\u26A0\uFE0F  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715");

// src/config.js
var SUPABASE_URL = "https://zvipbuytpdoyglbkzsyb.supabase.co";
var SUPABASE_KEY = "sb_publishable__r9RW0Vw6SuBSq4Ny3nhvA_toeO1keX";

// src/entry.js
var TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTkxMGM5MjljYWM2NzE2MjdiZGExMTViZTU1MWE5NiIsIm5iZiI6MTc3ODQwNDU5Ny41NCwic3ViIjoiNmEwMDRjZjVlYzNjZGI4Y2E3Nzk5Y2I1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.694vsGX8gVIfYTbirJky1_KV48eiweqUBMca5nyT7TM";
var TMDB_BASE = "https://api.themoviedb.org/3";
var LANG = "es-ES";
var REGION = "ES";
var PROFILE_COVER = "/cover.jpg";
document.documentElement.style.setProperty("--profile-cover-image", 'url("' + PROFILE_COVER + '")');
var CATALOG = JSON.parse(document.getElementById("catalog-data").textContent);
var CACHE_KEY = "plano-tmdb-cache-v2";
var SECTION_KEY = "plano-tmdb-sections-v2";
var TTL = 6 * 60 * 60 * 1e3;
var aliases = /* @__PURE__ */ new Map();
function validId(id) {
  return typeof id === "string" && /^(tt\d+|tmdb:(movie|tv):[1-9]\d*)$/.test(id);
}
function canonicalId(id) {
  return aliases.get(id) || id;
}
for (const m of CATALOG) {
  const match = m.tmdbUrl?.match(/\/(movie|tv)\/(\d+)/);
  if (match) {
    const old = m.id;
    m.id = `tmdb:${match[1]}:${match[2]}`;
    m.imdbId = old;
    aliases.set(old, m.id);
  }
}
var BASE_IDS = new Set(CATALOG.map((m) => m.id));
var remoteResults = [];
var remotePage = 1;
var remoteTotal = 1;
var apiMode = "idle";
var apiError = "";
var searchTimer = 0;
var searchGeneration = 0;
var activeSearch = null;
var detailGeneration = 0;
var detailController = null;
var selectedGenre = "";
var sections = {};
var sectionLoading = /* @__PURE__ */ new Set();
var sectionErrors = {};
var genres = { movie: [], tv: [] };
var recentSearches = [];
function safePoster(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === "image.tmdb.org" ? u.href : "";
  } catch {
    return "";
  }
}
function cleanTitle(m) {
  if (!m || !validId(m.id) || !["movie", "series", "tv"].includes(m.type)) return null;
  const id = canonicalId(m.id);
  return { id, title: String(m.title || "T\xEDtulo guardado").slice(0, 200), year: String(m.year || "").slice(0, 15), type: m.type === "tv" ? "series" : m.type, poster: safePoster(m.poster), cast: String(m.cast || "").slice(0, 1e3), overview: String(m.overview || "").slice(0, 6e3), genre: String(m.genre || "").slice(0, 300), tmdbRating: Number(m.tmdbRating) || 0, imdbId: /^tt\d+$/.test(m.imdbId || "") ? m.imdbId : /^tt/.test(m.id) ? m.id : "", releaseDate: /^\d{4}-\d{2}-\d{2}$/.test(m.releaseDate || "") ? m.releaseDate : "", language: m.language === "en-US" ? "en-US" : "es-ES", providers: m.providers && typeof m.providers === "object" ? m.providers : null, trailer: typeof m.trailer === "string" && /^https:\/\/(www\.youtube\.com\/watch\?v=[\w-]+|vimeo\.com\/\d+)$/.test(m.trailer) ? m.trailer : "", detailAt: Number(m.detailAt) || 0 };
}
try {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  const legacy = cached || JSON.parse(localStorage.getItem("plano-omdb-cache-v1") || "[]");
  for (const m of (Array.isArray(legacy) ? legacy : []).map(cleanTitle).filter(Boolean)) {
    if (m.imdbId && m.id.startsWith("tmdb:")) aliases.set(m.imdbId, m.id);
    const i = CATALOG.findIndex((x) => x.id === m.id);
    if (i < 0) CATALOG.push(m);
    else CATALOG[i] = { ...CATALOG[i], ...m, poster: CATALOG[i].poster };
  }
  sections = JSON.parse(localStorage.getItem(SECTION_KEY) || "{}") || {};
  recentSearches = JSON.parse(localStorage.getItem("plano-searches-v1") || "[]");
  if (!Array.isArray(recentSearches)) recentSearches = [];
} catch {
}
function persistCatalog() {
  try {
    const savedIds = /* @__PURE__ */ new Set([...state.entries.map((e) => e.id), ...state.favorites]);
    const keep = /* @__PURE__ */ new Set([...CATALOG.slice(-250).map((m) => m.id), ...savedIds, ...BASE_IDS]);
    localStorage.setItem(CACHE_KEY, JSON.stringify(CATALOG.filter((m) => keep.has(m.id)).map((m) => ({ ...m, poster: BASE_IDS.has(m.id) ? "" : m.poster }))));
  } catch {
  }
}
function cacheRemote(items) {
  for (const m of items) {
    const id = canonicalId(m.id), i = CATALOG.findIndex((x) => x.id === id);
    if (i < 0) CATALOG.push({ ...m, id });
    else CATALOG[i] = { ...CATALOG[i], ...m, id, poster: BASE_IDS.has(id) ? CATALOG[i].poster : m.poster || CATALOG[i].poster };
  }
  persistCatalog();
}
function fromTMDB(d, type = d.media_type) {
  if (!["movie", "tv"].includes(type) || !Number.isInteger(d.id)) return null;
  const date = d.release_date || d.first_air_date || "";
  return { id: `tmdb:${type}:${d.id}`, title: d.title || d.name || "Sin t\xEDtulo", year: date.slice(0, 4), type: type === "tv" ? "series" : "movie", poster: d.poster_path ? "https://image.tmdb.org/t/p/w500" + d.poster_path : "", overview: d.overview || "", releaseDate: date, tmdbRating: Number(d.vote_average) || 0, ...d.genres ? { genre: d.genres.map((g) => g.name).join(" \xB7 ") } : {}, ...d.credits ? { cast: (d.credits.cast || []).slice(0, 6).map((p) => p.name).join(", ") } : {} };
}
async function requestTMDB(path, params = {}, signal) {
  const url = new URL(TMDB_BASE.replace(/\/$/, "") + path);
  for (const [k, v] of Object.entries({ language: LANG, ...params })) url.searchParams.set(k, String(v));
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15e3);
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener("abort", abort, { once: true });
  try {
    const r = await fetch(url, { headers: { Authorization: "Bearer " + TMDB_TOKEN, accept: "application/json" }, signal: controller.signal });
    if (!r.ok) throw Error(r.status === 401 || r.status === 403 ? "TMDB no acepta el token. Revisa TMDB_TOKEN." : r.status === 429 ? "L\xEDmite de peticiones de TMDB. Espera un momento y reintenta." : r.status === 404 ? "No hay ficha disponible para este t\xEDtulo." : "TMDB no responde correctamente (" + r.status + ").");
    return await r.json();
  } catch (e) {
    if (e.name === "AbortError" && !timedOut) throw e;
    if (e instanceof TypeError || timedOut) throw Error(navigator.onLine === false ? "Sin conexi\xF3n. Puedes seguir usando tu diario y las fichas guardadas." : "No se pudo conectar con TMDB. Revisa Internet y vuelve a intentarlo.");
    throw e;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
function rememberSearch(q) {
  recentSearches = [q, ...recentSearches.filter((x) => x !== q)].slice(0, 8);
  try {
    localStorage.setItem("plano-searches-v1", JSON.stringify(recentSearches));
  } catch {
  }
}
async function fetchCatalog(next = 1) {
  clearTimeout(searchTimer);
  const q = query.trim(), generation = ++searchGeneration;
  activeSearch?.abort();
  activeSearch = new AbortController();
  apiMode = "loading";
  apiError = "";
  if (next === 1) remoteResults = [];
  render();
  try {
    let data, items;
    if (q) {
      data = await requestTMDB("/search/multi", { query: q, page: next, include_adult: false }, activeSearch.signal);
      items = (data.results || []).map((d) => fromTMDB(d)).filter(Boolean);
    } else if (selectedGenre) {
      const [type, id] = selectedGenre.split(":");
      data = await requestTMDB("/discover/" + type, { with_genres: id, page: next, include_adult: false, sort_by: "popularity.desc", ...type === "movie" ? { region: REGION } : {} }, activeSearch.signal);
      items = (data.results || []).map((d) => fromTMDB(d, type)).filter(Boolean);
    } else {
      const cached = sections.trending;
      if (next === 1 && cached && Array.isArray(cached.items) && Date.now() - cached.at < TTL) {
        data = { total_pages: cached.totalPages || 1 };
        items = cached.items;
      } else {
        data = await requestTMDB("/trending/all/week", { page: next }, activeSearch.signal);
        items = (data.results || []).map((d) => fromTMDB(d)).filter(Boolean);
      }
    }
    if (generation !== searchGeneration) return;
    cacheRemote(items);
    remotePage = next;
    remoteTotal = Math.min(500, data.total_pages || 1);
    remoteResults = [...new Map((next === 1 ? items : [...remoteResults, ...items]).map((m) => [m.id, m])).values()];
    apiMode = "ready";
    if (q) rememberSearch(q);
    render();
  } catch (e) {
    if (generation !== searchGeneration || e.name === "AbortError") return;
    apiMode = "error";
    apiError = e.message;
    if (!remoteResults.length) {
      const ql = q.toLocaleLowerCase("es");
      remoteResults = CATALOG.filter((m) => !ql || m.title.toLocaleLowerCase("es").includes(ql));
    }
    render();
  }
}
function searchRemote() {
  clearTimeout(searchTimer);
  activeSearch?.abort();
  ++searchGeneration;
  selectedGenre = "";
  apiMode = "loading";
  apiError = "";
  remoteResults = [];
  render();
  searchTimer = setTimeout(() => fetchCatalog(1), 350);
}
function sectionConfig(name) {
  switch (name) {
    case "trending":
      return ["/trending/all/week", {}, null];
    case "cinema":
      return ["/movie/now_playing", { region: REGION }, "movie"];
    case "upcomingMovies":
      return ["/discover/movie", { "primary_release_date.gte": dateISO(), region: REGION, sort_by: "popularity.desc", include_adult: false }, "movie"];
    case "upcomingTV":
      return ["/discover/tv", { "first_air_date.gte": dateISO(), sort_by: "popularity.desc", include_adult: false }, "tv"];
  }
}
async function loadSection(name, force = false) {
  const cache = sections[name];
  if (!force && cache && Array.isArray(cache.items) && Date.now() - cache.at < TTL) {
    cacheRemote(cache.items);
    return;
  }
  if (sectionLoading.has(name)) return;
  sectionLoading.add(name);
  delete sectionErrors[name];
  render();
  try {
    const [path, params, type] = sectionConfig(name), d = await requestTMDB(path, params), items = (d.results || []).map((x) => fromTMDB(x, type || x.media_type)).filter(Boolean);
    sections[name] = { at: Date.now(), items, totalPages: d.total_pages || 1 };
    cacheRemote(items);
    try {
      localStorage.setItem(SECTION_KEY, JSON.stringify(sections));
    } catch {
    }
  } catch (e) {
    sectionErrors[name] = e.message;
  } finally {
    sectionLoading.delete(name);
    if (page === "home" || page === "explore") render();
  }
}
async function loadHome(force = false) {
  await Promise.allSettled(["trending", "cinema", "upcomingMovies", "upcomingTV"].map((n) => loadSection(n, force)));
}
async function loadGenres() {
  try {
    const cached = sections.genres;
    if (cached && Date.now() - cached.at < TTL) {
      genres = cached.items;
      return;
    }
    const [m, t] = await Promise.all([requestTMDB("/genre/movie/list"), requestTMDB("/genre/tv/list")]);
    genres = { movie: m.genres || [], tv: t.genres || [] };
    sections.genres = { at: Date.now(), items: genres };
    try {
      localStorage.setItem(SECTION_KEY, JSON.stringify(sections));
    } catch {
    }
    if (page === "explore") render();
  } catch (e) {
    if (page === "explore") {
      apiError = e.message;
      render();
    }
  }
}
async function resolveTitle(m, signal) {
  if (m.id.startsWith("tmdb:")) return m.id;
  const d = await requestTMDB("/find/" + m.id, { external_source: "imdb_id" }, signal), found = d.movie_results?.[0] || d.tv_results?.[0];
  if (!found) throw Error("No se encontr\xF3 la correspondencia de este t\xEDtulo en TMDB. Tu valoraci\xF3n se conserva.");
  const type = d.movie_results?.length ? "movie" : "tv", next = fromTMDB(found, type);
  next.imdbId = m.id;
  aliases.set(m.id, next.id);
  state.entries = normalizeEntries(state.entries).entries;
  state.favorites = [...new Set(state.favorites.map(canonicalId))];
  CATALOG = CATALOG.filter((x) => x.id !== m.id);
  cacheRemote([next]);
  persist();
  return next.id;
}
function tmdbRatingMarkup(value) {
  const n = Number(value);
  return n > 0 && n <= 10 ? '<span aria-hidden="true">\u2605</span><strong>' + n.toFixed(1) + " / 10</strong><small>TMDB</small>" : "<small>Nota TMDB no disponible</small>";
}
function providerMarkup(data) {
  const groups = [["flatrate", "Streaming"], ["free", "Gratis"], ["ads", "Con anuncios"], ["rent", "Alquiler"], ["buy", "Compra"]];
  const rows = groups.filter(([key]) => Array.isArray(data?.[key]) && data[key].length).map(([key, label]) => `<h4>${label}</h4><div class="providers">${data[key].map((p) => `<div class="provider">${p.logo_path ? `<img src="https://image.tmdb.org/t/p/w92${esc(p.logo_path)}" alt="" loading="lazy">` : ""}<span>${esc(p.provider_name)}</span></div>`).join("")}</div>`).join("");
  const link = typeof data?.link === "string" && /^https:\/\/www.themoviedb.org\//.test(data.link) ? data.link : "";
  return `<h3>D\xF3nde verla \xB7 ${esc(REGION)}</h3>${rows || "<p>No hay disponibilidad informada para esta regi\xF3n.</p>"}${link ? `<a class="text-button" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Consultar opciones \u2197</a>` : ""}<p class="film-credit">Disponibilidad facilitada por <a href="https://www.justwatch.com/es" target="_blank" rel="noopener noreferrer">JustWatch</a>. Puede cambiar.</p>`;
}
function paintDetail(m, message = "") {
  if (!$("#detail").open) return;
  $("#dialog-title").textContent = m.title;
  $(".film-hero h3").textContent = m.title;
  $("#detail-plot").textContent = m.overview || "Sin sinopsis disponible.";
  $("#plot-language").textContent = message || (m.language === "en-US" ? "Sinopsis en ingl\xE9s: TMDB no dispone de versi\xF3n en castellano." : "Sinopsis de TMDB \xB7 castellano");
  $("#detail-genres").textContent = m.genre || "G\xE9neros no disponibles";
  $("#detail-cast").textContent = m.cast || "Reparto no disponible";
  $("#detail-rating").innerHTML = tmdbRatingMarkup(m.tmdbRating);
  $("#detail-providers").innerHTML = providerMarkup(m.providers);
  $("#detail-trailer").innerHTML = m.trailer ? `<a class="button secondary" href="${esc(m.trailer)}" target="_blank" rel="noopener noreferrer">Ver tr\xE1iler \u2197</a>` : '<p class="muted">Tr\xE1iler no disponible.</p>';
  $("#detail-plot").classList.remove("skeleton");
  ["#detail-genres", "#detail-cast"].forEach((sel) => $(sel)?.classList.remove("skeleton-text"));
  $("#detail-retry").hidden = !message;
}
async function loadDetail(m) {
  const generation = detailGeneration;
  detailController?.abort();
  detailController = new AbortController();
  const signal = detailController.signal;
  if (m.detailAt) paintDetail(m);
  if (m.detailAt && Date.now() - m.detailAt < TTL) return;
  try {
    const id = await resolveTitle(m, signal);
    if (generation !== detailGeneration) return;
    $("#detail").dataset.id = id;
    $("#film-form").dataset.id = id;
    const [, type, num] = id.split(":");
    const d = await requestTMDB("/" + type + "/" + num, { append_to_response: "credits,external_ids,watch/providers,videos" }, signal);
    let next = { ...fromTMDB(d, type), imdbId: d.external_ids?.imdb_id || m.imdbId || "", providers: d["watch/providers"]?.results?.[REGION] || null, language: LANG, detailAt: Date.now() };
    if (!next.overview) {
      try {
        const en = await requestTMDB("/" + type + "/" + num, { language: "en-US" }, signal);
        next.overview = en.overview || "";
        next.language = "en-US";
      } catch (e) {
        if (e.name === "AbortError") throw e;
      }
    }
    let v = (d.videos?.results || []).find((v2) => v2.type === "Trailer" && ["YouTube", "Vimeo"].includes(v2.site));
    if (!v) {
      try {
        const fallback = await requestTMDB("/" + type + "/" + num + "/videos", { language: "en-US" }, signal);
        v = (fallback.results || []).find((v2) => v2.type === "Trailer" && ["YouTube", "Vimeo"].includes(v2.site));
      } catch (e) {
        if (e.name === "AbortError") throw e;
      }
    }
    next.trailer = v ? (v.site === "YouTube" ? "https://www.youtube.com/watch?v=" : "https://vimeo.com/") + encodeURIComponent(v.key) : "";
    cacheRemote([next]);
    if (generation !== detailGeneration || !$("#detail").open) return;
    paintDetail(next);
  } catch (e) {
    if (generation !== detailGeneration || e.name === "AbortError") return;
    paintDetail(m, e.message);
  }
}
function switchDetailTab(tab) {
  dismissToast();
  if (!["info", "rating", "memory"].includes(tab)) return;
  document.querySelectorAll("[data-detail-tab]").forEach((b) => {
    const active = b.dataset.detailTab === tab;
    b.setAttribute("aria-selected", String(active));
    b.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll("[data-detail-panel]").forEach((panel) => panel.hidden = panel.dataset.detailPanel !== tab);
  $("#detail").dataset.tab = tab;
  $("#film-save").hidden = tab !== "rating";
  $("#film-start").hidden = tab !== "info";
  $("#detail-scroll").scrollTop = 0;
}
var KEY = "plano-interactive-demo-v1";
var LABELS = { watched: "Vista", watching: "Viendo", planned: "Pendiente" };
var EMOTIONS = ["Asombro", "Alegr\xEDa", "Nostalgia", "Tensi\xF3n", "Tristeza", "Inspiraci\xF3n"];
var GENRES = ["Ciencia ficci\xF3n", "Ciencia ficci\xF3n", "Misterio", "Ciencia ficci\xF3n", "Drama", "Misterio", "Ciencia ficci\xF3n", "Comedia", "Ciencia ficci\xF3n", "Comedia", "Comedia", "Drama"];
var ICONS = { close: '<path d="m6 6 12 12M18 6 6 18"/>', trash: '<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>', home: '<path d="m3 11 9-8 9 8v10H3Z"/><path d="M9 21v-7h6v7"/>', explore: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>', collection: '<path d="M5 4h14v17l-7-4-7 4Z"/>', social: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5"/>', stats: '<path d="M5 20V10m7 10V4m7 16v-7M2 21h20"/>', profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>' };
var NAV = [["home", "Inicio"], ["explore", "Buscar"], ["collection", "Diario"], ["social", "Amigos"], ["profile", "Perfil"]];
var $ = (s) => document.querySelector(s);
var esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
function dateISO(date = /* @__PURE__ */ new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
}
function daysAgo(n) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  return dateISO(d);
}
function seed() {
  return emptyState();
}
function validDate(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && (/* @__PURE__ */ new Date(v + "T12:00:00")).toISOString().slice(0, 10) === v;
}
function normalizeFavorites(list) {
  return [...new Set((Array.isArray(list) ? list : []).filter((id) => typeof id === "string").map(canonicalId))].filter((id) => CATALOG.some((m) => m.id === id)).slice(0, 3);
}
function normalizeEntries(rows) {
  if (!Array.isArray(rows) || rows.length > 1e4) throw Error("El archivo no contiene una colecci\xF3n v\xE1lida.");
  const found = /* @__PURE__ */ new Map();
  let skipped = 0;
  for (const r of rows) {
    if (!r || typeof r !== "object") {
      skipped++;
      continue;
    }
    const id = canonicalId(typeof r.id === "string" ? r.id : r.title?.id);
    if (validId(id) && !CATALOG.some((m) => m.id === id)) {
      const title = importTitle(r) || cleanTitle({ id, title: "T\xEDtulo guardado", type: id.includes(":tv:") ? "series" : "movie" });
      if (title) CATALOG.push(title);
    }
    if (!validId(id) || !Object.hasOwn(LABELS, r.status)) {
      skipped++;
      continue;
    }
    const rating = r.rating == null || r.rating === "" ? null : Number(r.rating);
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 10)) {
      skipped++;
      continue;
    }
    found.set(id, { id, status: r.status, rating, season: Math.max(1, Math.min(999, parseInt(r.season) || 1)), episode: Math.max(1, Math.min(9999, parseInt(r.episode) || 1)), review: String(r.review ?? "").slice(0, 3e3), watchedAt: validDate(r.watchedAt) ? r.watchedAt : "", companion: String(r.companion ?? "").slice(0, 100), emotions: Array.isArray(r.emotions) ? [...new Set(r.emotions.filter((e) => EMOTIONS.includes(e)))] : [] });
  }
  for (const e of found.values()) {
    if (CATALOG.find((m) => m.id === e.id)?.type !== "series") {
      delete e.season;
      delete e.episode;
    }
  }
  return { entries: [...found.values()], skipped };
}
var storageOK = true;
var state = emptyState();
var page = "home";
var filter = "all";
var query = "";
var feedMode = "all";
var friendId = "";
var friendTab = "diary";
var friendGeneration = 0;
var toastTimer;
function positionToast() {
  const t = $("#toast");
  if (t) {
    t.style.bottom = "";
    t.style.visibility = "";
  }
}
function dismissToast() {
  clearTimeout(toastTimer);
  const t = $("#toast");
  if (t) {
    motionCleanups.get(t)?.();
    t.classList.remove("plano-toast-in", "plano-toast-out");
    t.replaceChildren();
    t.style.bottom = "";
  }
}
document.addEventListener("pointerdown", (ev) => {
  if (!ev.target.closest("#toast")) dismissToast();
}, { capture: true, passive: true });
document.addEventListener("click", (ev) => {
  if (ev.detail === 0 && !ev.target.closest("#toast")) dismissToast();
}, true);
function toast(message, undo = null) {
  dismissToast();
  const t = $("#toast");
  ($("#detail").open ? $("#detail") : document.body).append(t);
  t.style.visibility = "";
  t.replaceChildren(document.createTextNode(message));
  if (undo) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Deshacer";
    b.onclick = () => {
      clearTimeout(toastTimer);
      t.replaceChildren();
      undo();
    };
    t.append(b);
  }
  positionToast();
  motionOnce(t, "plano-toast-in", 220);
  toastTimer = setTimeout(fadeToast, undo ? 4e3 : 2e3);
}
function entry(id) {
  return state.entries.find((e) => e.id === id);
}
function image(m, cls = "") {
  if (!m?.poster) return "";
  return `<img ${cls ? `class="${cls}"` : ""} src="${esc(m.poster)}" alt="Cartel de ${esc(m.title)}" loading="lazy" referrerpolicy="no-referrer">`;
}
function stats() {
  const watched = state.entries.filter((e) => e.status === "watched"), rated = watched.filter((e) => e.rating !== null);
  return { watched, rated, avg: rated.length ? (rated.reduce((a, e) => a + e.rating, 0) / rated.length).toFixed(1) : "\u2014" };
}
function weekly() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  const start = dateISO(d);
  return stats().watched.filter((e) => e.watchedAt >= start && e.watchedAt <= dateISO()).length;
}
function statusIcon(status) {
  const shape = { watched: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', watching: '<path d="M8 5.5v13l11-6.5Z" fill="currentColor" stroke="none"/>', planned: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.5"/>' }[status] || '<path d="M12 5v14M5 12h14"/>';
  return `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" fill="none" aria-hidden="true">${shape}</svg>`;
}
function quickLabel(e) {
  return e ? "Abrir ficha \xB7 " + LABELS[e.status] : "A\xF1adir a pendientes";
}
function posterTag(e) {
  if (!e) return "";
  if (e.status !== "watched") return LABELS[e.status];
  return [e.rating ? "\u2605 " + e.rating : "", e.emotions?.[0] ? esc(e.emotions[0]) : ""].filter(Boolean).join(" \xB7 ") || LABELS.watched;
}
function card(m) {
  if (BASE_IDS.has(m.id)) m = { ...m, poster: CATALOG.find((x) => x.id === m.id).poster };
  const e = entry(m.id);
  return `<article class="movie" data-card="${m.id}" style="${emotionStyle(e?.status === "planned" ? null : e)}"><div class="poster-wrap"><button class="poster" style="border-color:var(--emotion,var(--line))" data-film="${m.id}" data-title="${esc(m.title)}" aria-label="Abrir ${esc(m.title)}">${image(m)}<span class="poster-tag" ${e ? "" : "hidden"}>${posterTag(e)}</span></button><button type="button" class="poster-quick" data-quick="${m.id}" aria-label="${quickLabel(e)}"><span class="poster-plus">${statusIcon(e?.status)}</span></button></div><button class="movie-title" data-film="${m.id}">${esc(m.title)}</button><small>${esc(m.year)} <span aria-hidden="true">\xB7</span> ${m.type === "movie" ? "Pel\xEDcula" : "Serie"}</small></article>`;
}
function episodeAction(m) {
  const e = entry(m.id);
  return m.type === "series" && e?.status === "watching" ? `<div class="episode-action" data-progress="${m.id}"><small>S${e.season || 1}\xB7E${e.episode || 1}</small><button type="button" data-episode="${m.id}">+1 episodio</button></div>` : "";
}
function detailActions(m) {
  const e = entry(m.id);
  return `<div class="status-actions" id="detail-status-actions">${["planned", ...m.type === "series" ? ["watching"] : [], "watched"].map((status) => `<button type="button" data-set-status="${status}" aria-pressed="${e?.status === status}">${LABELS[status]}</button>`).join("")}</div><div id="detail-progress">${episodeAction(m)}</div>`;
}
function syncEntryUI(id) {
  const e = entry(id);
  document.querySelectorAll("[data-card]").forEach((node) => {
    if (node.dataset.card !== id) return;
    node.setAttribute("style", emotionStyle(e?.status === "planned" ? null : e));
    const b = node.querySelector("[data-quick]");
    b.setAttribute("aria-label", quickLabel(e));
    const mark = b.querySelector(".poster-plus"), before = mark.innerHTML;
    mark.innerHTML = statusIcon(e?.status);
    if (before !== mark.innerHTML && e) motionOnce(mark.querySelector("svg"), "plano-stamp", 260);
    const tag = node.querySelector(".poster-tag");
    tag.hidden = !e;
    tag.innerHTML = posterTag(e);
  });
  document.querySelectorAll("[data-progress]").forEach((node) => {
    if (node.dataset.progress === id) node.querySelector("small").textContent = `S${e?.season || 1}\xB7E${e?.episode || 1}`;
  });
  if ($("#detail").open && $("#detail").dataset.id === id) {
    document.querySelectorAll("[data-set-status]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setStatus === e?.status)));
    const m = CATALOG.find((m2) => m2.id === id);
    $("#detail-progress").innerHTML = episodeAction(m);
    $("#film-panel-rating").innerHTML = memoryEditor(m, e || { status: "watched", rating: null, review: "", watchedAt: "", companion: "", emotions: [] });
    emotionOrder = [...e?.emotions || []];
    updateEpisodeFields();
  }
}
function commitQuick(id, next, message) {
  const previous = entry(id), snapshot = previous ? JSON.parse(JSON.stringify(previous)) : null, index = state.entries.findIndex((e) => e.id === id);
  state.entries = state.entries.filter((e) => e.id !== id);
  state.entries.push(next);
  if (!persist()) {
    state.entries = state.entries.filter((e) => e.id !== id);
    if (snapshot) state.entries.splice(index, 0, snapshot);
    return;
  }
  syncEntryUI(id);
  toast(message, () => {
    const current = entry(id);
    if (JSON.stringify(current) !== JSON.stringify(next)) return;
    state.entries = state.entries.filter((e) => e.id !== id);
    if (snapshot) state.entries.splice(Math.min(index, state.entries.length), 0, snapshot);
    persist();
    syncEntryUI(id);
    toast("Cambio deshecho.");
  });
}
function savePending(id) {
  if (entry(id)?.status === "planned") return;
  const next = { id, status: "planned", rating: null, review: "", watchedAt: "", companion: "", emotions: [], ...entry(id) };
  next.status = "planned";
  if (CATALOG.find((m) => m.id === id)?.type !== "series") {
    delete next.season;
    delete next.episode;
  }
  commitQuick(id, next, "A\xF1adida a pendientes.");
}
function editStatus(id, status) {
  if (!$("#detail").open || $("#detail").dataset.id !== id) openFilmNow(id);
  const input = $("#film-form").querySelector(`[name="status"][value="${status}"]`);
  if (input) input.checked = true;
  updateEpisodeFields();
  switchDetailTab("rating");
}
function incrementEpisode(id) {
  const e = entry(id), m = CATALOG.find((m2) => m2.id === id);
  if (!e || m?.type !== "series" || e.status !== "watching") return;
  const next = { ...e, season: e.season || 1, episode: (e.episode || 1) + 1 };
  commitQuick(id, next, `S${next.season}\xB7E${next.episode} guardado.`);
  if (entry(id)?.episode === next.episode) document.querySelectorAll("[data-progress]").forEach((n) => {
    if (n.dataset.progress === id) motionRoll(n.querySelector("small"), `S${e.season || 1}\xB7E${e.episode || 1}`, `S${next.season}\xB7E${next.episode}`, 200);
  });
}
function tabs(options) {
  return `<div class="filters">${options.map(([key, label]) => `<button class="filter ${filter === key ? "active" : ""}" data-filter="${key}" aria-pressed="${filter === key}">${label}</button>`).join("")}</div>`;
}
function skeletons() {
  return `<div class="rail" aria-label="Cargando t\xEDtulos" aria-busy="true">${Array.from({ length: 6 }, () => '<div class="skeleton skeleton-poster"></div>').join("")}</div>`;
}
function releaseInfo(m) {
  if (!m.releaseDate) return "";
  const days = Math.ceil((Date.parse(m.releaseDate + "T00:00:00") - Date.parse(dateISO() + "T00:00:00")) / 864e5);
  return `<p class="release-date">${new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" }).format(/* @__PURE__ */ new Date(m.releaseDate + "T12:00:00"))} \xB7 ${days > 0 ? "Faltan " + days + " d\xEDas" : days === 0 ? "Hoy" : "Ya estrenada"}</p>`;
}
function continuingCard(m) {
  const e = entry(m.id), progress = m.type === "series" && e?.status === "watching" && Number.isInteger(e.season) && e.season > 0 && Number.isInteger(e.episode) && e.episode > 0 ? `<small class="episode-progress">S${e.season}\xB7E${e.episode}</small>` : "";
  return `<div class="continue-wrap"><button type="button" class="movie continue-card" data-film="${m.id}" aria-label="Abrir ficha de ${esc(m.title)}"><span class="poster" data-title="${esc(m.title)}">${image(m)}</span><span class="continue-copy"><span class="movie-title">${esc(m.title)}</span><small>${esc(m.year)} \xB7 ${m.type === "movie" ? "Pel\xEDcula" : "Serie"}</small><small class="continue-state">${esc(LABELS[e?.status] || "Viendo")}</small>${emotionLabel(e)}${progress ? '<progress class="continue-progress" aria-label="Serie en curso; total de episodios no disponible"></progress>' : ""}</span></button>${episodeAction(m)}</div>`;
}
function rail(title, items, upcoming = false, extra = "") {
  return `<section class="rail-section ${title === "Continuar viendo" ? "continue-rail" + (items.length <= 2 ? " continue-few" : "") : ""}"><div class="section-head"><h2>${title}</h2></div>${extra}${items.length ? `<div class="rail">${items.map((m) => `<div class="rail-item">${title === "Continuar viendo" && items.length <= 2 ? continuingCard(m) : card(m) + (title === "Continuar viendo" ? episodeAction(m) : "")}${title === "Para ver" ? `<button type="button" class="button secondary" data-mark-watched="${m.id}">Vista</button>` : ""}${upcoming ? releaseInfo(m) + `<button class="button secondary" data-pending="${m.id}" ${entry(m.id) ? "disabled" : ""}>${entry(m.id) ? "\u2713 En mi diario" : "+ Pendiente"}</button>` : ""}</div>`).join("")}</div>` : '<p class="muted">Todav\xEDa no hay t\xEDtulos en esta secci\xF3n.</p>'}</section>`;
}
function remoteRail(name, title, upcoming = false) {
  const s = sections[name];
  const extra = sectionErrors[name] ? `<p class="api-message" role="status">${esc(sectionErrors[name])}${s?.items?.length ? " Mostrando la \xFAltima copia guardada." : " No hay una copia guardada de esta secci\xF3n."}</p><button class="text-button" data-retry-section="${name}">Reintentar</button>` : "";
  if (sectionLoading.has(name) && !s) return `<section class="rail-section"><h2>${title}</h2>${skeletons()}</section>`;
  return rail(title, Array.isArray(s?.items) ? s.items : [], upcoming, extra);
}
var EMOTION_VARS = ["asombro", "alegria", "nostalgia", "tension", "tristeza", "inspiracion"];
var diaryEmotion = "Todas";
var diaryView = "list";
var calMonth = "";
var emotionOrder = [];
function emotionStyle(e) {
  const i = EMOTIONS.indexOf(typeof e === "string" ? e : e?.emotions?.[0]);
  return i < 0 ? "" : "--emotion:var(--emotion-" + EMOTION_VARS[i] + ")";
}
function emotionLabel(e) {
  const name = typeof e === "string" ? e : e?.emotions?.[0];
  return EMOTIONS.includes(name) ? `<span class="emotion-label" style="${emotionStyle(name)}"><i class="emotion-dot" aria-hidden="true"></i>${esc(name)}</span>` : "";
}
function shortDate(d) {
  return validDate(d) ? new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(/* @__PURE__ */ new Date(d + "T12:00:00")) : "Sin fecha";
}
function relativeDate(d) {
  return d === dateISO() ? "Hoy" : d === daysAgo(1) ? "Ayer" : shortDate(d);
}
function memoryOfDay() {
  const seen = state.entries.filter((e) => e.status === "watched"), today = dateISO(), now = /* @__PURE__ */ new Date(today + "T12:00:00");
  const anniversary = seen.filter((e) => validDate(e.watchedAt) && e.watchedAt < today && e.watchedAt.slice(5) === today.slice(5));
  const older = seen.filter((e) => validDate(e.watchedAt) && e.watchedAt < daysAgo(30) && (e.emotions?.length || e.review));
  older.sort((a, b) => (b.emotions?.length || 0) - (a.emotions?.length || 0) || Number(!!b.review) - Number(!!a.review));
  let pool = anniversary.length ? anniversary : older.length ? older.filter((e) => (e.emotions?.length || 0) === (older[0].emotions?.length || 0) && !!e.review === !!older[0].review) : [];
  let selected;
  if (pool.length) {
    pool.sort((a, b) => a.id.localeCompare(b.id));
    selected = pool[Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 864e5) % pool.length];
  } else selected = [...seen].filter((e) => e.emotions?.length).sort((a, b) => b.watchedAt.localeCompare(a.watchedAt))[0] || [...seen].sort((a, b) => b.watchedAt.localeCompare(a.watchedAt))[0];
  if (!selected) return null;
  let label = "TU \xDALTIMO RECUERDO";
  if (anniversary.includes(selected)) {
    const years = now.getFullYear() - Number(selected.watchedAt.slice(0, 4));
    label = years === 1 ? "HACE UN A\xD1O" : "HACE " + years + " A\xD1OS";
  } else if (older.includes(selected)) {
    const months = Math.max(1, (now.getFullYear() - Number(selected.watchedAt.slice(0, 4))) * 12 + now.getMonth() + 1 - Number(selected.watchedAt.slice(5, 7)));
    label = months >= 12 ? "HACE " + Math.floor(months / 12) + (months < 24 ? " A\xD1O" : " A\xD1OS") : months === 1 ? "HACE UN MES" : "HACE " + months + " MESES";
  }
  return { e: selected, label };
}
function memoryHero() {
  const chosen = memoryOfDay();
  if (!chosen) return `<section class="memory-hero memory-empty"><div class="hero-collage" aria-hidden="true">${CATALOG.filter((m2) => m2.poster).slice(0, 9).map((m2) => `<img src="${esc(m2.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer">`).join("")}</div><span class="memory-date">EMPIEZA TU DIARIO</span><h2>Guarda tu primer recuerdo</h2><p>Una emoci\xF3n, una compa\xF1\xEDa, unas palabras. Tu historia empieza aqu\xED.</p><button class="button" data-page="explore">Buscar una pel\xEDcula</button></section>`;
  const { e, label } = chosen, m = CATALOG.find((m2) => m2.id === e.id);
  if (!m) return "";
  return `<section class="memory-hero ${!e.review && !e.emotions?.length ? "memory-simple" : ""}" style="${emotionStyle(e)}" aria-label="Recuerdo del d\xEDa">${image(m)}<span class="memory-date">${label}${e.watchedAt ? " \xB7 " + shortDate(e.watchedAt).toUpperCase() : ""}</span><h2>${esc(m.title)}</h2>${e.review ? `<blockquote>\xAB${esc(e.review)}\xBB</blockquote>` : ""}<div class="memory-chips">${emotionLabel(e)}${e.companion ? `<span>con ${esc(e.companion)}</span>` : ""}${e.rating ? `<span class="score">\u2605 ${e.rating}</span>` : ""}</div><button class="button" data-memory-film="${e.id}">\xBFQu\xE9 sentir\xEDas hoy al verla?</button></section>`;
}
function weekStrip() {
  const monday = /* @__PURE__ */ new Date();
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return dateISO(d);
  }), seen = state.entries.filter((e) => e.status === "watched" && days.includes(e.watchedAt));
  const names = /* @__PURE__ */ new Set();
  return `<section class="week-strip"><div class="section-head"><h2>Tu semana</h2><small>${seen.length} ${seen.length === 1 ? "recuerdo" : "recuerdos"}</small></div><div class="week-days">${days.map((d, i) => {
    const e = seen.filter((e2) => e2.watchedAt === d).at(-1), emotion = e?.emotions?.[0];
    if (emotion) names.add(emotion);
    return `<button class="week-day ${d === dateISO() ? "today" : ""}" data-page="collection" aria-label="${shortDate(d)}: ${emotion || (e ? "Recuerdo sin emoci\xF3n" : "Sin recuerdos")}" ${d === dateISO() ? 'aria-current="date"' : ""} style="${emotionStyle(e)}"><span class="week-fill ${emotion ? "filled" : ""}"></span><span>${["L", "M", "X", "J", "V", "S", "D"][i]}</span></button>`;
  }).join("")}</div>${names.size || !mobileLayout() ? `<div class="week-key">${[...names].map(emotionLabel).join("")}</div>` : ""}</section>`;
}
function diaryCard(e) {
  const m = CATALOG.find((m2) => m2.id === e.id);
  if (!m) return "";
  if (e.status === "planned") return `<button class="diary-card" data-film="${e.id}">${image(m)}<span class="diary-copy"><strong>${esc(m.title)}</strong><small>Pendiente</small></span></button>`;
  return `<button class="diary-card" style="${emotionStyle(e)}" data-film="${e.id}" aria-label="Abrir recuerdo de ${esc(m.title)}">${image(m)}<span class="diary-copy"><strong>${esc(m.title)}</strong><small>${relativeDate(e.watchedAt)} \xB7 ${LABELS[e.status]}</small><span class="diary-meta">${e.rating ? `<span class="score">\u2605 ${e.rating}</span>` : ""}${emotionLabel(e)}</span>${e.review ? `<span class="diary-quote">${esc(e.review)}</span>` : '<span class="add-words">+ A\xF1adir unas palabras</span>'}</span></button>`;
}
function memoryEditor(m, e) {
  const companions = [...new Set([...state.entries].reverse().map((x) => x.companion).filter((x) => x && x !== "Solo/a"))].slice(0, 3);
  return `<p class="film-kicker" id="editor-kicker">GUARDAR RECUERDO</p><fieldset class="sr-only" aria-hidden="true"><legend>Estado seleccionado</legend>${["planned", ...m.type === "series" ? ["watching"] : [], "watched"].map((key) => `<input type="radio" name="status" value="${key}" tabindex="-1" ${key === e.status ? "checked" : ""}>`).join("")}</fieldset><div class="editor-status"><span id="editor-state" aria-live="polite"></span><span aria-hidden="true">\xB7</span><button type="button" class="text-button" data-next-tab="info">Cambiar</button></div><p class="status-help" id="status-help" aria-live="polite"></p>${m.type === "series" ? `<div id="episode-fields" class="form-row" ${e.status !== "watching" ? "hidden" : ""}><label class="field"><span>Temporada actual</span><input name="season" type="number" min="1" max="999" value="${e.season || 1}"></label><label class="field"><span>Episodio actual</span><input name="episode" type="number" min="1" max="9999" value="${e.episode || 1}"></label></div>` : ""}<div id="memory-fields"><fieldset class="film-rating-field"><legend>Tu nota</legend><div class="film-rating-options">${Array.from({ length: 10 }, (_, i) => `<label><input type="radio" name="rating" value="${i + 1}" ${e.rating === i + 1 ? "checked" : ""}><span>${i + 1}</span></label>`).join("")}</div><label class="film-no-rating"><input type="radio" name="rating" value="" ${!e.rating ? "checked" : ""}><span>Sin nota</span></label></fieldset><fieldset class="film-emotion-field"><legend>\xBFQu\xE9 sentiste?</legend><div class="memory-emotions">${EMOTIONS.map((x) => `<label class="memory-choice" style="${emotionStyle(x)}"><input type="checkbox" name="emotions" value="${x}" ${e.emotions.includes(x) ? "checked" : ""}><span><i class="emotion-dot" aria-hidden="true"></i>${x}</span></label>`).join("")}</div><p class="footnote" id="principal-emotion">${e.emotions.length ? "Emoci\xF3n principal: " + esc(e.emotions[0]) : "La primera que marques ser\xE1 la emoci\xF3n principal."}</p></fieldset><p class="memory-section-label">\xBFCon qui\xE9n la viste?</p><div class="companion-chips">${["Solo/a", ...companions].map((x) => `<button type="button" class="filter ${e.companion === x ? "active" : ""}" aria-pressed="${e.companion === x}" data-companion="${esc(x)}">${esc(x)}</button>`).join("")}<button type="button" class="filter" data-other-companion>+ Otra persona</button></div><label class="field" id="companion-field" ${!e.companion || ["Solo/a", ...companions].includes(e.companion) ? "hidden" : ""}><span>Nombre o compa\xF1\xEDa \xB7 Privado</span><input name="companion" maxlength="100" value="${esc(e.companion)}" placeholder="\xBFCon qui\xE9n compartiste la historia?"></label><label class="field"><span>Unas palabras</span><textarea name="review" rows="2" maxlength="3000" placeholder="Lo que se queda contigo\u2026">${esc(e.review)}</textarea></label><details class="memory-secondary"><summary><svg class="ms-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg><span>Fecha: <b>${e.watchedAt ? shortDate(e.watchedAt) : "hoy"}</b></span><span class="ms-change">Cambiar</span></summary><div class="form-row"><label class="field"><span>Fecha de visionado</span><input type="date" name="watchedAt" max="${dateISO()}" value="${esc(e.watchedAt)}"></label></div></details></div>`;
}
function memorySummary(m, e) {
  return `<div class="memory-summary"><span class="film-kicker">LO QUE SE QUEDA CONTIGO</span><h3>${esc(m.title)}</h3><small>${relativeDate(e.watchedAt)}</small>${emotionLabel(e)}${e.review ? `<blockquote>\xAB${esc(e.review)}\xBB</blockquote>` : "<p>A\xFAn no has guardado unas palabras sobre esta historia.</p>"}${e.companion ? `<p>Con ${esc(e.companion)}</p>` : ""}<button type="button" class="button" data-next-tab="rating">Guardar lo que sientes hoy</button></div>`;
}
function home() {
  const list = (status) => state.entries.filter((e) => e.status === status).map((e) => CATALOG.find((m) => m.id === e.id)).filter(Boolean);
  return `<div class="page-heading home-memory-heading"><h1>${homeGreeting()}</h1></div>${memoryHero()}${weekStrip()}${tonightCard()}${list("watching").length ? rail("Continuar viendo", list("watching")) : ""}${list("planned").length ? rail("Para ver", list("planned").slice(-12).reverse()) : ""}<div class="refresh-control"><button class="text-button" data-action="refresh-page">Actualizar Inicio \u21BB</button></div>${remoteRail("cinema", "En cines ahora")}${remoteRail("trending", "Tendencias de la semana")}${remoteRail("upcomingMovies", "Pr\xF3ximos estrenos \xB7 pel\xEDculas", true)}${remoteRail("upcomingTV", "Pr\xF3ximos estrenos \xB7 series", true)}<section class="panel home-challenge"><div class="panel-head"><h3>Reto semanal</h3><button class="text-button" data-page="stats">Mi a\xF1o \u2197</button></div>${challenge()}</section>${backupCard()}${syncInvite()}`;
}
function recentChips() {
  return recentSearches.length ? `<div class="search-chip-row" aria-label="B\xFAsquedas recientes">${recentSearches.map((q) => `<button class="filter" data-recent="${esc(q)}">${esc(q)}</button>`).join("")}</div>` : "";
}
function searchEmpty() {
  const other = remoteResults.find((m) => filter !== "all" && m.type !== filter), type = other?.type;
  if (!other && (apiError || apiMode !== "ready")) return "";
  return `<div class="search-empty" role="status"><p>${other ? "Hay resultados en " + (type === "series" ? "Series" : "Pel\xEDculas") + "." : "No encontramos nada con esa b\xFAsqueda."}</p>${other ? `<button class="button secondary" data-search-filter="${type}">Ver ${type === "series" ? "Series" : "Pel\xEDculas"}</button>` : ""}${!other && !apiError && apiMode === "ready" ? recentChips() : ""}<p>Prueba con otro t\xEDtulo o quita el filtro.</p>${filter !== "all" ? '<button class="text-button" data-search-filter="all">Quitar filtro</button>' : ""}</div>`;
}
function explore() {
  const hasQuery = !!query.trim(), list = remoteResults.filter((m) => filter === "all" || m.type === filter);
  return `<div class="page-heading search-page-heading"><h1>Encuentra tu historia</h1></div>${!hasQuery ? `<section class="search-discovery"><section id="genre-section"><h2>G\xE9neros</h2><div class="search-chip-row"><button class="filter ${!selectedGenre ? "active" : ""}" data-genre="">Tendencias</button>${Object.entries(genres).flatMap(([type, rows]) => (Array.isArray(rows) ? rows : []).filter(() => filter === "all" || (filter === "movie" ? type === "movie" : type === "tv")).map((g) => `<button class="filter ${selectedGenre === type + ":" + g.id ? "active" : ""}" aria-pressed="${selectedGenre === type + ":" + g.id}" data-genre="${type}:${g.id}">${esc(g.name)} \xB7 ${type === "movie" ? "cine" : "series"}</button>`)).join("")}</div></section></section>` : ""}<section class="search-results"><div class="section-head"><h2>${hasQuery ? "Resultados" : selectedGenre ? "Por g\xE9nero" : "Tendencias"}</h2>${tabs([["all", "Todo"], ["movie", "Pel\xEDculas"], ["series", "Series"]])}</div>${apiError ? `<div class="search-error" role="status"><span>No se pudo conectar con TMDB.${list.length ? "<small>Mostrando datos guardados.</small>" : ""}</span><button class="text-button" data-action="retry-search">Reintentar</button></div>` : ""}${apiMode === "loading" && !list.length ? skeletons() : `<div class="grid">${list.length ? list.map(card).join("") : searchEmpty()}</div>`}${remotePage < remoteTotal ? `<button class="button secondary more-results" data-action="more" ${apiMode === "loading" ? "disabled" : ""}>${apiMode === "loading" ? "Cargando\u2026" : "Cargar m\xE1s"}</button>` : ""}</section>${!apiError && apiMode === "ready" && !hasQuery && list.length && recentSearches.length ? `<section class="recent-searches"><h2 class="timeline-month">B\xFAsquedas recientes</h2>${recentChips()}</section>` : ""}`;
}
function catalogList() {
  const q = query.trim().toLocaleLowerCase("es");
  return CATALOG.filter((m) => (!q || `${m.title} ${m.cast || ""}`.toLocaleLowerCase("es").includes(q)) && entry(m.id) && (filter === "all" || entry(m.id).status === filter));
}
function askConfirmation(message) {
  return new Promise((resolve) => {
    const d = $("#confirm-dialog");
    $("#confirm-message").textContent = message;
    d.returnValue = "cancel";
    d.addEventListener("close", () => resolve(d.returnValue === "accept"), { once: true });
    d.showModal();
    d.querySelector('[value="cancel"]').focus();
  });
}
document.addEventListener("change", (ev) => {
  if (ev.target.id === "diary-state") {
    filter = ev.target.value;
    render();
    $("#diary-state").focus({ preventScroll: true });
    return;
  }
  if (ev.target.name === "emotions") {
    emotionOrder = emotionOrder.filter((x) => x !== ev.target.value);
    if (ev.target.checked) emotionOrder.push(ev.target.value);
    $("#principal-emotion").textContent = emotionOrder.length ? "Emoci\xF3n principal: " + emotionOrder[0] : "La primera que marques ser\xE1 la emoci\xF3n principal.";
  }
});
function updateEpisodeFields() {
  const form = $("#film-form");
  if (!form) return;
  const status = form.querySelector('[name="status"]:checked')?.value || "planned", box = $("#episode-fields");
  if (box) box.hidden = status !== "watching";
  $("#editor-state").textContent = "Estado: " + LABELS[status] + (box && status === "watching" ? " \xB7 S" + (form.elements.season.value || 1) + "\xB7E" + (form.elements.episode.value || 1) : "");
  $("#editor-kicker").textContent = { planned: "A\xD1ADIR A PENDIENTES", watching: "GUARDAR PROGRESO", watched: "GUARDAR RECUERDO" }[status];
  $("#memory-fields").hidden = status === "planned";
  $("#film-save").textContent = { planned: "Guardar como pendiente", watching: "Guardar progreso", watched: "Guardar recuerdo" }[status];
  $("#status-help").textContent = { planned: "Para otra ocasi\xF3n. Puedes guardarla sin nota ni emociones.", watching: "Guarda por d\xF3nde vas. La nota y los recuerdos son opcionales.", watched: "Guarda lo que esta historia dej\xF3 en ti." }[status];
  const date = form.elements.watchedAt;
  if (status === "watched" && !date.value) date.value = dateISO();
  else if (status !== "watched" && !entry(form.dataset.id)?.watchedAt) date.value = "";
}
function challenge() {
  const n = weekly();
  return `<div class="challenge"><span class="challenge-icon" aria-hidden="true">\u2733</span><div><h3>Una semana de cine</h3><p>Ve 3 t\xEDtulos y encuentra tu pr\xF3ximo favorito.</p></div></div><div class="progress" role="progressbar" aria-label="Reto semanal" aria-valuenow="${Math.min(3, n)}" aria-valuemin="0" aria-valuemax="3"><i style="width:${Math.min(100, n / 3 * 100)}%"></i></div><div class="row"><small>${Math.min(n, 3)} de 3 completados</small><small>${n >= 3 ? "\xA1Reto conseguido!" : "De lunes a domingo"}</small></div>`;
}
function collection() {
  const ids = new Set(catalogList().map((m) => m.id)), rows = state.entries.filter((e) => ids.has(e.id) && (diaryEmotion === "Todas" || e.emotions?.includes(diaryEmotion))), dated = rows.filter((e) => validDate(e.watchedAt)).sort((a, b) => b.watchedAt.localeCompare(a.watchedAt)), months = [...new Set(dated.map((e) => e.watchedAt.slice(0, 7)))];
  return `<div class="diary"><div class="page-heading diary-heading"><div class="diary-heading-title"><h1>Tu diario</h1><small>${(() => { const n = state.entries.filter((e) => e.status === "watched").length; return n + (n === 1 ? " recuerdo" : " recuerdos"); })()}</small></div><div class="diary-controls"><select class="diary-state" id="diary-state" aria-label="Filtrar diario por estado">${[["all", "Todas"], ["watched", "Vistas"], ["watching", "Viendo"], ["planned", "Pendientes"]].map(([key, label]) => `<option value="${key}" ${filter === key ? "selected" : ""}>${label}</option>`).join("")}</select>${diaryToggle()}<button class="diary-add" data-page="explore" aria-label="A\xF1adir t\xEDtulo">+</button></div></div><div class="emotion-filters" aria-label="Filtrar por emoci\xF3n">${["Todas", ...EMOTIONS].map((x) => `<button class="filter ${diaryEmotion === x ? "active" : ""}" data-diary-emotion="${x}" aria-pressed="${diaryEmotion === x}">${x === "Todas" ? x : emotionLabel(x)}</button>`).join("")}</div>${diaryView === "calendar" ? memoryCalendar(rows) : months.map((month) => `<section><h2 class="timeline-month">${new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(/* @__PURE__ */ new Date(month + "-01T12:00:00")).toUpperCase()}</h2><div class="timeline-list">${dated.filter((e) => e.watchedAt.startsWith(month)).map(diaryCard).join("")}</div></section>`).join("")}${diaryView === "calendar" ? "" : [["watched", "Recuerdos sin fecha"], ["watching", "En curso"], ["planned", "Por ver"]].map(([status, title]) => {
    const es = rows.filter((e) => !validDate(e.watchedAt) && e.status === status);
    return es.length ? `<section><h2 class="timeline-month">${title}</h2><div class="undated-list">${es.map(diaryCard).join("")}</div></section>` : "";
  }).join("")}${diaryView !== "calendar" && !rows.length ? '<div class="empty"><h3>Aqu\xED empieza tu diario</h3><p>No hay recuerdos con estos filtros.</p><button class="button" data-page="explore">Buscar una historia</button></div>' : ""}</div>`;
}
function yearView() {
  const s = stats(), year = (/* @__PURE__ */ new Date()).getFullYear(), yearEntries = s.watched.filter((e) => e.watchedAt.startsWith(year + "") && e.watchedAt <= dateISO()), ratings = yearEntries.filter((e) => e.rating != null), avg = ratings.length ? (ratings.reduce((a, e) => a + e.rating, 0) / ratings.length).toFixed(1) : "\u2014";
  const seen = new Set(s.watched.map((e) => e.watchedAt));
  let streak = 0;
  for (let n = seen.has(daysAgo(0)) ? 0 : 1; seen.has(daysAgo(n)); n++) streak++;
  const counts = {};
  yearEntries.forEach((e) => {
    const movie = CATALOG.find((m) => m.id === e.id);
    const g = GENRES[CATALOG.indexOf(movie)] || movie?.genre?.split(",")[0] || "Otros";
    counts[g] = (counts[g] || 0) + 1;
  });
  const genres2 = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  let heat = "";
  for (let i = 90; i >= 0; i--) {
    const date = daysAgo(i), n = s.watched.filter((e) => e.watchedAt === date).length;
    heat += `<span class="day ${n > 1 ? "many" : n ? "on" : ""}" role="img" aria-label="${date}: ${n} t\xEDtulos vistos" title="${date}: ${n} t\xEDtulos"></span>`;
  }
  return `<div class="page-heading"><div class="row"><h1>Mi ${year} en cine.</h1><span class="demo-badge">${cloud.user ? "SINCRONIZADO" : "EN ESTE DISPOSITIVO"}</span></div><p>Los n\xFAmeros cuentan historias. Estos se actualizan con lo que guardas.</p></div>${wrappedCta()}<div class="stat-grid"><div class="panel stat"><small>Pel\xEDculas vistas este a\xF1o</small><strong>${yearEntries.filter((e) => CATALOG.find((m) => m.id === e.id)?.type === "movie").length}</strong></div><div class="panel stat"><small>Series terminadas este a\xF1o</small><strong>${yearEntries.filter((e) => CATALOG.find((m) => m.id === e.id)?.type === "series").length}</strong></div><div class="panel stat"><small>Nota media este a\xF1o</small><strong>${avg}<span style="font-size:15px;color:var(--muted)"> / 10</span></strong></div><div class="panel stat"><small>Racha actual</small><strong>${streak}<span style="font-size:15px;color:var(--muted)"> d\xEDas</span></strong></div></div><section class="panel"><div class="row"><h3>Un d\xEDa, una historia</h3><small>\xDAltimos 91 d\xEDas</small></div><div class="heatmap" aria-label="Calendario de actividad">${heat}</div><div class="row"><small>${daysAgo(90)}</small><small>M\xE1s claro = m\xE1s t\xEDtulos vistos \xB7 Hoy</small></div></section><div class="lower-grid"><section class="panel"><h3>Tus g\xE9neros del a\xF1o</h3>${genres2.length ? genres2.map(([g, n]) => `<div class="genre"><div class="row"><span>${g}</span><span class="muted">${n} ${n === 1 ? "t\xEDtulo" : "t\xEDtulos"}</span></div><div class="progress" style="margin-top:9px"><i style="width:${n / yearEntries.length * 100}%"></i></div></div>`).join("") : '<p class="footnote">Marca un t\xEDtulo como visto y a\xF1ade una fecha para empezar.</p>'}</section><section class="panel"><div class="panel-head"><h3>Un peque\xF1o reto, cada semana</h3></div>${challenge()}</section></div><p class="footnote">Se cuenta la fecha de visionado; las vistas sin fecha no entran en el resumen anual. Una entrada por t\xEDtulo, sin contar episodios ni revisiones. Reto y racha calculados con la hora de tu dispositivo.</p>`;
}
function profileData() {
  const watched = state.entries.filter((e) => e.status === "watched"), rated = watched.filter((e) => e.rating);
  const emotions = {};
  watched.forEach((e) => (e.emotions || []).forEach((em, i) => emotions[em] = (emotions[em] || 0) + (i ? 1 : 2)));
  const palette = Object.entries(emotions).sort((x, y) => y[1] - x[1]), total = palette.reduce((n, [, v]) => n + v, 0);
  const days = [...new Set(watched.map((e) => e.watchedAt).filter(validDate))].sort(), perDay = {};
  watched.forEach((e) => validDate(e.watchedAt) && (perDay[e.watchedAt] = (perDay[e.watchedAt] || 0) + 1));
  let best = 0, run = 0, prev = null;
  days.forEach((d) => {
    run = prev && (Date.parse(d) - Date.parse(prev)) / 864e5 === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  const top = palette[0]?.[0] || "", personas = typeof PERSONAS === "undefined" ? {} : PERSONAS;
  const series = watched.filter((e) => CATALOG.find((m) => m.id === e.id)?.type === "series").length;
  const badges = [
    ["first", "Primer recuerdo", "Guarda tu primera historia", Math.min(watched.length, 1), 1, "\u{1F39F}\uFE0F"],
    ["ten", "Cin\xE9filo", "10 historias vistas", Math.min(watched.length, 10), 10, "\u{1F3AC}"],
    ["marathon", "Marat\xF3n", "3 historias en un mismo d\xEDa", Math.min(Math.max(0, ...Object.values(perDay)), 3), 3, "\u{1F37F}"],
    ["streak", "Racha de 7", "7 d\xEDas seguidos con historia", Math.min(best, 7), 7, "\u{1F525}"],
    ["heart", "Coraz\xF3n abierto", "Siente las 6 emociones", Math.min(palette.length, 6), 6, "\u{1F308}"],
    ["critic", "Cr\xEDtico", "Escribe 5 rese\xF1as", Math.min(watched.filter((e) => e.review).length, 5), 5, "✍️"],
    ["series", "Seri\xE9filo", "Termina 3 series", Math.min(series, 3), 3, "\u{1F4FA}"],
    ["company", "Buena compa\xF1\xEDa", "5 historias vistas con alguien", Math.min(watched.filter((e) => e.companion && e.companion !== "Solo/a").length, 5), 5, "\u{1F91D}"]
  ];
  return { watched, avg: rated.length ? (rated.reduce((n, e) => n + e.rating, 0) / rated.length).toFixed(1) : "—", palette, total, best, top, persona: personas[top] || null, badges };
}
function profile() {
  const d = profileData(), favs = state.favorites.map((id) => CATALOG.find((m) => m.id === id)).filter(Boolean);
  const recent = [...d.watched].sort((x, y) => (y.watchedAt || "").localeCompare(x.watchedAt || "")).slice(0, 12).map((e) => ({ e, m: CATALOG.find((m) => m.id === e.id) })).filter((x) => x.m);
  const cover = favs[0]?.poster || recent.find((x) => x.m.poster)?.m.poster || "", earned = d.badges.filter((b) => b[3] >= b[4]).length;
  const name = esc(state.profile.name), y = typeof yearData === "function" ? yearData() : { list: [] };
  return `${cloud.user ? "" : accountMarkup()}<div class="fp mp"><div class="fp-cover" aria-hidden="true">${cover ? `<img src="${esc(cover)}" alt="" referrerpolicy="no-referrer" data-mp-cover>` : `<img src="${PROFILE_COVER}" alt="">`}</div><section class="fp-hero"><div class="fp-avatar mp-avatar" style="${d.top ? emotionStyle(d.top) : ""}">${state.profile.avatar ? `<img src="${esc(state.profile.avatar)}" alt="Tu foto">` : `<span>${esc(state.profile.name.slice(0, 2).toUpperCase())}</span>`}<button class="avatar-edit mp-edit" data-action="edit-profile" aria-label="Editar perfil"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button></div><h1>${name}</h1>${state.profile.handle ? `<p class="fp-handle">@${esc(state.profile.handle)}</p>` : ""}${d.persona ? `<span class="mp-persona" style="${emotionStyle(d.top)}">✦ ${esc(d.persona[0])}</span>` : ""}${state.profile.bio ? `<p class="fp-bio">${esc(state.profile.bio)}</p>` : '<button class="text-button mp-bio-add" data-action="edit-profile">+ A\xF1ade una frase sobre ti</button>'}</section><div class="fp-stats"><div><strong>${d.watched.length}</strong><small>${d.watched.length === 1 ? "historia" : "historias"}</small></div><div><strong>${d.avg}</strong><small>nota media</small></div><div><strong>${d.best}</strong><small>mejor racha</small></div><div><button type="button" class="mp-stat-link" data-page="social"><strong>${state.following.length}</strong><small>siguiendo</small></button></div></div><div class="mp-actions">${y.list.length ? '<button type="button" class="mp-action mp-action-hero" data-wrapped><span aria-hidden="true">▶</span>Tu a\xF1o en historias</button>' : ""}<button type="button" class="mp-action" data-page="collection"><span aria-hidden="true">\u{1F4D6}</span>Mi diario</button><button type="button" class="mp-action" data-page="stats"><span aria-hidden="true">\u{1F4CA}</span>Estad\xEDsticas</button><button type="button" class="mp-action" data-action="share-card"><span aria-hidden="true">↗</span>Compartir</button></div><section class="fp-section"><div class="section-head mp-head"><h2>Tu top 3</h2><button class="text-button" data-action="favorites">Editar</button></div><div class="fp-favs">${favs.map((m, i) => `<button type="button" class="fp-fav" data-film="${m.id}" aria-label="Favorito ${i + 1}: ${esc(m.title)}">${image(m)}<span>${i + 1}</span></button>`).join("")}${Array.from({ length: Math.max(0, 3 - favs.length) }, (_, i) => `<button type="button" class="fav-slot" data-action="favorites" aria-label="Elegir favorito"><span aria-hidden="true">+</span><small>${i === 0 && !favs.length ? "Elige tus 3 historias" : ""}</small></button>`).join("")}</div></section>${d.palette.length ? `<section class="fp-section"><h2>Tu paleta emocional</h2><div class="fp-palette" role="img" aria-label="${d.palette.map(([em, n]) => `${em} ${Math.round(n / d.total * 100)}%`).join(", ")}">${d.palette.map(([em, n]) => `<i style="${emotionStyle(em)};flex:${n}"></i>`).join("")}</div><div class="fp-legend">${d.palette.slice(0, 3).map(([em, n]) => `<span style="${emotionStyle(em)}"><i class="emotion-dot" aria-hidden="true"></i>${em} \xB7 ${Math.round(n / d.total * 100)}%</span>`).join("")}</div>${d.persona ? `<p class="mp-persona-text">${esc(d.persona[1])}</p>` : ""}</section>` : ""}<section class="fp-section"><div class="section-head mp-head"><h2>Logros</h2><small class="muted">${earned} de ${d.badges.length}</small></div><div class="mp-badges">${d.badges.map(([key, title, desc, have, need, emoji]) => `<div class="mp-badge ${have >= need ? "is-earned" : ""}" title="${esc(desc)}"><span class="mp-badge-icon" aria-hidden="true">${emoji}</span><strong>${title}</strong><small>${have >= need ? "\xA1Conseguido!" : `${have} / ${need}`}</small>${have >= need ? "" : `<i class="mp-badge-bar" style="--p:${Math.round(have / need * 100)}%" aria-hidden="true"></i>`}<span class="sr-only">${esc(desc)}</span></div>`).join("")}</div></section><section class="fp-section"><div class="section-head mp-head"><h2>\xDAltimos recuerdos</h2>${recent.length ? '<button class="text-button" data-page="collection">Ver diario</button>' : ""}</div>${recent.length ? `<div class="mp-recent">${recent.map(({ e, m }) => `<button type="button" class="mp-memory" data-film="${m.id}" style="${emotionStyle(e)}" aria-label="${esc(m.title)}${e.rating ? ", nota " + e.rating : ""}">${image(m)}<span class="mp-memory-meta">${e.rating ? `★ ${e.rating}` : ""}${e.watchedAt ? `<small>${shortDate(e.watchedAt)}</small>` : ""}</span></button>`).join("")}</div>` : '<div class="mp-empty"><p>Cuando guardes una historia, aparecer\xE1 aqu\xED con su cartel.</p><button class="button" data-page="explore">Buscar una pel\xEDcula</button></div>'}</section><p class="footnote mp-foot">${cloud.user ? "Tu perfil, notas y rese\xF1as son p\xFAblicos. \xABCon qui\xE9n la viste\xBB es privado." : "Tu diario se guarda en este dispositivo. Crea una cuenta para compartirlo con tus amigos."}</p></div>`;
}
function profileAfterRender() {
  const img = $(".mp [data-mp-cover]"), box = $(".mp");
  if (!img || !box) return;
  posterTint(img.getAttribute("src")).then((tint) => {
    if (box.isConnected) applyTint(box, tint);
  });
}
var favPicks = [];
var favSearchTimer = 0;
var favSearchSeq = 0;
function editFavorites() {
  favPicks = normalizeFavorites(state.favorites);
  const d = $("#favorites-dialog");
  d.innerHTML = `<div class="dialog-head"><h2 id="favorites-title">Tu top 3</h2><button class="icon-button" data-close aria-label="Cerrar">${icon("close")}</button></div><div class="dialog-body fav-picker"><p class="muted fav-intro">Busca cualquier pel\xEDcula o serie. Toca un cartel para a\xF1adirlo y toca uno de arriba para quitarlo.</p><div class="fav-picks" id="fav-picks"></div><label class="fav-search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="fav-query" type="search" placeholder="Busca una pel\xEDcula o serie…" autocomplete="off" aria-label="Buscar para tu top 3"></label><p class="fav-hint" id="fav-hint" aria-live="polite"></p><div class="fav-results" id="fav-results"></div><div class="fav-footer"><button class="button" type="button" data-fav-save>Guardar mi top 3</button></div></div>`;
  renderFavPicks();
  favSuggestions();
  d.showModal();
}
function renderFavPicks() {
  const box = $("#fav-picks");
  if (!box) return;
  box.innerHTML = [0, 1, 2].map((i) => {
    const m = CATALOG.find((x) => x.id === favPicks[i]);
    return m ? `<button type="button" class="fav-pick" data-fav-remove="${m.id}" aria-label="Quitar ${esc(m.title)} del puesto ${i + 1}">${m.poster ? image(m) : `<span class="fav-noposter">${esc(m.title)}</span>`}<span class="fav-rank">${i + 1}</span><span class="fav-x" aria-hidden="true">\xD7</span></button>` : `<div class="fav-pick fav-pick-empty" aria-label="Puesto ${i + 1} libre"><span class="fav-rank">${i + 1}</span><small>Libre</small></div>`;
  }).join("");
  document.querySelectorAll("[data-fav-add]").forEach((b) => {
    const on = favPicks.includes(b.dataset.favAdd);
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", String(on));
  });
}
function favCard(m) {
  const on = favPicks.includes(m.id);
  return `<button type="button" class="fav-result ${on ? "is-on" : ""}" data-fav-add="${m.id}" aria-pressed="${on}">${m.poster ? image(m) : `<span class="fav-noposter">${esc(m.title)}</span>`}<small>${esc(m.title)}${m.year ? " \xB7 " + esc(m.year) : ""}</small></button>`;
}
function favSuggestions() {
  const seen = stats().watched.slice().sort((x, y) => (y.rating || 0) - (x.rating || 0)).map((e) => CATALOG.find((m) => m.id === e.id)).filter((m) => m?.poster).slice(0, 12);
  $("#fav-hint").textContent = seen.length ? "De tu diario \xB7 tus mejor valoradas" : "Ideas para empezar \xB7 o escribe para buscar en todo el cat\xE1logo";
  $("#fav-results").innerHTML = (seen.length ? seen : CATALOG.filter((m) => m.poster).slice(0, 12)).map(favCard).join("");
}
document.addEventListener("input", (ev) => {
  if (ev.target.id !== "fav-query") return;
  clearTimeout(favSearchTimer);
  const q = ev.target.value.trim(), seq = ++favSearchSeq;
  if (!q) return favSuggestions();
  $("#fav-hint").textContent = "Buscando…";
  favSearchTimer = setTimeout(async () => {
    try {
      const data = await requestTMDB("/search/multi", { query: q, page: 1, include_adult: false });
      if (seq !== favSearchSeq) return;
      const items = (data.results || []).map((d2) => fromTMDB(d2)).filter((m) => m && m.poster).slice(0, 18);
      cacheRemote(items);
      const shown = items.map((m) => CATALOG.find((x) => x.id === canonicalId(m.id)) || m);
      $("#fav-hint").textContent = shown.length ? `Resultados para \xAB${q}\xBB` : `No encontramos nada para \xAB${q}\xBB. Prueba con otro t\xEDtulo.`;
      $("#fav-results").innerHTML = shown.map(favCard).join("");
    } catch (e) {
      if (seq === favSearchSeq) $("#fav-hint").textContent = e.message || "No se pudo buscar ahora.";
    }
  }, 320);
});
document.addEventListener("click", (ev) => {
  const add = ev.target.closest?.("[data-fav-add]"), remove = ev.target.closest?.("[data-fav-remove]"), save = ev.target.closest?.("[data-fav-save]");
  if (add) {
    const id = add.dataset.favAdd;
    if (favPicks.includes(id)) favPicks = favPicks.filter((x) => x !== id);
    else if (favPicks.length < 3) {
      favPicks.push(id);
      buzz(8);
    } else {
      $("#fav-hint").textContent = "Ya tienes 3. Toca uno de arriba para quitarlo.";
      return;
    }
    renderFavPicks();
  }
  if (remove) {
    favPicks = favPicks.filter((x) => x !== remove.dataset.favRemove);
    renderFavPicks();
  }
  if (save) {
    state.favorites = favPicks.filter((id) => CATALOG.some((m) => m.id === id));
    const ok = persist();
    $("#favorites-dialog").close();
    render();
    if (ok) toast(state.favorites.length === 3 ? "Tu top 3 est\xE1 listo." : "Favoritos guardados.");
  }
});
function render() {
  const y = window.scrollY;
  $(".main").classList.toggle("profile-page", page === "profile" || page === "friend");
  $(".topbar").classList.toggle("profile-mode", page === "profile");
  $("#nav").innerHTML = NAV.map(([id, label]) => `<button data-page="${id}" class="${page === id || page === "friend" && id === "social" ? "active" : ""}" ${page === id ? 'aria-current="page"' : ""}>${icon(id)}<span>${label}</span></button>`).join("");
  $("#side-name").textContent = state.profile.name;
  $("#side-avatar").textContent = state.profile.name[0]?.toUpperCase() || "T";
  sideStatus();
  $("#view").innerHTML = cloud.user && !cloud.ready ? '<div class="empty"><h2>Cargando tu cuenta</h2>' + accountMarkup() + "</div>" : { home, explore, collection, social, stats: yearView, profile, friend: friendProfile }[page]();
  document.querySelectorAll("img").forEach((img) => img.addEventListener("error", () => {
    img.style.visibility = "hidden";
  }, { once: true }));
  window.scrollTo(0, y);
  afterRender();
}
function navigate(next, fromHistory = false) {
  dismissToast();
  clearTimeout(searchTimer);
  activeSearch?.abort();
  ++searchGeneration;
  if (![...NAV.map(([id]) => id), "stats"].includes(next)) return;
  const previous = page;
  page = next;
  if (!fromHistory && previous !== next) pushPage({ page: next });
  apiMode = "idle";
  filter = "all";
  query = "";
  selectedGenre = "";
  $("#search").value = "";
  const swap = () => {
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  previous !== next ? pageTransition(swap) : swap();
  $("#content").focus({ preventScroll: true });
  if (next === "explore") {
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) $("#search").focus();
    loadGenres();
    fetchCatalog(1);
  }
  if (next === "home") loadHome();
  if (next === "social") loadCommunity();
}
function openFilmNow(id) {
  dismissToast();
  const m = CATALOG.find((m2) => m2.id === id);
  if (!m) return;
  detailGeneration++;
  detailController?.abort();
  const e = entry(id) || { status: "watched", rating: null, review: "", watchedAt: "", companion: "", emotions: [] };
  emotionOrder = [...e.emotions];
  const d = $("#detail");
  if (d.contains($("#toast"))) document.body.append($("#toast"));
  d.dataset.id = id;
  d.dataset.tab = "info";
  d.innerHTML = `<div class="film-screen"><header class="film-header"><div><span class="film-kicker">PLANO / TU DIARIO</span><h2 id="dialog-title">${esc(m.title)}</h2></div><button class="film-close" data-close aria-label="Cerrar ficha">${icon("close")}</button></header><div class="film-tabs" role="tablist" aria-label="Secciones de la pel\xEDcula">${[["info", "Ficha"], ["rating", "Valorar"], ["memory", "Recuerdos"]].map(([key, label]) => `<button id="film-tab-${key}" role="tab" aria-selected="${key === "info"}" aria-controls="film-panel-${key}" tabindex="${key === "info" ? 0 : -1}" data-detail-tab="${key}">${label}</button>`).join("")}</div><form id="film-form" data-id="${id}" novalidate><div class="film-scroll" id="detail-scroll"><section id="film-panel-info" role="tabpanel" aria-labelledby="film-tab-info" data-detail-panel="info"><div class="film-backdrop" aria-hidden="true">${m.poster ? `<img src="${esc(m.poster)}" alt="" referrerpolicy="no-referrer">` : ""}</div><div class="film-hero">${image(m, "film-poster")}<div class="film-hero-copy"><span class="film-type">${m.type === "movie" ? "PEL\xCDCULA" : "SERIE"} \xB7 ${esc(m.year)}</span><h3>${esc(m.title)}</h3>${detailActions(m)}<p id="detail-genres" class="${m.genre || GENRES[CATALOG.indexOf(m)] ? "" : "skeleton-text"}">${esc(m.genre || GENRES[CATALOG.indexOf(m)] || "Cargando g\xE9neros\u2026")}</p><div class="film-external-rating" id="detail-rating">${tmdbRatingMarkup(m.tmdbRating)}</div></div></div><div class="film-synopsis"><div class="film-section-heading"><h3>La historia</h3></div><p id="detail-plot" class="skeleton" aria-live="polite">Cargando sinopsis\u2026</p><div class="film-language"><small id="plot-language">Preparando la sinopsis en castellano\u2026</small><button id="detail-retry" type="button" class="text-button" data-action="retry-detail" hidden>Reintentar</button></div></div><div class="film-cast"><h3>Reparto</h3><p id="detail-cast" class="${m.cast ? "" : "skeleton-text"}">${esc(m.cast || "Cargando reparto\u2026")}</p></div><section class="film-cast" id="detail-providers"><h3>D\xF3nde verla</h3><p class="skeleton-text">Cargando disponibilidad\u2026</p></section><div id="detail-trailer" class="film-cast"></div><p class="film-credit">Datos y valoraci\xF3n de TMDB.</p></section><section id="film-panel-rating" role="tabpanel" aria-labelledby="film-tab-rating" data-detail-panel="rating" hidden>${memoryEditor(m, e)}</section><section id="film-panel-memory" role="tabpanel" aria-labelledby="film-tab-memory" data-detail-panel="memory" hidden>${memorySummary(m, e)}</section></div><footer class="film-bottom"><span class="film-save-hint">${entry(id) ? "En tu diario" : "Tu pr\xF3xima historia"}</span><button class="button" id="film-start" type="button" data-next-tab="rating">${entry(id) ? "Editar mi valoraci\xF3n" : "A\xF1adir a mi diario"} <span aria-hidden="true">\u2197</span></button><button class="button" id="film-save" type="submit" hidden>Guardar recuerdo <span aria-hidden="true">\u2713</span></button>${entry(id) ? `<button type="button" class="film-remove" data-delete="${id}" aria-label="Quitar de mi colecci\xF3n">${icon("trash")}</button>` : ""}</footer></form></div>`;
  d.showModal();
  document.body.classList.add("film-open");
  updateEpisodeFields();
  loadDetail(m);
  tintDetail(m);
  motionOpenDetail();
}
function download(blob, name) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2e3);
}
function importTitle(r) {
  if (!r || typeof r !== "object") return null;
  return cleanTitle(r.title && typeof r.title === "object" ? r.title : { id: r.id, title: typeof r.title === "string" ? r.title : "T\xEDtulo guardado", year: r.year, type: r.type || (String(r.id).includes(":tv:") ? "series" : "movie") });
}
function exportCollection() {
  lsSet("plano-last-backup", String(Date.now()));
  const entries = state.entries.map((e) => {
    const m = CATALOG.find((m2) => m2.id === e.id);
    return { id: e.id, title: m?.title || "T\xEDtulo guardado", year: m?.year || "", type: m?.type || "movie", status: e.status, rating: e.rating, season: e.season || 1, episode: e.episode || 1, review: e.review || "", watchedAt: e.watchedAt || "", companion: e.companion || "", emotions: e.emotions || [] };
  });
  download(new Blob([JSON.stringify({ app: "Plano", version: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), entries }, null, 2)], { type: "application/json" }), "plano-coleccion.json");
  toast("Colecci\xF3n exportada en JSON.");
}
async function shareCard() {
  state.favorites = normalizeFavorites(state.favorites);
  if (state.favorites.length !== 3) {
    toast("Elige tres favoritos para crear tu tarjeta.");
    editFavorites();
    return;
  }
  toast("Preparando tus tres carteles\u2026");
  try {
    await document.fonts.ready;
    const load = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    const posters = await Promise.all(state.favorites.map((id) => load(CATALOG.find((m) => m.id === id).poster)));
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1400;
    const c = canvas.getContext("2d");
    if (!c) throw Error("Canvas");
    c.fillStyle = "#070b16";
    c.fillRect(0, 0, 1200, 1400);
    try {
      const cover = await load(PROFILE_COVER);
      c.drawImage(cover, 0, 0, 1200, 390);
    } catch (error) {
      console.warn("No se pudo cargar la portada de la tarjeta PNG.", error);
    }
    const fade = c.createLinearGradient(0, 200, 0, 450);
    fade.addColorStop(0, "#070b1600");
    fade.addColorStop(1, "#070b16");
    c.fillStyle = fade;
    c.fillRect(0, 200, 1200, 250);
    c.fillStyle = "#c9a7ff";
    c.font = "800 42px Manrope";
    c.fillText("Plano", 65, 78);
    try {
      const logo = await load("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjczLjQyIDM1LjUyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQpO308L3N0eWxlPjxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50IiB5MT0iMTcuNzYiIHgyPSIyNzMuNDIiIHkyPSIxNy43NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzkwY2VhMSIvPjxzdG9wIG9mZnNldD0iMC41NiIgc3RvcC1jb2xvcj0iIzNjYmVjOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwYjNlNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT5Bc3NldCAzPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGZpbGw9InVybCgjbGluZWFyLWdyYWRpZW50KSIgZD0iTTE5MS44NSwzNS4zN2g2My45QTE3LjY3LDE3LjY3LDAsMCwwLDI3My40MiwxNy43aDBBMTcuNjcsMTcuNjcsMCwwLDAsMjU1Ljc1LDBoLTYzLjlBMTcuNjcsMTcuNjcsMCwwLDAsMTc0LjE4LDE3LjdoMEExNy42NywxNy42NywwLDAsMCwxOTEuODUsMzUuMzdaTTEwLjEsMzUuNDJoNy44VjYuOTJIMjhWMEgwdjYuOUgxMC4xWm0yOC4xLDBINDZWOC4yNWguMUw1NS4wNSwzNS40aDZMNzAuMyw4LjI1aC4xVjM1LjRoNy44VjBINjYuNDVsLTguMiwyMy4xaC0uMUw1MCwwSDM4LjJaTTg5LjE0LjEyaDExLjdhMzMuNTYsMzMuNTYsMCwwLDEsOC4wOCwxLDE4LjUyLDE4LjUyLDAsMCwxLDYuNjcsMy4wOCwxNS4wOSwxNS4wOSwwLDAsMSw0LjUzLDUuNTIsMTguNSwxOC41LDAsMCwxLDEuNjcsOC4yNSwxNi45MSwxNi45MSwwLDAsMS0xLjYyLDcuNTgsMTYuMywxNi4zLDAsMCwxLTQuMzgsNS41LDE5LjI0LDE5LjI0LDAsMCwxLTYuMzUsMy4zNywyNC41MywyNC41MywwLDAsMS03LjU1LDEuMTVIODkuMTRabTcuOCwyOC4yaDRhMjEuNjYsMjEuNjYsMCwwLDAsNS0uNTVBMTAuNTgsMTAuNTgsMCwwLDAsMTEwLDI2YTguNzMsOC43MywwLDAsMCwyLjY4LTMuMzUsMTEuOSwxMS45LDAsMCwwLDEtNS4wOCw5Ljg3LDkuODcsMCwwLDAtMS00LjUyLDkuMTcsOS4xNywwLDAsMC0yLjYzLTMuMThBMTEuNjEsMTEuNjEsMCwwLDAsMTA2LjIyLDhhMTcuMDYsMTcuMDYsMCwwLDAtNC42OC0uNjNoLTQuNlpNMTMzLjA5LjEyaDEzLjJhMzIuODcsMzIuODcsMCwwLDEsNC42My4zMywxMi42NiwxMi42NiwwLDAsMSw0LjE3LDEuMyw3Ljk0LDcuOTQsMCwwLDEsMywyLjcyLDguMzQsOC4zNCwwLDAsMSwxLjE1LDQuNjUsNy40OCw3LjQ4LDAsMCwxLTEuNjcsNSw5LjEzLDkuMTMsMCwwLDEtNC40MywyLjgyVjE3YTEwLjI4LDEwLjI4LDAsMCwxLDMuMTgsMSw4LjUxLDguNTEsMCwwLDEsMi40NSwxLjg1LDcuNzksNy43OSwwLDAsMSwxLjU3LDIuNjIsOS4xNiw5LjE2LDAsMCwxLC41NSwzLjIsOC41Miw4LjUyLDAsMCwxLTEuMiw0LjY4LDkuMzIsOS4zMiwwLDAsMS0zLjEsM0ExMy4zOCwxMy4zOCwwLDAsMSwxNTIuMzIsMzVhMjIuNSwyMi41LDAsMCwxLTQuNzMuNWgtMTQuNVptNy44LDE0LjE1aDUuNjVhNy42NSw3LjY1LDAsMCwwLDEuNzgtLjIsNC43OCw0Ljc4LDAsMCwwLDEuNTctLjY1LDMuNDMsMy40MywwLDAsMCwxLjEzLTEuMiwzLjYzLDMuNjMsMCwwLDAsLjQyLTEuOEEzLjMsMy4zLDAsMCwwLDE1MSw4LjZhMy40MiwzLjQyLDAsMCwwLTEuMjMtMS4xM0E2LjA3LDYuMDcsMCwwLDAsMTQ4LDYuOWE5LjksOS45LDAsMCwwLTEuODUtLjE4aC01LjNabTAsMTQuNjVoN2E4LjI3LDguMjcsMCwwLDAsMS44My0uMiw0LjY3LDQuNjcsMCwwLDAsMS42Ny0uNywzLjkzLDMuOTMsMCwwLDAsMS4yMy0xLjMsMy44LDMuOCwwLDAsMCwuNDctMS45NSwzLjE2LDMuMTYsMCwwLDAtLjYyLTIsNCw0LDAsMCwwLTEuNTgtMS4xOCw4LjIzLDguMjMsMCwwLDAtMi0uNTUsMTUuMTIsMTUuMTIsMCwwLDAtMi4wNS0uMTVoLTUuOVoiLz48L2c+PC9nPjwvc3ZnPg==");
      c.drawImage(logo, 955, 45, 180, 180 * logo.height / logo.width);
    } catch {
    }
    c.textAlign = "center";
    c.beginPath();
    c.arc(600, 295, 82, 0, Math.PI * 2);
    c.fillStyle = "#38234f";
    c.fill();
    c.lineWidth = 5;
    c.strokeStyle = "#b889ff";
    c.stroke();
    if (state.profile.avatar) {
      try {
        const img = await load(state.profile.avatar);
        c.save();
        c.beginPath();
        c.arc(600, 295, 78, 0, Math.PI * 2);
        c.clip();
        c.drawImage(img, 522, 217, 156, 156);
        c.restore();
      } catch {
      }
    } else {
      c.fillStyle = "#f4f2ff";
      c.font = "600 48px Manrope";
      c.fillText(state.profile.name.slice(0, 2).toUpperCase(), 600, 314);
    }
    c.fillStyle = "#f4f2ff";
    c.font = "700 48px Manrope";
    c.fillText(state.profile.name, 600, 445, 1050);
    c.fillStyle = "#b2b5c8";
    c.font = "400 26px Manrope";
    c.fillText("@" + state.profile.handle, 600, 490);
    const st = stats();
    [[st.watched.length, "T\xCDTULOS VISTOS"], [st.avg, "NOTA MEDIA"], [state.following.length, "SIGUIENDO"]].forEach(([n, label], i) => {
      const x = 240 + i * 360;
      c.fillStyle = "#f4f2ff";
      c.font = "700 43px Manrope";
      c.fillText(String(n), x, 590);
      c.fillStyle = "#b2b5c8";
      c.font = "500 24px Manrope";
      c.fillText(label, x, 635);
    });
    c.textAlign = "left";
    c.fillStyle = "#f4f2ff";
    c.font = "700 30px Manrope";
    c.fillText("Tres historias que se quedan.", 65, 725);
    posters.forEach((img, i) => {
      const x = 65 + i * 365;
      c.save();
      c.beginPath();
      c.roundRect(x, 765, 340, 480, 16);
      c.clip();
      const scale = Math.max(340 / img.width, 480 / img.height);
      const w = img.width * scale, h = img.height * scale;
      c.drawImage(img, x + (340 - w) / 2, 765 + (480 - h) / 2, w, h);
      c.restore();
      c.fillStyle = "#f4f2ff";
      c.font = "600 24px Manrope";
      {
        const words = CATALOG.find((m) => m.id === state.favorites[i]).title.split(" ");
        let line = "", row = 0;
        for (const word of words) {
          if (c.measureText(line + word).width > 335 && line) {
            c.fillText(line.trim(), x, 1283 + row * 29);
            row++;
            line = "";
          }
          line += word + " ";
        }
        c.fillText(line.trim(), x, 1283 + row * 29);
      }
    });
    c.fillStyle = "#b2b5c8";
    c.font = "400 24px Manrope";
    c.fillText("PLANO \xB7 " + dateISO() + " \xB7 Carteles de TMDB", 65, 1334);
    c.font = "400 24px Manrope";
    c.fillText("This product uses the TMDB API but is not endorsed or certified by TMDB.", 65, 1370, 1080);
    canvas.toBlob((blob) => {
      if (!blob) {
        toast("No se pudo crear la imagen.");
        return;
      }
      download(blob, "plano-mi-tarjeta.png");
      toast("Tarjeta con tus tres favoritos descargada.");
    }, "image/png");
  } catch {
    toast("Alg\xFAn cartel externo impide exportar la imagen. Prueba con los carteles incluidos en la selecci\xF3n inicial.");
  }
}
document.addEventListener("click", async (ev) => {
  const b = ev.target.closest("button");
  if (!b) return;
  if (b.dataset.searchFilter) {
    filter = b.dataset.searchFilter;
    render();
    return;
  }
  if (b.dataset.memoryFilm) {
    openFilmNow(b.dataset.memoryFilm);
    switchDetailTab("memory");
    return;
  }
  if (b.dataset.diaryEmotion) {
    diaryEmotion = b.dataset.diaryEmotion;
    render();
    return;
  }
  if (b.hasAttribute("data-companion")) {
    $("#film-form [name=companion]").value = b.dataset.companion;
    $("#companion-field").hidden = true;
    document.querySelectorAll("[data-companion]").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.setAttribute("aria-pressed", String(x === b));
    });
    return;
  }
  if (b.hasAttribute("data-other-companion")) {
    $("#companion-field").hidden = false;
    $("#film-form [name=companion]").focus();
    return;
  }
  if (b.hasAttribute("data-genre")) {
    selectedGenre = b.dataset.genre;
    fetchCatalog(1);
    return;
  }
  if (b.dataset.recent) {
    query = b.dataset.recent;
    $("#search").value = query;
    fetchCatalog(1);
    return;
  }
  if (b.dataset.retrySection) {
    loadSection(b.dataset.retrySection, true);
    return;
  }
  if (b.dataset.quick) {
    ev.stopPropagation();
    entry(b.dataset.quick) ? openFilmNow(b.dataset.quick) : savePending(b.dataset.quick);
    return;
  }
  if (b.dataset.pending) {
    savePending(b.dataset.pending);
    return;
  }
  if (b.dataset.episode) {
    incrementEpisode(b.dataset.episode);
    return;
  }
  if (b.dataset.markWatched) {
    editStatus(b.dataset.markWatched, "watched");
    return;
  }
  if (b.dataset.setStatus) {
    const id = $("#detail").dataset.id, status = b.dataset.setStatus;
    if (entry(id)?.status === status) return;
    if (status === "planned") savePending(id);
    else editStatus(id, status);
    return;
  }
  if (b.dataset.detailTab || b.dataset.nextTab) {
    switchDetailTab(b.dataset.detailTab || b.dataset.nextTab);
    return;
  }
  if (b.dataset.page) {
    navigate(b.dataset.page);
    return;
  }
  if (b.dataset.friend) {
    openPublicProfile(b.dataset.friend);
    return;
  }
  if (b.hasAttribute("data-close")) {
    b.closest("dialog").close();
    return;
  }
  if (b.dataset.film) {
    openFilm(b.dataset.film);
    return;
  }
  if (b.dataset.filter) {
    filter = b.dataset.filter;
    if (page === "explore") {
      selectedGenre = "";
      fetchCatalog(1);
    } else render();
    return;
  }
  if (b.dataset.feed) {
    feedMode = b.dataset.feed;
    render();
    return;
  }
  if (b.dataset.follow) {
    const id = b.dataset.follow;
    state.following = state.following.includes(id) ? state.following.filter((x) => x !== id) : [...state.following, id];
    persist();
    render();
    return;
  }
  if (b.dataset.react !== void 0) {
    const id = Number(b.dataset.react);
    state.reactions = state.reactions.includes(id) ? state.reactions.filter((x) => x !== id) : [...state.reactions, id];
    persist();
    render();
    return;
  }
  if (b.dataset.delete) {
    const id = b.dataset.delete, removed = entry(id), index = state.entries.findIndex((e) => e.id === id), title = CATALOG.find((m) => m.id === id)?.title || "este t\xEDtulo";
    if (!removed || !await askConfirmation(`\xBFQuitar \xAB${title}\xBB de tu diario? Se borrar\xE1n su nota y tus recuerdos.`)) return;
    state.entries = state.entries.filter((e) => e.id !== id);
    const ok = persist();
    $("#detail").close();
    render();
    if (ok) toast("Quitada de tu diario.", () => {
      if (entry(id)) return;
      state.entries.splice(Math.min(index, state.entries.length), 0, removed);
      persist();
      render();
      toast("Recuperada.");
    });
    return;
  }
  switch (b.dataset.action) {
    case "retry-detail":
      loadDetail(CATALOG.find((m) => m.id === $("#detail").dataset.id));
      break;
    case "retry-search":
      fetchCatalog(1);
      break;
    case "dismiss-notice":
      $(".notice").hidden = true;
      document.querySelector(".sync-invite")?.remove();
      try {
        localStorage.setItem("plano-notice-dismissed", "1");
      } catch {
      }
      break;
    case "more":
      fetchCatalog(remotePage + 1);
      break;
    case "info":
      $("#info-dialog").showModal();
      break;
    case "favorites":
      editFavorites();
      break;
    case "avatar":
      $("#avatar-input").click();
      break;
    case "clear-search":
      navigate("explore");
      break;
    case "export":
      exportCollection();
      document.querySelector(".backup-card")?.remove();
      break;
    case "backup-later":
      lsSet("plano-last-backup", String(Date.now()));
      document.querySelector(".backup-card")?.remove();
      break;
    case "import":
      $("#import-file").click();
      break;
    case "share-card":
      shareCard();
      break;
    case "edit-profile":
      $("#profile-form").elements.name.value = state.profile.name;
      $("#profile-form").elements.handle.value = state.profile.handle;
      $("#profile-form").elements.bio.value = state.profile.bio || "";
      $("#account-zone").hidden = !cloud.user;
      $("#avatar-button").hidden = !cloud.user;
      $("#profile-note").textContent = cloud.user ? "Tu nombre, @usuario, bio y foto son p\xFAblicos para que tus amigos te encuentren." : "Este perfil solo existe en tu navegador. No crea una cuenta p\xFAblica.";
      $("#profile-dialog").showModal();
      break;
    case "delete-account":
      deleteAccount();
      break;
    case "reset":
      if (!state.entries.length && !state.favorites.length) {
        toast("Tu diario ya est\xE1 vac\xEDo.");
        break;
      }
      if (await askConfirmation(cloud.user ? `Se borrar\xE1n los ${state.entries.length} t\xEDtulos de tu diario y tus favoritos, tambi\xE9n de tu cuenta en la nube. No se puede deshacer. Exporta antes una copia si quieres conservarlos. \xBFBorrar?` : `Se borrar\xE1n los ${state.entries.length} t\xEDtulos guardados en este navegador. No se puede deshacer. \xBFBorrar?`)) {
        state = { ...seed(), profile: state.profile, following: state.following };
        const ok = persist();
        render();
        $("#profile-dialog").close();
        if (ok) toast("Diario borrado.");
      }
      break;
  }
});
document.addEventListener("submit", (ev) => {
  if (ev.target.id === "favorites-form") {
    ev.preventDefault();
    const f = new FormData(ev.target), ids = [0, 1, 2].map((i) => f.get("favorite" + i));
    if (new Set(ids).size !== 3 || !ids.every((id) => CATALOG.some((m) => m.id === id))) {
      toast("Elige tres t\xEDtulos distintos.");
      return;
    }
    state.favorites = ids;
    const ok = persist();
    $("#favorites-dialog").close();
    render();
    if (ok) toast("Tus tres favoritos est\xE1n guardados.");
    return;
  }
  if (ev.target.id === "film-form") {
    ev.preventDefault();
    const f = new FormData(ev.target), id = ev.target.dataset.id, e = { id, status: f.get("status"), rating: f.get("rating") ? Number(f.get("rating")) : null, review: String(f.get("review")).trim(), watchedAt: String(f.get("watchedAt")), companion: String(f.get("companion")).trim(), emotions: emotionOrder.filter((x) => f.getAll("emotions").includes(x)), season: Math.max(1, Math.min(999, parseInt(f.get("season")) || entry(id)?.season || 1)), episode: Math.max(1, Math.min(9999, parseInt(f.get("episode")) || entry(id)?.episode || 1)) };
    if (CATALOG.find((m) => m.id === id)?.type !== "series") {
      delete e.season;
      delete e.episode;
    }
    if (e.watchedAt && (!validDate(e.watchedAt) || e.watchedAt > dateISO())) {
      switchDetailTab("rating");
      $(".memory-secondary").open = true;
      toast("Revisa la fecha de visionado.");
      return;
    }
    const motionWasNew = !entry(id);
    state.entries = [...state.entries.filter((x) => x.id !== id), e];
    const ok = persist();
    $("#detail").close();
    render();
    if (ok && motionWasNew) document.querySelectorAll("[data-card]").forEach((n) => {
      if (n.dataset.card === id) motionOnce(n.querySelector(".poster-plus svg"), "plano-stamp", 260);
    });
    if (ok) toast({ planned: "A\xF1adida a pendientes.", watching: "Progreso guardado.", watched: "Recuerdo guardado en tu colecci\xF3n." }[e.status]);
    if (ok && e.status === "watched") showTicket(id);
  }
  if (ev.target.id === "profile-form") {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const name = String(f.get("name")).trim();
    if (!name) {
      toast("Escribe un nombre para tu perfil.");
      return;
    }
    const handle = String(f.get("handle")).trim().toLowerCase().replace(/^@/, "");
    if (cloud.user && !/^[a-z0-9_]{3,30}$/.test(handle)) {
      toast("El @usuario debe tener entre 3 y 30 letras, n\xFAmeros o guiones bajos.");
      return;
    }
    const bio = String(f.get("bio")).trim(), apply = () => {
      state.profile = { ...state.profile, name, handle, bio };
      const ok = persist();
      $("#profile-dialog").close();
      render();
      if (ok) toast("Perfil actualizado.");
    };
    if (!cloud.user || handle === state.profile.handle) return apply();
    if (handleProblem(handle)) return toast(handleProblem(handle));
    handleTaken(handle).then((taken) => taken ? toast(`@${handle} ya est\xE1 cogido. Prueba otro.`) : apply(), () => toast("No se pudo comprobar el @usuario. Int\xE9ntalo de nuevo."));
  }
});
$("#avatar-input").addEventListener("change", async (ev) => {
  const file = ev.target.files[0];
  ev.target.value = "";
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
    toast("Elige una foto JPG, PNG o WebP de menos de 1 MB.");
    return;
  }
  if (!cloud.user) {
    toast("Entra en tu cuenta para guardar un avatar.");
    return;
  }
  try {
    const path = cloud.user.id + "/" + Date.now() + "." + { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
    const { error } = await db.storage.from("avatars").upload(path, file, { contentType: file.type });
    if (error) throw error;
    state.profile.avatar = db.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    persist();
    render();
    toast("Foto de perfil guardada.");
  } catch (e) {
    toast(cloudMessage(e));
  }
});
$("#search").addEventListener("input", (ev) => {
  query = ev.target.value;
  if (!["explore", "collection"].includes(page)) {
    page = "explore";
    filter = "all";
  }
  if (page === "explore") searchRemote();
  else render();
});
$("#import-file").addEventListener("change", async (ev) => {
  const file = ev.target.files[0];
  ev.target.value = "";
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    toast("El JSON debe pesar menos de 5 MB.");
    return;
  }
  try {
    const data = JSON.parse(await file.text());
    const rows = Array.isArray(data) ? data : data.entries;
    if (!Array.isArray(rows)) throw Error("Formato");
    const imported = rows.map(importTitle).filter(Boolean);
    const originalCatalog = CATALOG.slice();
    for (const m of imported) {
      if (!CATALOG.some((x) => x.id === m.id)) CATALOG.push(m);
    }
    const { entries, skipped } = normalizeEntries(rows);
    if (!entries.length) {
      CATALOG = originalCatalog;
      toast("No hay entradas compatibles con tu cat\xE1logo local.");
      return;
    }
    if (!await askConfirmation(`Se importar\xE1n ${entries.length} t\xEDtulos y se omitir\xE1n ${skipped} entradas no compatibles. Los t\xEDtulos coincidentes se actualizar\xE1n. \xBFContinuar?`)) {
      CATALOG = originalCatalog;
      return;
    }
    const next = new Map(state.entries.map((e) => [e.id, e]));
    entries.forEach((e) => next.set(e.id, e));
    state.entries = [...next.values()];
    const ok = persist();
    render();
    if (ok) toast(`${entries.length} t\xEDtulos importados. ${skipped} omitidos.`);
  } catch {
    toast("No se pudo leer el archivo. Elige un JSON exportado desde Plano.");
  }
});
document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (ev) => {
  if (ev.target === d) {
    const r = d.getBoundingClientRect();
    if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) d.close();
  }
}));
$("#detail").addEventListener("close", () => {
  detailGeneration++;
  detailController?.abort();
  document.body.classList.remove("film-open");
  if ($("#detail").contains($("#toast"))) document.body.append($("#toast"));
});
$("#detail").addEventListener("keydown", (ev) => {
  const b = ev.target.closest("[data-detail-tab]");
  if (!b || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(ev.key)) return;
  ev.preventDefault();
  const keys = ["info", "rating", "memory"];
  const i = keys.indexOf(b.dataset.detailTab);
  const next = ev.key === "Home" ? 0 : ev.key === "End" ? 2 : (i + (ev.key === "ArrowRight" ? 1 : 2)) % 3;
  switchDetailTab(keys[next]);
  $("#film-tab-" + keys[next]).focus();
});
document.addEventListener("change", (ev) => {
  if (ev.target.matches("#film-form [name=status]")) updateEpisodeFields();
});
document.addEventListener("input", (ev) => {
  if (ev.target.matches("#film-form [name=season],#film-form [name=episode]")) updateEpisodeFields();
});
try {
  if (localStorage.getItem("plano-notice-dismissed")) $(".notice").hidden = true;
} catch {
}
$("#today").textContent = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" }).format(/* @__PURE__ */ new Date());
var foldState = {};
try {
  foldState = JSON.parse(localStorage.getItem("plano-folds-v1") || "{}") || {};
} catch {
}
var renderedPage = "";
var scrollAnchor = 0;
var scrollFrame = 0;
var refreshBusy = false;
var pullStart = null;
var pullDistance = 0;
var mobileLayout = () => matchMedia("(max-width:700px)").matches;
var reducedMotion = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
function setupFolds() {
  const targets = [];
  if (page === "home") document.querySelectorAll("#view .rail-section").forEach((section, i) => {
    const h = section.querySelector("h2");
    if (h?.textContent !== "Continuar viendo") targets.push([section, h, "home-" + h.textContent]);
  });
  if (page === "profile") document.querySelectorAll("#view .profile-section").forEach((section) => {
    const h = section.querySelector("h2");
    if (h?.textContent === "Actividad reciente") targets.push([section, h, "profile-activity"]);
  });
  if (page === "explore") {
    const section = $("#genre-section");
    if (section) targets.push([section, section.querySelector("h2"), "search-genres"]);
  }
  for (const [section, h, key] of targets) {
    const open = foldState[key] !== false, head2 = h.closest(".section-head") || h;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fold-toggle";
    button.dataset.fold = key;
    button.setAttribute("aria-expanded", String(open));
    button.append(document.createTextNode(h.textContent));
    const chevron = document.createElement("span");
    chevron.className = "fold-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "\u2304";
    button.append(chevron);
    h.replaceChildren(button);
    const body = document.createElement("div");
    body.className = "fold-body";
    body.id = "fold-" + key.replace(/[^a-z0-9]/gi, "-");
    button.setAttribute("aria-controls", body.id);
    const inner = document.createElement("div");
    inner.className = "fold-inner";
    let node = head2.nextSibling;
    while (node) {
      const next = node.nextSibling;
      inner.append(node);
      node = next;
    }
    body.append(inner);
    section.append(body);
    body.classList.toggle("fold-closed", !open);
    inner.inert = !open;
    inner.setAttribute("aria-hidden", String(!open));
  }
}
function placeRefreshControl() {
  if (page !== "home") return;
  const control = $("#view .refresh-control"), heading = $("#view .page-heading"), continuing = $("#view .continue-rail");
  if (!control || !heading) return;
  const button = control.querySelector("button");
  if (mobileLayout()) {
    button.innerHTML = '<span class="plano-refresh-icon" aria-hidden="true">\u21BB</span>';
    button.setAttribute("aria-label", "Actualizar Inicio");
    $("#view .week-strip .section-head").append(control);
  } else {
    button.innerHTML = 'Actualizar Inicio <span class="plano-refresh-icon" aria-hidden="true">\u21BB</span>';
    button.removeAttribute("aria-label");
    (continuing?.querySelector(".section-head") || heading).append(control);
  }
}
window.addEventListener("resize", placeRefreshControl, { passive: true });
function afterRender() {
  document.body.dataset.page = page;
  placeRefreshControl();
  setupFolds();
  if (renderedPage !== page) {
    const v = $("#view");
    if (!reducedMotion() && !document.documentElement.classList.contains("vt-page")) v.animate([{ opacity: 0.25, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 150, easing: "ease-out" });
    renderedPage = page;
    $(".topbar").classList.remove("header-hidden");
    scrollAnchor = window.scrollY;
  }
  updateScrollUI();
  motionAfterRender();
  if (page === "profile") profileAfterRender();
}
function updateScrollUI() {
  scrollFrame = 0;
  positionToast();
  const y = Math.max(0, window.scrollY), header = $(".topbar");
  $("#back-top").hidden = y < 600;
  const focused = header.contains(document.activeElement);
  if (!mobileLayout() || y < 12 || focused) {
    header.classList.remove("header-hidden");
    scrollAnchor = y;
  } else if (Math.abs(y - scrollAnchor) >= 8) {
    header.classList.toggle("header-hidden", y > scrollAnchor);
    scrollAnchor = y;
  }
}
window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI);
}, { passive: true });
window.addEventListener("resize", updateScrollUI, { passive: true });
document.addEventListener("focusin", (ev) => {
  if ($(".topbar").contains(ev.target)) {
    $(".topbar").classList.remove("header-hidden");
    scrollAnchor = window.scrollY;
  }
});
function pullAllowed() {
  return mobileLayout() && ["home", "explore"].includes(page) && !document.querySelector("dialog[open]") && !refreshBusy && !sectionLoading.size && apiMode !== "loading";
}
async function refreshPage() {
  if (!["home", "explore"].includes(page) || refreshBusy || sectionLoading.size || apiMode === "loading") return;
  refreshBusy = true;
  motionRefresh();
  const indicator = $("#pull-indicator");
  indicator.hidden = false;
  indicator.textContent = "Actualizando\u2026";
  indicator.setAttribute("aria-busy", "true");
  try {
    if (page === "home") await loadHome(true);
    else {
      delete sections.trending;
      await fetchCatalog(1);
    }
  } finally {
    refreshBusy = false;
    motionRefresh();
    indicator.hidden = true;
    indicator.setAttribute("aria-busy", "false");
    pullDistance = 0;
  }
}
window.addEventListener("touchstart", (ev) => {
  pullStart = null;
  pullDistance = 0;
  if (pullAllowed() && window.scrollY <= 0 && ev.touches.length === 1 && !ev.target.closest("input,textarea,select,button,a,.rail,.chips")) pullStart = { y: ev.touches[0].clientY, x: ev.touches[0].clientX };
}, { passive: true });
window.addEventListener("touchmove", (ev) => {
  if (!pullStart || ev.touches.length !== 1) return;
  const t = ev.touches[0];
  if (window.scrollY > 0 || Math.abs(t.clientX - pullStart.x) > 35) {
    pullStart = null;
    $("#pull-indicator").hidden = true;
    return;
  }
  pullDistance = Math.max(0, t.clientY - pullStart.y);
  const indicator = $("#pull-indicator");
  indicator.hidden = pullDistance < 12;
  indicator.textContent = pullDistance >= 70 ? "Suelta para actualizar" : "Tira para actualizar";
}, { passive: true });
window.addEventListener("touchend", () => {
  const trigger = pullStart && pullDistance >= 70;
  pullStart = null;
  $("#pull-indicator").hidden = true;
  if (trigger) refreshPage();
}, { passive: true });
window.addEventListener("touchcancel", () => {
  pullStart = null;
  pullDistance = 0;
  $("#pull-indicator").hidden = true;
}, { passive: true });
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("button");
  if (!b) return;
  if (b.dataset.fold) {
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    const body = document.getElementById(b.getAttribute("aria-controls"));
    body.classList.toggle("fold-closed", !open);
    body.firstElementChild.inert = !open;
    body.firstElementChild.setAttribute("aria-hidden", String(!open));
    foldState[b.dataset.fold] = open;
    try {
      localStorage.setItem("plano-folds-v1", JSON.stringify(foldState));
    } catch {
    }
  }
  if (b.id === "back-top") window.scrollTo({ top: 0, behavior: reducedMotion() ? "instant" : "smooth" });
  if (b.dataset.action === "refresh-page") refreshPage();
});
var motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
var motionCleanups = /* @__PURE__ */ new Map();
var seenPosters = /* @__PURE__ */ new Set();
var weekMotionSeen = false;
function motionOnce(node, name, duration, done = () => {
}) {
  if (!node) return;
  const restarting = motionCleanups.has(node);
  motionCleanups.get(node)?.();
  if (restarting) void node.offsetWidth;
  if (motionQuery.matches) {
    done();
    return;
  }
  let timer;
  const finish = () => {
    clearTimeout(timer);
    node.removeEventListener("animationend", ended);
    node.classList.remove(name);
    if (motionCleanups.get(node) === finish) motionCleanups.delete(node);
    done();
  };
  const ended = (ev) => {
    if (ev.target === node) finish();
  };
  node.classList.add(name);
  node.addEventListener("animationend", ended);
  timer = setTimeout(finish, duration + 80);
  motionCleanups.set(node, finish);
}
function motionPrune() {
  for (const [node, finish] of motionCleanups) if (!node.isConnected) finish();
}
function motionRoll(node, oldText, newText, duration = 220) {
  if (!node) return;
  motionCleanups.get(node)?.();
  node.textContent = newText;
  if (motionQuery.matches || oldText === newText) return;
  const wrap = document.createElement("span"), old = document.createElement("span"), fresh = document.createElement("span");
  wrap.className = "plano-roll";
  wrap.style.setProperty("--roll-time", duration + "ms");
  wrap.setAttribute("aria-hidden", "true");
  old.className = "plano-roll-old";
  fresh.className = "plano-roll-new";
  old.textContent = oldText;
  fresh.textContent = newText;
  wrap.append(old, fresh);
  const accessible = document.createElement("span");
  accessible.className = "sr-only";
  accessible.textContent = newText;
  node.replaceChildren(accessible, wrap);
  motionOnce(fresh, "plano-roll-running", duration, () => {
    if (node.contains(wrap)) node.textContent = newText;
  });
}
function motionReaction(owner, title, wasOn, oldCount) {
  for (const b of document.querySelectorAll("[data-cloud-like]")) {
    if (b.dataset.cloudLike !== owner || b.dataset.titleId !== title) continue;
    const mark = b.querySelector(".plano-reaction-icon"), count = b.querySelector(".plano-reaction-count");
    if (!mark || motionQuery.matches) continue;
    motionOnce(mark, wasOn ? "plano-unpop" : "plano-pop", 280);
    if (count && oldCount !== count.textContent) motionRoll(count, oldCount, count.textContent, 220);
    if (wasOn) continue;
    motionBurst(mark);
  }
  if (!wasOn && !motionQuery.matches) try {
    navigator.vibrate?.(10);
  } catch {
  }
}

var BURST_COLORS = ["#8fd3ff", "#ffc34d", "#f0a58f", "#e07be0", "#6f8cff", "#6fe0b5"];
function motionBurst(node) {
  if (!node || motionQuery.matches) return;
  node.querySelector(".plano-particles")?.remove();
  const box = document.createElement("span");
  box.className = "plano-particles";
  box.setAttribute("aria-hidden", "true");
  BURST_COLORS.forEach((c, i) => {
    const p = document.createElement("span"), a = (i / BURST_COLORS.length) * Math.PI * 2 - Math.PI / 2, r = 20 + Math.random() * 8;
    p.className = "plano-particle";
    p.style.background = c;
    p.style.setProperty("--dx", Math.cos(a) * r + "px");
    p.style.setProperty("--dy", Math.sin(a) * r + "px");
    box.append(p);
  });
  node.append(box);
  setTimeout(() => box.remove(), 520);
}
function homeGreeting() {
  const h = (/* @__PURE__ */ new Date()).getHours(), name = state.profile?.name && state.profile.name !== "Tu perfil" ? state.profile.name.split(" ")[0] : "";
  const hi = h < 6 ? "Buenas noches" : h < 13 ? "Buenos d\xEDas" : h < 21 ? "Buenas tardes" : "Buenas noches";
  return esc(name ? `${hi}, ${name}` : hi);
}
function syncInvite() {
  let dismissed = false;
  try {
    dismissed = !!localStorage.getItem("plano-notice-dismissed");
  } catch {
  }
  if (cloud.user || dismissed) return "";
  return `<section class="sync-invite"><span class="sync-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18Z"/><path d="m9.5 13.5 2 2 3.5-4"/></svg></span><div><strong>Guarda tus recuerdos en la nube</strong><small>Crea una cuenta gratis para no perder tu diario y seguir a tus amigos.</small></div><div class="sync-actions">${googleButton(true)}<button class="button" data-cloud="signup">Crear cuenta</button><button class="text-button" data-action="dismiss-notice">Ahora no</button></div></section>`;
}
function lsGet(k) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k, v) {
  try {
    localStorage.setItem(k, v);
  } catch {
  }
}
var GOOGLE_G = '<svg class="google-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
var googleEnabled = null, googleCheck = null;
function googleButton(compact = false) {
  return `<button type="button" class="google-btn ${compact ? "compact" : ""}" data-cloud="google" ${googleEnabled ? "" : "hidden"}>${GOOGLE_G}<span>Continuar con Google</span></button>${compact ? "" : `<p class="auth-or" ${googleEnabled ? "" : "hidden"}><span>o con tu correo</span></p>`}`;
}
function checkGoogle() {
  if (googleCheck) return googleCheck;
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 6e3);
  googleCheck = fetch(SUPABASE_URL + "/auth/v1/settings", { headers: { apikey: SUPABASE_KEY }, signal: ctl.signal }).then((r) => r.ok ? r.json() : null).then((j) => {
    googleEnabled = !!j?.external?.google;
    return googleEnabled;
  }).catch(() => {
    googleCheck = null;
    return false;
  }).finally(() => clearTimeout(t));
  return googleCheck;
}
function refreshGoogleButtons() {
  checkGoogle().then((on) => {
    document.querySelectorAll(".google-btn, .auth-or").forEach((n) => n.hidden = !on);
  });
}
async function googleLogin() {
  const b = document.querySelectorAll(".google-btn");
  b.forEach((x) => x.disabled = true);
  try {
    if (!await checkGoogle()) throw new Error("google_off");
    const r = await db.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } });
    if (r.error) throw r.error;
  } catch (e) {
    b.forEach((x) => x.disabled = false);
    toast(e?.message === "google_off" ? "El acceso con Google no est\xE1 disponible ahora. Usa tu correo." : cloudMessage(e));
  }
}
function watchedCount() {
  return state.entries.filter((e) => e.status === "watched").length;
}
function maybeAccountNudge() {
  if (lsGet("plano-nudge-3")) lsSet("plano-nudge-1", "1");
  const count = watchedCount(), step = [1, 5].find((n) => count >= n && !lsGet("plano-nudge-" + n));
  if (cloud.user || !step || document.querySelector("dialog[open]") || $(".plano-ticket-layer")) return;
  [1, 5].filter((n) => n <= step).forEach((n) => lsSet("plano-nudge-" + n, "1"));
  let d = $("#nudge-dialog");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "nudge-dialog";
    d.setAttribute("aria-labelledby", "nudge-title");
    document.body.append(d);
    d.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-cloud], [data-nudge-close]")) d.close();
    });
    d.addEventListener("close", () => setTimeout(() => {
      d.remove();
      refreshHitTest();
    }, 0));
  }
  const posters = state.entries.filter((e) => e.status === "watched").slice(-3).map((e) => CATALOG.find((m) => m.id === e.id)).filter((m) => m?.poster);
  d.innerHTML = `<div class="nudge"><div class="nudge-stack" aria-hidden="true">${posters.map((m) => `<img src="${esc(m.poster)}" alt="" referrerpolicy="no-referrer">`).join("")}</div><h2 id="nudge-title">${count === 1 ? "Guarda tu diario para siempre" : `Ya tienes ${count} recuerdos`}</h2><p>${count === 1 ? "Tu primer recuerdo solo vive en este m\xF3vil. Crea tu cuenta gratis para no perderlo nunca, tenerlo en todos tus dispositivos y compartirlo con tus amigos." : "Ahora mismo solo viven en este m\xF3vil. Gu\xE1rdalos en tu cuenta para no perderlos si cambias de tel\xE9fono."}</p>${googleButton(true)}<button class="button" type="button" data-cloud="signup">Crear cuenta gratis</button><button class="button secondary nudge-login" type="button" data-cloud="login">Ya tengo cuenta</button><button class="text-button nudge-later" type="button" data-nudge-close>Ahora no</button></div>`;
  d.showModal();
  refreshGoogleButtons();
}
function backupCard() {
  if (cloud.user || !watchedCount()) return "";
  const now = Date.now();
  let last = Number(lsGet("plano-last-backup"));
  if (!last) {
    lsSet("plano-last-backup", String(now));
    return "";
  }
  const days = Math.floor((now - last) / 864e5);
  if (days < 14) return "";
  return `<section class="backup-card"><span class="sync-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m-4-4 4 4 4-4M5 19h14"/></svg></span><div><strong>Haz una copia de tu diario</strong><small>Hace ${days} d\xEDas de tu \xFAltima copia. Sin cuenta, tus recuerdos solo est\xE1n en este m\xF3vil.</small></div><div class="sync-actions"><button class="button" data-action="export">Descargar copia</button><button class="text-button" data-action="backup-later">M\xE1s tarde</button></div></section>`;
}
function socialGate() {
  const people = CATALOG.filter((m) => m.poster).slice(0, 3);
  return `<section class="social-gate"><div class="gate-avatars" aria-hidden="true">${["#8fd3ff", "#ffc34d", "#6fe0b5"].map((c, i) => `<span style="--c:${c}"><img src="${esc(people[i]?.poster || "")}" alt="" referrerpolicy="no-referrer"></span>`).join("")}</div><h1>El cine se comparte</h1><p>Sigue a tus amigos, mira qu\xE9 sintieron con cada pel\xEDcula y m\xE1ndales un \xABMe llega\xBB. Para eso necesitas una cuenta.</p><div class="gate-actions">${googleButton(true)}<button class="button" data-cloud="signup">Crear cuenta con correo</button><button class="button secondary" data-cloud="login">Ya tengo cuenta</button></div><small>Tu diario sigue funcionando sin cuenta.</small></section>`;
}
function refreshHitTest() {
  const v = $("#view");
  if (!v) return;
  v.style.transform = "translateZ(0)";
  void v.offsetHeight;
  v.style.transform = "";
}
function welcomeDone() {
  try {
    localStorage.setItem("plano-onboarded", "1");
  } catch {
  }
}
function maybeWelcome() {
  let seen = false;
  try {
    seen = !!localStorage.getItem("plano-onboarded");
  } catch {
  }
  if (seen || cloud.user || state.entries.length || state.favorites.length || lsGet("sb-zvipbuytpdoyglbkzsyb-auth-token") || document.querySelector("dialog[open]")) return;
  let d = $("#welcome-dialog");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "welcome-dialog";
    d.setAttribute("aria-labelledby", "welcome-title");
    document.body.append(d);
    d.addEventListener("close", () => {
      welcomeDone();
      setTimeout(() => {
        d.remove();
        refreshHitTest();
      }, 0);
    });
  }
  const picks = /* @__PURE__ */ new Set(), films = CATALOG.filter((m) => m.poster).slice(0, 12);
  const step = (n) => {
    d.dataset.step = n;
    d.querySelectorAll("[data-welcome-step]").forEach((x) => x.hidden = x.dataset.welcomeStep !== String(n));
    d.querySelectorAll(".welcome-dots i").forEach((x, i) => x.classList.toggle("on", i === n - 1));
    d.querySelector(`[data-welcome-step="${n}"] input, [data-welcome-step="${n}"] .button`)?.focus();
  };
  d.innerHTML = `<div class="welcome"><button class="welcome-skip text-button" type="button" data-welcome="skip">Saltar</button>
<section data-welcome-step="1"><svg class="welcome-logo" viewBox="0 0 100 100" aria-hidden="true"><use href="#plano-mark"/></svg><h2 id="welcome-title">Bienvenido a Plano</h2><p>Tu diario de cine y series. Aqu\xED no solo apuntas lo que ves: guardas lo que sentiste.</p><ul class="welcome-points"><li><i style="background:#8fd3ff"></i>Una emoci\xF3n para cada historia</li><li><i style="background:#ffc34d"></i>Con qui\xE9n la viste y unas palabras</li><li><i style="background:#6fe0b5"></i>Tu semana y tu a\xF1o en cine</li></ul><button class="button" type="button" data-welcome="next">Empezar</button><button class="text-button welcome-login" type="button" data-cloud="login">Ya tengo cuenta \xB7 Entrar</button></section>
<section data-welcome-step="2" hidden><h2>\xBFC\xF3mo te llamas?</h2><p>As\xED te saludar\xE1 Plano cada d\xEDa.</p><label class="field"><span>Tu nombre</span><input id="welcome-name" maxlength="40" autocomplete="given-name" placeholder="Tu nombre" value="${state.profile.name !== "Tu perfil" ? esc(state.profile.name) : ""}"></label><button class="button" type="button" data-welcome="next">Seguir</button></section>
<section data-welcome-step="3" hidden><h2>Elige 3 historias que te marcaron</h2><p>Ser\xE1n tu Top 3 en el perfil. Puedes cambiarlas cuando quieras.</p><div class="welcome-grid">${films.map((m) => `<button type="button" class="welcome-film" data-welcome-film="${m.id}" aria-pressed="false" aria-label="${esc(m.title)}"><img src="${esc(m.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="welcome-check" aria-hidden="true"></span></button>`).join("")}</div><button class="button" type="button" data-welcome="finish" disabled>Elige 3 \xB7 0/3</button></section>
<div class="welcome-dots" aria-hidden="true"><i class="on"></i><i></i><i></i></div></div>`;
  d.onclick = (ev) => {
    if (ev.target.closest("[data-cloud]")) return d.close();
    const b = ev.target.closest("[data-welcome],[data-welcome-film]");
    if (!b) return;
    if (b.dataset.welcomeFilm) {
      const id = b.dataset.welcomeFilm;
      if (picks.has(id)) picks.delete(id);
      else if (picks.size < 3) picks.add(id);
      else return toast("Ya tienes tres. Quita una para cambiarla.");
      b.setAttribute("aria-pressed", picks.has(id));
      b.querySelector(".welcome-check").textContent = picks.has(id) ? [...picks].indexOf(id) + 1 : "";
      d.querySelectorAll(".welcome-film[aria-pressed=true]").forEach((x) => x.querySelector(".welcome-check").textContent = [...picks].indexOf(x.dataset.welcomeFilm) + 1);
      if (picks.has(id)) motionOnce(b, "plano-stamp", 260);
      const fin = d.querySelector('[data-welcome="finish"]');
      fin.disabled = picks.size !== 3;
      fin.textContent = picks.size === 3 ? "Listo, vamos" : `Elige 3 \xB7 ${picks.size}/3`;
      return;
    }
    const act = b.dataset.welcome;
    if (act === "skip") return d.close();
    if (act === "next") {
      const n = Number(d.dataset.step) + 1;
      if (n === 3) {
        const name = $("#welcome-name").value.trim();
        if (name) {
          state.profile.name = name;
          persist();
        }
      }
      return step(n);
    }
    if (act === "finish" && picks.size === 3) {
      state.favorites = [...picks];
      const ok = persist();
      d.close();
      render();
      if (ok) toast(`Top 3 guardado${state.profile.name !== "Tu perfil" ? ", " + state.profile.name.split(" ")[0] : ""}.`);
    }
  };
  d.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && ev.target.id === "welcome-name") {
      ev.preventDefault();
      d.querySelector('[data-welcome-step="2"] .button').click();
    }
  });
  d.showModal();
  step(1);
}
function motionRefresh() {
  document.querySelectorAll('[data-action="refresh-page"]').forEach((b) => refreshBusy ? motionOnce(b, "plano-refresh-busy", 350) : motionCleanups.get(b)?.());
}
function motionPosters(root = document) {
  root.querySelectorAll('img[alt^="Cartel de "]').forEach((img) => {
    if (img.dataset.motionBound) return;
    img.dataset.motionBound = "1";
    const loaded = () => {
      if (!img.naturalWidth || seenPosters.has(img.currentSrc || img.src)) return;
      seenPosters.add(img.currentSrc || img.src);
      motionOnce(img, "plano-poster-loaded", 200);
    };
    if (img.complete) loaded();
    else img.addEventListener("load", loaded, { once: true });
  });
}
function motionAfterRender() {
  if (!cloud.user && document.querySelector(".google-btn")) refreshGoogleButtons();
  const notice = $(".notice");
  if (notice) notice.hidden = true;
  motionPrune();
  motionPosters();
  motionRefresh();
  const days = document.querySelectorAll(".week-fill");
  if (page === "home" && days.length && !weekMotionSeen) {
    days.forEach((day, i) => {
      day.style.setProperty("--week-delay", i * 40 + "ms");
      motionOnce(day, "plano-week-enter", 200 + i * 40);
    });
    days[days.length - 1].addEventListener("animationend", () => {
      weekMotionSeen = true;
    }, { once: true });
  }
}
function motionOpenDetail() {
  document.querySelectorAll(".plano-detail-ghost").forEach((n) => {
    motionCleanups.get(n)?.();
    n.remove();
  });
  motionPosters($("#detail"));
  if (mobileLayout() && !document.documentElement.classList.contains("vt-film")) motionOnce($("#detail"), "plano-detail-enter", 240);
}
function motionCloseDetail() {
  if (vtClosing || motionQuery.matches || !mobileLayout() || $("#detail").open) return;
  const screen = $("#detail .film-screen");
  if (!screen) return;
  document.querySelectorAll(".plano-detail-ghost").forEach((n) => {
    motionCleanups.get(n)?.();
    n.remove();
  });
  const ghost = document.createElement("div");
  ghost.className = "plano-detail-ghost";
  ghost.inert = true;
  ghost.setAttribute("aria-hidden", "true");
  ghost.append(screen.cloneNode(true));
  ghost.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
  document.body.append(ghost);
  const scroller = ghost.querySelector(".film-scroll");
  if (scroller) scroller.scrollTop = $("#detail-scroll")?.scrollTop || 0;
  motionOnce(ghost, "plano-ghost-running", 160, () => ghost.remove());
}
function fadeToast() {
  const t = $("#toast");
  if (!t?.childNodes.length) return;
  motionOnce(t, "plano-toast-out", 150, () => dismissToast());
}
document.addEventListener("pointerdown", (ev) => {
  const label = ev.target.closest(".memory-choice");
  if (!label) return;
  const r = label.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
  label.style.setProperty("--ink-x", x + "px");
  label.style.setProperty("--ink-y", y + "px");
  label.style.setProperty("--ink-size", Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2 + "px");
}, { passive: true });
document.addEventListener("change", (ev) => {
  if (ev.target.matches(".memory-choice input")) motionOnce(ev.target.closest(".memory-choice"), ev.target.checked ? "plano-emotion-on" : "plano-emotion-off", ev.target.checked ? 260 : 150);
  if (ev.target.matches(".film-rating-options input") && ev.target.checked) motionOnce(ev.target.nextElementSibling, "plano-note", 300);
});
$("#detail").addEventListener("close", motionCloseDetail);
document.querySelectorAll(".topbar .plano-logo, .sidebar .plano-logo").forEach((l) => motionOnce(l, "plano-logo-intro", 760));
motionQuery.addEventListener("change", () => {
  if (motionQuery.matches) for (const finish of [...motionCleanups.values()]) finish();
});
var db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
var cloud = { user: null, ready: false, revision: 0, pending: false, saving: false, error: "", generation: 0, profiles: [], posts: [], reactions: [], friend: null, friendEntries: [], busy: false, communityError: "" };
var syncTimer;
var accountTask = Promise.resolve();
function emptyState() {
  return { version: 1, profile: { name: "Tu perfil", handle: "", bio: "", avatar: "" }, favorites: [], entries: [], following: [], reactions: [] };
}
function cacheKey() {
  return cloud.user ? "plano-account-" + cloud.user.id : KEY;
}
function writeCache() {
  localStorage.setItem(cacheKey(), JSON.stringify({ state, revision: cloud.revision, pending: cloud.pending }));
}
async function deleteAccount() {
  if (!cloud.user) return;
  if (!await askConfirmation(`Se eliminar\xE1n tu cuenta @${state.profile.handle}, tu diario, tus rese\xF1as, a qui\xE9n sigues y tus reacciones. No se puede deshacer. Si quieres conservar tu diario, exp\xF3rtalo antes. \xBFEliminar tu cuenta?`)) return;
  try {
    const files = await db.storage.from("avatars").list(cloud.user.id);
    if (files.data?.length) await db.storage.from("avatars").remove(files.data.map((f) => cloud.user.id + "/" + f.name));
    const { error } = await db.rpc("delete_my_account");
    if (error) throw error;
    try {
      localStorage.removeItem(cacheKey());
    } catch {
    }
    cloud.pending = false;
    $("#profile-dialog").close();
    await db.auth.signOut({ scope: "local" });
    toast("Tu cuenta se ha eliminado. Gracias por usar Plano.");
  } catch (e) {
    toast(e?.code === "PGRST202" ? "No se pudo eliminar la cuenta ahora. Escr\xEDbenos desde Privacidad \u2192 Contacto y la borramos por ti." : cloudMessage(e));
  }
}
function cloudMessage(error) {
  const msg = error?.message || "";
  if (msg.includes("sync_conflict")) return "Hay cambios de otro dispositivo. Exporta tu copia y carga la versi\xF3n de tu cuenta antes de continuar.";
  if (error?.code === "23505") return "Ese @usuario ya est\xE1 cogido. Prueba otro.";
  if (msg.includes("Invalid login")) return "Correo o contrase\xF1a incorrectos.";
  if (msg.includes("Email not confirmed")) return "Confirma tu correo antes de entrar.";
  if (msg.includes("rate limit")) return "Demasiados intentos. Espera un momento y vuelve a probar.";
  return navigator.onLine ? "No se pudo completar la operaci\xF3n. Revisa los datos y vuelve a intentarlo." : "Sin conexi\xF3n. Tus cambios quedan en este dispositivo hasta que puedas sincronizar.";
}
function accountMarkup() {
  return `<section class="account-panel"><div><strong>${cloud.user ? "Tu cuenta de Plano" : "Lleva tu diario contigo"}</strong><small id="sync-status" role="status">${cloud.user ? cloud.error || (!cloud.ready ? "Cargando cuenta\u2026" : cloud.pending ? "Cambios pendientes de sincronizar" : "Colecci\xF3n sincronizada") : "Entra para guardar tu colecci\xF3n y seguir a tus amigos."}</small></div><div class="account-actions">${cloud.user ? `<button class="text-button" data-cloud="sync">Sincronizar</button><button class="text-button" data-cloud="reload">Cargar cuenta</button><button class="text-button" data-cloud="logout">Salir</button>` : '<button class="button" data-cloud="login">Entrar / Crear cuenta</button>'}</div></section>`;
}
function sideStatus() {
  const sideText = $("#side-status-text"), sideHelp = $("#side-status-help");
  if (sideText) {
    sideText.textContent = cloud.user ? cloud.error ? "Revisa la sincronizaci\xF3n" : cloud.pending ? "Sincronizando\u2026" : "Sincronizado" : "En este dispositivo";
    sideHelp.textContent = cloud.user ? "@" + (state.profile.handle || "") + " \xB7 tu diario est\xE1 en la nube." : "Crea una cuenta para no perder tu diario.";
    $("#side-status").classList.toggle("is-cloud", !!cloud.user);
  }
}
function syncStatus() {
  sideStatus();
  const e = $("#sync-status");
  if (e) e.textContent = cloud.error || (cloud.pending ? "Cambios pendientes de sincronizar" : "Colecci\xF3n sincronizada");
}
function persist() {
  persistCatalog();
  try {
    if (cloud.user && !cloud.ready) {
      toast("Espera a que termine de cargar tu cuenta.");
      return false;
    }
    if (cloud.user) {
      cloud.pending = true;
      writeCache();
      clearTimeout(syncTimer);
      syncTimer = setTimeout(flushCloud, 350);
      syncStatus();
    } else localStorage.setItem(KEY, JSON.stringify(state));
    storageOK = true;
    if (!cloud.user) setTimeout(maybeAccountNudge, 1200);
    return true;
  } catch {
    storageOK = false;
    toast("No se pudo guardar. Exporta tu colecci\xF3n antes de cerrar.");
    return false;
  }
}
function publicPoster(m) {
  return [m?.poster, m?.tmdbPoster].find((u) => typeof u === "string" && u.startsWith("https://image.tmdb.org/")) || "";
}
function payloadForCloud(snapshot) {
  return { profile: snapshot.profile, favorites: snapshot.favorites, favorite_titles: snapshot.favorites.map((id) => CATALOG.find((m) => m.id === id)).filter(Boolean).map((m) => ({ title_id: m.id, title: m.title, year: m.year, type: m.type, poster: publicPoster(m) })), entries: snapshot.entries.map((e) => {
    const m = CATALOG.find((m2) => m2.id === e.id);
    return { ...e, title: m?.title || "T\xEDtulo guardado", year: m?.year || "", type: m?.type || "movie", poster: publicPoster(m) };
  }) };
}
async function flushCloud() {
  if (!cloud.user || !cloud.ready || cloud.saving || !cloud.pending) return;
  cloud.saving = true;
  const generation = cloud.generation, snapshot = JSON.stringify(state);
  try {
    const { data, error } = await db.rpc("save_plano", { payload: payloadForCloud(JSON.parse(snapshot)), expected_revision: cloud.revision });
    if (error) throw error;
    if (generation !== cloud.generation) return;
    cloud.revision = Number(data);
    cloud.pending = JSON.stringify(state) !== snapshot;
    cloud.error = "";
    writeCache();
    syncStatus();
  } catch (e) {
    if (generation === cloud.generation) {
      cloud.error = cloudMessage(e);
      syncStatus();
    }
  } finally {
    cloud.saving = false;
    if (generation === cloud.generation && cloud.pending && !cloud.error) syncTimer = setTimeout(flushCloud, 200);
  }
}
function addCloudTitles(rows) {
  for (const row of rows) {
    if (!CATALOG.some((m) => m.id === row.title_id)) {
      const m = cleanTitle({ id: row.title_id, title: row.title, year: row.year, type: row.type, poster: row.poster });
      if (m) CATALOG.push(m);
    }
  }
  persistCatalog();
}
function asEntry(row, companion = "") {
  return { id: row.title_id, status: row.status, rating: row.rating, review: row.review, watchedAt: row.watched_at || "", companion, emotions: row.emotions || [], ...row.type === "series" ? { season: row.season || 1, episode: row.episode || 1 } : {} };
}
async function allRows(query2) {
  const data = [];
  for (let offset = 0; ; offset += 500) {
    const r = await query2().range(offset, offset + 499);
    if (r.error) return r;
    data.push(...r.data);
    if (r.data.length < 500) return { data, error: null };
  }
}
async function loadAccount(user) {
  const generation = ++cloud.generation;
  cloud.user = user;
  cloud.ready = false;
  cloud.pending = false;
  cloud.error = "";
  state = emptyState();
  render();
  if (!user) {
    try {
      const guest = JSON.parse(localStorage.getItem(KEY) || "null");
      if (guest?.version === 1) state = { ...emptyState(), ...guest, entries: normalizeEntries(guest.entries).entries, favorites: normalizeFavorites(guest.favorites) };
    } catch {
    }
    cloud.ready = true;
    render();
    return;
  }
  try {
    let { data: profile2, error } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (error) throw error;
    if (!profile2 || PLACEHOLDER_HANDLE.test(profile2.handle)) {
      profile2 = await ensureHandle(user, profile2, generation);
      if (!profile2) return;
    }
    const results = await Promise.all([allRows(() => db.from("journal").select("*").eq("user_id", user.id).order("title_id")), allRows(() => db.from("journal_private").select("*").eq("user_id", user.id).order("title_id")), db.from("sync_versions").select("revision").eq("user_id", user.id).maybeSingle(), allRows(() => db.from("follows").select("following_id").eq("follower_id", user.id).order("following_id"))]);
    for (const r of results) if (r.error) throw r.error;
    if (generation !== cloud.generation) return;
    addCloudTitles([...profile2.favorite_titles || [], ...results[0].data]);
    const priv = new Map(results[1].data.map((x) => [x.title_id, x.companion]));
    cloud.revision = Number(results[2].data?.revision || 0);
    state = { ...emptyState(), profile: { name: profile2.name, handle: profile2.handle, bio: profile2.bio, avatar: profile2.avatar_url }, favorites: normalizeFavorites(profile2.favorites), entries: results[0].data.map((r) => asEntry(r, priv.get(r.title_id) || "")), following: results[3].data.map((x) => x.following_id) };
    const cached = JSON.parse(localStorage.getItem(cacheKey()) || "null");
    if (cached?.pending) {
      state = { ...emptyState(), ...cached.state, entries: normalizeEntries(cached.state?.entries || []).entries, favorites: normalizeFavorites(cached.state?.favorites) };
      cloud.pending = true;
      if (Number(cached.revision) !== cloud.revision) cloud.error = "Hay cambios de otro dispositivo. Exporta esta copia local antes de cargar tu cuenta.";
      cloud.revision = Number(cached.revision);
    }
    cloud.ready = true;
    writeCache();
    render();
    if (cloud.pending && !cloud.error) flushCloud();
    if (!state.entries.length) {
      let guest;
      try {
        guest = JSON.parse(localStorage.getItem(KEY) || "null");
      } catch {
      }
      if (guest?.entries?.length && await askConfirmation("Hay una colecci\xF3n local en este navegador. \xBFImportarla a tu cuenta? Tus notas y rese\xF1as ser\xE1n visibles en tu perfil; la compa\xF1\xEDa seguir\xE1 privada.")) {
        state.entries = normalizeEntries(guest.entries).entries;
        persist();
        render();
      }
    }
    await loadCommunity();
  } catch (e) {
    if (generation !== cloud.generation) return;
    cloud.error = cloudMessage(e);
    cloud.ready = false;
    render();
  }
}
function authDialog(recovery = false, mode = "login") {
  const d = $("#auth-dialog"), signup = !recovery && mode === "signup";
  d.innerHTML = `<div class="dialog-head"><h2>${recovery ? "Nueva contrase\xF1a" : signup ? "Crea tu cuenta" : "Tu diario, contigo"}</h2><button type="button" class="icon-button" data-close aria-label="Cerrar">${icon("close")}</button></div><form id="auth-form" class="dialog-body" data-recovery="${recovery}" data-mode="${signup ? "signup" : "login"}">${recovery ? "" : `<div class="auth-tabs" role="tablist" aria-label="Acceso"><button type="button" role="tab" aria-selected="${!signup}" data-auth-mode="login">Entrar</button><button type="button" role="tab" aria-selected="${signup}" data-auth-mode="signup">Crear cuenta</button></div>${googleButton()}`}${signup ? `<label class="field"><span>Tu nombre</span><input name="name" autocomplete="name" maxlength="80" required></label>${handleField("")}` : ""}${recovery ? "" : `<label class="field"><span>Correo electr\xF3nico</span><input type="email" name="email" autocomplete="email" required></label>`}<label class="field"><span>Contrase\xF1a \xB7 m\xEDnimo 8 caracteres</span><input type="password" name="password" autocomplete="${recovery || signup ? "new-password" : "current-password"}" minlength="8" required></label>${signup ? '<p class="muted auth-legal">Tu perfil, notas y rese\xF1as ser\xE1n p\xFAblicos. \xABCon qui\xE9n la viste\xBB solo lo ves t\xFA. Al crear la cuenta aceptas las <a href="/privacidad.html#condiciones" target="_blank" rel="noopener">condiciones</a> y la <a href="/privacidad.html" target="_blank" rel="noopener">pol\xEDtica de privacidad</a>.</p>' : ""}<p id="auth-error" role="status"></p><div class="account-actions"><button class="button" type="submit" name="mode" value="${recovery ? "recovery" : signup ? "signup" : "login"}">${recovery ? "Guardar contrase\xF1a" : signup ? "Crear cuenta" : "Entrar"}</button></div>${recovery || signup ? "" : '<button class="text-button" type="button" data-cloud="recover">He olvidado mi contrase\xF1a</button>'}</form>`;
  if (!d.open) d.showModal();
  if (!recovery) refreshGoogleButtons();
  d.querySelector(signup ? "[name=name]" : "[name=email]")?.focus();
}
var PLACEHOLDER_HANDLE = /^plano_[0-9a-f]{16}$/;
function cleanHandle(v) {
  return plain(v).replace(/^@+/, "").replace(/[\s.-]+/g, "_").replace(/[^a-z0-9_]/g, "").slice(0, 30);
}
function handleProblem(h) {
  if (!h) return "Elige un @usuario.";
  if (h.length < 3) return "M\xEDnimo 3 caracteres.";
  if (!/^[a-z0-9_]{3,30}$/.test(h)) return "Solo letras, n\xFAmeros y _.";
  if (PLACEHOLDER_HANDLE.test(h) || /^plano_?$/.test(h)) return "Ese nombre est\xE1 reservado.";
  return "";
}
async function handleTaken(h, ownId = cloud.user?.id) {
  const r = await db.from("profiles").select("id").eq("handle", h).maybeSingle();
  if (r.error) throw r.error;
  return !!r.data && r.data.id !== ownId;
}
function handleField(value) {
  return `<label class="field handle-field"><span>Nombre de usuario</span><span class="handle-input"><b aria-hidden="true">@</b><input name="handle" value="${esc(value)}" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="30" required aria-describedby="handle-status" placeholder="tu_usuario"></span><small id="handle-status" class="handle-status" aria-live="polite">Es c\xF3mo te encontrar\xE1n tus amigos. Letras, n\xFAmeros y _.</small></label>`;
}
var handleTimer = 0, handleSeq = 0;
function checkHandleInput(input) {
  const h = cleanHandle(input.value), status = input.closest("form").querySelector(".handle-status"), seq = ++handleSeq;
  if (input.value !== h) input.value = h;
  clearTimeout(handleTimer);
  const problem = handleProblem(h);
  status.dataset.state = problem ? "bad" : "checking";
  status.textContent = problem || "Comprobando…";
  if (problem) return;
  handleTimer = setTimeout(async () => {
    try {
      const taken = await handleTaken(h);
      if (seq !== handleSeq) return;
      status.dataset.state = taken ? "bad" : "ok";
      status.textContent = taken ? `@${h} ya est\xE1 cogido. Prueba otro.` : `✓ @${h} est\xE1 libre`;
    } catch {
      if (seq !== handleSeq) return;
      status.dataset.state = "";
      status.textContent = "No se pudo comprobar ahora. Lo comprobaremos al guardar.";
    }
  }, 350);
}
document.addEventListener("input", (ev) => {
  if (ev.target.matches(".handle-field input[name=handle]")) checkHandleInput(ev.target);
});
function handleSuggestions(name, email) {
  const base = cleanHandle(name).replace(/^_+|_+$/g, ""), parts = base.split("_").filter(Boolean), mail = cleanHandle(String(email || "").split("@")[0]);
  const year = String((/* @__PURE__ */ new Date()).getFullYear()).slice(2);
  return [...new Set([parts.join("_"), parts.join(""), parts[0] && parts[1] ? parts[0] + parts[1][0] : "", mail, parts[0] ? parts[0] + "_cine" : "", parts[0] ? parts[0] + year : ""].map((x) => x.slice(0, 30)).filter((x) => !handleProblem(x)))].slice(0, 4);
}
function ensureHandle(user, existing, generation) {
  return new Promise((resolve) => {
    const meta = user.user_metadata || {}, wanted = cleanHandle(meta.handle || ""), name = String(existing?.name && existing.name !== "Tu perfil" ? existing.name : meta.name || meta.full_name || "").slice(0, 80);
    const save = async (handle, displayName) => {
      if (existing) {
        const r = await db.from("profiles").update({ handle, name: displayName }).eq("id", user.id).select().single();
        if (r.error) throw r.error;
        return r.data;
      }
      const r = await db.from("profiles").insert({ id: user.id, handle, name: displayName, bio: "", avatar_url: "", favorites: [] }).select().single();
      if (r.error) throw r.error;
      return r.data;
    };
    (async () => {
      if (!existing && wanted && !handleProblem(wanted) && name) {
        try {
          return resolve(await save(wanted, name));
        } catch {
        }
      }
      if (generation !== cloud.generation) return resolve(null);
      let d = $("#handle-dialog");
      if (!d) {
        d = document.createElement("dialog");
        d.id = "handle-dialog";
        d.setAttribute("aria-labelledby", "handle-title");
        document.body.append(d);
        d.addEventListener("cancel", (ev) => ev.preventDefault());
      }
      const tips = handleSuggestions(name, user.email);
      d.innerHTML = `<form class="dialog-body handle-form" id="handle-form"><span class="handle-badge" aria-hidden="true">@</span><h2 id="handle-title">${existing ? "Elige tu nombre de usuario" : "Un \xFAltimo paso"}</h2><p class="muted">${existing ? "Tu cuenta tiene un @usuario provisional. Elige el tuyo para que tus amigos te encuentren." : "Elige c\xF3mo te ver\xE1n y te encontrar\xE1n tus amigos en Plano."}</p><label class="field"><span>Tu nombre</span><input name="name" value="${esc(name)}" autocomplete="name" maxlength="80" required></label>${handleField(wanted)}${tips.length ? `<div class="handle-tips" aria-label="Sugerencias">${tips.map((t) => `<button type="button" class="filter" data-handle-tip="${esc(t)}">@${esc(t)}</button>`).join("")}</div>` : ""}<p id="handle-error" role="alert"></p><button class="button" type="submit">Guardar y entrar</button><button class="text-button" type="button" data-handle-logout>Usar otra cuenta</button></form>`;
      if (!d.open) d.showModal();
      const input = d.querySelector("[name=handle]");
      if (wanted) checkHandleInput(input);
      (name ? input : d.querySelector("[name=name]")).focus();
      d.onclick = (ev) => {
        const tip = ev.target.closest("[data-handle-tip]");
        if (tip) {
          input.value = tip.dataset.handleTip;
          checkHandleInput(input);
          input.focus();
        }
        if (ev.target.closest("[data-handle-logout]")) {
          d.close();
          resolve(null);
          db.auth.signOut();
        }
      };
      d.querySelector("form").onsubmit = async (ev) => {
        ev.preventDefault();
        const form = ev.target, error = form.querySelector("#handle-error"), button = form.querySelector("[type=submit]");
        const handle = cleanHandle(form.elements.handle.value), displayName = String(form.elements.name.value).trim().slice(0, 80);
        const problem = !displayName ? "Escribe tu nombre." : handleProblem(handle);
        if (problem) return error.textContent = problem;
        button.disabled = true;
        error.textContent = "";
        try {
          if (await handleTaken(handle, user.id)) {
            error.textContent = `@${handle} ya est\xE1 cogido. Prueba otro.`;
            return;
          }
          const row = await save(handle, displayName);
          d.close();
          resolve(row);
        } catch (e) {
          error.textContent = e?.code === "23505" ? `@${handle} ya est\xE1 cogido. Prueba otro.` : cloudMessage(e);
        } finally {
          button.disabled = false;
        }
      };
    })();
  });
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest?.("[data-auth-mode]");
  if (b) authDialog(false, b.dataset.authMode);
});
async function loadCommunity(search = "") {
  cloud.busy = true;
  cloud.communityError = "";
  if (page === "social") render();
  try {
    let q = db.from("profiles").select("id,handle,name,bio,avatar_url,favorites").order("created_at", { ascending: false }).limit(30);
    if (search) q = q.ilike("handle", "%" + search.replace(/[^a-zA-Z0-9_]/g, "") + "%");
    const people = await q;
    if (people.error) throw people.error;
    let posts = db.from("journal").select("*,profiles!journal_user_id_fkey(id,name,handle,avatar_url)").order("updated_at", { ascending: false }).limit(40);
    if (feedMode === "following") {
      if (!state.following.length) {
        cloud.posts = [];
        cloud.profiles = people.data;
        return;
      }
      posts = posts.in("user_id", state.following);
    }
    const r = await posts;
    if (r.error) throw r.error;
    cloud.profiles = people.data;
    cloud.posts = r.data;
    addCloudTitles(r.data);
    const likes = await db.from("reactions").select("*").limit(5e3);
    if (likes.error) throw likes.error;
    cloud.reactions = likes.data;
  } catch (e) {
    cloud.communityError = cloudMessage(e);
  } finally {
    cloud.busy = false;
    if (["social", "profile"].includes(page)) render();
  }
}
function realAvatar(p) {
  return p.avatar_url && p.avatar_url.startsWith(SUPABASE_URL + "/storage/v1/object/public/avatars/") ? `<img class="avatar" src="${esc(p.avatar_url)}" alt="">` : `<span class="avatar">${esc(p.name?.slice(0, 2) || "P")}</span>`;
}
function followButton(p) {
  return p.id === cloud.user?.id ? "" : `<button class="button secondary" data-cloud-follow="${p.id}">${state.following.includes(p.id) ? "Siguiendo" : "Seguir"}</button>`;
}
function publicPost(p) {
  const person = p.profiles || cloud.friend || {}, likes = cloud.reactions.filter((r) => r.owner_id === p.user_id && r.title_id === p.title_id), mine = likes.some((r) => r.user_id === cloud.user?.id);
  return `<article class="panel"><div class="post-head">${realAvatar(person)}<button class="person-link" data-cloud-profile="${p.user_id}"><strong>${esc(person.name || "Usuario")}</strong><small>@${esc(person.handle || "")}</small></button></div><div class="post-body"><button class="text-button" data-film="${p.title_id}">${image(CATALOG.find((m) => m.id === p.title_id), "post-poster")}</button><div><h3>${esc(p.title)}</h3><small>${LABELS[p.status]}</small>${p.status !== "planned" && p.rating ? `<p class="score">\u2605 ${p.rating}/10</p>` : ""}${p.status !== "planned" ? `<p>${esc(p.review || "")}</p>${emotionLabel(p)}` : ""}</div></div><button class="reaction ${mine ? "active" : ""}" data-cloud-like="${p.user_id}" data-title-id="${p.title_id}" aria-pressed="${mine}"><span class="plano-reaction-icon" aria-hidden="true">${mine ? "\u2665" : "\u2661"}</span> Me llega \xB7 <span class="plano-reaction-count">${likes.length}</span></button></article>`;
}
function social() {
  if (!cloud.user) return socialGate();
  return `<div class="page-heading"><h1>El cine se comparte.</h1><p>Encuentra a tus amigos por su @usuario.</p></div><form id="people-search" class="account-actions"><input name="handle" aria-label="Buscar usuario" placeholder="@usuario" maxlength="30"><button class="button">Buscar</button></form><div class="toolbar"><div class="filters"><button class="filter ${feedMode === "all" ? "active" : ""}" data-cloud-feed="all">Descubrir</button><button class="filter ${feedMode === "following" ? "active" : ""}" data-cloud-feed="following">Siguiendo</button></div><button class="text-button" data-cloud="community">Actualizar</button></div>${cloud.communityError ? `<p role="status">${esc(cloud.communityError)}</p>` : ""}<div class="feed-layout"><section class="feed">${cloud.posts.length ? cloud.posts.map(publicPost).join("") : `<div class="empty"><h3>${cloud.busy ? "Cargando comunidad\u2026" : "Todav\xEDa no hay actividad"}</h3><p>Las historias compartidas aparecer\xE1n aqu\xED.</p></div>`}</section><aside class="panel"><h3>Personas</h3>${cloud.profiles.map((p) => `<div class="friend">${realAvatar(p)}<button class="person-link" data-cloud-profile="${p.id}">${esc(p.name)}<small>@${esc(p.handle)}</small></button>${followButton(p)}</div>`).join("") || '<p class="muted">No hay perfiles para esta b\xFAsqueda.</p>'}</aside></div>`;
}
async function openPublicProfile(id, fromHistory = false) {
  if (id === cloud.user?.id) return navigate("profile");
  if (!fromHistory && !(page === "friend" && friendId === id)) pushPage({ page: "friend", id });
  const generation = ++friendGeneration;
  cloud.friend = cloud.friend?.id === id ? cloud.friend : null;
  friendId = id;
  friendTab = "diary";
  page = "friend";
  pageTransition(() => {
    render();
    window.scrollTo(0, 0);
  });
  try {
    const count = (column) => db.from("follows").select("follower_id", { count: "exact", head: true }).eq(column, id);
    const [p, e, followers, following] = await Promise.all([db.from("profiles").select("*").eq("id", id).single(), db.from("journal").select("*").eq("user_id", id).order("updated_at", { ascending: false }).limit(300), count("following_id"), count("follower_id")]);
    for (const r of [p, e, followers, following]) if (r.error) throw r.error;
    if (generation !== friendGeneration) return;
    cloud.friend = { ...p.data, followers: followers.count || 0, followingCount: following.count || 0 };
    cloud.friendEntries = e.data;
    addCloudTitles([...p.data.favorite_titles || [], ...e.data]);
    if (page === "friend" && friendId === id) render();
  } catch (err) {
    if (generation !== friendGeneration) return;
    toast(cloudMessage(err));
    if (page === "friend" && !cloud.friend) navigate("social");
  }
}
function friendAvatar(p) {
  const url = p.avatar_url && p.avatar_url.startsWith(SUPABASE_URL + "/storage/v1/object/public/avatars/") ? p.avatar_url : "";
  return url ? `<img src="${esc(url)}" alt="">` : `<span>${esc((p.name || p.handle || "P").slice(0, 2).toUpperCase())}</span>`;
}
function tasteMatch(rows) {
  const mine = new Map(state.entries.filter((e) => e.status === "watched").map((e) => [e.id, e]));
  const common = rows.filter((r) => r.status === "watched" && mine.has(r.title_id));
  const rated = common.filter((r) => r.rating && mine.get(r.title_id).rating);
  if (!common.length) return { common, score: null };
  let score;
  if (rated.length) score = Math.round(rated.reduce((a, r) => a + (1 - Math.abs(r.rating - mine.get(r.title_id).rating) / 9), 0) / rated.length * 100);
  else score = Math.round(common.filter((r) => (r.emotions || []).some((em) => mine.get(r.title_id).emotions?.includes(em))).length / common.length * 60 + 40);
  return { common, score };
}
function friendDiaryItem(r) {
  const m = CATALOG.find((x) => x.id === r.title_id), likes = cloud.reactions.filter((x) => x.owner_id === r.user_id && x.title_id === r.title_id), liked = likes.some((x) => x.user_id === cloud.user?.id), mine = entry(r.title_id);
  return `<article class="fp-item" style="${emotionStyle(r.status === "planned" ? null : r.emotions?.[0])}"><button type="button" class="fp-poster" data-film="${esc(r.title_id)}" aria-label="Abrir ${esc(r.title)}">${m ? image(m) : ""}</button><div class="fp-item-copy"><button type="button" class="fp-item-title" data-film="${esc(r.title_id)}">${esc(r.title)}</button><small>${r.status === "watched" && r.watched_at ? relativeDate(r.watched_at) + " \xB7 " : ""}${LABELS[r.status]}${mine ? ` \xB7 <span class="fp-mine">En tu diario${mine.rating ? " ★ " + mine.rating : ""}</span>` : ""}</small>${r.status !== "planned" ? `<div class="diary-meta">${r.rating ? `<span class="score">★ ${r.rating}</span>` : ""}${emotionLabel(r.emotions?.[0])}</div>${r.review ? `<p class="fp-quote">“${esc(r.review)}”</p>` : ""}<button class="reaction ${liked ? "active" : ""}" data-cloud-like="${r.user_id}" data-title-id="${esc(r.title_id)}" aria-pressed="${liked}"><span class="plano-reaction-icon" aria-hidden="true">${liked ? "♥" : "♡"}</span> Me llega \xB7 <span class="plano-reaction-count">${likes.length}</span></button>` : ""}</div></article>`;
}
function friendProfile() {
  const p = cloud.friend;
  if (!p || p.id !== friendId) return `<div class="fp" aria-busy="true"><button class="text-button friend-back" data-page="social">← Amigos</button><div class="fp-hero"><div class="fp-avatar skeleton"></div><div class="skeleton fp-sk-line"></div><div class="skeleton fp-sk-line short"></div></div><div class="fp-stats">${'<div class="skeleton fp-sk-stat"></div>'.repeat(4)}</div><p class="sr-only" role="status">Cargando perfil…</p></div>`;
  const rows = cloud.friendEntries, watched = rows.filter((r) => r.status === "watched"), planned = rows.filter((r) => r.status !== "watched");
  const rated = watched.filter((r) => r.rating), avg = rated.length ? (rated.reduce((a, r) => a + r.rating, 0) / rated.length).toFixed(1) : "—";
  const emotions = {};
  watched.forEach((r) => (r.emotions || []).forEach((em, i) => emotions[em] = (emotions[em] || 0) + (i ? 1 : 2)));
  const total = Object.values(emotions).reduce((a, n) => a + n, 0), palette = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
  const favs = (p.favorites || []).map((id) => CATALOG.find((m) => m.id === canonicalId(id))).filter(Boolean);
  const cover = favs[0]?.poster || watched.map((r) => CATALOG.find((m) => m.id === r.title_id)?.poster).find(Boolean) || "";
  const match = cloud.user ? tasteMatch(rows) : { common: [], score: null };
  const discover = watched.filter((r) => (r.rating || 0) >= 8 && !entry(r.title_id)).slice(0, 10).map((r) => CATALOG.find((m) => m.id === r.title_id)).filter(Boolean);
  const following = state.following.includes(p.id), first = esc((p.name || "").split(" ")[0] || "@" + p.handle);
  const list = friendTab === "planned" ? planned : friendTab === "common" ? match.common : watched;
  const empty = { diary: `${first} todav\xEDa no ha guardado recuerdos.`, planned: "No tiene pendientes.", common: "Todav\xEDa no hab\xE9is visto nada en com\xFAn." }[friendTab];
  return `<div class="fp"><div class="fp-cover" aria-hidden="true">${cover ? `<img src="${esc(cover)}" alt="" referrerpolicy="no-referrer">` : ""}</div><button class="text-button friend-back" data-page="social">← Amigos</button><section class="fp-hero"><div class="fp-avatar">${friendAvatar(p)}</div><h1>${esc(p.name)}</h1><p class="fp-handle">@${esc(p.handle)}</p>${p.bio ? `<p class="fp-bio">${esc(p.bio)}</p>` : ""}${cloud.user ? `<button class="button ${following ? "secondary" : ""} fp-follow" data-cloud-follow="${p.id}" aria-pressed="${following}">${following ? "✓ Siguiendo" : "Seguir"}</button><button type="button" class="button secondary fp-follow fp-duo" data-duo-open>🍿 Plan a dúo</button>` : ""}</section><div class="fp-stats"><div><strong>${watched.length}</strong><small>${watched.length === 1 ? "recuerdo" : "recuerdos"}</small></div><div><strong>${avg}</strong><small>nota media</small></div><div><strong>${p.followers}</strong><small>${p.followers === 1 ? "seguidor" : "seguidores"}</small></div><div><strong>${p.followingCount}</strong><small>siguiendo</small></div></div>${match.score !== null ? `<section class="fp-match" style="--match:${match.score}"><div class="fp-ring" role="img" aria-label="Compatibilidad ${match.score}%"><span>${match.score}%</span></div><div><strong>Compatibilidad de gustos</strong><p>${match.common.length} ${match.common.length === 1 ? "historia" : "historias"} en com\xFAn. ${match.score >= 80 ? "Os entend\xE9is sin spoilers." : match.score >= 60 ? "Buen equipo para una noche de cine." : "Gustos distintos: perfectos para descubrir cosas nuevas."}</p></div></section>` : ""}${palette.length ? `<section class="fp-section"><h2>Su paleta emocional</h2><div class="fp-palette" role="img" aria-label="${palette.map(([em, n]) => `${em} ${Math.round(n / total * 100)}%`).join(", ")}">${palette.map(([em, n]) => `<i style="${emotionStyle(em)};flex:${n}"></i>`).join("")}</div><div class="fp-legend">${palette.slice(0, 3).map(([em, n]) => `<span style="${emotionStyle(em)}"><i class="emotion-dot" aria-hidden="true"></i>${em} \xB7 ${Math.round(n / total * 100)}%</span>`).join("")}</div></section>` : ""}${favs.length ? `<section class="fp-section"><h2>Top ${favs.length === 1 ? "favorito" : "favoritos"}</h2><div class="fp-favs">${favs.map((m, i) => `<button type="button" class="fp-fav" data-film="${m.id}" aria-label="Favorito ${i + 1}: ${esc(m.title)}">${image(m)}<span>${i + 1}</span></button>`).join("")}</div></section>` : ""}${discover.length ? `<section class="fp-section"><h2>Le encant\xF3 y t\xFA no la has visto</h2><div class="fp-discover">${discover.map((m) => `<button type="button" class="fp-disc" data-film="${m.id}">${image(m)}<small>${esc(m.title)}</small></button>`).join("")}</div></section>` : ""}<section class="fp-section"><div class="fp-tabs" role="tablist" aria-label="Contenido del perfil">${[["diary", "Diario", watched.length], ["planned", "Pendientes", planned.length], ...cloud.user ? [["common", "En com\xFAn", match.common.length]] : []].map(([key, label, n]) => `<button type="button" role="tab" aria-selected="${friendTab === key}" data-friend-tab="${key}">${label} <small>${n}</small></button>`).join("")}</div><div class="fp-list" role="tabpanel">${list.map(friendDiaryItem).join("") || `<p class="muted fp-empty">${empty}</p>`}</div></section></div>`;
}
async function cloudClick(b) {
  if (b.dataset.cloud === "login") return authDialog();
  if (b.dataset.cloud === "signup") return authDialog(false, "signup");
  if (b.dataset.cloud === "google") return googleLogin();
  if (b.dataset.cloud === "recover") {
    const email = $("#auth-form [name=email]").value;
    if (!email) return $("#auth-error").textContent = "Escribe tu correo.";
    const r = await db.auth.resetPasswordForEmail(email, { redirectTo: location.origin });
    $("#auth-error").textContent = r.error ? cloudMessage(r.error) : "Si existe la cuenta, recibir\xE1s un correo para recuperar el acceso.";
    return;
  }
  if (b.dataset.cloud === "sync") {
    cloud.error = "";
    return flushCloud();
  }
  if (b.dataset.cloud === "reload") {
    if (cloud.pending && !await askConfirmation("Se cargar\xE1n los datos de tu cuenta y se descartar\xE1n los cambios locales sin sincronizar. Exporta antes si quieres conservarlos. \xBFContinuar?")) return;
    localStorage.removeItem(cacheKey());
    return loadAccount(cloud.user);
  }
  if (b.dataset.cloud === "logout") {
    await flushCloud();
    if (cloud.pending) {
      toast("Hay cambios sin sincronizar. Exporta una copia o sincroniza antes de salir.");
      return;
    }
    const { error } = await db.auth.signOut();
    if (error) throw error;
    document.querySelectorAll("dialog[open]").forEach((d) => d.close());
    toast("Has cerrado sesi\xF3n. Tu diario sigue a salvo en tu cuenta.");
    return;
  }
  if (b.dataset.cloud === "community") return loadCommunity();
  if (b.dataset.cloudProfile) return openPublicProfile(b.dataset.cloudProfile);
  if (b.dataset.cloudFeed) {
    feedMode = b.dataset.cloudFeed;
    return loadCommunity();
  }
  if (b.dataset.cloudFollow) {
    if (!cloud.user) return authDialog();
    const id = b.dataset.cloudFollow, on = state.following.includes(id), r = on ? await db.from("follows").delete().eq("follower_id", cloud.user.id).eq("following_id", id) : await db.from("follows").insert({ follower_id: cloud.user.id, following_id: id });
    if (r.error) throw r.error;
    state.following = on ? state.following.filter((x) => x !== id) : [...state.following, id];
    if (cloud.friend?.id === id && Number.isFinite(cloud.friend.followers)) cloud.friend.followers = Math.max(0, cloud.friend.followers + (on ? -1 : 1));
    writeCache();
    render();
    return;
  }
  if (b.dataset.cloudLike) {
    if (!cloud.user) return authDialog();
    const motionOldCount = b.querySelector(".plano-reaction-count")?.textContent || "0";
    const row = { user_id: cloud.user.id, owner_id: b.dataset.cloudLike, title_id: b.dataset.titleId }, mine = cloud.reactions.some((r2) => r2.user_id === row.user_id && r2.owner_id === row.owner_id && r2.title_id === row.title_id), r = mine ? await db.from("reactions").delete().match(row) : await db.from("reactions").insert(row);
    if (r.error) throw r.error;
    cloud.reactions = mine ? cloud.reactions.filter((r2) => !(r2.user_id === row.user_id && r2.owner_id === row.owner_id && r2.title_id === row.title_id)) : [...cloud.reactions, row];
    render();
    motionReaction(row.owner_id, row.title_id, mine, motionOldCount);
  }
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-cloud],[data-cloud-profile],[data-cloud-follow],[data-cloud-like],[data-cloud-feed]");
  if (!b) return;
  ev.preventDefault();
  cloudClick(b).catch((e) => toast(cloudMessage(e)));
});
document.addEventListener("submit", async (ev) => {
  if (ev.target.id === "people-search") {
    ev.preventDefault();
    loadCommunity(new FormData(ev.target).get("handle"));
    return;
  }
  if (ev.target.id !== "auth-form") return;
  ev.preventDefault();
  const f = new FormData(ev.target), mode = ev.submitter?.value || (ev.target.dataset.recovery === "true" ? "recovery" : ev.target.dataset.mode);
  const buttons = ev.target.querySelectorAll("button");
  if (mode === "signup") {
    const handle = cleanHandle(f.get("handle")), name = String(f.get("name") || "").trim();
    const problem = !name ? "Escribe tu nombre." : handleProblem(handle);
    if (problem) {
      $("#auth-error").textContent = problem;
      return;
    }
  }
  buttons.forEach((b) => b.disabled = true);
  try {
    let result;
    if (mode === "recovery") result = await db.auth.updateUser({ password: f.get("password") });
    else if (mode === "signup") {
      const handle = cleanHandle(f.get("handle"));
      if (await handleTaken(handle, null)) throw { code: "23505" };
      result = await db.auth.signUp({ email: f.get("email"), password: f.get("password"), options: { emailRedirectTo: location.origin, data: { handle, name: String(f.get("name")).trim().slice(0, 80) } } });
    }
    else result = await db.auth.signInWithPassword({ email: f.get("email"), password: f.get("password") });
    if (result.error) throw result.error;
    if (mode === "signup" && !result.data.session) {
      $("#auth-error").textContent = "Revisa tu correo para confirmar la cuenta.";
    } else $("#auth-dialog").close();
  } catch (e) {
    $("#auth-error").textContent = cloudMessage(e);
  } finally {
    buttons.forEach((b) => b.disabled = false);
  }
});
window.addEventListener("online", () => {
  if (cloud.pending) flushCloud();
});
window.addEventListener("beforeunload", (ev) => {
  if (cloud.pending) {
    ev.preventDefault();
    ev.returnValue = "";
  }
});
db.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
    setTimeout(() => authDialog(true), 0);
  }
  if (event === "TOKEN_REFRESHED") return;
  if ((session?.user?.id || null) === cloud.user?.id && cloud.ready) return;
  accountTask = accountTask.then(() => loadAccount(session?.user || null)).catch(() => {
  });
});
// Botón atrás: cierra ventanas y vuelve a la pestaña anterior, como una app nativa.
var dialogStack = [];
var ignorePops = 0;
function pushPage(entry2) {
  try {
    history.pushState({ plano: "page", ...entry2 }, "");
  } catch {
  }
}
try {
  history.replaceState({ plano: "page", page: "home" }, "");
} catch {
}
var nativeShowModal = HTMLDialogElement.prototype.showModal;
HTMLDialogElement.prototype.showModal = function() {
  nativeShowModal.call(this);
  if (!this.dataset.historyBound) {
    this.dataset.historyBound = "1";
    this.addEventListener("close", () => {
      const i = dialogStack.indexOf(this);
      if (i < 0) return;
      dialogStack.splice(i, 1);
      if (this.dataset.popClose) {
        delete this.dataset.popClose;
        return;
      }
      ignorePops++;
      history.back();
    });
  }
  if (!dialogStack.includes(this)) {
    dialogStack.push(this);
    try {
      history.pushState({ plano: "dialog" }, "");
    } catch {
    }
  }
};
window.addEventListener("popstate", (ev) => {
  if (ignorePops) {
    ignorePops--;
    return;
  }
  const top = dialogStack[dialogStack.length - 1];
  if (top) {
    if (top.id === "handle-dialog" || !top.open) {
      if (!top.open) dialogStack.pop();
      else history.pushState({ plano: "dialog" }, "");
      return;
    }
    top.dataset.popClose = "1";
    if (top.id === "detail" && filmReturn) closeFilm();
    else top.close();
    return;
  }
  if ($(".plano-ticket-layer")) closeTicket();
  const st = ev.state;
  if (st?.plano !== "page") return;
  if (st.page === "friend" && st.id) openPublicProfile(st.id, true);
  else if (st.page && st.page !== page) navigate(st.page, true);
});
// Plano · v4: transiciones de cine, color del cartel, entrada al guardar, tu año en historias, calendario y "esta noche".
var vtReady = typeof document.startViewTransition === "function";
var filmSource = null;
var filmReturn = null;
var vtClosing = false;
function canMorph() {
  return vtReady && !motionQuery.matches;
}
function onScreen(node) {
  if (!node?.isConnected) return false;
  const r = node.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
}
function buzz(pattern) {
  if (motionQuery.matches) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
  }
}
function openFilm(id) {
  const src = filmSource;
  filmSource = null;
  filmReturn = null;
  if (!canMorph() || !onScreen(src) || $("#detail").open || !CATALOG.some((m) => m.id === id)) return openFilmNow(id);
  const root = document.documentElement;
  src.style.viewTransitionName = "plano-film";
  root.classList.add("vt-film");
  let t;
  try {
    t = document.startViewTransition(() => {
      src.style.viewTransitionName = "";
      openFilmNow(id);
      const p = $("#detail .film-poster");
      if (p) p.style.viewTransitionName = "plano-film";
    });
  } catch {
    src.style.viewTransitionName = "";
    root.classList.remove("vt-film");
    return openFilmNow(id);
  }
  filmReturn = { src };
  t.finished.finally(() => {
    root.classList.remove("vt-film");
    const p = $("#detail .film-poster");
    if (p) p.style.viewTransitionName = "";
  });
}
function closeFilm() {
  const d = $("#detail"), p = d.querySelector(".film-poster"), src = filmReturn?.src;
  if (!d.open) return;
  if (!canMorph() || !onScreen(p) || !onScreen(src)) return d.close();
  const root = document.documentElement;
  vtClosing = true;
  p.style.viewTransitionName = "plano-film";
  root.classList.add("vt-film", "vt-film-back");
  let t;
  try {
    t = document.startViewTransition(() => {
      p.style.viewTransitionName = "";
      d.close();
      src.style.viewTransitionName = "plano-film";
    });
  } catch {
    p.style.viewTransitionName = "";
    vtClosing = false;
    root.classList.remove("vt-film", "vt-film-back");
    return d.close();
  }
  t.finished.finally(() => {
    src.style.viewTransitionName = "";
    vtClosing = false;
    root.classList.remove("vt-film", "vt-film-back");
  });
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest?.("[data-film]");
  filmSource = b && !b.closest("dialog") ? b.querySelector("img") || b.closest("article,.rail-item,.continue-wrap")?.querySelector("img") || null : null;
}, true);
document.addEventListener("click", (ev) => {
  if (!filmReturn || !ev.target.closest?.("#detail [data-close]")) return;
  ev.preventDefault();
  ev.stopImmediatePropagation();
  closeFilm();
}, true);
$("#detail").addEventListener("cancel", (ev) => {
  if (!filmReturn || !canMorph()) return;
  ev.preventDefault();
  closeFilm();
});
$("#detail").addEventListener("close", () => {
  filmReturn = null;
});
function pageTransition(swap) {
  if (!canMorph()) return swap();
  const root = document.documentElement;
  root.classList.add("vt-page");
  try {
    document.startViewTransition(swap).finished.finally(() => root.classList.remove("vt-page"));
  } catch {
    root.classList.remove("vt-page");
    swap();
  }
}
var tintCache = /* @__PURE__ */ new Map();
function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function posterTint(src) {
  if (!src) return Promise.resolve(null);
  if (tintCache.has(src)) return tintCache.get(src);
  const job = loadImg(src).then((img) => {
    const c = document.createElement("canvas"), w = 24, h = 36;
    c.width = w;
    c.height = h;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(img, 0, 0, w, h);
    const data = x.getImageData(0, 0, w, h).data;
    let r = 0, g = 0, b = 0, total = 0;
    for (let i = 0; i < data.length; i += 4) {
      const R = data[i], G = data[i + 1], B = data[i + 2], max = Math.max(R, G, B), min = Math.min(R, G, B), sat = max ? (max - min) / max : 0, lum = (max + min) / 510;
      const weight = sat * sat * (lum > 0.12 && lum < 0.9 ? 1 : 0.08);
      r += R * weight;
      g += G * weight;
      b += B * weight;
      total += weight;
    }
    if (total < 1.5) return null;
    const [hue, s] = rgbToHsl([r / total, g / total, b / total]);
    return s < 0.14 ? null : { h: Math.round(hue * 360), s: Math.round(Math.min(0.82, Math.max(0.42, s)) * 100) };
  }).catch(() => null);
  tintCache.set(src, job);
  return job;
}
function applyTint(node, tint) {
  if (!tint) return node.classList.remove("tinted");
  node.style.setProperty("--tint-h", tint.h);
  node.style.setProperty("--tint-s", tint.s + "%");
  node.classList.add("tinted");
}
function tintDetail(m) {
  const d = $("#detail"), generation = detailGeneration;
  d.classList.remove("tinted");
  posterTint(m.poster).then((tint) => {
    if (d.open && generation === detailGeneration) applyTint(d, tint);
  });
}
async function shareCanvas(canvas, name, text) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw Error("Imagen");
  const file = new File([blob], name, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Plano", text });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  download(blob, name);
  toast("Imagen guardada en tu dispositivo.");
}
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}
function drawCover(c, img, x, y, w, h, r = 18) {
  c.save();
  roundRect(c, x, y, w, h, r);
  c.clip();
  const scale = Math.max(w / img.width, h / img.height), iw = img.width * scale, ih = img.height * scale;
  c.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  c.restore();
}
function wrapText(c, text, x, y, max, lineHeight, maxLines = 3) {
  const words = String(text).split(/\s+/);
  let line = "", rows = 0;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (c.measureText(test).width > max && line) {
      if (rows === maxLines - 1) {
        c.fillText(line + "…", x, y + rows * lineHeight);
        return rows + 1;
      }
      c.fillText(line, x, y + rows * lineHeight);
      rows++;
      line = word;
    } else line = test;
  }
  c.fillText(line, x, y + rows * lineHeight);
  return rows + 1;
}
var EMOTION_HEX = { Asombro: "#8fd3ff", "Alegr\xEDa": "#ffc34d", Nostalgia: "#f0a58f", "Tensi\xF3n": "#e07be0", Tristeza: "#6f8cff", "Inspiraci\xF3n": "#6fe0b5" };
function longDate(d) {
  return validDate(d) ? new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(/* @__PURE__ */ new Date(d + "T12:00:00")) : "Sin fecha";
}
var ticketTimer;
function closeTicket() {
  clearTimeout(ticketTimer);
  const layer = $(".plano-ticket-layer");
  if (!layer) return;
  motionOnce(layer, "plano-ticket-out", 260, () => {
    layer.remove();
    if (!cloud.user) setTimeout(maybeAccountNudge, 400);
  });
}
function showTicket(id) {
  const m = CATALOG.find((x) => x.id === id), e = entry(id);
  if (!m || !e || e.status !== "watched") return;
  clearTimeout(ticketTimer);
  $(".plano-ticket-layer")?.remove();
  const n = stats().watched.length, emotion = e.emotions?.[0];
  const rows = [["Fecha", e.watchedAt ? shortDate(e.watchedAt) : "Sin fecha"], ["Nota", e.rating ? "★ " + e.rating : "—"], ["Emoci\xF3n", emotion || "—"], ["Con", e.companion || ""]].filter(([, v]) => v);
  const layer = document.createElement("div");
  layer.className = "plano-ticket-layer";
  layer.dataset.id = id;
  layer.innerHTML = `<div class="plano-ticket" style="${emotionStyle(e)}"><div class="ticket-main"><span class="ticket-kicker">PLANO \xB7 ENTRADA N\xBA ${String(n).padStart(4, "0")}</span><strong class="ticket-title">${esc(m.title)}</strong><div class="ticket-rows">${rows.map(([k, v]) => `<span><small>${k}</small><b>${esc(v)}</b></span>`).join("")}</div></div><div class="ticket-stub">${m.poster ? `<img src="${esc(m.poster)}" alt="" referrerpolicy="no-referrer">` : ""}<span class="ticket-stamp">GUARDADO</span></div></div><p class="sr-only" role="status">Recuerdo guardado: ${esc(m.title)}. Entrada n\xFAmero ${n}.</p><div class="ticket-actions"><button type="button" class="button secondary" data-ticket="share">Compartir entrada</button><button type="button" class="button" data-ticket="close">Listo</button></div>`;
  document.body.append(layer);
  motionOnce(layer, "plano-ticket-in", 900);
  buzz([12, 70, 20]);
  ticketTimer = setTimeout(closeTicket, 4200);
}
document.addEventListener("pointerdown", (ev) => {
  if (ev.target.closest?.(".plano-ticket-layer")) clearTimeout(ticketTimer);
}, { passive: true });
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && $(".plano-ticket-layer")) closeTicket();
  else if ($(".plano-ticket-layer") && ev.key === "Tab") clearTimeout(ticketTimer);
});
document.addEventListener("click", async (ev) => {
  const layer = ev.target.closest?.(".plano-ticket-layer");
  if (!layer) return;
  const b = ev.target.closest("[data-ticket]");
  if (!b) {
    if (ev.target === layer) closeTicket();
    return;
  }
  if (b.dataset.ticket === "close") return closeTicket();
  b.disabled = true;
  try {
    await shareTicket(layer.dataset.id);
  } catch {
    toast("No se pudo crear la imagen de la entrada.");
  } finally {
    b.disabled = false;
  }
});
async function shareTicket(id) {
  const m = CATALOG.find((x) => x.id === id), e = entry(id);
  if (!m || !e) return;
  await document.fonts.ready;
  const W = 1080, H = 1350, c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d"), color = EMOTION_HEX[e.emotions?.[0]] || "#ff8a6e";
  const bg = x.createRadialGradient(W / 2, 0, 50, W / 2, 300, 1100);
  bg.addColorStop(0, color + "55");
  bg.addColorStop(1, "#14110f");
  x.fillStyle = "#14110f";
  x.fillRect(0, 0, W, H);
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);
  let poster = null;
  try {
    if (m.poster) poster = await loadImg(m.poster);
  } catch {
  }
  const tx = 90, ty = 250, tw = 900, th = 820, stub = 330;
  const paper = document.createElement("canvas");
  paper.width = W;
  paper.height = H;
  const px = paper.getContext("2d");
  px.fillStyle = "#f1e9da";
  roundRect(px, tx, ty, tw, th, 36);
  px.fill();
  px.globalCompositeOperation = "destination-out";
  [[tx + tw - stub, ty], [tx + tw - stub, ty + th]].forEach(([cx, cy]) => {
    px.beginPath();
    px.arc(cx, cy, 34, 0, Math.PI * 2);
    px.fill();
  });
  x.save();
  x.shadowColor = "#000a";
  x.shadowBlur = 60;
  x.shadowOffsetY = 30;
  x.drawImage(paper, 0, 0);
  x.restore();
  x.setLineDash([4, 16]);
  x.lineWidth = 5;
  x.strokeStyle = "#14110f55";
  x.beginPath();
  x.moveTo(tx + tw - stub, ty + 50);
  x.lineTo(tx + tw - stub, ty + th - 50);
  x.stroke();
  x.setLineDash([]);
  if (poster) drawCover(x, poster, tx + tw - stub + 40, ty + 70, stub - 80, th - 140, 20);
  x.fillStyle = "#c4402a";
  x.font = "800 30px Manrope";
  x.fillText("PLANO \xB7 ENTRADA N\xBA " + String(stats().watched.length).padStart(4, "0"), tx + 60, ty + 100);
  x.fillStyle = "#14110f";
  x.font = "800 70px Manrope";
  const lines = wrapText(x, m.title, tx + 60, ty + 200, tw - stub - 110, 78, 3);
  const rows = [["FECHA", longDate(e.watchedAt)], ["NOTA", e.rating ? "★ " + e.rating + " / 10" : "Sin nota"], ["EMOCI\xD3N", e.emotions?.[0] || ""], ["CON", e.companion || ""]].filter(([, v]) => v);
  rows.forEach(([k, v], i) => {
    const y = ty + 230 + lines * 78 + i * 108;
    x.fillStyle = "#8a7d6c";
    x.font = "700 26px Manrope";
    x.fillText(k, tx + 60, y);
    x.fillStyle = "#14110f";
    x.font = "700 40px Manrope";
    wrapText(x, v, tx + 60, y + 48, tw - stub - 110, 44, 1);
  });
  x.save();
  x.translate(tx + tw - stub / 2, ty + th - 150);
  x.rotate(-0.2);
  x.strokeStyle = color;
  x.fillStyle = color;
  x.lineWidth = 6;
  roundRect(x, -130, -42, 260, 84, 14);
  x.stroke();
  x.font = "800 40px Manrope";
  x.textAlign = "center";
  x.fillText("GUARDADO", 0, 15);
  x.restore();
  if (e.review) {
    x.fillStyle = "#f1e9da";
    x.font = "italic 500 40px Manrope";
    wrapText(x, "“" + e.review + "”", 90, ty + th + 110, 900, 52, 2);
  }
  x.fillStyle = "#b8ad9c";
  x.font = "500 24px Manrope";
  x.fillText("Mi diario de cine en Plano \xB7 Carteles de TMDB", 90, H - 60);
  await shareCanvas(c, "plano-entrada.png", `Acabo de guardar ${m.title} en mi diario de cine.`);
}
var PERSONAS = {
  Asombro: ["Alma exploradora", "Buscas historias que te dejen con la boca abierta."],
  "Alegr\xEDa": ["Cazasonrisas", "Para ti, el cine es un lugar donde ser feliz."],
  Nostalgia: ["Coleccionista de recuerdos", "Cada historia te devuelve a alg\xFAn sitio."],
  "Tensi\xF3n": ["Coraz\xF3n al l\xEDmite", "Te gusta vivir las historias con el coraz\xF3n en un pu\xF1o."],
  Tristeza: ["Coraz\xF3n valiente", "No huyes de las historias que duelen: las abrazas."],
  "Inspiraci\xF3n": ["Mente so\xF1adora", "Sales de cada historia con ganas de hacer algo grande."]
};
var MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function yearData() {
  const year = String((/* @__PURE__ */ new Date()).getFullYear()), today = dateISO();
  const list = state.entries.filter((e) => e.status === "watched" && validDate(e.watchedAt) && e.watchedAt.startsWith(year) && e.watchedAt <= today).map((e) => ({ e, m: CATALOG.find((m) => m.id === e.id) })).filter((x) => x.m).sort((a, b) => a.e.watchedAt.localeCompare(b.e.watchedAt));
  const emotions = {}, companions = {}, months = Array(12).fill(0);
  let solo = 0;
  list.forEach(({ e }) => {
    (e.emotions || []).forEach((em, i) => emotions[em] = (emotions[em] || 0) + (i ? 1 : 2));
    if (e.companion && e.companion !== "Solo/a") companions[e.companion] = (companions[e.companion] || 0) + 1;
    else if (e.companion === "Solo/a") solo++;
    months[Number(e.watchedAt.slice(5, 7)) - 1]++;
  });
  const topEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const topCompanion = Object.entries(companions).sort((a, b) => b[1] - a[1])[0] || null;
  const rated = list.filter((x) => x.e.rating != null);
  const best = [...rated].sort((a, b) => b.e.rating - a.e.rating || b.e.watchedAt.localeCompare(a.e.watchedAt))[0] || list[list.length - 1] || null;
  const days = [...new Set(list.map((x) => x.e.watchedAt))].sort();
  let streak = 0, run = 0, prev = null;
  days.forEach((d) => {
    run = prev && (Date.parse(d) - Date.parse(prev)) / 864e5 === 1 ? run + 1 : 1;
    streak = Math.max(streak, run);
    prev = d;
  });
  const topMonth = months.indexOf(Math.max(...months));
  return {
    year,
    list,
    movies: list.filter((x) => x.m.type === "movie").length,
    series: list.filter((x) => x.m.type === "series").length,
    days: days.length,
    streak,
    topEmotion,
    emotionShare: topEmotion ? Math.round(list.filter((x) => x.e.emotions?.includes(topEmotion)).length / list.length * 100) : 0,
    topCompanion,
    solo,
    best,
    months,
    topMonth,
    avg: rated.length ? (rated.reduce((a, x) => a + x.e.rating, 0) / rated.length).toFixed(1) : "—"
  };
}
function posterFan(items, cls = "") {
  return `<div class="wr-fan ${cls}" aria-hidden="true">${items.filter((x) => x.m.poster).slice(0, 3).map((x) => `<img src="${esc(x.m.poster)}" alt="" referrerpolicy="no-referrer">`).join("")}</div>`;
}
function wrappedSlides(y) {
  const slides = [];
  const collage = y.list.filter((x) => x.m.poster).slice(-12);
  slides.push({ bg: "intro", html: `<div class="wr-collage" aria-hidden="true">${collage.map((x) => `<img src="${esc(x.m.poster)}" alt="" referrerpolicy="no-referrer">`).join("")}</div><div class="wr-copy wr-center"><span class="wr-kicker">PLANO PRESENTA</span><h2 class="wr-huge">Tu ${y.year}<br>en cine</h2><p>Este a\xF1o viviste</p><strong class="wr-number" data-count="${y.list.length}">${y.list.length}</strong><p>${y.list.length === 1 ? "historia" : "historias"} que se quedaron contigo.</p></div>` });
  slides.push({ bg: "split", html: `<div class="wr-copy"><span class="wr-kicker">TU A\xD1O EN N\xDAMEROS</span><div class="wr-split"><div><strong class="wr-number" data-count="${y.movies}">${y.movies}</strong><p>${y.movies === 1 ? "pel\xEDcula" : "pel\xEDculas"}</p></div><div><strong class="wr-number" data-count="${y.series}">${y.series}</strong><p>${y.series === 1 ? "serie" : "series"}</p></div></div><ul class="wr-facts"><li><b>${y.days}</b> ${y.days === 1 ? "d\xEDa" : "d\xEDas"} con historia</li><li><b>${y.streak}</b> ${y.streak === 1 ? "d\xEDa" : "d\xEDas"} de tu mejor racha</li><li><b>${y.avg}</b> de nota media</li></ul></div>` });
  if (y.topEmotion) slides.push({ bg: "emotion", style: emotionStyle(y.topEmotion), html: `<div class="wr-copy wr-center"><span class="wr-kicker">LA EMOCI\xD3N DE TU A\xD1O</span><h2 class="wr-huge wr-emotion">${esc(y.topEmotion)}</h2><p>Estuvo en el <b>${y.emotionShare}%</b> de tus recuerdos.</p>${posterFan(y.list.filter((x) => x.e.emotions?.includes(y.topEmotion)).reverse())}</div>` });
  if (y.topCompanion) slides.push({ bg: "company", html: `<div class="wr-copy wr-center"><span class="wr-kicker">TU COMPA\xD1\xCDA FAVORITA</span><h2 class="wr-huge">${esc(y.topCompanion[0])}</h2><p>Compartisteis <b>${y.topCompanion[1]}</b> ${y.topCompanion[1] === 1 ? "historia" : "historias"}.</p>${posterFan(y.list.filter((x) => x.e.companion === y.topCompanion[0]).reverse())}</div>` });
  else if (y.solo) slides.push({ bg: "company", html: `<div class="wr-copy wr-center"><span class="wr-kicker">TU MEJOR COMPA\xD1\xCDA</span><h2 class="wr-huge">T\xFA</h2><p><b>${y.solo}</b> ${y.solo === 1 ? "historia vista" : "historias vistas"} a solas. Sin spoilers ni interrupciones.</p></div>` });
  if (y.best) {
    const e = y.best.e, m = y.best.m;
    slides.push({ bg: "best", style: emotionStyle(e), poster: m.poster, html: `<div class="wr-copy wr-center"><span class="wr-kicker">TU HISTORIA DEL A\xD1O</span>${m.poster ? `<img class="wr-best-poster" src="${esc(m.poster)}" alt="Cartel de ${esc(m.title)}" referrerpolicy="no-referrer">` : ""}<h2 class="wr-title">${esc(m.title)}</h2><p>${e.rating ? `★ ${e.rating} / 10` : ""}${e.rating && e.emotions?.[0] ? " \xB7 " : ""}${esc(e.emotions?.[0] || "")}</p>${e.review ? `<blockquote>“${esc(e.review)}”</blockquote>` : ""}</div>` });
  }
  const max = Math.max(1, ...y.months);
  slides.push({ bg: "month", html: `<div class="wr-copy"><span class="wr-kicker">TU MES M\xC1S CIN\xC9FILO</span><h2 class="wr-huge">${MONTHS[y.topMonth]}</h2><p><b>${y.months[y.topMonth]}</b> ${y.months[y.topMonth] === 1 ? "historia" : "historias"} en un solo mes.</p><div class="wr-bars" role="img" aria-label="Historias por mes">${y.months.map((n, i) => `<span class="${i === y.topMonth ? "top" : ""}" style="--h:${Math.max(4, n / max * 100)}%"><i></i><small>${MONTHS[i][0]}</small></span>`).join("")}</div></div>` });
  const persona = PERSONAS[y.topEmotion] || ["Historia en construcci\xF3n", "Cada historia que guardas dibuja un poco m\xE1s qui\xE9n eres."];
  slides.push({ bg: "persona", style: emotionStyle(y.topEmotion), html: `<div class="wr-copy wr-center"><span class="wr-kicker">TU PERFIL CIN\xC9FILO</span><svg class="wr-badge" viewBox="0 0 100 100" aria-hidden="true"><use href="#plano-mark"/></svg><h2 class="wr-huge wr-persona">${persona[0]}</h2><p>${persona[1]}</p></div>` });
  slides.push({ bg: "share", html: `<div class="wr-copy wr-center"><span class="wr-kicker">ESO HA SIDO TU ${y.year}</span><h2 class="wr-title">Gracias por dejar que el cine te cuente.</h2>${posterFan([...y.list].sort((a, b) => (b.e.rating || 0) - (a.e.rating || 0)), "wr-fan-big")}<div class="wr-actions"><button type="button" class="button" data-wr="share">Compartir mi a\xF1o</button><button type="button" class="button secondary" data-wr="again">Ver de nuevo</button></div></div>` });
  return slides;
}
var wr = null;
function openWrapped() {
  const y = yearData();
  if (!y.list.length) {
    toast("Guarda un recuerdo con fecha de este a\xF1o para ver tu resumen.");
    return;
  }
  let d = $("#wrapped");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "wrapped";
    d.setAttribute("aria-label", "Tu a\xF1o en cine");
    document.body.append(d);
    d.addEventListener("close", () => {
      cancelAnimationFrame(wr?.raf);
      wr = null;
      document.body.classList.remove("film-open");
    });
    d.addEventListener("pointerdown", (ev) => {
      if (wr && !ev.target.closest("button")) wr.paused = true;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) => d.addEventListener(type, () => {
      if (wr) wr.paused = false;
    }));
    d.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight") wrappedGo(1);
      if (ev.key === "ArrowLeft") wrappedGo(-1);
    });
    d.addEventListener("click", async (ev) => {
      const b = ev.target.closest("button");
      if (!b || !wr) return;
      if (b.dataset.wrNav) return wrappedGo(Number(b.dataset.wrNav));
      if (b.hasAttribute("data-wr-close")) return d.close();
      if (b.dataset.wr === "again") return wrappedShow(0);
      if (b.dataset.wr === "share") {
        b.disabled = true;
        try {
          await shareYear(wr.data);
        } catch {
          toast("No se pudo crear la imagen de tu a\xF1o.");
        } finally {
          b.disabled = false;
        }
      }
    });
  }
  const slides = wrappedSlides(y);
  wr = { data: y, slides, i: 0, start: 0, elapsed: 0, paused: false, raf: 0 };
  d.innerHTML = `<div class="wr-progress" aria-hidden="true">${slides.map(() => "<span><i></i></span>").join("")}</div><button type="button" class="wr-close" data-wr-close aria-label="Cerrar resumen">${icon("close")}</button><div class="wr-stage" aria-live="polite"></div><button type="button" class="wr-nav wr-prev" data-wr-nav="-1" aria-label="Historia anterior"></button><button type="button" class="wr-nav wr-next" data-wr-nav="1" aria-label="Historia siguiente"></button>`;
  d.showModal();
  document.body.classList.add("film-open");
  wrappedShow(0);
  wr.raf = requestAnimationFrame(wrappedTick);
}
var WR_TIME = 6500;
function wrappedShow(i) {
  if (!wr) return;
  wr.i = Math.max(0, Math.min(wr.slides.length - 1, i));
  wr.elapsed = 0;
  wr.start = performance.now();
  const s = wr.slides[wr.i], d = $("#wrapped"), stage = d.querySelector(".wr-stage");
  d.dataset.bg = s.bg;
  d.setAttribute("style", s.style || "");
  stage.innerHTML = `<section class="wr-slide wr-${s.bg}" aria-roledescription="historia" aria-label="${wr.i + 1} de ${wr.slides.length}">${s.html}</section>`;
  d.querySelectorAll(".wr-progress i").forEach((bar, n) => bar.style.width = n < wr.i ? "100%" : "0%");
  if (s.poster) posterTint(s.poster).then((tint) => {
    if (wr?.slides[wr.i] === s) applyTint(d, tint);
  });
  else d.classList.remove("tinted");
  if (!motionQuery.matches) {
    motionOnce(stage.firstElementChild, "wr-enter", 700);
    stage.querySelectorAll("[data-count]").forEach((node) => countUp(node, Number(node.dataset.count)));
  }
  buzz(8);
}
function wrappedGo(step) {
  if (!wr) return;
  if (step > 0 && wr.i === wr.slides.length - 1) return;
  wrappedShow(wr.i + step);
}
function wrappedTick(now) {
  if (!wr) return;
  const last = wr.i === wr.slides.length - 1;
  if (wr.paused || motionQuery.matches || last) wr.start = now - wr.elapsed;
  wr.elapsed = now - wr.start;
  const bar = $("#wrapped")?.querySelectorAll(".wr-progress i")[wr.i];
  if (bar) bar.style.width = last ? "100%" : motionQuery.matches ? "0%" : Math.min(100, wr.elapsed / WR_TIME * 100) + "%";
  if (!last && !motionQuery.matches && wr.elapsed >= WR_TIME) wrappedShow(wr.i + 1);
  wr.raf = requestAnimationFrame(wrappedTick);
}
function countUp(node, to, duration = 900) {
  if (!(to > 0)) return;
  const start = performance.now();
  const step = (now) => {
    if (!node.isConnected) return;
    const p = Math.min(1, (now - start) / duration);
    node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  node.textContent = "0";
  requestAnimationFrame(step);
}
async function shareYear(y) {
  await document.fonts.ready;
  const W = 1080, H = 1920, c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d"), color = EMOTION_HEX[y.topEmotion] || "#ff8a6e";
  x.fillStyle = "#14110f";
  x.fillRect(0, 0, W, H);
  const glow = x.createRadialGradient(W / 2, 520, 40, W / 2, 520, 1100);
  glow.addColorStop(0, color + "66");
  glow.addColorStop(0.6, "#e5472f22");
  glow.addColorStop(1, "#14110f00");
  x.fillStyle = glow;
  x.fillRect(0, 0, W, H);
  x.fillStyle = "#ff8a6e";
  x.font = "800 34px Manrope";
  x.fillText("PLANO", 90, 130);
  x.fillStyle = "#f1e9da";
  x.font = "800 96px Manrope";
  x.fillText("Mi " + y.year, 90, 290);
  x.fillText("en cine", 90, 395);
  const top = [...y.list].sort((a, b) => (b.e.rating || 0) - (a.e.rating || 0)).filter((p) => p.m.poster).slice(0, 3);
  const imgs = (await Promise.all(top.map((p) => loadImg(p.m.poster).catch(() => null)))).filter(Boolean);
  const pw = 280, ph = 420, gap = 30, startX = (W - (imgs.length * pw + (imgs.length - 1) * gap)) / 2;
  imgs.forEach((img, i) => {
    x.save();
    x.shadowColor = "#000b";
    x.shadowBlur = 40;
    x.shadowOffsetY = 20;
    x.fillStyle = "#000";
    roundRect(x, startX + i * (pw + gap), 500, pw, ph, 22);
    x.fill();
    x.restore();
    drawCover(x, img, startX + i * (pw + gap), 500, pw, ph, 22);
  });
  const rows = [["Historias", String(y.list.length)], ["Pel\xEDculas \xB7 series", y.movies + " \xB7 " + y.series], ["Emoci\xF3n del a\xF1o", y.topEmotion || "—"], ["Compa\xF1\xEDa favorita", y.topCompanion?.[0] || (y.solo ? "Yo" : "—")], ["Mes m\xE1s cin\xE9filo", MONTHS[y.topMonth]], ["Perfil", (PERSONAS[y.topEmotion] || ["Historia en construcci\xF3n"])[0]]];
  rows.forEach(([k, v], i) => {
    const yy = 1060 + i * 120;
    x.fillStyle = "#b8ad9c";
    x.font = "600 32px Manrope";
    x.fillText(k, 90, yy);
    x.fillStyle = i === 2 ? color : "#f1e9da";
    x.font = "800 52px Manrope";
    x.textAlign = "right";
    wrapText(x, v, W - 90, yy + 4, 560, 56, 1);
    x.textAlign = "left";
    x.fillStyle = "#38312b";
    x.fillRect(90, yy + 40, W - 180, 2);
  });
  x.fillStyle = "#b8ad9c";
  x.font = "500 26px Manrope";
  x.fillText("Mi diario de cine en Plano \xB7 Carteles de TMDB", 90, H - 80);
  await shareCanvas(c, "plano-mi-" + y.year + ".png", `Mi ${y.year} en cine: ${y.list.length} historias.`);
}
function wrappedCta() {
  const y = yearData();
  if (!y.list.length) return "";
  return `<button type="button" class="wrapped-cta" data-wrapped><span class="wrapped-posters" aria-hidden="true">${y.list.filter((x) => x.m.poster).slice(-4).map((x) => `<img src="${esc(x.m.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer">`).join("")}</span><span class="wrapped-copy"><small>NUEVO \xB7 ${y.year}</small><strong>Tu a\xF1o en historias</strong><span>${y.list.length} ${y.list.length === 1 ? "recuerdo" : "recuerdos"}, tu emoci\xF3n del a\xF1o y tu perfil cin\xE9filo</span></span><span class="wrapped-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" fill="currentColor"/></svg></span></button>`;
}
function memoryCalendar(rows) {
  const watched = rows.filter((e) => e.status === "watched" && validDate(e.watchedAt));
  const nowMonth = dateISO().slice(0, 7), latest = watched.map((e) => e.watchedAt).sort().pop();
  if (!/^\d{4}-\d{2}$/.test(calMonth)) calMonth = (latest || dateISO()).slice(0, 7);
  const [y, mo] = calMonth.split("-").map(Number), days = new Date(y, mo, 0).getDate(), lead = (new Date(y, mo - 1, 1).getDay() + 6) % 7;
  const byDay = {};
  watched.filter((e) => e.watchedAt.startsWith(calMonth)).forEach((e) => (byDay[Number(e.watchedAt.slice(8))] ||= []).push(e));
  const label = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(new Date(y, mo - 1, 15));
  const count = Object.values(byDay).reduce((a, l) => a + l.length, 0), today = dateISO();
  let cells = Array.from({ length: lead }, () => '<span class="cal-day cal-blank" aria-hidden="true"></span>').join("");
  for (let d = 1; d <= days; d++) {
    const list = byDay[d], iso = calMonth + "-" + String(d).padStart(2, "0");
    if (list) {
      const e = list[list.length - 1], m = CATALOG.find((x) => x.id === e.id), titles = list.map((x) => CATALOG.find((m2) => m2.id === x.id)?.title).filter(Boolean).join(", ");
      cells += `<button type="button" class="cal-day cal-has" data-film="${e.id}" style="${emotionStyle(e)}" aria-label="${d} de ${esc(label)}: ${esc(titles)}">${m ? image(m) : ""}<span class="cal-num">${d}</span>${list.length > 1 ? `<span class="cal-more">+${list.length - 1}</span>` : ""}</button>`;
    } else cells += `<span class="cal-day${iso === today ? " cal-today" : ""}${iso > today ? " cal-future" : ""}"><span class="cal-num">${d}</span></span>`;
  }
  return `<section class="memory-calendar" aria-label="Calendario de recuerdos"><div class="cal-head"><button type="button" class="icon-button cal-step" data-cal="-1" aria-label="Mes anterior">‹</button><div><h2>${esc(label.charAt(0).toUpperCase() + label.slice(1))}</h2><small>${count} ${count === 1 ? "recuerdo" : "recuerdos"}</small></div><button type="button" class="icon-button cal-step" data-cal="1" aria-label="Mes siguiente" ${calMonth >= nowMonth ? "disabled" : ""}>›</button></div><div class="cal-week" aria-hidden="true">${["L", "M", "X", "J", "V", "S", "D"].map((d) => `<span>${d}</span>`).join("")}</div><div class="cal-grid">${cells}</div>${count ? "" : '<p class="footnote cal-empty">Ning\xFAn recuerdo con fecha este mes. Cada pel\xEDcula que guardes llenar\xE1 un d\xEDa con su cartel.</p>'}</section>`;
}
function diaryToggle() {
  const views = [["list", "Lista", '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'], ["calendar", "Calendario", '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>']];
  return `<div class="view-toggle" role="group" aria-label="Vista del diario">${views.map(([key, label, path]) => `<button type="button" data-diary-view="${key}" aria-pressed="${diaryView === key}" aria-label="${label}" title="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg></button>`).join("")}</div>`;
}
var MOOD_GENRES = {
  Asombro: ["ciencia ficcion", "sci-fi", "fantasia", "aventura", "animacion", "misterio"],
  "Alegr\xEDa": ["comedia", "animacion", "familia", "musica", "kids"],
  Nostalgia: ["drama", "familia", "romance", "historia", "animacion"],
  "Tensi\xF3n": ["suspense", "misterio", "accion", "crimen", "terror", "thriller", "belica", "war"],
  Tristeza: ["drama", "romance", "belica"],
  "Inspiraci\xF3n": ["drama", "musica", "historia", "documental", "biografia"]
};
function plain(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function genreOf(m) {
  return plain(m.genre || GENRES[CATALOG.indexOf(m)] || "");
}
var tonight = { mood: "", company: "", shown: [] };
function tonightCandidates() {
  const pending = state.entries.filter((e) => e.status === "planned" || e.status === "watching").map((e) => CATALOG.find((m) => m.id === e.id)).filter(Boolean);
  if (pending.length >= 2) return pending;
  const known = new Set(state.entries.map((e) => e.id));
  return [...pending, ...CATALOG.filter((m) => !known.has(m.id) && m.poster).slice(0, 40)];
}
function tonightPick() {
  const mood = tonight.mood === "sorpresa" ? EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)] : tonight.mood, wanted = MOOD_GENRES[mood] || [];
  const loved = stats().watched.filter((e) => (e.rating || 0) >= 8 && (!tonight.company || tonight.company === "Solo/a" || e.companion === tonight.company));
  const lovedGenres = loved.map((e) => genreOf(CATALOG.find((m) => m.id === e.id) || {})).join(",");
  const scored = tonightCandidates().map((m) => {
    const g = genreOf(m), e = entry(m.id), hits = wanted.filter((w) => g.includes(w));
    const twin = loved.find((l) => {
      const lg = genreOf(CATALOG.find((x) => x.id === l.id) || {});
      return lg && g && lg.split(",").some((part) => part.trim() && g.includes(part.trim()));
    });
    let score = hits.length * 3 + (e?.status === "watching" ? 2.5 : e ? 2 : 0) + (twin ? 1.5 : 0) + (lovedGenres && g && lovedGenres.includes(g.split(",")[0]) ? 0.5 : 0) + Math.random() * 1.6;
    if (tonight.shown.includes(m.id)) score -= 100;
    const reasons = [];
    if (hits.length && mood) reasons.push(`Buscas ${mood.toLowerCase()} y es ${(m.genre || GENRES[CATALOG.indexOf(m)] || "tu estilo").split(",")[0].trim().toLowerCase()}`);
    if (e?.status === "watching") reasons.push("La tienes a medias");
    else if (e) reasons.push("Est\xE1 en tu lista de pendientes");
    if (twin) reasons.push(`${tonight.company && tonight.company !== "Solo/a" ? "Con " + tonight.company + " os" : "Te"} encant\xF3 ${CATALOG.find((x) => x.id === twin.id)?.title}`);
    return { m, score, reasons, mood };
  }).sort((a, b) => b.score - a.score);
  return scored[0] || null;
}
function tonightCard() {
  const pending = state.entries.filter((e) => e.status === "planned").map((e) => CATALOG.find((m) => m.id === e.id)).filter((m) => m?.poster).slice(-3);
  const fan = (pending.length ? pending : CATALOG.slice(0, 3)).map((m) => `<img src="${esc(m.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer">`).join("");
  return `<section class="tonight-card"><div class="tonight-copy"><span class="tonight-kicker">ESTA NOCHE</span><h2>\xBFQu\xE9 vemos hoy?</h2><p>Dime c\xF3mo te sientes y con qui\xE9n est\xE1s. Yo elijo de tu lista.</p><button type="button" class="button" data-tonight>Elegir por m\xED</button></div><div class="tonight-fan" aria-hidden="true">${fan}</div></section>`;
}
function tonightDialog() {
  let d = $("#tonight");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "tonight";
    d.setAttribute("aria-labelledby", "tonight-title");
    document.body.append(d);
    d.addEventListener("click", (ev) => {
      if (ev.target === d) return d.close();
      const b = ev.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-close")) return d.close();
      if (b.dataset.mood) {
        tonight.mood = b.dataset.mood;
        return tonightStep("company");
      }
      if (b.dataset.company !== void 0 && b.closest("#tonight")) {
        tonight.company = b.dataset.company;
        return tonightStep("result");
      }
      if (b.dataset.tn === "again") return tonightStep("result");
      if (b.dataset.tn === "restart") {
        tonight = { mood: "", company: "", shown: [] };
        return tonightStep("mood");
      }
      if (b.dataset.tn === "open") {
        d.close();
        openFilmNow(b.dataset.id);
      }
    });
  }
  return d;
}
function openTonight() {
  tonight = { mood: "", company: "", shown: [] };
  const d = tonightDialog();
  tonightStep("mood");
  d.showModal();
}
function tonightStep(step) {
  const d = $("#tonight");
  const head = (title) => `<div class="tn-head"><span class="tonight-kicker">ESTA NOCHE</span><button type="button" class="icon-button" data-close aria-label="Cerrar">${icon("close")}</button></div><h2 id="tonight-title">${title}</h2>`;
  if (step === "mood") {
    d.innerHTML = `${head("\xBFQu\xE9 te apetece sentir?")}<div class="tn-moods">${EMOTIONS.map((x) => `<button type="button" class="tn-mood" data-mood="${x}" style="${emotionStyle(x)}"><i class="emotion-dot" aria-hidden="true"></i>${x}</button>`).join("")}<button type="button" class="tn-mood tn-surprise" data-mood="sorpresa">✨ Sorpr\xE9ndeme</button></div>`;
  } else if (step === "company") {
    const people = Object.entries(state.entries.reduce((a, e) => (e.companion && e.companion !== "Solo/a" && (a[e.companion] = (a[e.companion] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([p]) => p);
    d.innerHTML = `${head("\xBFCon qui\xE9n la vas a ver?")}<div class="tn-moods">${["Solo/a", ...people].map((p) => `<button type="button" class="tn-mood" data-company="${esc(p)}">${esc(p)}</button>`).join("")}<button type="button" class="tn-mood" data-company="">Con alguien m\xE1s</button></div>`;
  } else {
    const pick = tonightPick();
    if (!pick) {
      d.innerHTML = `${head("Hoy no tengo propuestas")}<p class="tn-reason">A\xF1ade t\xEDtulos a pendientes y vuelve a probar.</p>`;
      return;
    }
    tonight.shown.push(pick.m.id);
    const reel = tonightCandidates().filter((m) => m.poster && m.id !== pick.m.id).sort(() => Math.random() - 0.5).slice(0, 7);
    d.innerHTML = `${head(pick.mood ? `Para sentir ${esc(pick.mood.toLowerCase())}…` : "Esta noche toca…")}<div class="tn-result"><div class="tn-reel" aria-hidden="true">${[...reel, pick.m].map((m) => `<img src="${esc(m.poster)}" alt="" referrerpolicy="no-referrer">`).join("")}</div><div class="tn-pick"><h3>${esc(pick.m.title)}</h3><p class="muted">${pick.m.type === "movie" ? "Pel\xEDcula" : "Serie"}${pick.m.year ? " \xB7 " + esc(pick.m.year) : ""}</p>${pick.reasons.length ? `<ul class="tn-reasons">${pick.reasons.slice(0, 3).map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}</div></div><div class="tn-actions"><button type="button" class="button" data-tn="open" data-id="${pick.m.id}">Ver ficha</button><button type="button" class="button secondary" data-tn="again">Otra opci\xF3n</button><button type="button" class="text-button" data-tn="restart">Empezar de nuevo</button></div><p class="sr-only" role="status">Te propongo ${esc(pick.m.title)}.</p>`;
    const reelNode = d.querySelector(".tn-reel"), frames = reelNode.children.length;
    posterTint(pick.m.poster).then((tint) => {
      if (d.open) applyTint(d, tint);
    });
    if (motionQuery.matches || frames < 2) {
      reelNode.lastElementChild.classList.add("on");
      d.querySelector(".tn-pick").classList.add("tn-shown");
    } else {
      let i = 0;
      const spin = () => {
        if (!d.open || !reelNode.isConnected) return;
        [...reelNode.children].forEach((img, k) => img.classList.toggle("on", k === i));
        buzz(4);
        if (i < frames - 1) {
          i++;
          setTimeout(spin, 70 + i * i * 9);
        } else {
          motionOnce(reelNode, "tn-land", 500);
          d.querySelector(".tn-pick").classList.add("tn-shown");
          buzz([10, 40, 16]);
        }
      };
      spin();
    }
  }
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest?.("button");
  if (!b) return;
  if (b.dataset.friendTab) {
    friendTab = b.dataset.friendTab;
    render();
    $(`[data-friend-tab="${friendTab}"]`)?.focus();
    return;
  }
  if (b.hasAttribute("data-wrapped")) return openWrapped();
  if (b.hasAttribute("data-tonight")) return openTonight();
  if (b.dataset.diaryView) {
    diaryView = b.dataset.diaryView;
    lsSet("plano-diary-view", diaryView);
    pageTransition(render);
    return;
  }
  if (b.dataset.cal) {
    const [y, m] = calMonth.split("-").map(Number), next = new Date(y, m - 1 + Number(b.dataset.cal), 15);
    calMonth = next.getFullYear() + "-" + String(next.getMonth() + 1).padStart(2, "0");
    render();
    $(".memory-calendar [data-cal='" + b.dataset.cal + "']:not([disabled])")?.focus();
  }
});
var duo = { list: [], shown: [], stats: null, seq: 0 };
function duoFirst(p) {
  return (p.name || "").split(" ")[0] || "@" + p.handle;
}
function duoCandidates() {
  const p = cloud.friend, first = duoFirst(p), theirs = new Map(cloud.friendEntries.map((r) => [r.title_id, r])), mine = new Map(state.entries.map((e) => [e.id, e])), out = new Map();
  const add = (id, score, reason) => {
    const m = CATALOG.find((x) => x.id === id);
    if (!m?.poster) return;
    const t = theirs.get(id), e = mine.get(id);
    if (t?.status === "watched" && e?.status === "watched") return;
    const cur = out.get(id);
    if (cur) {
      cur.score += score / 4;
      if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
    } else out.set(id, { m, score, reasons: [reason] });
  };
  for (const [id, t] of theirs) {
    const e = mine.get(id);
    if (t.status === "planned" && e?.status === "planned") add(id, 100, "Los dos la ten\xE9is pendiente");
    else if (t.status === "watched" && (t.rating || 0) >= 8 && e?.status === "planned") add(id, 85, `A ${first} le encant\xF3 (★ ${t.rating}) y est\xE1 en tu lista`);
    else if (t.status === "planned" && e?.status === "watched" && (e.rating || 0) >= 8) add(id, 70, `T\xFA le diste ★ ${e.rating} y ${first} la tiene pendiente`);
    else if (t.status === "watched" && (t.rating || 0) >= 8 && !e) add(id, 60, `A ${first} le encant\xF3 y t\xFA a\xFAn no la has visto`);
    else if (t.status === "planned" && !e) add(id, 35, `${first} la tiene pendiente`);
  }
  for (const [id, e] of mine) if (e.status === "planned" && !theirs.has(id)) add(id, 30, "Est\xE1 en tu lista");
  for (const r of duo.extra) add(r.id, 55, r.reason);
  return [...out.values()].sort((a, b) => b.score - a.score);
}
function duoStats() {
  const p = cloud.friend, first = duoFirst(p), match = tasteMatch(cloud.friendEntries), mine = new Map(state.entries.map((e) => [e.id, e]));
  const both = match.common.map((r) => ({ r, e: mine.get(r.title_id), m: CATALOG.find((x) => x.id === r.title_id) })).filter((x) => x.m);
  const rated = both.filter((x) => x.r.rating && x.e.rating);
  const unite = rated.filter((x) => x.r.rating >= 7 && x.e.rating >= 7).sort((a, b) => Math.min(b.r.rating, b.e.rating) - Math.min(a.r.rating, a.e.rating))[0];
  const split = rated.filter((x) => Math.abs(x.r.rating - x.e.rating) >= 3).sort((a, b) => Math.abs(b.r.rating - b.e.rating) - Math.abs(a.r.rating - a.e.rating))[0];
  const em = {};
  both.forEach((x) => (x.r.emotions || []).forEach((a) => (x.e.emotions || []).includes(a) && (em[a] = (em[a] || 0) + 1)));
  const feel = Object.entries(em).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  return { first, score: match.score, common: both.length, unite, split, feel };
}
function duoDialog() {
  let d = $("#duo");
  if (d) return d;
  d = document.createElement("dialog");
  d.id = "duo";
  d.setAttribute("aria-labelledby", "duo-title");
  document.body.append(d);
  d.addEventListener("click", (ev) => {
    if (ev.target === d) return d.close();
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-close")) return d.close();
    if (b.dataset.film) return d.close();
    if (b.dataset.duo === "again") return duoPick();
    if (b.dataset.duo === "share") return duoShare();
    if (b.dataset.duo === "open") {
      d.close();
      openFilmNow(b.dataset.id);
    }
  });
  return d;
}
function duoAvatars(p) {
  const meAvatar = state.profile.avatar ? `<img src="${esc(state.profile.avatar)}" alt="">` : `<span>${esc((state.profile.name || "T\xFA").slice(0, 2).toUpperCase())}</span>`;
  return `<div class="duo-faces" aria-hidden="true"><div class="fp-avatar">${meAvatar}</div><div class="fp-avatar">${friendAvatar(p)}</div></div>`;
}
function openDuo() {
  const p = cloud.friend;
  if (!p || !cloud.user) return;
  duo = { list: [], shown: [], stats: duoStats(), seq: duo.seq + 1, extra: [], current: null };
  duo.list = duoCandidates();
  const d = duoDialog(), s = duo.stats;
  const row = (label, x, text) => x ? `<button type="button" class="duo-fact" data-film="${esc(x.m.id)}">${image(x.m)}<span><small>${label}</small><b>${esc(x.m.title)}</b><em>${text}</em></span></button>` : "";
  d.innerHTML = `<div class="tn-head"><span class="tonight-kicker">PLAN A D\xDAO</span><button type="button" class="icon-button" data-close aria-label="Cerrar">${icon("close")}</button></div>${duoAvatars(p)}<h2 id="duo-title">T\xFA y ${esc(s.first)}</h2><p class="duo-sub">${s.score !== null ? `<b>${s.score}%</b> compatibles \xB7 ${s.common} ${s.common === 1 ? "historia" : "historias"} en com\xFAn${s.feel ? ` \xB7 a los dos os hace sentir <b>${esc(s.feel.toLowerCase())}</b>` : ""}` : "Todav\xEDa no hab\xE9is visto nada en com\xFAn. Esta puede ser la primera."}</p>${s.unite || s.split ? `<div class="duo-facts">${row("Lo que os une", s.unite, `T\xFA ★ ${s.unite?.e.rating} \xB7 ${esc(s.first)} ★ ${s.unite?.r.rating}`)}${row("Lo que os separa", s.split, `T\xFA ★ ${s.split?.e.rating} \xB7 ${esc(s.first)} ★ ${s.split?.r.rating} \xB7 \xBFdebate?`)}</div>` : ""}<div class="duo-stage" id="duo-stage"></div>`;
  d.showModal();
  duoPick();
  duoMore(duo.seq);
}
async function duoMore(seq) {
  const mine = new Map(state.entries.map((e) => [e.id, e])), loved = cloud.friendEntries.filter((r) => r.status === "watched" && (r.rating || 0) >= 7 && (mine.get(r.title_id)?.rating || 0) >= 7 && /^tmdb:(movie|tv):\d+$/.test(r.title_id)).slice(0, 2);
  if (!loved.length) return;
  const seen = new Set([...state.entries.filter((e) => e.status === "watched").map((e) => e.id), ...cloud.friendEntries.filter((r) => r.status === "watched").map((r) => r.title_id)]);
  try {
    const results = await Promise.all(loved.map(async (r) => {
      const [, type, id] = r.title_id.split(":");
      const data = await requestTMDB(`/${type}/${id}/recommendations`, { page: 1 });
      return (data.results || []).map((x) => fromTMDB(x, type)).filter((m) => m?.poster && !seen.has(m.id)).slice(0, 6).map((m) => ({ m, reason: `Porque a los dos os gust\xF3 ${r.title}` }));
    }));
    if (seq !== duo.seq) return;
    const flat = results.flat();
    cacheRemote(flat.map((x) => x.m));
    duo.extra = flat.map((x) => ({ id: x.m.id, reason: x.reason }));
    duo.list = duoCandidates();
    if (!duo.current) duoPick();
  } catch {
  }
}
function duoPick() {
  const d = $("#duo"), stage = $("#duo-stage");
  if (!d || !stage) return;
  let pool = duo.list.filter((c) => !duo.shown.includes(c.m.id));
  if (!pool.length && duo.list.length) {
    duo.shown = [];
    pool = duo.list;
  }
  const top = pool.slice(0, 4), pick = duo.shown.length ? top[Math.floor(Math.random() * top.length)] : top[0];
  duo.current = pick || null;
  if (!pick) {
    stage.innerHTML = `<p class="tn-reason duo-empty">A\xFAn no tengo propuesta para los dos. A\xF1adid t\xEDtulos a pendientes o valorad las que hab\xE9is visto y lo vuelvo a intentar.</p>`;
    return;
  }
  duo.shown.push(pick.m.id);
  const reel = duo.list.filter((c) => c.m.id !== pick.m.id).map((c) => c.m).sort(() => Math.random() - 0.5).slice(0, 7);
  stage.innerHTML = `<h3 class="duo-label">Para ver juntos</h3><div class="tn-result"><div class="tn-reel" aria-hidden="true">${[...reel, pick.m].map((m) => `<img src="${esc(m.poster)}" alt="" referrerpolicy="no-referrer">`).join("")}</div><div class="tn-pick"><h3>${esc(pick.m.title)}</h3><p class="muted">${pick.m.type === "movie" ? "Pel\xEDcula" : "Serie"}${pick.m.year ? " \xB7 " + esc(pick.m.year) : ""}</p><ul class="tn-reasons">${pick.reasons.slice(0, 2).map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div></div><div class="tn-actions"><button type="button" class="button" data-duo="share">Proponer plan</button><button type="button" class="button secondary" data-duo="again">Otra</button><button type="button" class="text-button" data-duo="open" data-id="${pick.m.id}">Ver ficha</button></div><p class="sr-only" role="status">Os propongo ${esc(pick.m.title)}.</p>`;
  posterTint(pick.m.poster).then((tint) => {
    if (d.open) applyTint(d, tint);
  });
  const reelNode = stage.querySelector(".tn-reel"), frames = reelNode.children.length, show = () => stage.querySelector(".tn-pick")?.classList.add("tn-shown");
  if (motionQuery.matches || frames < 2) {
    reelNode.lastElementChild.classList.add("on");
    return show();
  }
  let i = 0;
  const spin = () => {
    if (!d.open || !reelNode.isConnected) return;
    [...reelNode.children].forEach((img, k) => img.classList.toggle("on", k === i));
    buzz(4);
    if (i < frames - 1) {
      i++;
      setTimeout(spin, 70 + i * i * 9);
    } else {
      motionOnce(reelNode, "tn-land", 500);
      show();
      buzz([10, 40, 16]);
    }
  };
  spin();
}
async function duoShare() {
  const pick = duo.current, s = duo.stats;
  if (!pick) return;
  const text = `\xBFVemos ${pick.m.title}${pick.m.year ? ` (${pick.m.year})` : ""} juntos? \u{1F37F}${s.score !== null ? ` Seg\xFAn Plano somos ${s.score}% compatibles.` : ""}`, url = location.origin + "/";
  try {
    if (navigator.share) return await navigator.share({ title: "Plan a d\xFAo en Plano", text, url });
    await navigator.clipboard.writeText(text + " " + url);
    toast("Plan copiado. P\xE9galo en vuestro chat.");
  } catch (e) {
    if (e?.name !== "AbortError") toast("No se pudo compartir el plan.");
  }
}
document.addEventListener("click", (ev) => {
  if (ev.target.closest?.("[data-duo-open]")) openDuo();
});
if (lsGet("plano-diary-view") === "calendar") diaryView = "calendar";
if (new URLSearchParams(location.search).has("tonight")) setTimeout(() => {
  history.replaceState({ plano: "page", page: "home" }, "", location.pathname);
  openTonight();
}, 700);
render();
setTimeout(() => {
  try {
    maybeWelcome();
  } catch {
  }
}, 450);
loadHome();
persistCatalog();