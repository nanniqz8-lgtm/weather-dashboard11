console.log("DOM маніпуляції розпочато!");

//  Оголошуємо масив даних (оновлено поля за Варіантом 1: day, tempC, description)
const forecastData = [
  { id: 1, day: "Пн", tempC: 18, description: "Хмарно ☁️" },
  { id: 2, day: "Вт", tempC: 22, description: "Ясно ☀️" },
  { id: 3, day: "Ср", tempC: 15, description: "Дощ 🌧️" },
  { id: 4, day: "Чт", tempC: -2, description: "Сніг ❄️" },
  { id: 5, day: "Пт", tempC: 0, description: "Хмарно ☁️" },
  { id: 6, day: "Сб", tempC: -5, description: "Заметіль 🌨️" },
  { id: 7, day: "Нд", tempC: 5, description: "Ясно ☀️" },
];

//  Вибираємо контейнери на сторінці
/*const listContainer = document.querySelector("#forecast-list");
const avgTempElement = document.querySelector("#avg-temp");

//  Функція рендеру
function renderForecast(data) {
  // Програмно очищаємо статичні картки-заглушки з HTML
  listContainer.innerHTML = "";

  let tempSum = 0; // Змінна для накопичення суми температур

  // Цикл перебору масиву
  for (const item of data) {
    // Створюємо нові HTML-елементи (згідно з варіантом)
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const details = document.createElement("p");

    // Наповнюємо їх текстом (textContent безпечний для виведення тексту)
    title.textContent = item.day;
    details.textContent = `${item.tempC}°C, ${item.description}`;

    // Відновлюємо базовий клас для сітки
    card.classList.add("card");

    //УМОВА - додаємо клас 'cold', якщо температура < 0
    if (item.tempC < 0) {
      card.classList.add("cold");
    } else if (item.tempC >= 20) {
      card.classList.add("temp-warm"); // теплі стилі з ПР5
    } else {
      card.classList.add("temp-cool"); // прохолодні стилі з ПР5
    }

    // Вкладаємо заголовок і текст усередину картки
    card.append(title);
    card.append(details);

    // Вкладаємо готову картку в контейнер на сторінці
    listContainer.append(card);

    // Накопичуємо суму для середньої температури
    tempSum += item.tempC;
  }

  //  ПІДСУМОК - обчислюємо середню температуру і оновлюємо DOM
  const avgTemp = (tempSum / data.length).toFixed(1); // toFixed(1) залишає 1 знак після коми
  avgTempElement.textContent = avgTemp;
}

// Викликаємо функцію, передаючи їй масив
renderForecast(forecastData); */

/*ПРАКТИЧНА РОБОТА 8: ПОДІЇ ТА ФОРМИ*/

// 1. Вибираємо необхідні елементи
const addForm = document.querySelector("#add-forecast-form");
const inputDay = document.querySelector("#input-day");
const inputTemp = document.querySelector("#input-temp");
const inputDesc = document.querySelector("#input-desc");

const btnWarmestDay = document.querySelector("#btn-warmest-day");
const warmestDayResult = document.querySelector("#warmest-day-result");

// 2. ОБРОБКА SUBMIT ФОРМИ
addForm.addEventListener("submit", function (event) {
  // Скасовуємо стандартне перезавантаження сторінки
  event.preventDefault();

  // Зчитуємо значення з полів
  const newDay = inputDay.value;
  const newTemp = Number(inputTemp.value); // Перетворюємо на число
  const newDesc = inputDesc.value;

  // Створюємо новий об'єкт прогнозу (такої ж структури, як у масиві forecastData)
  const newForecastItem = {
    id: Date.now(), // Генеруємо унікальний ID
    day: newDay,
    tempC: newTemp,
    description: newDesc,
  };


  // Додаємо новий об'єкт у масив
  forecastData.push(newForecastItem);

  // Перемальовуємо список (викликаємо функцію з ПР7)
  //renderForecast(forecastData);

  // Очищаємо форму після успішного додавання
  addForm.reset();
});

