// earth.js - Скрипт для 3D глобуса

// Ждем, пока весь HTML загрузится
document.addEventListener('DOMContentLoaded', () => {
    console.log("earth.js загружен, ожидаем инициализации глобуса...");

    // Функция инициализации глобуса
    window.initEarthGlobe = function() { // Делаем функцию глобальной, чтобы ее видел script.js
        console.log("Начинаем инициализацию глобуса Земли...");
        
        // Проверяем, доступен ли THREE (глобальный объект)
        if (typeof THREE === 'undefined') {
            console.error("Библиотека Three.js не загружена!");
            return;
        }
        
        const container = document.getElementById('earth-globe-container');
        if (!container) {
            console.error("Контейнер #earth-globe-container не найден!");
            return;
        }
        // Проверяем, не был ли глобус уже инициализирован в этом контейнере
        if (container.querySelector('canvas')) {
            console.log("Глобус уже инициализирован.");
            return;
        }

        let width = container.clientWidth;
        let height = container.clientHeight;
        if (width === 0 || height === 0) {
            console.warn("Контейнер глобуса не видим, используем размеры CSS (400x400).");
            width = 400; height = 400;
            container.style.width = `${width}px`; 
            container.style.height = `${height}px`;
        }
        
        console.log(`Размеры контейнера глобуса: ${width}x${height}px`);

        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'globe-loading';
        loadingIndicator.innerHTML = '<div class="loading-spinner"></div><p>Загрузка глобуса...</p>';
        container.appendChild(loadingIndicator);

        // Таймаут для удаления индикатора загрузки
        const loadingTimeout = setTimeout(() => {
            // Если загрузка текстуры занимает слишком много времени, принудительно скрываем индикатор
            if (loadingIndicator && loadingIndicator.parentNode) {
                console.log("Принудительно скрываю индикатор загрузки по таймауту");
                loadingIndicator.parentNode.removeChild(loadingIndicator);
            }
        }, 5000); // 5 секунд максимум для ожидания

        // --- Инициализация Three.js (используем глобальный THREE) ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 2.5;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        // container.innerHTML = ''; // Очистка больше не нужна, т.к. вызываем один раз
        container.appendChild(renderer.domElement);
        
        console.log("THREE.js сцена создана, начинаем загрузку текстур...");

        // Создадим материал заранее, чтобы его можно было использовать сразу
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff, // Синий цвет по умолчанию
            shininess: 10
        });
        
        // --- Материалы и Геометрии ---
        // Увеличиваем размер глобуса с 0.8 до 1.2
        const earthGeometry = new THREE.SphereGeometry(1.2, 64, 64); 
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earthMesh);

        // --- Текстуры --- 
        const textureLoader = new THREE.TextureLoader();
        
        // Используем локальную текстуру Земли вместо внешних ссылок
        console.log("Загружаем текстуру images/earth.jpg...");
        textureLoader.load('./images/earth.jpg', 
            // Обработчик успешной загрузки
            function(texture) {
                console.log("Текстура Земли успешно загружена!");
                // Применяем текстуру к материалу
                earthMaterial.color.set(0xffffff); // Сбрасываем цвет на белый
                earthMaterial.map = texture;
                earthMaterial.needsUpdate = true;
                
                // Удаляем индикатор загрузки
                if (loadingIndicator && loadingIndicator.parentNode) {
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                }
                clearTimeout(loadingTimeout); // Очищаем таймаут
            },
            // Обработчик прогресса загрузки
            function(xhr) {
                console.log(`Загрузка текстуры: ${Math.round(xhr.loaded / xhr.total * 100)}%`);
            },
            // Обработчик ошибки
            function(error) {
                console.error("Ошибка загрузки текстуры:", error);
                console.log("Попытка загрузки через альтернативный путь...");
                
                // Пробуем альтернативный путь
                textureLoader.load('/images/earth.jpg', 
                    (texture) => {
                        console.log("Альтернативная текстура загружена!");
                        earthMaterial.color.set(0xffffff);
                        earthMaterial.map = texture;
                        earthMaterial.needsUpdate = true;
                        
                        // Удаляем индикатор загрузки
                        if (loadingIndicator && loadingIndicator.parentNode) {
                            loadingIndicator.parentNode.removeChild(loadingIndicator);
                        }
                        clearTimeout(loadingTimeout);
                    },
                    null,
                    () => {
                        // Третья попытка - прямой URL
                        console.log("Вторая попытка не удалась, пробуем абсолютный путь...");
                        textureLoader.load(window.location.origin + '/images/earth.jpg', 
                            (texture) => {
                                console.log("Текстура загружена с абсолютного пути!");
                                earthMaterial.color.set(0xffffff);
                                earthMaterial.map = texture;
                                earthMaterial.needsUpdate = true;
                                
                                // Удаляем индикатор загрузки
                                if (loadingIndicator && loadingIndicator.parentNode) {
                                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                                }
                                clearTimeout(loadingTimeout);
                            },
                            null,
                            () => {
                                // Если все попытки не удались, оставляем синий цвет
                                console.error("Все попытки загрузки текстуры не удались. Использую процедурную текстуру.");
                                
                                // Создаем процедурную текстуру
                                createProceduralEarthTexture(earthMaterial);
                                
                                // Удаляем индикатор загрузки
                                if (loadingIndicator && loadingIndicator.parentNode) {
                                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                                }
                                clearTimeout(loadingTimeout);
                            }
                        );
                    }
                );
            }
        );
        
        // --- Освещение ---
        // Увеличиваем интенсивность окружающего освещения для лучшей видимости текстуры
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
        scene.add(ambientLight);
        
        // Добавляем несколько источников направленного света с разных сторон
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0); 
        directionalLight1.position.set(5, 3, 5);
        scene.add(directionalLight1);
        
        // Дополнительный источник света с противоположной стороны
        const directionalLight2 = new THREE.DirectionalLight(0xccccff, 0.5); 
        directionalLight2.position.set(-5, -3, -5);
        scene.add(directionalLight2);
        
        // Добавляем слабый синеватый свет сверху для холодного эффекта космоса
        const directionalLight3 = new THREE.DirectionalLight(0x8888ff, 0.3); 
        directionalLight3.position.set(0, 10, 0);
        scene.add(directionalLight3);

        // --- Управление (используем глобальный THREE.OrbitControls) --- 
        let controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {
             controls = new THREE.OrbitControls(camera, renderer.domElement);
             controls.enableDamping = true;
             controls.dampingFactor = 0.05;
             controls.enableZoom = true; 
             controls.enablePan = false; 
             controls.minDistance = 1.5; 
             controls.maxDistance = 4;   
             controls.autoRotate = true;
             controls.autoRotateSpeed = 0.3; 
             controls.target.set(0, 0, 0); 
        } else {
            console.error("OrbitControls не загружен!");
        }
        
        // --- Анимация --- 
        function animate() {
            requestAnimationFrame(animate);
            // Убираем вращение облаков, так как их нет
            // cloudsMesh.rotation.y += 0.0005; 
            
            // Добавляем медленное вращение самой Земли
            earthMesh.rotation.y += 0.001;
            
            if (controls) controls.update(); 
            renderer.render(scene, camera);
        }
        animate();

        // --- Ресайз --- 
        window.addEventListener('resize', () => {
            width = container.clientWidth;
            height = container.clientHeight;
            if (!container || width === 0 || height === 0) return; // Доп. проверка на контейнер
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }, false);
    } // Конец функции initEarthGlobe

    // Не вызываем initEarthGlobe здесь, ждем вызова из script.js

}); // Конец DOMContentLoaded

