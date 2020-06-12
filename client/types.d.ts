interface MyProps {
  [index: string]: unknown;
  className: string;
}

interface MyServiceWorkerConfig {
  [index: string]: unknown;
  onSuccess: (registration: ServiceWorkerRegistration) => void;
  onUpdate: (registration: ServiceWorkerRegistration) => void;
}
