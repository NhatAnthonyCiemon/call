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
    async function getIceServers() {
        const response = await fetch(
            "https://global.xirsys.net/_turn/MyFirstApp",
            {
                method: "PUT",
                headers: {
                    Authorization:
                        "Basic " +
                        btoa("nhat:67e43036-a35e-11ef-8fc0-0242ac150002"),
                    "Content-Type": "application/json",
                },
            }
        );
        const iceServers = await response.json();
        return iceServers.v.iceServers; // Đây là danh sách các ICE servers
    }

    // Sử dụng các ICE servers từ Xirsys trong cấu hình WebRTC
    getIceServers().then((iceServers) => {
        peer = new Peer(userId, {
            host: "0.peerjs.com",
            port: 443,
            secure: true,
            config: {
                iceServers: iceServers,
            },
        });
        console.log(userId);
        peer.on("open", () => {});
        listen();
    });
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
