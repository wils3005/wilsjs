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
  port: Number(process.env.PORT),
  path: "/",
});

const myConnections: Set<MyConnection> = new Set();

const handleError = (error: Error): void => console.error(error);

// outgoing calls
const callPeers = (ids: string[]): void => {
  for (const id of ids) {
    const callPeer = (stream: MediaStream): void => {
      const connection = peer.call(id, stream);
      myConnections.add(connection);
    };

    navigator.mediaDevices
      .getUserMedia(streamConstraints)
      .then(callPeer)
      .catch(handleError);
  }
};

// incoming calls
const handleCall = (connection: Peer.MediaConnection): void => {
  const answerPeer = (stream: MediaStream): void => {
    myConnections.add(connection);
    connection.answer(stream);
  };

  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then(answerPeer)
    .catch(handleError);
};

const addStreamToVideoElement = (stream: MediaStream): void => {
  const e = document.querySelector<HTMLVideoElement>("video");
  if (e instanceof HTMLVideoElement) e.srcObject = stream;
};

////////////////////////////////////////////////////////////////////////////////
navigator.mediaDevices
  .getUserMedia(streamConstraints)
  .then(addStreamToVideoElement)
  .catch(handleError);

const clientsURL = String(process.env.CLIENTS_URL);

fetch(clientsURL)
  .then(async (response: Response) => response.json())
  .then(callPeers)
  .catch(handleError);

peer.on("call", handleCall);
peer.on("error", handleError);
