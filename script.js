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

// Функция для перевода текста
async function translateText(text) {
    try {
        // Разбиваем текст на предложения
        const sentences = text.split(/(?<=[.!?])\s+/);
        const translatedSentences = [];
        
        for (const sentence of sentences) {
            if (sentence.trim()) {
                try {
                    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sentence)}&langpair=en|ru`);
                    const data = await response.json();
                    
                    if (data.responseStatus === 200 && data.responseData.translatedText) {
                        translatedSentences.push(data.responseData.translatedText);
                    } else {
                        translatedSentences.push(sentence); // Если перевод не удался, используем оригинал
                    }
                } catch (error) {
                    console.error('Ошибка при переводе предложения:', error);
                    translatedSentences.push(sentence);
                }
                
                // Добавляем небольшую задержку между запросами
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        return translatedSentences.join(' ');
    } catch (error) {
        console.error('Ошибка при переводе:', error);
        return text;
    }
}

// Получение Астрономической картинки дня
async function fetchAPOD() {
    try {
        // Добавляем классы загрузки
        apodTitle.classList.add('loading');
        apodExplanation.classList.add('loading');
        
        // Устанавливаем временный текст загрузки
        apodTitle.textContent = 'Загрузка заголовка';
        apodExplanation.textContent = 'Загрузка описания';
        
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        if (data.url) {
            apodImg.src = data.url;
            apodImg.alt = data.title || 'Астрономическая картинка дня';
        }
        
        // Переводим заголовок
        if (data.title) {
            const translatedTitle = await translateText(data.title);
            apodTitle.textContent = translatedTitle;
            apodTitle.classList.remove('loading');
        }
        
        if (data.date) {
            apodDate.textContent = formatRussianDate(new Date(data.date));
        }
        
        // Переводим описание
        if (data.explanation) {
            try {
                const translatedExplanation = await translateText(data.explanation);
                apodExplanation.textContent = translatedExplanation;
                apodExplanation.classList.remove('loading');
            } catch (error) {
                console.error('Ошибка при переводе описания:', error);
                apodExplanation.textContent = data.explanation;
                apodExplanation.classList.remove('loading');
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке APOD:', error);
        apodTitle.textContent = 'Ошибка загрузки';
        apodExplanation.textContent = 'К сожалению, не удалось загрузить астрономическую картинку дня. Пожалуйста, попробуйте позже.';
        apodTitle.classList.remove('loading');
        apodExplanation.classList.remove('loading');
    }
}

// Добавляем индикатор загрузки для перевода
function addLoadingIndicator() {
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            position: relative;
            color: rgba(255, 255, 255, 0.7);
        }
        .loading:after {
            content: '...';
            position: absolute;
            animation: loading 1.5s infinite;
        }
        @keyframes loading {
            0% { content: '.'; }
            33% { content: '..'; }
            66% { content: '...'; }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация индикатора загрузки
addLoadingIndicator();

// Получение фотографий с Марсохода
async function fetchMarsPhotos(rover) {
    try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        marsPhotos.innerHTML = '';
        
        if (data.photos && data.photos.length > 0) {
            const photos = data.photos.slice(0, 6);
            photos.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.img_src;
                img.alt = `Фотография с марсохода ${rover}`;
                img.loading = 'lazy';
                img.dataset.caption = `Фотография с марсохода ${rover}. Дата: ${photo.earth_date}`;
                img.addEventListener('click', () => openModal(img.src, img.dataset.caption));
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

// Получение изображения Земли
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
        console.error('Ошибка при загрузке изображения Земли:', error);
        earthImg.alt = 'Не удалось загрузить изображение Земли';
    }
}

// Обработчики событий
roverSelect.addEventListener('change', (e) => {
    fetchMarsPhotos(e.target.value);
});

// Начальная загрузка
fetchAPOD();
fetchMarsPhotos('curiosity');
fetchEarthImage();

// Обновление контента каждый час
setInterval(() => {
    fetchAPOD();
    fetchMarsPhotos(roverSelect.value);
    fetchEarthImage();
}, 3600000); // 3600000 миллисекунд = 1 час

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

// 3D эффект для главной плашки
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

// Анимация появления элементов с задержкой
function animateElements() {
    const elements = document.querySelectorAll('.hero h1, .hero p, .countdown');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

// Запускаем анимации при загрузке
window.addEventListener('load', () => {
    animateElements();
});

// Модальное окно
const modal = document.getElementById('photo-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeModal = document.querySelector('.close-modal');

function openModal(src, caption) {
    modal.style.display = 'block';
    modalImg.src = src;
    modalCaption.textContent = caption;
    document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Возвращаем прокрутку страницы
}

closeModal.addEventListener('click', closeModalHandler);

// Закрытие модального окна при клике вне изображения
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalHandler();
    }
});

// 3D эффект слежения за мышкой для Solar System Section
const solarSystemSection = document.querySelector('.solar-system-section');

if (solarSystemSection) {
    const maxRotation = 4; // Максимальный угол наклона в градусах

    solarSystemSection.addEventListener('mousemove', (e) => {
        const rect = solarSystemSection.getBoundingClientRect();
        const x = e.clientX - rect.left; // Координата X внутри элемента
        const y = e.clientY - rect.top;  // Координата Y внутри элемента

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * maxRotation;
        const rotateY = -((x - centerX) / centerX) * maxRotation; // Инвертируем Y для интуитивного наклона

        // Применяем наклон + сохраняем базовый небольшой сдвиг и масштаб от hover (если он есть)
        // Можно просто применить наклон, тогда hover-трансформация будет переопределяться
        solarSystemSection.style.transform = `perspective(1200px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    });

    solarSystemSection.addEventListener('mouseleave', () => {
        // Возвращаем стиль к состоянию ховера (или к исходному, если убрать translateY/scale)
        // Если оставить transform как в :hover, то при уходе мыши сохранится эффект наведения
        // Если сбросить transform = '', то вернется к состоянию без ховера
        solarSystemSection.style.transform = `perspective(1200px) translateY(-8px) rotateX(0deg) rotateY(0deg) scale(1.01)`; // Возврат к hover-состоянию без наклона
        // Или сбросить полностью: solarSystemSection.style.transform = '';
    });
}
