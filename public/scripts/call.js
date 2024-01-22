// document.addEventListener('DOMContentLoaded', async function () {
//     const BASE_URL = "https://chat-service-fhbc.onrender.com";
//     // const BASE_URL = "http://localhost:3000";

//     let peer = new Peer();
//     let myStream;
//     let peerList = [];
//     let room;
//     let toggleVideoValue =true
//     let toggleAudioValue =true
//     const socketSender = localStorage.getItem("socketSender");
//     const socketReceiver = localStorage.getItem("socketReceiver");
//     const senderToken = localStorage.getItem("senderToken");

//     const urlParams = new URLSearchParams(window.location.search);
//     const isAudioCall = urlParams.has('audio');
//     const isVideoCall = urlParams.has('video');
//     let callId;

//     const endCall =document.getElementById('endCall')
//     endCall.addEventListener("click",()=>{
//        window.history.go(-1)
//     })

// const muteButton = document.getElementById('muteButton')
// muteButton.addEventListener("click",()=>{
//     toggleAudioValue=!toggleAudioValue
//     toggleAudio(toggleAudioValue)
// })

// const videoPauseButton = document.getElementById('videoPauseButton')
// videoPauseButton.addEventListener("click",()=>{
//     toggleVideoValue = !toggleVideoValue
//     toggleVideo(toggleVideoValue)
// })

// const switchCameraButton = document.getElementById('switchCameraButton');

// if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
//     switchCameraButton.addEventListener('click', switchCamera);
// } else {
//     console.error('Device enumeration not supported on this browser.');
// }

//     if (isAudioCall) {
//         videoPauseButton.style.display='none'
//         switchCameraButton.style.display='none'
//         callId =urlParams.get('audio')
//         await audioInit(socketSender)
//     } else {
//         callId =urlParams.get('video')
//         await init(socketSender);
//     }

//     async function init(userId) {
//         peer = new Peer(userId);
//         peer.on('open', (id) => {
//             room=id
//             console.log(id + " connected");
//             // if (socketReceiver) {
//             //     makeCall(socketReceiver);
//             // }
//         });
//         listenToCall();
//     }

//     function listenToCall() {
//         console.log('Listen to call...!');
//         peer.on('call', (call) => {
//             console.log('Listen to call...! 2');
//             answerCall(call);
//         });
//     }
    
//     async function answerCall(call) {
//         console.log('Answer to call...!');
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//                 console.log('Answer to call...! 2');
//                 handleStream(stream, call);
//             }).catch((err) => {
//                 console.log("unable to connect because " + err);
//             });
//         }
        
//         async function handleStream(stream, call) {
//         console.log('Handle stream');
//         myStream = stream;
//         addLocalVideo(stream);
//         call.answer(stream);
//         call.on('stream', (remoteStream) => {
//             console.log(remoteStream,call);
//             handleRemoteStream(remoteStream, call);
//         });

//         // notifyReceiver(socketReceiver);
//         toggleVideo(true);
//         document.getElementById("continue_button").style.display = 'none';
//     }

//     function handleRemoteStream(remoteStream, call) {
//         console.log(7, remoteStream);
//         console.log(8, call);
//         console.log(call.peer, remoteStream);
//         const remoteVideo = document.createElement("video");
//         remoteVideo.srcObject = remoteStream;  // Ensure srcObject is set
//         remoteVideo.classList.add("video");
//         remoteVideo.play();
//         remoteVideo.id = call.peer;  // Set id for later reference
//         document.getElementById("remoteVideo").appendChild(remoteVideo);
//         if (!peerList.includes(call.peer)) {
//             peerList.push(call.peer);
//         }
//             document.getElementById("continue_button").style.display = 'none';
//     }



//     function makeCall(receiverId) {
//         console.log(receiverId);
//         console.log(navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation:true} }));
//         navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation:true} })
//         .then((stream) => {
//                 console.log(stream);
//                 myStream = stream;
//                 addLocalVideo(stream);
//                 let call = peer.call(receiverId, stream);
//                 console.log(call);
//                 call.on('stream', (remoteStream) => {
//                     console.log(remoteStream,call);
//                     handleRemoteStream(remoteStream, call);
//                 });
//             }).catch((err) => {
//                 console.log("unable to connect because " + err);
//             });
//     }

//     function addLocalVideo(stream) {
//         let video = document.createElement("video");
//         video.srcObject = stream;
//         video.classList.add("video");
//         video.play();
//         video.muted = true; 
//         document.getElementById("localVideo").appendChild(video);
//     }

//     // function addRemoteVideo(stream, peerId) {
//     //     console.log(stream,peerId);
//     //     let video = document.createElement("video");
//     //     video.srcObject = stream;
//     //     video.classList.add("video");
//     //     video.play();
//     //     video.id = peerId;  // Set the id attribute to the peerId
//     //     document.getElementById("remoteVideo").appendChild(video);
//     // }

    
    