// 3. ДОДАТКОВА ВАЛІДАЦІЯ (Custom Validity згідно Варіанту 1)
inputTemp.addEventListener("input", function () {
  const tempValue = Number(inputTemp.value);

  // Перевіряємо, чи ввели щось і чи виходить воно за межі -50...50
  if (inputTemp.value !== "" && (tempValue < -50 || tempValue > 50)) {
    // Якщо так, встановлюємо власне повідомлення про помилку
    inputTemp.setCustomValidity("Температура поза реалістичним діапазоном");
  } else {
    // Якщо все добре, очищаємо повідомлення (скидаємо помилку)
    inputTemp.setCustomValidity("");
  }
});

// 4. ДОДАТКОВА ПОДІЯ ВАРІАНТУ (Пошук найтеплішого дня)
btnWarmestDay.addEventListener("click", function () {
  // Якщо масив порожній (хоча у нас він не порожній), захист
  if (forecastData.length === 0) return;

  let maxTempDay = forecastData[0]; // Припускаємо, що перший день найтепліший

  // Перебираємо масив
  for (const item of forecastData) {
    if (item.tempC > maxTempDay.tempC) {
      maxTempDay = item; // Знайшли тепліший день
    }
  }

  // Виводимо результат
  warmestDayResult.textContent = `Найтепліший день: ${maxTempDay.day} (${maxTempDay.tempC}°C)`;
});

/*ПРАКТИЧНА РОБОТА 9: FETCH API (Реальні дані) */

// 1. URL згідно Варіанту 1 (Open-Meteo API)
const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current=temperature_2m,weather_code&timezone=auto";

// 2. Словник (об'єкт) для перетворення weather_code у текст
// (Згідно зі специфікацією WMO Weather interpretation codes)
const weatherCodeDictionary = {
  0: "Ясно (безхмарно)",
  1: "Переважно ясно",
  2: "Мінлива хмарність",
  3: "Суцільна хмарність",
  45: "Туман",
  48: "Туман із памороззю",
  51: "Мряка (легка)",
  53: "Мряка (помірна)",
  55: "Мряка (густа)",
  61: "Дощ (легкий)",
  63: "Дощ (помірний)",
  65: "Дощ (сильний)",
  71: "Снігопад (легкий)",
  73: "Снігопад (помірний)",
  75: "Снігопад (сильний)",
  95: "Гроза",
};

// Функція-помічник для перекладу коду (якщо коду немає в словнику, повертає 'Невідомо')
const getWeatherDescription = (code) =>
  weatherCodeDictionary[code] || `Невідомо (Код: ${code})`;

// 3. Вибираємо DOM-елементи
const btnRefresh = document.querySelector("#btn-refresh");
const statusMessage = document.querySelector("#api-status-message");
const weatherDataBlock = document.querySelector("#current-weather-data");

const liveTemp = document.querySelector("#live-temp");
const liveDesc = document.querySelector("#live-desc");
const liveTime = document.querySelector("#live-time");
const currentIcon = document.querySelector("#current-icon");

