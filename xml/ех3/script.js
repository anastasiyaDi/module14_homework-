document.querySelector('button').addEventListener('click', function() {
    const input = document.querySelector('input');
    const errorDiv = document.getElementById('error');
    const imagesDiv = document.getElementById('images');

    // Очищаем предыдущие результаты
    errorDiv.textContent = '';
    imagesDiv.innerHTML = '';

    const value = parseInt(input.value);

    // Проверка диапазона
    if (isNaN(value) || value < 1 || value > 10) {
        errorDiv.textContent = 'Число вне диапазона от 1 до 10';
        return;
    }

    // Создаем XHR запрос
    const xhr = new XMLHttpRequest();
    const url = `https://jsonplaceholder.typicode.com/photos?_limit=${value}`;

    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const photos = JSON.parse(xhr.responseText);

            // Отображаем картинки
            photos.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.thumbnailUrl;
                img.alt = photo.title;
                imagesDiv.appendChild(img);
            });
        } else {
            errorDiv.textContent = 'Ошибка загрузки данных';
        }
    };

    xhr.onerror = function() {
        errorDiv.textContent = 'Ошибка сети';
    };

    xhr.send();
});