//     function toggleVideo(toggleVideoValue) {
//         console.log(toggleVideoValue);
//         if (toggleVideoValue) {
//             myStream.getVideoTracks()[0].enabled = true;
//             console.log(peerList);
//             peerList.forEach(peerId => {
//                 console.log(peerId);
//                 const remoteVideo = document.getElementById(peerId);
//                 if (remoteVideo) {
//                     remoteVideo.play();
//                 }
//             });
//         } else {
//             myStream.getVideoTracks()[0].enabled = false;
//             console.log(peerList);
//             peerList.forEach(peerId => {
//                 console.log(peerId);
//                 const remoteVideo = document.getElementById(peerId);
//                 if (remoteVideo) {
//                     remoteVideo.pause();
//                 }
//             });
//         }
//     }

//     async function switchCamera() {
//         try {            
//             const devices = await navigator.mediaDevices.enumerateDevices();
//             const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
//             if (videoDevices.length < 2) {
//                 alert("Only One Camera");
//                 return;
//             }
    
//             if (!('facingMode' in navigator.mediaDevices.getSupportedConstraints())) {
//                 alert('facingMode constraint not supported on this browser.');
//                 return;
//             }
    
//             console.log('Video devices:', videoDevices);
    
//             // Determine current facing mode
//             const currentFacingMode = myStream.getVideoTracks()[0].getSettings().facingMode;
//             console.log('Current facing mode:', currentFacingMode);
    
//             // Choose next facing mode (explicitly set for clarity)
//             const nextFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
//             console.log('Next facing mode:', nextFacingMode);
    
//             // Build getUserMedia options
//             const options = {
//                 video: { facingMode: nextFacingMode },
//                 audio: {echoCancellation:true}
//             };
    
//             console.log('Options:', options);
    
//             // Stop existing tracks for local video
//             const localTracks = myStream.getTracks();
//             console.log(localTracks);
//             localTracks.forEach(track => {
//                 if (track.kind === 'video') {
//                     track.stop();
//                 }
//             });
//             console.log( localTracks);
//             console.log( await navigator.mediaDevices);
    
//            // Get the new stream with a delay
//            try {
//             //    const newLocalStream = await navigator.mediaDevices.getUserMedia(options);

//             //     console.log('New stream:', newLocalStream);
//             //     console.log('New stream getVideoTracks:', newLocalStream.getVideoTracks());

//             //     // Replace tracks for both local and remote views
//             //     myStream = newLocalStream;  // Update myStream
//             //     const localVideo = document.querySelector("#localVideo video");
//             //     localVideo.srcObject = newLocalStream;
//             //     localVideo.play();
//             //     localVideo.muted = true;

//             //     console.log(peerList);

//             //     let call = peer.call(socketReceiver, newLocalStream);
//             //     call.on('stream', (remoteStream) => {
//             //         console.log(remoteStream, call);
//             //         handleRemoteStream(remoteStream, call);
//             //     });

//             navigator.mediaDevices.getUserMedia({ video: { facingMode: nextFacingMode },audio: {echoCancellation:true}})
//             .then((stream)=>{
//                 console.log(stream);
//                 myStream = stream;
//                 const localVideo = document.querySelector("#localVideo video");
//                 localVideo.srcObject = stream;
//                 localVideo.play();
//                 localVideo.muted = true;
//                 let call = peer.call(socketReceiver, stream);
//                 console.log(call);
//                 call.on('stream', (remoteStream) => {
//                     console.log(remoteStream,call);
//                     handleRemoteStream(remoteStream, call);
//                 });
//                 console.log('Switched to the next camera.');
//             }).catch((error) => {
//                 console.error('Error getting new local stream:', error);
//                 // Provide user feedback if needed
//                 alert('Error switching camera. Please try again.');
//             })
//         } catch (error) {
//             console.error('Error switching camera:', error);
//             // Provide user feedback if needed
//             alert('Error switching camera. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error switching camera:', error);
//         // Provide user feedback if needed
//         alert('Error switching camera. Please try again.');
//     }}
    
    
// //     async function switchCamera() {
// //         try {
// //             console.log(1);
// //             const newLocalStream = await navigator.mediaDevices.getUserMedia({ video: true,audio:true });
// //             console.log(2, newLocalStream);
// //             const existingCall = peer.call(socketReceiver,newLocalStream);
// //             console.log(3, existingCall);
// //             const oldTrack = existingCall.localStream.getVideoTracks()[0];
// //             console.log(4, oldTrack);
// //             oldTrack.stop();
// //             console.log(5, existingCall);
// //             existingCall.localStream.removeTrack(oldTrack);
// //             console.log(6, existingCall);

// //             // const newVideoTrack = newLocalStream.getVideoTracks()[0];
// // console.log(newLocalStream.getVideoTracks());

// //             existingCall.localStream.addTrack(newLocalStream.getVideoTracks()[0]);
// //             console.log(7, existingCall);
// //           console.log('Switched to the next camera (replaced track).');
// //         } catch (error) {
// //           console.error('Error switching camera:', error);
// //         }
// //       }
      
    

//     function notifyReceiver(receiverId) {
//         alert("Incoming call from " + receiverId);
//     }

