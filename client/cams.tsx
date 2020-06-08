import { default as Peer } from "peerjs";
import { default as React } from "react";

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

function logError(error: Error) {
  console.error(error);
}

function callPeers(ids: string[]) {
  for (const id of ids) {
    const callPeer = (stream: MediaStream) => {
      const connection = peer.call(id, stream);
      myConnections.add(connection);
      // addStreamToRemoteVideoElement(connection);
    };

    navigator.mediaDevices
      .getUserMedia(streamConstraints)
      .then(callPeer)
      .catch(logError);
  }
}

function handleCall(connection: Peer.MediaConnection) {
  const answerPeer = (stream: MediaStream): void => {
    myConnections.add(connection);
    // addStreamToRemoteVideoElement(connection);
    connection.answer(stream);
  };

  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then(answerPeer)
    .catch(logError);
}

function addStreamToVideoElement(stream: MediaStream) {
  document.querySelector<HTMLVideoElement>("#local-video").srcObject = stream;
}

export function Component() {
  return (
    <div id="cams">
      <video id="local-video" autoPlay muted></video>
    </div>
  );
}

navigator.mediaDevices
  .getUserMedia(streamConstraints)
  .then(addStreamToVideoElement)
  .catch(logError);

fetch(process.env.CLIENTS_URL)
  .then((response) => response.json())
  .then(callPeers)
  .catch(logError);

peer.on("call", handleCall);
peer.on("error", logError);
