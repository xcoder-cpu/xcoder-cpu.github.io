// NASA API Key - Замените на ваш собственный API ключ
const NASA_API_KEY = 'DEMO_KEY'; // Замените на ваш реальный NASA API ключ

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
    
    function updateCursor() {
        const cursor = element.querySelector('.typing::after');
        if (cursor) {
            const textWidth = element.offsetWidth;
            const textHeight = element.offsetHeight;
            cursor.style.left = `${textWidth}px`;
            cursor.style.top = '0';
        }
    }
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
            // Обновляем позицию курсора после каждого символа
            setTimeout(updateCursor, 0);
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
    const sections = document.querySelectorAll('section, .solar-system-section'); 
    const windowHeight = window.innerHeight;
    const triggerBottom = windowHeight * 0.8;
    let earthSectionVisible = false; // Флаг для однократной инициализации глобуса

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
            
            // Инициализация глобуса при первом появлении секции #earth
            if (section.id === 'earth' && !earthSectionVisible) {
                console.log('Секция Земля видима, пытаемся инициализировать глобус');
                // Проверяем наличие необходимых библиотек
                if (typeof THREE === 'undefined') {
                    console.error('Three.js не загружен! Подключаем библиотеку...');
                    const threeScript = document.createElement('script');
                    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
                    document.body.appendChild(threeScript);
                    
                    threeScript.onload = function() {
                        console.log('Three.js успешно загружен');
                        // Теперь загружаем OrbitControls
                        const orbitScript = document.createElement('script');
                        orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                        document.body.appendChild(orbitScript);
                        
                        orbitScript.onload = function() {
                            console.log('OrbitControls успешно загружен');
                            // Пробуем инициализировать глобус
                            if (typeof window.initEarthGlobe === 'function') {
                                window.initEarthGlobe();
                                earthSectionVisible = true;
                            } else {
                                console.error('Функция initEarthGlobe не найдена после загрузки библиотек!');
                            }
                        };
                    };
                } else if (typeof THREE.OrbitControls === 'undefined') {
                    console.error('OrbitControls не загружен! Подключаем библиотеку...');
                    const orbitScript = document.createElement('script');
                    orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                    document.body.appendChild(orbitScript);
                    
                    orbitScript.onload = function() {
                        console.log('OrbitControls успешно загружен');
                        // Пробуем инициализировать глобус
                        if (typeof window.initEarthGlobe === 'function') {
                            window.initEarthGlobe();
                            earthSectionVisible = true;
                        } else {
                            console.error('Функция initEarthGlobe не найдена после загрузки OrbitControls!');
                        }
                    };
                } else if (typeof window.initEarthGlobe === 'function') {
                    console.log('Инициализация глобуса...');
                    window.initEarthGlobe();
                    earthSectionVisible = true;
                } else {
                    console.error('Функция initEarthGlobe не найдена! Проверяем загрузку earth.js...');
                    // Пробуем подключить earth.js динамически
                    const earthScript = document.createElement('script');
                    earthScript.src = 'earth.js';
                    document.body.appendChild(earthScript);
                    
                    earthScript.onload = function() {
                        console.log('earth.js загружен, повторная попытка инициализации...');
                        setTimeout(() => {
                            if (typeof window.initEarthGlobe === 'function') {
                                window.initEarthGlobe();
                                earthSectionVisible = true;
                            } else {
                                console.error('Функция initEarthGlobe все еще не найдена после загрузки earth.js!');
                            }
                        }, 500);
                    };
                }
            }
            
            // Анимация печати для ДРУГИХ секций
            if (section.matches('section:not(#earth)') && !section.classList.contains('animated')) { 
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
        // Можно добавить логику для снятия класса visible при уходе из зоны видимости, если нужно
        // else { section.classList.remove('visible'); }
    });
}

// Initial scroll check
window.addEventListener('load', () => {
    handleScroll();
    applyTypingAnimation();
});
window.addEventListener('scroll', handleScroll);