//     // Add the continue call button if the user is the sender
//     if (socketSender && isVideoCall) {
//         const response = await fetch(`${BASE_URL}/chat/secondUser?type=video&callId=${callId}`)
//         const secondUser = await response.json()
//         const body = document.getElementById("remoteVideo");
//         const continueCallButton = document.createElement('button');
//         continueCallButton.id = "continue_button";
//         continueCallButton.innerText = 'Join Call';
//         continueCallButton.classList.add("btn", "btn-primary");
//         continueCallButton.addEventListener('click', () => {
//             if (socketReceiver) {
//                 makeCall(socketReceiver);
//             }
//         });
//         if(secondUser?.secondUser === senderToken){
//             body.appendChild(continueCallButton);
//         }
//     }


//     async function audioInit(userId) {
//         peer = new Peer(userId);
//         peer.on('open', (id) => {
//             console.log(id + " connected");
//         });
//         listenToAudioCall();

//     }

//     function listenToAudioCall() {
//         peer.on("call", (call) => {
//                 answerAudioCall(call);
//         });
//     }

//     function answerAudioCall(call) {
//         navigator.mediaDevices.getUserMedia({ video: false, audio: {echoCancellation:true} })
//             .then((stream) => {
//                 handleAudioStream(stream, call);
//             })
//             .catch((err) => {
//                 console.error("Unable to connect:", err);
//             });
//     }

//     function handleAudioStream(stream, call) {
//         myStream = stream;
//         addLocalAudio(stream);
//         call.answer(stream);
//         call.on('stream', (remoteStream) => {
//             handleRemoteAudioStream(remoteStream, call);
//         });

//         // notifyAudioReceiver(socketReceiver);
//         document.getElementById("continue_audio_button").style.display = 'none';
//     }
    
//     function handleRemoteAudioStream(remoteStream, call) {
//         if (!peerList.includes(call.peer)) {
//             addRemoteAudio(remoteStream);
//             peerList.push(call.peer);
//             document.getElementById("continue_audio_button").style.display = 'none';
//         }
//     }

//     function makeAudioCall(receiverId) {
//         navigator.mediaDevices.getUserMedia({ video: false, audio: true })
//             .then((stream) => {
//                 myStream = stream;
//                 addLocalAudio(stream);
//                 let call = peer.call(receiverId, stream);
//                 call.on("stream", (remoteStream) => {
//                     handleRemoteAudioStream(remoteStream, call);
//                 });
//             })
//             .catch((err) => {
//                 console.error("Unable to connect:", err);
//             });
//     }

//     function addLocalAudio(stream) {
//         let audio = document.createElement("audio");
//         audio.srcObject = stream;
//         audio.classList.add("audio");
//         audio.play();
//         document.getElementById("localVideo").appendChild(audio);
//     }

//     function addRemoteAudio(stream) {
//         let audio = document.createElement("audio");
//         audio.srcObject = stream;
//         audio.classList.add("audio");
//         audio.play();
//         audio.muted=true;
//         document.getElementById("remoteVideo").appendChild(audio);
//     }


//     function toggleAudio(toggleAudioValue) {
//         if (toggleAudioValue) {
//             console.log(toggleAudioValue);
//             console.log( myStream.getAudioTracks()[0]);
//             myStream.getAudioTracks()[0].enabled = true
//         } else {
//             console.log(toggleAudioValue);
//             console.log( myStream.getAudioTracks()[0]);
//             myStream.getAudioTracks()[0].enabled = false
//         }
//     }

//     function notifyAudioReceiver(receiverId) {
//         alert("Incoming audio call from " + receiverId);
//     }

//     if (socketSender && isAudioCall) {
//         const response = await fetch(`${BASE_URL}/chat/secondUser?type=audio&callId=${callId}`)
//         const secondUser = await response.json()
//         const body = document.getElementById("remoteVideo");
//         const continueCallButton = document.createElement('button');
//         continueCallButton.id = "continue_audio_button";
//         continueCallButton.innerText = 'Join Audio Call';
//         continueCallButton.classList.add("btn", "btn-primary");
//         continueCallButton.addEventListener('click', () => {
//             if (socketReceiver) {
//                 makeAudioCall(socketReceiver);
//             }
//         });
//         if(secondUser?.secondUser === senderToken){
//             body.appendChild(continueCallButton);
//         }
//     }

//     // Expose functions to the global scope
//     window.init = init;
//     window.makeCall = makeCall;
//     window.toggleVideo = toggleVideo;
//     window.toggleAudio = toggleAudio;

//     // Expose audio call functions to the global scope
//     window.audioInit = audioInit;
//     window.makeAudioCall = makeAudioCall;
//     window.toggleAudio = toggleAudio;
// });







// // document.addEventListener('DOMContentLoaded', async function () {
// //     let peer = new Peer();
// //     let myStream;
// //     let peerList = [];

// //     const socketSender = localStorage.getItem("socketSender");
// //     const socketReceiver = localStorage.getItem("socketReceiver");

// //     const urlParams = new URLSearchParams(window.location.search);
// //     const isAudioCall = urlParams.has('audio');
// //     const isVideoCall = urlParams.has('video');

// //     if (isAudioCall) {
// //         await audioInit(socketSender)
// //     } else {
// //         await init(socketSender);
// //     }

// //     async function init(userId) {
// //         peer = new Peer(userId);
// //         peer.on('open', (id) => {
// //             console.log(id + " connected");
// //         });
// //         listenToCall();
// //     }

