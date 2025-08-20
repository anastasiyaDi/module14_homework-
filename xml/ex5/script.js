const btn = document.querySelector('.j-btn');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');

// Функция для проверки валидности числа
const isValidNumber = (value, min, max) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= min && num <= max;
};

// Функция для отображения ошибок
const showError = (message) => {
    errorDiv.textContent = message;
    resultDiv.innerHTML = '';
};

// Функция для сохранения данных в localStorage
const saveToLocalStorage = (data, page, limit) => {
    const storageData = {
        data: data,
        timestamp: new Date().getTime(),
        page: page,
        limit: limit
    };
    localStorage.setItem('lastRequest', JSON.stringify(storageData));
};

// Функция для загрузки данных из localStorage
const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('lastRequest');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем, что данные не старше 1 часа
        if (new Date().getTime() - parsed.timestamp < 3600000) {
            return parsed;
        }
    }
    return null;
};

// Функция для выполнения запроса
const fetchImages = async (page, limit) => {
    const url = `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Ошибка сети: ' + error.message);
    }
};

// Функция для отображения картинок
const displayImages = (images) => {
    if (images.length === 0) {
        resultDiv.innerHTML = '<p>Нет данных для отображения</p>';
        return;
    }

    const imagesHTML = images.map(image => `
        <div class="image-card">
            <img src="${image.thumbnailUrl}" alt="${image.title}">
            <p>${image.title}</p>
        </div>
    `).join('');

    resultDiv.innerHTML = `<div class="images-grid">${imagesHTML}</div>`;
};

// Загрузка данных из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
        displayImages(savedData.data);
        // Заполняем inputs сохраненными значениями
        document.getElementById('page').value = savedData.page;
        document.getElementById('limit').value = savedData.limit;
    }
});

// Обработчик клика на кнопку
btn.addEventListener('click', async () => {
    // Получаем значения из input
    const pageValue = document.getElementById('page').value;
    const limitValue = document.getElementById('limit').value;

    // Очищаем предыдущие результаты
    errorDiv.textContent = '';

    // Проверяем валидность чисел
    const isPageValid = isValidNumber(pageValue, 1, 10);
    const isLimitValid = isValidNumber(limitValue, 1, 10);

    if (!isPageValid && !isLimitValid) {
        showError('Номер страницы и лимит вне диапазона от 1 до 10');
        return;
    }

    if (!isPageValid) {
        showError('Номер страницы вне диапазона от 1 до 10');
        return;
    }

    if (!isLimitValid) {
        showError('Лимит вне диапазона от 1 до 10');
        return;
    }

    const page = parseInt(pageValue);
    const limit = parseInt(limitValue);

    // Блокируем кнопку на время запроса
    btn.disabled = true;
    btn.textContent = 'Загрузка...';

    try {
        // Выполняем запрос
        const images = await fetchImages(page, limit);

        // Сохраняем в localStorage
        saveToLocalStorage(images, page, limit);

        // Отображаем результат
        displayImages(images);

    } catch (error) {
        showError(error.message);
    } finally {
        // Разблокируем кнопку
        btn.disabled = false;
        btn.textContent = 'Запрос';
    }
});