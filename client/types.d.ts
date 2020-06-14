interface MyServiceWorkerConfig {
  [index: string]: unknown;
  onSuccess: (registration: ServiceWorkerRegistration) => void;
  onUpdate: (registration: ServiceWorkerRegistration) => void;
}
