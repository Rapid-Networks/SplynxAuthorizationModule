enum HttpCode {
  MOVED_PERMANENTLY = 301,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  METHOD_NOT_FOUND = 405,
  REQUEST_TIMEOUT = 408,
  PAYLOAD_TOO_LARGE = 413,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

type ErrorCode = 'INITIALIZATION_ERROR' | 'NETWORK_ERROR' | 'APP_ERROR';

/*As recommended from:
   https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md
*/
/**
 * Custom application error class
 * @extends Error
 */
export class AppError extends Error {
  public readonly name: ErrorCode;
  public readonly message: string;
  public readonly cause: any;

  constructor(name: ErrorCode, message: string, cause: any) {
    super(message);
    /*
     https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
     */
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.message = message;
    this.cause = cause;
    /*As explained on :
      https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/operationalvsprogrammererror.md
        Operational errors refer to situations where you understand what happened and the impact of it
    */

    Error.captureStackTrace(this);
  }
}

/**
 * Custom application network error class
 * @extends Error
 */
export class NetworkAppError extends Error {
  public readonly name: string;
  public readonly httpCode?: HttpCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    description: string,
    isOperational: boolean,
    httpCode?: HttpCode,
  ) {
    super(description);
    /*
     https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
     */
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    /*As explained on :
      https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/operationalvsprogrammererror.md
        Operational errors refer to situations where you understand what happened and the impact of it
    */

    Error.captureStackTrace(this);
  }
}
