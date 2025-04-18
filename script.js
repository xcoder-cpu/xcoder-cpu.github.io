// NASA API Key - Replace with your own API key
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your actual NASA API key

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