// 4. Основна АСИНХРОННА функція завантаження даних
async function loadLiveData() {
  // Етап А: Показуємо стан "Завантаження"
  btnRefresh.disabled = true; // Блокуємо кнопку від спаму
  statusMessage.textContent = "Отримання даних із супутника... 🛰️";
  statusMessage.className = "status-msg loading"; // Показуємо повідомлення
  weatherDataBlock.classList.add("hidden"); // Ховаємо старі дані

  try {
    // Етап Б: Робимо запит до сервера
    const response = await fetch(API_URL);

    // Перевіряємо, чи успішна відповідь (статус 200-299)
    if (!response.ok) {
      throw new Error(`Помилка сервера. Статус: ${response.status}`);
    }

    // Етап В: Розбираємо JSON відповідь
    const data = await response.json();

    // Виводимо в консоль для перевірки (Крок 5 інструкції)
    console.log("Дані з Open-Meteo API:", data);

    // Етап Г: Виводимо дані в DOM
    // (data.current.temperature_2m, data.current.weather_code, data.current.time)
    liveTemp.textContent = data.current.temperature_2m;
    liveDesc.textContent = getWeatherDescription(data.current.weather_code);

    // Форматуємо час (він приходить у форматі "2026-09-26T16:00")
    const dateObj = new Date(data.current.time);
    liveTime.textContent = dateObj.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Змінюємо іконку залежно від температури (спрощена логіка)
    if (data.current.temperature_2m < 0) {
      currentIcon.outerHTML = '<span id="current-icon" style="font-size: 3rem;">❄️</span>';
    } else {
      currentIcon.outerHTML = '<span id="current-icon" style="font-size: 3rem;">☀️</span>';
    }

    // Ховаємо повідомлення, показуємо дані
    statusMessage.className = "status-msg hidden";
    weatherDataBlock.classList.remove("hidden");
  } catch (error) {
    // Етап Д: Обробка помилок (зокрема зникнення інтернету)
    console.error("Помилка Fetch API:", error);

    // Виводимо користувачу специфічне повідомлення за варіантом
    statusMessage.textContent =
      "❌ Не вдалося отримати прогноз погоди. Перевірте з'єднання.";
    statusMessage.className = "status-msg error"; // Показуємо червоний блок
    // Блок із даними залишається схованим
  } finally {
    // Етап Е: Виконується завжди (успіх чи помилка)
    btnRefresh.disabled = false; // Розблоковуємо кнопку
  }
}

// 5. Навішуємо подію на кнопку "Оновити"
btnRefresh.addEventListener("click", loadLiveData);

// 6. Викликаємо функцію одразу при завантаженні сторінки
loadLiveData();

/*ПРАКТИЧНА РОБОТА 10: VUE 3 COMPONENT*/

const { createApp } = Vue;

// 1. Описуємо компонент WeatherCard
const WeatherCard = {
  // Вказуємо, які дані (props) чекає цей компонент
  props: ["day", "tempC", "description"],

  // Локальний реактивний стан компонента
  data() {
    return {
      showFahrenheit: false, // За замовчуванням Фаренгейти сховані
    };
  },

  // Обчислювані значення (похідні від props або data)
  computed: {
    // Конвертуємо Цельсії у Фаренгейти автоматично
    tempF() {
      return ((this.tempC * 9) / 5 + 32).toFixed(1);
    },
    // Динамічний клас для картки залежно від температури
    cardClass() {
      if (this.tempC < 0) return "card cold";
      if (this.tempC >= 20) return "card temp-warm";
      return "card temp-cool";
    },
    // Використовуємо емодзі, щоб не було помилок 404
    weatherEmoji() {
      if (this.tempC <= -2) return "❄️";
      if (this.tempC < 5) return "🌨️";
      if (this.tempC < 15) return "☁️️";
      if (this.tempC >= 20) return "☀️";
      return "⛅";
    },
  },

  // Шаблон компонента (те, як він виглядає в HTML).
  // @click  подія кліку, яка змінює стан showFahrenheit.
  template: `
        <article :class="cardClass" @click="showFahrenheit = !showFahrenheit" style="cursor: pointer;">
            <h3>{{ day }}</h3>
            <div style="font-size: 2.5rem; margin: 10px 0;">{{ weatherEmoji }}</div>

            <div class="temp-val">{{ tempC }}&deg;C</div>
            
            <!-- Умовний рендер: показуємо тільки якщо showFahrenheit = true -->
            <div v-if="showFahrenheit" style="color: #666; font-size: 0.9em; margin-bottom: 5px;">
                {{ tempF }}&deg;F
            </div>
            
            <p>{{ description }}</p>
        </article>
    `,
};

// 2. Створюємо основний застосунок Vue
const weatherApp = createApp({
  components: {
    "weather-card": WeatherCard,
  },
  data() {
    return {
      // Передаємо наш масив прогнозів (forecastData) з ПР6/8 у реактивний стан Vue
      forecastList: forecastData,
    };
  },
});