// Функция для форматирования даты на русском языке
function formatRussianDate(date) {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year} года`;
}

// Обновление таймера каждую секунду
function updateTimer() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    
    const diff = nextHour - now;
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Запускаем таймер сразу и обновляем каждую секунду
updateTimer();
setInterval(updateTimer, 1000);

// Получение Астрономической картинки дня
async function fetchAPOD() {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        apodImg.src = data.url;
        apodTitle.textContent = data.title;
        apodDate.textContent = formatRussianDate(new Date(data.date));
        apodExplanation.textContent = data.explanation;
    } catch (error) {
        console.error('Ошибка при загрузке APOD:', error);
        apodTitle.textContent = 'Ошибка загрузки';
        apodExplanation.textContent = 'К сожалению, не удалось загрузить астрономическую картинку дня. Пожалуйста, попробуйте позже.';
    }
}

// Получение фотографий с Марсохода
async function fetchMarsPhotos(rover) {
    try {
        // Используем более стабильный эндпоинт для демо-режима
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        marsPhotos.innerHTML = '';
        
        if (data.photos && data.photos.length > 0) {
            // Берем первые 6 фотографий
            data.photos.slice(0, 6).forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.img_src;
                img.alt = `Фотография с марсохода ${rover}`;
                marsPhotos.appendChild(img);
            });
        } else {
            marsPhotos.innerHTML = '<p>Фотографии для выбранного марсохода временно недоступны</p>';
        }
    } catch (error) {
        console.error('Ошибка при загрузке фотографий с Марса:', error);
        marsPhotos.innerHTML = '<p>Фотографии для выбранного марсохода временно недоступны</p>';
    }
}

// Обработчики событий
roverSelect.addEventListener('change', (e) => {
    fetchMarsPhotos(e.target.value);
});

// Начальная загрузка - НЕ вызываем initEarthGlobe здесь
fetchAPOD();
fetchMarsPhotos('curiosity');
// fetchEarthImage(); // Удалено
// initEarthGlobe(); // Удалено - будет вызвано в handleScroll

// Обновление контента каждый час - НЕ вызываем initEarthGlobe здесь
setInterval(() => {
    fetchAPOD();
    fetchMarsPhotos(roverSelect.value);
    // fetchEarthImage(); // Удалено
}, 3600000); 

// Плавная прокрутка для навигационных ссылок
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

// 3D эффект для главной плашки (ИСПРАВЛЕННЫЙ КОД)
const heroContent = document.querySelector('.hero-content');
const contentWrapper = document.querySelector('.hero-content .content-wrapper'); 

if (heroContent && contentWrapper) {
    heroContent.addEventListener('mousemove', (e) => {
        const rect = heroContent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Исправляем направление: Инвертируем X, НЕ инвертируем Y
        const rotateX = -((y - centerY) / 20); // Добавляем инверсию
        const rotateY = (x - centerX) / 20;  // Убираем инверсию
        
        contentWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroContent.addEventListener('mouseleave', () => {
        contentWrapper.style.transform = 'rotateX(0) rotateY(0)';
    });
}

// 3D эффект слежения за мышкой для Solar System Section (ИСПРАВЛЕННЫЙ КОД)
const solarSystemSection = document.querySelector('.solar-system-section');

if (solarSystemSection) {
    const maxRotation = 4; 
    const baseTranslateY = -8; 
    const smoothingFactor = 0.08; 

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    let isHovering = false; 
    let animationFrameId = null;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function animateTilt() {
        if (!isHovering && Math.abs(currentRotateX) < 0.01 && Math.abs(currentRotateY) < 0.01) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            const isVisible = solarSystemSection.classList.contains('visible');
            const finalTranslateY = isVisible ? 0 : 50; 
            solarSystemSection.style.transform = `perspective(1200px) translateY(${finalTranslateY}px) rotateX(0deg) rotateY(0deg) scale(1)`;
            return;
        }

        currentRotateX = lerp(currentRotateX, targetRotateX, smoothingFactor);
        currentRotateY = lerp(currentRotateY, targetRotateY, smoothingFactor);

        let currentTranslateY = baseTranslateY;
        if (!isHovering) {
            const isVisible = solarSystemSection.classList.contains('visible');
            const finalTranslateY = isVisible ? 0 : 50;
            currentTranslateY = lerp(parseFloat(solarSystemSection.style.transform.split('translateY(')[1]?.split('px)')[0]) || finalTranslateY, finalTranslateY, smoothingFactor * 2);
            targetRotateX = 0;
            targetRotateY = 0;
        }

        solarSystemSection.style.transform = `perspective(1200px) translateY(${currentTranslateY}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(1)`;
        animationFrameId = requestAnimationFrame(animateTilt);
    }

    solarSystemSection.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!animationFrameId) {
            animateTilt();
        }
    });

    solarSystemSection.addEventListener('mousemove', (e) => {
        if (!isHovering) return; 

        const rect = solarSystemSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // ИСПРАВЛЯЕМ НАПРАВЛЕНИЕ: Инвертируем обе оси 
        targetRotateX = -((y - centerY) / centerY) * maxRotation; 
        targetRotateY = ((x - centerX) / centerX) * maxRotation; // Убираем минус отсюда
        
        if (!animationFrameId) {
             animateTilt();
        }
    });

    solarSystemSection.addEventListener('mouseleave', () => {
        isHovering = false;
    });
}
