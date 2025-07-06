export class HTTPException extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;

    Object.setPrototypeOf(this, HTTPException.prototype);
  }
}
