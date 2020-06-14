// "default" | "denied" | "granted"
const title = "Your PDF download is ready!";

const notificationOptions: NotificationOptions = {
  body: "Go download it, I guess!",
  icon: "healx-128x128.png",
};

export const notification = new Notification(title, notificationOptions);

////////////////////////////////////////////////////////////////////////////////
const handlePermission = (permission: NotificationPermission): void => {
  console.log({ permission });
};

const handleError = (error: Error): void => console.error({ error });

////////////////////////////////////////////////////////////////////////////////
Notification.requestPermission().then(handlePermission).catch(handleError);