// 3. Монтуємо застосунок у div з id="app"
weatherApp.mount("#app");

// ПРАКТИЧНА РОБОТА 11: LocalStorage та IndexedDB


// 1. LocalStorage (Читання та Запис)
function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem('savedCities');
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Помилка читання localStorage:', error);
        return [];
    }
}

// Реальне збереження в LocalStorage (виправлення зауваження)
function saveToLocalStorage(city) {
    const lsCities = loadFromLocalStorage();
    lsCities.push(city);
    localStorage.setItem('savedCities', JSON.stringify(lsCities));
    console.log('Дані реально записано в localStorage користувачем:', city.name);
}


// 2. Ініціалізація IndexedDB (Створення бази та Object Store)
function openDB() {
    return new Promise((resolve, reject) => {
      
        // Перевіряємо, чи підтримується IndexedDB взагалі
        if (!('indexedDB' in window)) {
            return reject(new Error("Браузер не підтримує IndexedDB"));
        }

        const request = indexedDB.open('WeatherDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Створюємо сховище "cities", де ключ - це "id" (згідно з варіантом)
            if (!db.objectStoreNames.contains('cities')) {
                db.createObjectStore('cities', { keyPath: 'id' });
                console.log('IndexedDB: Створено сховище cities');
            }
        };

        request.onsuccess = () => resolve(request.result);
        
        // ОБРОБКА ПОМИЛОК: Ця подія спрацьовує, якщо доступ заблоковано (наприклад, у Firefox Private Browsing)
        request.onerror = (event) => {
            console.error("IndexedDB відмовив у доступі:", event.target.error);
            reject(event.target.error || new Error("Невідома помилка IndexedDB"));
        };
    });
}

// 3. CRUD: Додавання / Оновлення міста (PUT)
async function addCityDB(city) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cities', 'readwrite'); 
        tx.objectStore('cities').put(city); 
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// 4. CRUD: Читання всіх міст (GET)
async function getAllCitiesDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cities', 'readonly'); 
        const request = tx.objectStore('cities').getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 5. CRUD: Видалення міста (DELETE)
