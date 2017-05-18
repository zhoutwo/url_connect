import * as React from "react";
import {Grid, Row} from "react-bootstrap";
import {room, storage} from "../backgroundContext";
import {STORAGE_KEY_ID} from "../Constants";

interface IVideoChatControl {
  fromId: string;
  toId: string;
  video: true;
  type: "video-offer" | "video-answer" | "new-ice-candidate" | "close";
  sdp?: RTCSessionDescription | null;
  candidate?: RTCIceCandidate | null;
}

const mediaConstraints = {
  audio: true,
  video: true
};

const closeVideoCall = (con: RTCPeerConnection) => {
  delete con.onaddstream;
  delete con.onremovestream;
  delete con.onicecandidate;
  delete con.oniceconnectionstatechange;
  delete con.onsignalingstatechange;
  delete con.onicegatheringstatechange;
  delete con.onnegotiationneeded;
};

class VideoChatContainer extends React.Component<any, any> {
  private listener;
  private peerId: string;
  constructor(props) {
    super(props);

    this.setState({
      localVideo: <video id="localVideo" autoPlay={true} muted={true}/>,
      remoteVideo: <video id="remoteVideo" autoPlay={true}/>
    });

    this.gotStream = this.gotStream.bind(this);

    const self = new RTCPeerConnection({
      iceServers: [
        {urls: "stun:stun.l.google.com:19302"},
        {urls: "stun:stun1.l.google.com:19302"},
        {urls: "stun:stun2.l.google.com:19302"},
        {urls: "stun:stun3.l.google.com:19302"},
        {urls: "stun:stun4.l.google.com:19302"}
      ]
    });

    this.setState({
      connection: self
    });

    storage.get("peerId").then((peerId) => {
      if (peerId) {
        // Caller
        this.peerId = peerId;
        self.onnegotiationneeded = () => {
          /*
           Wait for answer....
           1.Create an RTCSessionDescription using the received SDP answer
           2.Pass the session description to RTCPeerConnection.setRemoteDescription()
           to configure Naomi’s WebRTC layer to know how Priya’s end of the connection is configured
           */
          this.listener = (data: IVideoChatControl) => {
            storage.get(STORAGE_KEY_ID).then((selfId) => {
              if (data.toId === selfId) {
                if (data.type === "close") {
                  closeVideoCall(self);
                  return room.removeMessageListener(this.listener);
                } else if (data.type === "video-answer") {
                  // Set up the connection
                  const desc = new RTCSessionDescription(data.sdp as RTCSessionDescriptionInit);
                  self.setRemoteDescription(desc)
                  .then(() => {
                    room.removeMessageListener(this.listener);
                  });
                } else if (data.type === "new-ice-candidate") {
                  const candidate = new RTCIceCandidate(data.candidate as RTCIceCandidateInit);
                  return self.addIceCandidate(candidate);
                }
              }
            }).catch((err) => {
              console.error(err);
            });
          };
          room.addMessageListener(this.listener);

          /*
           * 2.Call getUserMedia() to access the webcam and microphone
           * 3.Promise fulfilled:add the local stream by calling RTCPeerConnection.addStream()
           */
          navigator.mediaDevices.getUserMedia(mediaConstraints)
          .then(this.gotStream)
          .catch((err) => {
            console.error(err);
          });

          /*
          * 1.Create an SDP offer by calling RTCPeerConnection.createOffer()
          * 3.Promise fulfilled: set the description of Naomi’s end of the call by calling RTCPeerConnection.setLocalDescription()
          * 4.Promise fulfilled: send the offer through the signaling server to Priya in a message of type “video-offer”
          */
          self.createOffer().then((offer) => {
            return self.setLocalDescription(offer);
          }).then(() => {
            return storage.get(STORAGE_KEY_ID);
          }).then((selfId) => {
            const payload: IVideoChatControl = {
              fromId: selfId,
              sdp: self.localDescription,
              toId: peerId,
              type: "video-offer",
              video: true
            };
            room.pushMessage(payload);
          })
          .catch((err) => {
            console.error(err);
          });
        };
      } else {
        // Receiver
        /*
         Wait for offer...
         2.Create an RTCSessionDescription using the received SDP offer
         3.Call RTCPeerConnection.setRemoteDescription() to tell WebRTC about Naomi’s configuration.
         4.Call getUserMedia() to access the webcam and microphone
         5.Promise fulfilled: add the local stream by calling RTCPeerConnection.addStream()
         6.Promise fulfilled: call RTCPeerConnection.createAnswer() to create an SDP answer to send to Naomi
         7.Promise fulfilled: configure Priya’s end of the connection by match the generated answer
          by calling RTCPeerConnection.setLocalDescription()
         8.Promise fulfilled: send the SDP answer through the signaling server to Naomi in a message of type “video-answer”
         */
        this.listener = (data: IVideoChatControl) => {
          storage.get(STORAGE_KEY_ID).then((selfId) => {
            if (data.toId === selfId) {
              if (data.type === "close") {
                closeVideoCall(self);
                return room.removeMessageListener(this.listener);
              } else if (data.type === "video-offer") {
                // Set up the connection
                this.peerId = data.fromId;
                const desc = new RTCSessionDescription(data.sdp as RTCSessionDescriptionInit);
                return self.setRemoteDescription(desc).then(() => {
                  return navigator.mediaDevices.getUserMedia(mediaConstraints);
                })
                .then(this.gotStream)
                .then(() => {
                  return self.createAnswer();
                }).then((answer) => {
                  return self.setLocalDescription(answer);
                }).then(() => {
                  const payload: IVideoChatControl = {
                    fromId: selfId,
                    sdp: self.localDescription,
                    toId: data.fromId,
                    type: "video-answer",
                    video: true
                  };
                  room.pushMessage(payload);
                });
              } else if (data.type === "new-ice-candidate") {
                /*
                 1.Create an RTCIceCandidate object using the SDP provided in the candidate.
                 2.Deliver the candidate to Priya’s ICE layer by passing it to RTCPeerConnection.addIceCandidate()
                 */
                const candidate = new RTCIceCandidate(data.candidate as RTCIceCandidateInit);
                return self.addIceCandidate(candidate);
              }
            }
          }).catch((err) => {
            console.error(err);
          });
        };
        room.addMessageListener(this.listener);
      }
    });

    self.onicecandidate = (event) => {
      const candidate = event.candidate;
      if (candidate) {
        self.addIceCandidate(candidate)
        .then(() => {
          return storage.get(STORAGE_KEY_ID);
        })
        .then((selfId) => {
          const data: IVideoChatControl = {
            candidate,
            fromId: selfId,
            toId: this.peerId,
            type: "new-ice-candidate",
            video: true
          };
          room.pushMessage(data);
        })
        .catch((err) => {
          console.error(err);
        });
      }
    };

    self.oniceconnectionstatechange = (event) => {
      switch (self.iceConnectionState) {
        case "closed":
        case "failed":
        case "disconnected":
          storage.get(STORAGE_KEY_ID).then((selfId) => {
            const data: IVideoChatControl = {
              fromId: selfId,
              toId: this.peerId,
              type: "close",
              video: true
            };
            room.pushMessage(data);
            closeVideoCall(self);
          });
          break;
        default:
        // Do nothing otherwise
      }
    };

    self.onicegatheringstatechange = (event) => {
      console.log(`ICE gathering state changed to: ${self.iceGatheringState}`);
    };

    self.onsignalingstatechange = (event) => {
      switch (self.signalingState) {
        case "closed":
          closeVideoCall(self);
          break;
        default:
        // Do nothing otherwise
      }
    };

    // Add track event is not yet available
    self.onaddstream = (event) => {
      this.state.remoteVideo.srcObject = event.stream;
    };
  }

  public render(): JSX.Element {
    return (
      <Grid>
        <Row>
          {this.state.localVideo}
          {this.state.remoteVideo}
        </Row>
      </Grid>
    );
  }

  public gotStream(stream) {
    this.state.localVideo.srcObject = stream;
    this.state.connection.addStream(stream);
  }
}

export default VideoChatContainer;