// //     function listenToCall() {
// //         peer.on('call', (call) => {
// //             if (isAudioCall) {
// //                 answerAudioCall(call);
// //             } else {
// //                 answerCall(call);
// //             }
// //         });
// //     }

// //     function answerCall(call) {
// //         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
// //             .then((stream) => {
// //                 handleStream(stream, call);
// //             }).catch((err) => {
// //                 console.log("unable to connect because " + err);
// //             });
// //     }

// //     function handleStream(stream, call) {
// //         myStream = stream;
// //         addLocalVideo(stream);
// //         call.answer(stream);
// //         call.on('stream', (remoteStream) => {
// //             handleRemoteStream(remoteStream, call);
// //         });

// //         notifyReceiver(socketReceiver);
// //         toggleVideo(true);

// //         document.getElementById("continue_button").style.display = 'none';
// //     }

// //     function handleRemoteStream(remoteStream, call) {
// //         if (!peerList.includes(call.peer)) {
// //             addRemoteVideo(remoteStream);
// //             peerList.push(call.peer);
// //             document.getElementById("continue_button").style.display = 'none';
// //         }
// //     }

// //     function makeCall(receiverId) {
// //         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
// //             .then((stream) => {
// //                 myStream = stream;
// //                 addLocalVideo(stream);
// //                 let call = peer.call(receiverId, stream);
// //                 call.on('stream', (remoteStream) => {
// //                     handleRemoteStream(remoteStream, call);
// //                 });
// //             }).catch((err) => {
// //                 console.log("unable to connect because " + err);
// //             });
// //     }

// //     function addLocalVideo(stream) {
// //         let video = document.createElement("video");
// //         video.srcObject = stream;
// //         video.classList.add("video");
// //         video.play();
// //         document.getElementById("localVideo").appendChild(video);
// //     }

// //     function addRemoteVideo(stream) {
// //         let video = document.createElement("video");
// //         video.srcObject = stream;
// //         video.classList.add("video");
// //         video.play();
// //         document.getElementById("remoteVideo").appendChild(video);
// //     }

// //     function toggleVideo(b) {
// //         if (b) {
// //             myStream.getVideoTracks()[0].enabled = true;
// //             peerList.forEach(peerId => {
// //                 const remoteVideo = document.getElementById(peerId);
// //                 if (remoteVideo) {
// //                     remoteVideo.play();
// //                 }
// //             });
// //         } else {
// //             myStream.getVideoTracks()[0].enabled = false;
// //             peerList.forEach(peerId => {
// //                 const remoteVideo = document.getElementById(peerId);
// //                 if (remoteVideo) {
// //                     remoteVideo.pause();
// //                 }
// //             });
// //         }
// //     }

// //     function notifyReceiver(receiverId) {
// //         alert("Incoming call from " + receiverId);
// //     }

// //     // Add the continue call button if the user is the sender
// //     if (socketSender && isVideoCall) {
// //         const body = document.getElementById("remoteVideo");
// //         const continueCallButton = document.createElement('button');
// //         continueCallButton.id = "continue_button";
// //         continueCallButton.innerText = 'Continue Call';
// //         continueCallButton.classList.add("btn", "btn-primary");
// //         continueCallButton.addEventListener('click', () => {
// //             if (socketReceiver) {
// //                 makeCall(socketReceiver);
// //             }
// //         });
// //         body.appendChild(continueCallButton);
// //     }

// //     async function audioInit(userId) {
// //         peer = new Peer(userId);
// //         peer.on('open', (id) => {
// //             console.log(id + " connected");
// //         });
// //         listenToAudioCall();

// //     }

// //     function listenToAudioCall() {
// //         peer.on("call", (call) => {
// //             // Check data channel message type
// //             if (isAudioCall) {
// //                 answerAudioCall(call);
// //             }
// //         });
// //     }

// //     function answerAudioCall(call) {
// //         navigator.mediaDevices.getUserMedia({ video: false, audio: true })
// //             .then((stream) => {
// //                 handleAudioStream(stream, call);
// //             })
// //             .catch((err) => {
// //                 console.error("Unable to connect:", err);
// //             });
// //     }

// //     function handleAudioStream(stream, call) {
// //         myStream = stream;
// //         addLocalAudio(stream);
// //         call.answer(stream);
// //         call.on('stream', (remoteStream) => {
// //             handleRemoteAudioStream(remoteStream, call);
// //         });

// //         notifyAudioReceiver(socketReceiver);
// //         document.getElementById("continue_audio_button").style.display = 'none';
// //     }
    
// //     function handleRemoteAudioStream(remoteStream, call) {
// //         if (!peerList.includes(call.peer)) {
// //             addRemoteAudio(remoteStream);
// //             peerList.push(call.peer);
// //             document.getElementById("continue_audio_button").style.display = 'none';
// //         }
// //     }

// //     function makeAudioCall(receiverId) {
// //         navigator.mediaDevices.getUserMedia({ video: false, audio: true })
// //             .then((stream) => {
// //                 myStream = stream;
// //                 addLocalAudio(stream);

// //                 // Send data channel notification to receiver
// //                 // notifyReceiver(receiverId, "audioCall");

