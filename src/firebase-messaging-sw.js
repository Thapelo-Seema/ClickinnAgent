importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');
 
firebase.initializeApp({
    apiKey: "AIzaSyCpJ-f-wGwn2ryQkiMcRcxId-Phhqb329s",
    authDomain: "clickinn-996f0.firebaseapp.com",
    databaseURL: "https://clickinn-996f0.firebaseio.com",
    projectId: "clickinn-996f0",
    storageBucket: "clickinn-996f0.appspot.com",
    messagingSenderId: "882290923419",
    appId: "1:882290923419:web:4fbae14556bc5ce270f33e"
});
 
const messaging = firebase.messaging();

if('serviceWorker' in navigator) { 
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
        console.log("Service Worker Registered");
        messaging.useServiceWorker(registration);  
    })
    .catch(err =>{
        console.log(err);
    }) 
}