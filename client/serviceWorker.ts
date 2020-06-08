interface MyServiceWorkerConfig {
  onSuccess(registration: ServiceWorkerRegistration): void;
  onUpdate(registration: ServiceWorkerRegistration): void;
  [key: string]: any;
}

const { hostname, origin } = window.location;

const isLocalhost = Boolean(
  hostname === "localhost" ||
    hostname === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.exec(hostname)
);

const scriptURL = `${process.env.PUBLIC_URL}/service-worker.js`;

////////////////////////////////////////////////////////////////////////////////
// functions

function logLocalhostBlurb() {
  console.log(
    "This web app is being served cache-first by a service " +
      "worker. To learn more, visit https://bit.ly/CRA-PWA"
  );
}

function logError(error: Error) {
  console.error(error);
}

function reloadWindow() {
  window.location.reload();
}

function unregisterAndReloadWindow(registration: ServiceWorkerRegistration) {
  registration.unregister().then(reloadWindow).catch(logError);
}

function unregisterServiceWorker(
  registration: ServiceWorkerRegistration
): void {
  registration.unregister().catch(logError);
}

function registerValidSW(config: MyServiceWorkerConfig) {
  const addUpdateFoundHandler = (registration: ServiceWorkerRegistration) => {
    const handleUpdateFound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) return;

      const handleStateChange = () => {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            if (config && config.onUpdate) config.onUpdate(registration);
          } else {
            if (config && config.onSuccess) config.onSuccess(registration);
          }
        }
      };

      installingWorker.onstatechange = handleStateChange;
    };

    registration.onupdatefound = handleUpdateFound;
  };

  navigator.serviceWorker
    .register(scriptURL)
    .then(addUpdateFoundHandler)
    .catch(logError);
}

function checkValidServiceWorker(config: MyServiceWorkerConfig) {
  const handleFulfilled = (response: Response) => {
    const contentType = response.headers.get("content-type");

    if (
      response.status === 404 ||
      (contentType != null && contentType.indexOf("javascript") === -1)
    ) {
      navigator.serviceWorker.ready
        .then(unregisterAndReloadWindow)
        .catch(logError);
    } else {
      registerValidSW(config);
    }
  };

  fetch(scriptURL, { headers: { "Service-Worker": "script" } })
    .then(handleFulfilled)
    .catch(logError);
}

////////////////////////////////////////////////////////////////////////////////
// exports

export function register(config?: MyServiceWorkerConfig): void {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== origin) return;

    const handleLoad = () => {
      if (isLocalhost) {
        checkValidServiceWorker(config);
        navigator.serviceWorker.ready.then(logLocalhostBlurb).catch(logError);
      } else {
        registerValidSW(config);
      }
    };

    window.addEventListener("load", handleLoad);
  }
}

export function unregister(): void {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(unregisterServiceWorker).catch(logError);
  }
}