// //                 // Create and answer call with audio stream
// //                 let call = peer.call(receiverId, stream);
// //                 call.on("stream", (remoteStream) => {
// //                     handleRemoteAudioStream(remoteStream, call);
// //                 });
// //             })
// //             .catch((err) => {
// //                 console.error("Unable to connect:", err);
// //             });
// //     }

// //     function addLocalAudio(stream) {
// //         let audio = document.createElement("audio");
// //         audio.srcObject = stream;
// //         audio.classList.add("audio");
// //         audio.play();
// //         document.getElementById("localVideo").appendChild(audio);
// //     }

// //     function addRemoteAudio(stream) {
// //         let audio = document.createElement("audio");
// //         audio.srcObject = stream;
// //         audio.classList.add("audio");
// //         audio.play();
// //         document.getElementById("remoteVideo").appendChild(audio);
// //     }

// //     function toggleAudio(b) {
// //         if (b) {
// //             myStream.getAudioTracks()[0].enabled = true
// //         } else {
// //             myStream.getAudioTracks()[0].enabled = false
// //         }
// //     }

// //     function notifyAudioReceiver(receiverId) {
// //         alert("Incoming audio call from " + receiverId);
// //     }

// //     if (socketSender && isAudioCall) {
// //         const body = document.getElementById("remoteVideo");
// //         const continueCallButton = document.createElement('button');
// //         continueCallButton.id = "continue_audio_button";
// //         continueCallButton.innerText = 'Continue Audio Call';
// //         continueCallButton.classList.add("btn", "btn-primary");
// //         continueCallButton.addEventListener('click', () => {
// //             if (socketReceiver) {
// //                 makeAudioCall(socketReceiver);
// //             }
// //         });
// //         body.appendChild(continueCallButton);
// //     }

// //     // Expose functions to the global scope
// //     window.init = init;
// //     window.makeCall = makeCall;
// //     window.toggleVideo = toggleVideo;
// //     window.toggleAudio = toggleAudio;

// //     // Expose audio call functions to the global scope
// //     window.audioInit = audioInit;
// //     window.makeAudioCall = makeAudioCall;
// //     window.toggleAudio = toggleAudio;
// // });




