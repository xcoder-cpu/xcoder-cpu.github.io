// NASA API Key - Replace with your own API key
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your actual NASA API key

// Initialize Particles
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// DOM Elements
const apodImg = document.getElementById('apod-img');
const apodTitle = document.getElementById('apod-title');
const apodDate = document.getElementById('apod-date');
const apodExplanation = document.getElementById('apod-explanation');
const marsPhotos = document.getElementById('mars-photos');
const roverSelect = document.getElementById('rover-select');
const earthImg = document.getElementById('earth-img');
const timer = document.getElementById('timer');
const parallaxBg = document.querySelector('.parallax-bg');

// Smooth Parallax Background
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let ease = 0.06;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function handleParallax(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    targetX = (mouseX - centerX) / 50;
    targetY = (mouseY - centerY) / 50;
}

function animate() {
    currentX = lerp(currentX, targetX, ease);
    currentY = lerp(currentY, targetY, ease);
    
    parallaxBg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    
    requestAnimationFrame(animate);
}

document.addEventListener('mousemove', handleParallax);

animate();

function typeText(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    element.classList.add('typing');
    
    // Ensure the element is centered
    element.style.textAlign = 'center';
    element.style.width = '100%';
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing');
            // Ensure the final text is properly centered
            element.style.textAlign = 'center';
        }
    }
    
    type();
}

// Apply typing animation to all text elements
function applyTypingAnimation() {
    const textElements = [
        { element: document.querySelector('.hero h1'), speed: 50 },
        { element: document.querySelector('.hero p'), speed: 30 },
        { element: document.querySelector('#apod-title'), speed: 40 },
        { element: document.querySelector('#apod-date'), speed: 30 },
        { element: document.querySelector('#apod-explanation'), speed: 20 },
        { element: document.querySelector('.earth-info h3'), speed: 40 },
        { element: document.querySelector('.earth-info p'), speed: 30 }
    ];

    textElements.forEach((item, index) => {
        if (item.element) {
            const text = item.element.textContent;
            item.element.textContent = '';
            item.element.style.textAlign = 'center';
            item.element.style.width = '100%';
            
            setTimeout(() => {
                typeText(item.element, text, item.speed);
            }, index * 1000);
        }
    });
}

// Scroll Animation
function handleScroll() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    const triggerBottom = windowHeight * 0.8;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
            // Apply typing animation when section becomes visible
            if (!section.classList.contains('animated')) {
                section.classList.add('animated');
                const headings = section.querySelectorAll('h2');
                headings.forEach((heading, index) => {
                    const text = heading.textContent;
                    heading.textContent = '';
                    setTimeout(() => {
                        typeText(heading, text, 40);
                    }, index * 500);
                });
            }
        }
    });
}

// Initial scroll check
window.addEventListener('load', () => {
    handleScroll();
    applyTypingAnimation();
});
window.addEventListener('scroll', handleScroll);

// Update timer every second
function updateTimer() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    
    const diff = nextHour - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setInterval(updateTimer, 1000);
updateTimer();

// Fetch Astronomy Picture of the Day
async function fetchAPOD() {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        apodImg.src = data.url;
        apodTitle.textContent = data.title;
        apodDate.textContent = data.date;
        apodExplanation.textContent = data.explanation;
    } catch (error) {
        console.error('Error fetching APOD:', error);
    }
}

// Fetch Mars Rover Photos
async function fetchMarsPhotos(rover) {
    try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        marsPhotos.innerHTML = '';
        data.latest_photos.slice(0, 6).forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.img_src;
            img.alt = `Mars photo from ${rover}`;
            marsPhotos.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching Mars photos:', error);
    }
}

// Fetch Earth Image
async function fetchEarthImage() {
    try {
        const response = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const image = data[0];
            const date = image.date.split(' ')[0].replace(/-/g, '/');
            earthImg.src = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${image.image}.png`;
        }
    } catch (error) {
        console.error('Error fetching Earth image:', error);
    }
}

// Event Listeners
roverSelect.addEventListener('change', (e) => {
    fetchMarsPhotos(e.target.value);
});

// Initial Load
fetchAPOD();
fetchMarsPhotos('curiosity');
fetchEarthImage();

// Update content every hour
setInterval(() => {
    fetchAPOD();
    fetchMarsPhotos(roverSelect.value);
    fetchEarthImage();
}, 3600000); // 3600000 milliseconds = 1 hour

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Solar System Carousel
const carousel = document.querySelector('.solar-system-carousel');
if (carousel) {
    const container = carousel.querySelector('.carousel-container');
    const track = carousel.querySelector('.carousel-track');
    const cards = carousel.querySelectorAll('.carousel-card');
    let currentIndex = 0;
    let isAnimating = false;

    function positionCards() {
        cards.forEach((card, index) => {
            // Reset all cards first
            card.classList.remove('far-prev', 'prev', 'active', 'next', 'far-next');
            card.style.display = 'none';
            
            // Calculate relative position
            const relativeIndex = (index - currentIndex + cards.length) % cards.length;
            
            // Position cards based on their relative position
            if (relativeIndex === 0) {
                card.style.display = 'flex';
                card.classList.add('active');
            } else if (relativeIndex === 1) {
                card.style.display = 'flex';
                card.classList.add('next');
            } else if (relativeIndex === cards.length - 1) {
                card.style.display = 'flex';
                card.classList.add('prev');
            } else if (relativeIndex === 2) {
                card.style.display = 'flex';
                card.classList.add('far-next');
            } else if (relativeIndex === cards.length - 2) {
                card.style.display = 'flex';
                card.classList.add('far-prev');
            }
        });
    }

    function updateCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;

        // Update current index
        currentIndex = (currentIndex + direction + cards.length) % cards.length;
        
        // Position cards
        positionCards();
        
        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Mouse wheel event with debounce
    let wheelTimeout;
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (wheelTimeout) return;
        
        const direction = e.deltaY > 0 ? 1 : -1;
        updateCarousel(direction);
        
        wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
        }, 800);
    });

    // Touch events for mobile
    let touchStartY = 0;
    container.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            const direction = diff > 0 ? 1 : -1;
            updateCarousel(direction);
        }
    });

    // Initialize carousel
    window.addEventListener('load', () => {
        positionCards();
    });
}

// 3D rotation effect for hero section
const heroContent = document.querySelector('.hero-content');
const contentWrapper = document.querySelector('.hero-content .content-wrapper');

if (heroContent && contentWrapper) {
    heroContent.addEventListener('mousemove', (e) => {
        const rect = heroContent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        contentWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroContent.addEventListener('mouseleave', () => {
        contentWrapper.style.transform = 'rotateX(0) rotateY(0)';
    });
}
