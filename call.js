let localVideo = document.getElementById("local-video");
let remoteVideo = document.getElementById("remote-video");

localVideo.style.opacity = 0;
remoteVideo.style.opacity = 0;

localVideo.onplaying = () => {
    localVideo.style.opacity = 1;
};
remoteVideo.onplaying = () => {
    remoteVideo.style.opacity = 1;
};

let peer;
function init(userId) {
    peer = new Peer(userId, {
        host: "0.peerjs.com",
        port: 443,
        secure: true,
    });
    console.log(userId);
    peer.on("open", () => {});

    listen();
}

let localStream;
function listen() {
    peer.on("call", (call) => {
        navigator.getUserMedia(
            {
                audio: true,
                video: true,
            },
            (stream) => {
                localVideo.srcObject = stream;
                localStream = stream;

                call.answer(stream);
                call.on("stream", (remoteStream) => {
                    remoteVideo.srcObject = remoteStream;

                    remoteVideo.className = "primary-video";
                    localVideo.className = "secondary-video";
                });
            }
        );
    });
}

function startCall(otherUserId) {
    console.log(otherUserId);
    navigator.getUserMedia(
        {
            audio: true,
            video: true,
        },
        (stream) => {
            localVideo.srcObject = stream;
            localStream = stream;
            console.log("call");
            const call = peer.call(otherUserId, stream);
            if (!call) {
                Android.onCallError();
                return;
            }

            call.on("stream", (remoteStream) => {
                remoteVideo.srcObject = remoteStream;

                remoteVideo.className = "primary-video";
                localVideo.className = "secondary-video";
            });
        }
    );
}

function toggleVideo(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true;
    } else {
        localStream.getVideoTracks()[0].enabled = false;
    }
}

function toggleAudio(b) {
    if (b == "true") {
        localStream.getAudioTracks()[0].enabled = true;
    } else {
        localStream.getAudioTracks()[0].enabled = false;
    }
}
