
const ownerEmails = ["viresahni1994@gmail.com", "vinadevi3681@gmail.com"];
const ownerMobiles = ["+917091523681", "7520852157", "8092302602"];

let currentUser = null;
let userCount = 0;
let videoCount = 0;
let projectCount = 0;

function loginUser() {
    const username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter your email or mobile number.");
        return;
    }

    currentUser = username;
    userCount++;
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("studio").style.display = "block";
    document.getElementById("welcome").innerText = `Welcome, ${currentUser}`;

    if (isOwner(currentUser)) {
        document.getElementById("admin-controls").style.display = "block";
    } else {
        document.getElementById("admin-controls").style.display = "none";
    }
    loadProjects();
}

function logout() {
    currentUser = null;
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("studio").style.display = "none";
}

function isOwner(user) {
    return ownerEmails.includes(user) || ownerMobiles.includes(user);
}

async function generateVideo() {
    const idea = document.getElementById("idea").value;
    const videoPlayer = document.getElementById("videoPlayer");
    const captionBox = document.getElementById("captionBox");
    const hashtagsBox = document.getElementById("hashtags");

    if (!idea) {
        alert("Please enter a video idea.");
        return;
    }

    videoCount++;

    const apiKey = "YOUR_PIXABAY_API_KEY"; // Replace with your Pixabay API key
    if (apiKey === "YOUR_PIXABAY_API_KEY") {
        alert("Please replace 'YOUR_PIXABAY_API_KEY' with your actual Pixabay API key in script.js");
        return;
    }
    const url = `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(idea)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hits.length > 0) {
            videoPlayer.src = data.hits[0].videos.large.url;
            const caption = `🔥 ${idea} – Watch till the end!`;
            const hashtags = "#AIVideoStudio #ViralVideo #AIEditing #ReelsCreator";
            captionBox.innerText = caption;
            hashtagsBox.innerText = hashtags;

            let speech = new SpeechSynthesisUtterance(caption);
            speech.lang = "en-US";
            speechSynthesis.speak(speech);

        } else {
            alert("No videos found for your idea. Try a different one!");
        }
    } catch (error) {
        console.error("Error fetching video:", error);
        alert("Failed to generate video. Please try again later.");
    }
}


function saveProject() {
    const idea = document.getElementById("idea").value;
    if (!idea) {
        alert("Please enter a video idea to save.");
        return;
    }

    projectCount++;
    const projects = JSON.parse(localStorage.getItem(currentUser)) || [];
    projects.push(idea);
    localStorage.setItem(currentUser, JSON.stringify(projects));
    loadProjects();
}

function loadProjects() {
    const projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";
    const projects = JSON.parse(localStorage.getItem(currentUser)) || [];
    projects.forEach(project => {
        const projectElement = document.createElement("div");
        projectElement.innerText = project;
        projectsContainer.appendChild(projectElement);
    });
}

function openAdminPanel() {ji
    if (isOwner(currentUser)) {
        document.getElementById("adminPanel").style.display = "block";
    } else {
        alert("You do not have permission to access the admin panel.");
    }
}

function openAnalytics() {
    if (isOwner(currentUser)) {
        document.getElementById("userStat").innerText = userCount;
        document.getElementById("videoStat").innerText = videoCount;
        document.getElementById("projectStat").innerText = projectCount;
        document.getElementById("analyticsPanel").style.display = "block";
    } else {
        alert("You do not have permission to access the analytics dashboard.");
    }
}

function systemOn() {
    alert("System is ON");
}

function systemOff() {
    alert("System is OFF");
}