// Функция для создания процедурной текстуры Земли
function createProceduralEarthTexture(material) {
    // Создаем канвас для рисования текстуры
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Фон - океан (темно-синий)
    ctx.fillStyle = '#0d3b66';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Создаем простой градиент для атмосферы
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(120, 180, 240, 0.2)');  // Легкая атмосфера сверху
    gradient.addColorStop(0.5, 'rgba(13, 59, 102, 0)');    // Прозрачно в центре
    gradient.addColorStop(1, 'rgba(10, 50, 90, 0.1)');     // Легкая атмосфера снизу
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Добавляем континенты (зеленые пятна)
    ctx.fillStyle = '#2a9d8f';
    
    // Упрощенная Евразия
    drawContinent(ctx, 600, 150, 280, 120);
    
    // Упрощенная Африка
    drawContinent(ctx, 560, 300, 150, 170);
    
    // Упрощенная Северная Америка
    drawContinent(ctx, 250, 170, 220, 130);
    
    // Упрощенная Южная Америка
    drawContinent(ctx, 350, 350, 120, 140);
    
    // Упрощенная Австралия
    drawContinent(ctx, 800, 350, 120, 80);
    
    // Добавляем немного шума для реалистичности
    addNoise(ctx, canvas.width, canvas.height);
    
    // Преобразуем канвас в текстуру Three.js
    const texture = new THREE.CanvasTexture(canvas);
    
    // Применяем текстуру к материалу
    material.map = texture;
    material.color.set(0xffffff);
    material.needsUpdate = true;
    
    console.log("Процедурная текстура Земли создана и применена");
}

// Вспомогательная функция для рисования континента с неровными краями
function drawContinent(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);
    
    // Начинаем путь для континента
    ctx.beginPath();
    
    // Рисуем неровный контур
    let points = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const radius = width * 0.5 * (0.8 + Math.random() * 0.4);
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * (height / width) * radius;
        points.push({x: px, y: py});
    }
    
    // Рисуем форму континента
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        // Используем квадратичную кривую для сглаживания
        const xc = (points[i].x + points[i-1].x) / 2;
        const yc = (points[i].y + points[i-1].y) / 2;
        ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, xc, yc);
    }
    ctx.closePath();
    
    // Заполняем континент
    ctx.fill();
    
    // Добавляем тени для объема
    ctx.shadowColor = '#1d3557';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fill();
    
    ctx.restore();
}

// Функция для добавления шума на текстуру
function addNoise(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Небольшой шум для реализма
    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 20 - 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
}