document.addEventListener('DOMContentLoaded', async function () {
    const BASE_URL = "https://chat-service-fhbc.onrender.com";
    // const BASE_URL = "http://localhost:3000";

    let peer = new Peer();
    let myStream;
    let peerList = [];
    let room;
    let toggleVideoValue =true
    let toggleAudioValue =true
    const socketSender = localStorage.getItem("socketSender");
    const socketReceiver = localStorage.getItem("socketReceiver");
    const senderToken = localStorage.getItem("senderToken");

    const urlParams = new URLSearchParams(window.location.search);
    const isAudioCall = urlParams.has('audio');
    const isVideoCall = urlParams.has('video');
    let callId;

    const endCall =document.getElementById('endCall')
    endCall.addEventListener("click",()=>{
       window.history.go(-1)
    })

const muteButton = document.getElementById('muteButton')
muteButton.addEventListener("click",()=>{
    toggleAudioValue=!toggleAudioValue
    toggleAudio(toggleAudioValue)
})

const videoPauseButton = document.getElementById('videoPauseButton')
videoPauseButton.addEventListener("click",()=>{
    toggleVideoValue = !toggleVideoValue
    toggleVideo(toggleVideoValue)
})

const switchCameraButton = document.getElementById('switchCameraButton');

if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    switchCameraButton.addEventListener('click', switchCamera);
} else {
    console.error('Device enumeration not supported on this browser.');
}

    if (isAudioCall) {
        videoPauseButton.style.display='none'
        switchCameraButton.style.display='none'
        callId =urlParams.get('audio')
        await audioInit(socketSender)
    } else {
        callId =urlParams.get('video')
        await init(socketSender);
    }

    async function init(userId) {
        peer = new Peer(userId);
        peer.on('open', (id) => {
            room=id
            console.log(id + " connected");
            // if (socketReceiver) {
            //     makeCall(socketReceiver);
            // }
        });
        listenToCall();
    }

    function listenToCall() {
        peer.on('call', (call) => {
                answerCall(call);
        });
    }

    async function answerCall(call) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                handleStream(stream, call);
            }).catch((err) => {
                console.log("unable to connect because " + err);
            });
    }

    function handleStream(stream, call) {
        myStream = stream;
        addLocalVideo(stream);
        call.answer(stream);
        call.on('stream', (remoteStream) => {
            console.log(remoteStream,call);
            handleRemoteStream(remoteStream, call);
        });

        // notifyReceiver(socketReceiver);
        toggleVideo(true);
        document.getElementById("continue_button").style.display = 'none';
    }

    function handleRemoteStream(remoteStream, call) {
        console.log(7, remoteStream);
                console.log(8, call);
                console.log(call.peer, remoteStream);
                const remoteVideo = document.createElement("video");
                remoteVideo.srcObject = remoteStream;  // Ensure srcObject is set
                remoteVideo.classList.add("video");
                remoteVideo.play();
                remoteVideo.id = call.peer;  // Set id for later reference
                document.getElementById("remoteVideo").appendChild(remoteVideo);
                if (!peerList.includes(call.peer)) {
                    peerList.push(call.peer);
                }
                    document.getElementById("continue_button").style.display = 'none';
    }

    function makeCall(receiverId) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation:true} })
            .then((stream) => {
                myStream = stream;
                addLocalVideo(stream);
                let call = peer.call(receiverId, stream);
                call.on('stream', (remoteStream) => {
                    handleRemoteStream(remoteStream, call);
                });
            }).catch((err) => {
                console.log("unable to connect because " + err);
            });
    }

    function addLocalVideo(stream) {
        let video = document.createElement("video");
        video.srcObject = stream;
        video.classList.add("video");
        video.play();
        video.muted = true; 
        document.getElementById("localVideo").appendChild(video);
    }

    // function addRemoteVideo(stream) {
    //     let video = document.createElement("video");
    //     video.srcObject = stream;
    //     video.classList.add("video");
    //     video.play();
    //     // video.id = peerId;  // Set the id attribute to the peerId
    //     document.getElementById("remoteVideo").appendChild(video);
    // }
    
    
    function toggleVideo(toggleVideoValue) {
        console.log(toggleVideoValue);
        if (toggleVideoValue) {
            myStream.getVideoTracks()[0].enabled = true;
            peerList.forEach(peerId => {
                const remoteVideo = document.getElementById(peerId);
                if (remoteVideo) {
                    remoteVideo.play();
                }
            });
        } else {
            myStream.getVideoTracks()[0].enabled = false;
            peerList.forEach(peerId => {
                const remoteVideo = document.getElementById(peerId);
                if (remoteVideo) {
                    remoteVideo.pause();
                }
            });
        }
    }

    async function switchCamera() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
            if (videoDevices.length < 2) {
                alert("Only One Camera");
                return;
            }
    
            if (!('facingMode' in navigator.mediaDevices.getSupportedConstraints())) {
                alert('facingMode constraint not supported on this browser.');
                return;
            }
    
            // console.log('Video devices:', videoDevices);
    
            // Determine current facing mode
            const currentFacingMode = myStream.getVideoTracks()[0].getSettings().facingMode;
            // console.log('Current facing mode:', currentFacingMode);
    
            // Choose next facing mode (explicitly set for clarity)
            const nextFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
            // console.log('Next facing mode:', nextFacingMode);
    
            // Build getUserMedia options
            const options = {
                video: { facingMode: nextFacingMode },
                audio: {echoCancellation:true}
            };
    
            // console.log('Options:', options);
    
            // Stop existing tracks for local video
            const tracks = myStream.getTracks();
            // console.log(2, tracks);
            tracks.forEach(track => {
                if (track.kind === 'video') {
                    track.stop();
                }
            });
    
            // Get the new stream
            const newStream = await navigator.mediaDevices.getUserMedia(options);
    
            // console.log('New stream:', newStream);
            // console.log('New stream getVideoTracks:', newStream.getVideoTracks());
    
            // Replace tracks for both local and remote views
            myStream = newStream;  // Update myStream
            const localVideo = document.querySelector("#localVideo video");
            localVideo.srcObject = newStream;
            localVideo.play();
            localVideo.muted = true;
            // addLocalVideo(newStream)

            peerList.forEach(peerId => {
                const remoteVideo = document.getElementById(peerId);
                if (remoteVideo) {
                    const callToSwitchCamera = peer.call(peerId, newStream);
                    callToSwitchCamera.on('stream', (remoteStream) => {
                        handleRemoteStream(remoteStream, callToSwitchCamera);
                    });
                }
            });
    
            console.log('Switched to the next camera.');
        } catch (error) {
            console.error('Error switching camera:', error);
            // Provide user feedback if needed
            alert('Error switching camera. Please try again.');
        }
    }
    
    
    
    

    function notifyReceiver(receiverId) {
        alert("Incoming call from " + receiverId);
    }

    // Add the continue call button if the user is the sender
    if (socketSender && isVideoCall) {
        const response = await fetch(`${BASE_URL}/chat/secondUser?type=video&callId=${callId}`)
        const secondUser = await response.json()
        const body = document.getElementById("remoteVideo");
        const continueCallButton = document.createElement('button');
        continueCallButton.id = "continue_button";
        continueCallButton.innerText = 'Join Call';
        continueCallButton.classList.add("btn", "btn-primary");
        continueCallButton.addEventListener('click', () => {
            if (socketReceiver) {
                makeCall(socketReceiver);
            }
        });
        if(secondUser?.secondUser === senderToken){
            body.appendChild(continueCallButton);
        }
    }


    async function audioInit(userId) {
        peer = new Peer(userId);
        peer.on('open', (id) => {
            console.log(id + " connected");
        });
        listenToAudioCall();

    }

    function listenToAudioCall() {
        peer.on("call", (call) => {
                answerAudioCall(call);
        });
    }

    function answerAudioCall(call) {
        navigator.mediaDevices.getUserMedia({ video: false, audio: {echoCancellation:true} })
            .then((stream) => {
                handleAudioStream(stream, call);
            })
            .catch((err) => {
                console.error("Unable to connect:", err);
            });
    }

    function handleAudioStream(stream, call) {
        myStream = stream;
        addLocalAudio(stream);
        call.answer(stream);
        call.on('stream', (remoteStream) => {
            handleRemoteAudioStream(remoteStream, call);
        });

        // notifyAudioReceiver(socketReceiver);
        document.getElementById("continue_audio_button").style.display = 'none';
    }
    
    function handleRemoteAudioStream(remoteStream, call) {
        if (!peerList.includes(call.peer)) {
            addRemoteAudio(remoteStream);
            peerList.push(call.peer);
            document.getElementById("continue_audio_button").style.display = 'none';
        }
    }

    function makeAudioCall(receiverId) {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((stream) => {
                myStream = stream;
                addLocalAudio(stream);
                let call = peer.call(receiverId, stream);
                call.on("stream", (remoteStream) => {
                    handleRemoteAudioStream(remoteStream, call);
                });
            })
            .catch((err) => {
                console.error("Unable to connect:", err);
            });
    }

    function addLocalAudio(stream) {
        let audio = document.createElement("audio");
        audio.srcObject = stream;
        audio.classList.add("audio");
        audio.play();
        document.getElementById("localVideo").appendChild(audio);
    }

    function addRemoteAudio(stream) {
        let audio = document.createElement("audio");
        audio.srcObject = stream;
        audio.classList.add("audio");
        audio.play();
        audio.muted=true;
        document.getElementById("remoteVideo").appendChild(audio);
    }


    function toggleAudio(toggleAudioValue) {
        if (toggleAudioValue) {
            console.log(toggleAudioValue);
            console.log( myStream.getAudioTracks()[0]);
            myStream.getAudioTracks()[0].enabled = true
        } else {
            console.log(toggleAudioValue);
            console.log( myStream.getAudioTracks()[0]);
            myStream.getAudioTracks()[0].enabled = false
        }
    }

    function notifyAudioReceiver(receiverId) {
        alert("Incoming audio call from " + receiverId);
    }

    if (socketSender && isAudioCall) {
        const response = await fetch(`${BASE_URL}/chat/secondUser?type=audio&callId=${callId}`)
        const secondUser = await response.json()
        const body = document.getElementById("remoteVideo");
        const continueCallButton = document.createElement('button');
        continueCallButton.id = "continue_audio_button";
        continueCallButton.innerText = 'Join Audio Call';
        continueCallButton.classList.add("btn", "btn-primary");
        continueCallButton.addEventListener('click', () => {
            if (socketReceiver) {
                makeAudioCall(socketReceiver);
            }
        });
        if(secondUser?.secondUser === senderToken){
            body.appendChild(continueCallButton);
        }
    }

    // Expose functions to the global scope
    window.init = init;
    window.makeCall = makeCall;
    window.toggleVideo = toggleVideo;
    window.toggleAudio = toggleAudio;

    // Expose audio call functions to the global scope
    window.audioInit = audioInit;
    window.makeAudioCall = makeAudioCall;
    window.toggleAudio = toggleAudio;
});