async function deleteCityDB(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cities', 'readwrite');
        tx.objectStore('cities').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Обробник для нової кнопки збереження в LocalStorage
const btnSaveLS = document.querySelector('#btn-save-ls');
if (btnSaveLS) {
    btnSaveLS.addEventListener('click', () => {
        const liveTempText = document.querySelector('#live-temp').textContent;
        const liveDescText = document.querySelector('#live-desc').textContent;
        
        if (liveTempText === '--' || liveTempText === '') {
            return alert('Дочекайтесь завантаження погоди!');
        }
        
        const newCity = {
            id: "ls-" + Date.now().toString(),
            name: "Львів (через LS)", // Зберігаємо як Львів, щоб відрізняти від Києва
            lat: 49.83, lon: 24.02,
            temperature: parseFloat(liveTempText),
            weatherCode: liveDescText,
            time: new Date().toLocaleTimeString('uk-UA')
        };

        // Викликаємо РЕАЛЬНУ функцію збереження!
        saveToLocalStorage(newCity);
        
        // Скидаємо прапорець міграції, щоб при оновленні сторінки вона 100% спрацювала
        localStorage.removeItem('migratedToIDB');
        
        alert('✅ Місто успішно збережено в LocalStorage!\n\nТепер натисніть ОК і оновіть сторінку (F5). Скрипт знайде ці дані і перенесе їх в IndexedDB.');
    });
}


// 6. Рендер списку (Vanilla JS, DOM API з ПР7)
const savedCitiesContainer = document.querySelector('#saved-cities-list');

function renderSavedCities(cities) {
    if (!savedCitiesContainer) return;
    savedCitiesContainer.innerHTML = ''; // Очищаємо

    if (cities.length === 0) {
        savedCitiesContainer.innerHTML = '<p style="color: #666;">Немає збережених міст.</p>';
        return;
    }

    cities.forEach(city => {
        const div = document.createElement('div');
        div.className = 'saved-city-card';
        div.innerHTML = `
            <div>
                <strong>${city.name}</strong> 
                <span style="color:#777; font-size: 0.85em;">(lat: ${city.lat}, lon: ${city.lon})</span><br>
                Останній прогноз: <b>${city.temperature}°C</b>, ${city.weatherCode} <br>
                <small style="color:#999;">Час запису: ${city.time}</small>
            </div>
            <button data-id="${city.id}" class="btn-delete">Видалити</button>
        `;
        savedCitiesContainer.append(div);
    });
}

// 7. Головна функція запуску (з логікою МІГРАЦІЇ та ОБРОБКОЮ ПОМИЛОК)
async function initSavedCities() {
  
    try {
        const dbCities = await getAllCitiesDB();

        // Якщо IndexedDB порожня, і ми ще не робили міграцію
        if (!localStorage.getItem('migratedToIDB')) {
            console.log('Пошук старих даних у localStorage для міграції...');
            const lsCities = loadFromLocalStorage();
            
            if (lsCities.length > 0) {
                // Переносимо кожне місто в IndexedDB
                for (const city of lsCities) {
                    await addCityDB(city);
                }
                console.log('Міграцію з localStorage в IndexedDB успішно завершено!');
            }
            // Ставимо прапорець, щоб більше ніколи не робити міграцію
            localStorage.setItem('migratedToIDB', 'true');
            
            // Завантажуємо вже нові дані
            const updatedDbCities = await getAllCitiesDB();
            renderSavedCities(updatedDbCities);
        } else {
            // Звичайне завантаження
            renderSavedCities(dbCities);
        }
    } catch (error) {
        // ОБРОБКА ПОМИЛКИ ДОСТУПУ (try/catch успішно перехопив reject з openDB)
        console.error("Помилка ініціалізації сховища:", error.message || error.name);
        if (savedCitiesContainer) {
            savedCitiesContainer.innerHTML = `
                <div style="background-color: #FFEBEE; padding: 15px; border-radius: 8px; border: 1px solid #FFCDD2; color: #C62828;">
                    <strong>⚠️ Помилка доступу до бази даних!</strong><br>
                    Можливо, ви використовуєте режим "Інкогніто" або суворі налаштування приватності, які блокують IndexedDB. Функція збереження міст тимчасово недоступна.
                </div>`;
        }
        
        // Вимикаємо кнопку збереження, щоб уникнути подальших помилок
        const btnSaveCity = document.querySelector('#btn-save-city');
        if (btnSaveCity) btnSaveCity.disabled = true;
    }
}

// 8. Обробники подій
const btnSaveCity = document.querySelector('#btn-save-city');
if (btnSaveCity) {
    btnSaveCity.addEventListener('click', async () => {
        const liveTempText = document.querySelector('#live-temp').textContent;
        const liveDescText = document.querySelector('#live-desc').textContent;
        
        if (liveTempText === '--' || liveTempText === '') {
            alert('Дочекайтесь завантаження погоди!');
            return;
        }

        const newCity = {
            id: Date.now().toString(), 
            name: "Київ", 
            lat: 50.45,
            lon: 30.52,
            temperature: parseFloat(liveTempText),
            weatherCode: liveDescText,
            time: new Date().toLocaleTimeString('uk-UA')
        };

        try {
            await addCityDB(newCity); 
            const updated = await getAllCitiesDB(); 
            renderSavedCities(updated); 
        } catch(e) {
            alert("Не вдалося зберегти дані.");
        }
    });
}

if (savedCitiesContainer) {
    savedCitiesContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            try {
                await deleteCityDB(id); 
                const updated = await getAllCitiesDB();
                renderSavedCities(updated); 
            } catch(e) {
                console.error(e);
            }
        }
    });
}

// Запускаємо при завантаженні сторінки
initSavedCities();