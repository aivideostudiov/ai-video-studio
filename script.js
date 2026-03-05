document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const themeToggle = document.getElementById('theme-toggle');
    const generateBtn = document.getElementById('generateBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const loader = document.getElementById('loader');
    const videoPlayer = document.getElementById('video-player');
    const topicInput = document.getElementById('topic');
    const voiceSelect = document.getElementById('ai-voice');
    const musicSelect = document.getElementById('bg-music');

    // --- SETTINGS & TEMPLATES ---
    let globalSettings = { aiVoice: null, bgMusic: 'none' };
    const scriptTemplates = {
        Motivation: [
            "Believe in your infinite potential. Your only limit is you. Break through the barriers. You are unstoppable.",
            "Every great journey begins with a single step. Embrace the challenges. Success is waiting for you. Keep moving forward.",
            "Turn your dreams into reality. Stay focused and disciplined. Your hard work will pay off. The future is yours."
        ],
        Facts: [
            "Did you know the universe is expanding? Every galaxy is moving away from us. Space is filled with mysteries. We have much to learn.",
            "The human brain is a marvel. It contains about 86 billion neurons. It generates about 20 watts of electricity. It controls everything you do.",
            "Honey never spoils. Archaeologists found edible honey in ancient tombs. It has natural preservatives. It is a timeless superfood."
        ],
        Story: [
            "In a forgotten kingdom, a young hero was born. They were destined for greatness. An ancient prophecy foretold their rise. Their adventure begins now.",
            "A mysterious message in a bottle washed ashore. It spoke of a hidden treasure. The journey would be perilous. But the reward was legendary.",
            "She discovered a hidden power within herself. It was a gift from the stars. She had to learn to control it. Her destiny was calling."
        ]
    };
    const musicTracks = {
        'cinematic-ambient': 'https://cdn.pixabay.com/audio/2023/11/23/audio_854d682b64_128.mp3',
        'motivational-uplifting': 'https://cdn.pixabay.com/audio/2022/05/23/audio_adf416398d_128.mp3',
        'news-beat': 'https://cdn.pixabay.com/audio/2022/11/17/audio_8b315a452c_128.mp3'
    };
    const backgroundStyles = ['gradient-motion', 'wave-motion', 'particles'];
    let audio = null;

    // --- FUNCTIONS ---
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '<option value="none">None (Captions Only)</option>' + voices
            .filter(voice => voice.lang.startsWith('en') || voice.lang.startsWith('hi'))
            .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
            .join('');
        globalSettings.aiVoice = voiceSelect.value;
    }

    function generateScript(topic) {
        const allTemplates = Object.values(scriptTemplates).flat();
        const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];
        return randomTemplate.replace(/{{topic}}/g, topic);
    }

    function playScene(scenes, index) {
        if (index >= scenes.length) {
            if (audio) audio.pause();
            videoPlayer.innerHTML = '<div class="end-screen">Video Finished</div>';
            return;
        }

        const sceneData = scenes[index];
        videoPlayer.innerHTML = ''; // Clear previous scene

        const sceneElement = document.createElement('div');
        sceneElement.className = `scene ${sceneData.background}`;
        sceneElement.style.opacity = '0';

        const captionElement = document.createElement('p');
        captionElement.className = 'caption';
        captionElement.textContent = sceneData.text;
        sceneElement.appendChild(captionElement);
        videoPlayer.appendChild(sceneElement);

        // Fade in the scene
        setTimeout(() => { sceneElement.style.opacity = '1'; }, 100);

        if (globalSettings.aiVoice !== 'none') {
            const utterance = new SpeechSynthesisUtterance(sceneData.text);
            const selectedVoice = speechSynthesis.getVoices().find(v => v.name === globalSettings.aiVoice);
            if (selectedVoice) utterance.voice = selectedVoice;

            utterance.onend = () => setTimeout(() => playScene(scenes, index + 1), 500); // Pause before next scene
            speechSynthesis.speak(utterance);
        } else {
            // Auto-advance if no voice
            setTimeout(() => playScene(scenes, index + 1), 4000);
        }
    }

    // --- EVENT LISTENERS ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '🌞';
    });

    settingsBtn.onclick = () => settingsModal.style.display = 'flex';
    closeBtn.onclick = () => settingsModal.style.display = 'none';
    window.onclick = (e) => { if (e.target === settingsModal) settingsModal.style.display = 'none'; };

    voiceSelect.onchange = (e) => globalSettings.aiVoice = e.target.value;
    musicSelect.onchange = (e) => {
        globalSettings.bgMusic = e.target.value;
        if (audio) audio.pause();
        if (globalSettings.bgMusic !== 'none') {
            audio = new Audio(musicTracks[globalSettings.bgMusic]);
            audio.loop = true;
            audio.volume = 0.2;
            if (videoPlayer.innerHTML !== '') audio.play();
        }
    };

    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        if (!topic) return alert('Please enter a topic.');

        if (speechSynthesis.speaking) speechSynthesis.cancel();
        loader.style.display = 'block';
        videoPlayer.innerHTML = '';

        setTimeout(() => {
            const script = generateScript(topic);
            const sentences = script.match(/[^.!?]+[.!?]*/g) || [script];
            const scenes = sentences.map(text => ({
                text: text.trim(),
                background: backgroundStyles[Math.floor(Math.random() * backgroundStyles.length)]
            }));

            if (audio) audio.play().catch(e => console.error(e));
            loader.style.display = 'none';
            playScene(scenes, 0);
        }, 1000);
    });

    // --- INITIALIZATION ---
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    document.body.classList.add('dark-mode'); // Default to dark mode
});