// document.addEventListener('DOMContentLoaded', async function () {
//     let peer = new Peer();
//     let myStream;
//     let peerList = [];

//     const socketSender = localStorage.getItem("socketSender");
//     const socketReceiver = localStorage.getItem("socketReceiver");

//     const urlParams = new URLSearchParams(window.location.search);
//     const isAudioCall = urlParams.has('audio');
//     const isVideoCall = urlParams.has('video');

//     if (isAudioCall) {
//         await audioInit(socketSender)
//     } else {
//         await init(socketSender);
//     }

//     async function init(userId) {
//         peer = new Peer(userId);
//         peer.on('open', (id) => {
//             console.log(id + " connected");
//         });
//         listenToCall();
//     }

//     function listenToCall() {
//         peer.on('call', (call) => {
//             if (isAudioCall) {
//                 answerAudioCall(call);
//             } else {
//                 answerCall(call);
//             }
//         });
//     }

//     function answerCall(call) {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((stream) => {
//                 handleStream(stream, call);
//             }).catch((err) => {
//                 console.log("unable to connect because " + err);
//             });
//     }

//     function handleStream(stream, call) {
//         myStream = stream;
//         addLocalVideo(stream);
//         call.answer(stream);
//         call.on('stream', (remoteStream) => {
//             handleRemoteStream(remoteStream, call);
//         });

//         notifyReceiver(socketReceiver);
//         toggleVideo(true);

//         document.getElementById("continue_button").style.display = 'none';
//     }

//     function handleRemoteStream(remoteStream, call) {
//         if (!peerList.includes(call.peer)) {
//             addRemoteVideo(remoteStream);
//             peerList.push(call.peer);
//             document.getElementById("continue_button").style.display = 'none';
//         }
//     }

//     function makeCall(receiverId) {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((stream) => {
//                 myStream = stream;
//                 addLocalVideo(stream);
//                 let call = peer.call(receiverId, stream);
//                 call.on('stream', (remoteStream) => {
//                     handleRemoteStream(remoteStream, call);
//                 });
//             }).catch((err) => {
//                 console.log("unable to connect because " + err);
//             });
//     }

//     function addLocalVideo(stream) {
//         let video = document.createElement("video");
//         video.srcObject = stream;
//         video.classList.add("video");
//         video.play();
//         document.getElementById("localVideo").appendChild(video);
//     }

