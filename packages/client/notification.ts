// "default" | "denied" | "granted"
// const title = "Your PDF download is ready!";

// const notificationOptions: NotificationOptions = {
//   body: "Go download it, I guess!",
//   icon: "healx-128x128.png",
// };

const handlePermission = (permission: NotificationPermission): void => {
  console.debug({ permission });
};

const handleError = (error: Error): void => console.error({ error });

export default {};

////////////////////////////////////////////////////////////////////////////////
// new Notification(title, notificationOptions);
Notification.requestPermission().then(handlePermission).catch(handleError);
