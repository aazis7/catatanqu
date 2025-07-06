import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <div>
          <h1>Something went wrong</h1>
          <p>{error.data || "An unexpected error has been occured."}</p>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <div>
          <h1>Something went wrong</h1>
          <p>{error.message || "An unexpected error has been occured."}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Something went wrong</h1>
        <p>An unexpected error has been occured.</p>
      </div>
    </div>
  );
}