//     function addRemoteVideo(stream) {
//         let video = document.createElement("video");
//         video.srcObject = stream;
//         video.classList.add("video");
//         video.play();
//         document.getElementById("remoteVideo").appendChild(video);
//     }

//     function toggleVideo(b) {
//         if (b) {
//             myStream.getVideoTracks()[0].enabled = true;
//             peerList.forEach(peerId => {
//                 const remoteVideo = document.getElementById(peerId);
//                 if (remoteVideo) {
//                     remoteVideo.play();
//                 }
//             });
//         } else {
//             myStream.getVideoTracks()[0].enabled = false;
//             peerList.forEach(peerId => {
//                 const remoteVideo = document.getElementById(peerId);
//                 if (remoteVideo) {
//                     remoteVideo.pause();
//                 }
//             });
//         }
//     }

//     function notifyReceiver(receiverId) {
//         alert("Incoming call from " + receiverId);
//     }

//     // Add the continue call button if the user is the sender
//     if (socketSender && isVideoCall) {
//         const body = document.getElementById("remoteVideo");
//         const continueCallButton = document.createElement('button');
//         continueCallButton.id = "continue_button";
//         continueCallButton.innerText = 'Continue Call';
//         continueCallButton.classList.add("btn", "btn-primary");
//         continueCallButton.addEventListener('click', () => {
//             if (socketReceiver) {
//                 makeCall(socketReceiver);
//             }
//         });
//         body.appendChild(continueCallButton);
//     }

//     async function audioInit(userId) {
//         peer = new Peer(userId);
//         peer.on('open', (id) => {
//             console.log(id + " connected");
//         });
//         listenToAudioCall();

//     }

//     function listenToAudioCall() {
//         peer.on("call", (call) => {
//             // Check data channel message type
//             if (isAudioCall) {
//                 answerAudioCall(call);
//             }
//         });
//     }

//     function answerAudioCall(call) {
//         navigator.mediaDevices.getUserMedia({ video: false, audio: true })
//             .then((stream) => {
//                 handleAudioStream(stream, call);
//             })
//             .catch((err) => {
//                 console.error("Unable to connect:", err);
//             });
//     }

//     function handleAudioStream(stream, call) {
//         myStream = stream;
//         addLocalAudio(stream);
//         call.answer(stream);
//         call.on('stream', (remoteStream) => {
//             handleRemoteAudioStream(remoteStream, call);
//         });

//         notifyAudioReceiver(socketReceiver);
//         document.getElementById("continue_audio_button").style.display = 'none';
//     }
    
//     function handleRemoteAudioStream(remoteStream, call) {
//         if (!peerList.includes(call.peer)) {
//             addRemoteAudio(remoteStream);
//             peerList.push(call.peer);
//             document.getElementById("continue_audio_button").style.display = 'none';
//         }
//     }

//     function makeAudioCall(receiverId) {
//         navigator.mediaDevices.getUserMedia({ video: false, audio: true })
//             .then((stream) => {
//                 myStream = stream;
//                 addLocalAudio(stream);

//                 // Send data channel notification to receiver
//                 // notifyReceiver(receiverId, "audioCall");

//                 // Create and answer call with audio stream
//                 let call = peer.call(receiverId, stream);
//                 call.on("stream", (remoteStream) => {
//                     handleRemoteAudioStream(remoteStream, call);
//                 });
//             })
//             .catch((err) => {
//                 console.error("Unable to connect:", err);
//             });
//     }

//     function addLocalAudio(stream) {
//         let audio = document.createElement("audio");
//         audio.srcObject = stream;
//         audio.classList.add("audio");
//         audio.play();
//         document.getElementById("localVideo").appendChild(audio);
//     }

//     function addRemoteAudio(stream) {
//         let audio = document.createElement("audio");
//         audio.srcObject = stream;
//         audio.classList.add("audio");
//         audio.play();
//         document.getElementById("remoteVideo").appendChild(audio);
//     }

//     function toggleAudio(b) {
//         if (b) {
//             myStream.getAudioTracks()[0].enabled = true
//         } else {
//             myStream.getAudioTracks()[0].enabled = false
//         }
//     }

//     function notifyAudioReceiver(receiverId) {
//         alert("Incoming audio call from " + receiverId);
//     }

//     if (socketSender && isAudioCall) {
//         const body = document.getElementById("remoteVideo");
//         const continueCallButton = document.createElement('button');
//         continueCallButton.id = "continue_audio_button";
//         continueCallButton.innerText = 'Continue Audio Call';
//         continueCallButton.classList.add("btn", "btn-primary");
//         continueCallButton.addEventListener('click', () => {
//             if (socketReceiver) {
//                 makeAudioCall(socketReceiver);
//             }
//         });
//         body.appendChild(continueCallButton);
//     }

//     // Expose functions to the global scope
//     window.init = init;
//     window.makeCall = makeCall;
//     window.toggleVideo = toggleVideo;
//     window.toggleAudio = toggleAudio;

//     // Expose audio call functions to the global scope
//     window.audioInit = audioInit;
//     window.makeAudioCall = makeAudioCall;
//     window.toggleAudio = toggleAudio;
// });