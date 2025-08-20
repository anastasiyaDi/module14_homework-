const btn = document.querySelector('.j-btn');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');

// Функция для проверки диапазона чисел
const validateNumbers = (width, height) => {
    return !isNaN(width) && !isNaN(height) &&
           width >= 100 && width <= 300 &&
           height >= 100 && height <= 300;
};

// Функция для создания запроса
const useRequest = (width, height) => {
    const url = `https://dummyimage.com/${width}x${height}/`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки изображения');
            }
            return response.blob();
        })
        .then(blob => URL.createObjectURL(blob))
        .catch(error => {
            throw new Error(error.message);
        });
};

// Обработчик клика
btn.addEventListener('click', async () => {
    // Очищаем предыдущие результаты
    errorDiv.textContent = '';
    resultDiv.innerHTML = '';

    // Получаем значения из input (пример: const value = document.querySelector('input').value;)
    const width = document.querySelector('#width').value;
    const height = document.querySelector('#height').value;

    // Проверяем валидность чисел
    if (!validateNumbers(width, height)) {
        errorDiv.textContent = 'Одно из чисел вне диапазона от 100 до 300';
        return;
    }

    // Блокируем кнопку на время запроса
    btn.disabled = true;
    btn.textContent = 'Загрузка...';

    try {
        // Делаем запрос
        const imageUrl = await useRequest(width, height);

        // Создаем и отображаем изображение
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Изображение ${width}x${height}`;

        const container = document.createElement('div');
        container.className = 'image-container';
        container.appendChild(img);

        resultDiv.appendChild(container);

    } catch (error) {
        errorDiv.textContent = error.message;
    } finally {
        // Разблокируем кнопку
        btn.disabled = false;
        btn.textContent = 'Сгенерировать';
    }
});