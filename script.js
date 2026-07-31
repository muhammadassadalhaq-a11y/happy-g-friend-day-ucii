document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi elemen DOM
    const openingTitle = document.getElementById('openingTitle');
    const startBtn = document.getElementById('startBtn');
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicIcon = document.getElementById('musicIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    
    // Scene Navigation
    const scenes = document.querySelectorAll('.scene');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const replayBtn = document.getElementById('replayBtn');

    // Counter Elements
    const daysCount = document.getElementById('daysCount');
    const hoursCount = document.getElementById('hoursCount');
    const minutesCount = document.getElementById('minutesCount');
    const secondsCount = document.getElementById('secondsCount');

    // Gallery Elements
    const galleryContainer = document.getElementById('galleryContainer');
    const galleryDots = document.getElementById('galleryDots');

    // Letter & Ending Elements
    const typewriterText = document.getElementById('typewriterText');
    const endingMainTitle = document.getElementById('endingMainTitle');
    const endingSubtitle = document.getElementById('endingSubtitle');
    const confettiCanvas = document.getElementById('confettiCanvas');

    let currentScene = 1;
    let counterInterval = null;
    let galleryInterval = null;
    let currentPhotoIndex = 0;
    let isTypingStarted = false;

    // Load Konfigurasi ke UI
    function initConfig() {
        if (typeof CONFIG === 'undefined') {
            console.error('CONFIG tidak ditemukan!');
            return;
        }

        // Scene 1 Title
        openingTitle.innerHTML = `Hai, <span style="color: var(--rose-gold);">${CONFIG.girlName}</span> 🤍`;

        // Background Music Source
        bgMusic.querySelector('source').src = CONFIG.music;
        bgMusic.load();

        // Ending Scene Text
        endingMainTitle.innerText = `Happy Girlfriend Day, ${CONFIG.girlName}!`;
        endingSubtitle.innerText = `Dari ${CONFIG.boyName} untuk ${CONFIG.girlName}, selamanya tercinta.`;

        // Render Gallery
        renderGallery();
    }

    // Render Gallery Images & Dots
    function renderGallery() {
        galleryContainer.innerHTML = '';
        galleryDots.innerHTML = '';

        CONFIG.photos.forEach((photoSrc, index) => {
            // Slide Item
            const slide = document.createElement('div');
            slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = photoSrc;
            img.alt = `Kenangan ${index + 1}`;
            // Fallback jika gambar gagal dimuat
            img.onerror = function() {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1625"/><text x="50%" y="50%" fill="%23e0a96d" font-size="16" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">Foto belum dimasukkan</text></svg>';
            };

            slide.appendChild(img);
            galleryContainer.appendChild(slide);

            // Indicator Dot
            const dot = document.createElement('div');
            dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            galleryDots.appendChild(dot);
        });
    }

    // Gallery Slider Control
    function showSlide(index) {
        const slides = galleryContainer.querySelectorAll('.gallery-slide');
        const dots = galleryDots.querySelectorAll('.indicator-dot');

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
        currentPhotoIndex = index;
    }

    function nextSlide() {
        let nextIndex = (currentPhotoIndex + 1) % CONFIG.photos.length;
        showSlide(nextIndex);
    }

    function goToSlide(index) {
        showSlide(index);
        resetGalleryInterval();
    }

    function resetGalleryInterval() {
        clearInterval(galleryInterval);
        galleryInterval = setInterval(nextSlide, 4000);
    }

    // Relationship Counter Logic
    function startCounter() {
        const startDate = new Date(CONFIG.relationshipDate).getTime();

        function update() {
            const now = new Date().getTime();
            const difference = now - startDate;

            if (difference < 0) {
                daysCount.innerText = 0;
                hoursCount.innerText = 0;
                minutesCount.innerText = 0;
                secondsCount.innerText = 0;
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysCount.innerText = days;
            hoursCount.innerText = String(hours).padStart(2, '0');
            minutesCount.innerText = String(minutes).padStart(2, '0');
            secondsCount.innerText = String(seconds).padStart(2, '0');
        }

        update();
        counterInterval = setInterval(update, 1000);
    }

    // Typewriter Effect for Love Letter
    function startTypewriter() {
        if (isTypingStarted) return;
        isTypingStarted = true;

        typewriterText.innerHTML = '';
        const message = CONFIG.message;
        let i = 0;
        const speed = 35; // Kecepatan ketik (ms)

        function type() {
            if (i < message.length) {
                typewriterText.innerHTML += message.charAt(i) === '\n' ? '<br>' : message.charAt(i);
                i++;
                // Auto scroll letter container
                const container = typewriterText.closest('.letter-container');
                container.scrollTop = container.scrollHeight;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Confetti Animation for Ending Scene
    function triggerConfetti() {
        const canvas = confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        let particles = [];
        const colors = ['#e0a96d', '#ffb6c1', '#f3d0a9', '#ffffff', '#ff9999'];

        for (let i = 0; i < 70; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.7) * 8 - 2,
                gravity: 0.15,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, index) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += p.gravity;
                p.rotation += p.rotationSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                if (p.y > canvas.height) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animateConfetti);
            }
        }
        animateConfetti();
    }

    // Scene Transition Handler
    function changeScene(targetSceneNumber) {
        scenes.forEach(scene => scene.classList.remove('active'));
        const targetScene = document.getElementById(`scene${targetSceneNumber}`);
        if (targetScene) {
            targetScene.classList.add('active');
            currentScene = targetSceneNumber;

            // Trigger specific actions per scene
            if (currentScene === 2) {
                startCounter();
            } else if (currentScene === 3) {
                resetGalleryInterval();
            } else if (currentScene === 4) {
                startTypewriter();
            } else if (currentScene === 5) {
                triggerConfetti();
            }
        }
    }

    // Music Player Controller
    function toggleMusic() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggleBtn.classList.add('playing');
                musicIcon.innerText = '🎶';
            }).catch(e => console.log("Audio autoplay diblokir browser:", e));
        } else {
            bgMusic.pause();
            musicToggleBtn.classList.remove('playing');
            musicIcon.innerText = '🎵';
        }
    }

    // Event Listeners
    startBtn.addEventListener('click', () => {
        // Mulai putar musik saat tombol mulai diklik (bypass browser autoplay policy)
        bgMusic.play().then(() => {
            musicToggleBtn.classList.add('playing');
            musicIcon.innerText = '🎶';
        }).catch(err => console.log(err));

        musicControl.classList.remove('hidden');
        changeScene(2);
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = parseInt(e.currentTarget.getAttribute('data-target'));
            changeScene(target);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = parseInt(e.currentTarget.getAttribute('data-target'));
            changeScene(target);
        });
    });

    replayBtn.addEventListener('click', () => {
        isTypingStarted = false;
        changeScene(1);
    });

    musicToggleBtn.addEventListener('click', toggleMusic);

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });

    // Jalankan inisialisasi awal
    initConfig();
});