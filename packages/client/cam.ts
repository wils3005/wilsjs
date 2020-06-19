import Peer from "peerjs";

interface MyConnection extends Peer.MediaConnection {
  element?: HTMLVideoElement;
}

const streamConstraints = {
  video: {
    width: { min: 160, max: 640 },
    height: { min: 120, max: 480 },
    frameRate: { min: 15, max: 30 },
  },
  audio: true,
};

const peer = new Peer({
  host: process.env.HOST,
  port: Number(process.env.SIGNALING_SERVER_PORT),
  path: "/",
});

const myConnections: Set<MyConnection> = new Set();

const logError = (error: Error): void => console.error(error);

const callPeers = (ids: string[]): void => {
  for (const id of ids) {
    const callPeer = (stream: MediaStream): void => {
      const connection = peer.call(id, stream);
      myConnections.add(connection);
      // addStreamToRemoteVideoElement(connection);
    };

    navigator.mediaDevices
      .getUserMedia(streamConstraints)
      .then(callPeer)
      .catch(logError);
  }
};

const handleCall = (connection: Peer.MediaConnection): void => {
  const answerPeer = (stream: MediaStream): void => {
    myConnections.add(connection);
    // addStreamToRemoteVideoElement(connection);
    connection.answer(stream);
  };

  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then(answerPeer)
    .catch(logError);
};

const addStreamToVideoElement = (stream: MediaStream): void => {
  const e = document.querySelector<HTMLVideoElement>("#local-video");
  if (e instanceof HTMLVideoElement) e.srcObject = stream;
};

navigator.mediaDevices
  .getUserMedia(streamConstraints)
  .then(addStreamToVideoElement)
  .catch(logError);

const clientsUrl = String(process.env.CLIENTS_URL);

fetch(clientsUrl)
  .then(async (response: Response) => response.json())
  .then(callPeers)
  .catch(logError);

peer.on("call", handleCall);
peer.on("error", logError);
