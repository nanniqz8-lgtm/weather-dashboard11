console.log("DOM маніпуляції розпочато!");

//  Оголошуємо масив даних (оновлено поля за Варіантом 1: day, tempC, description)
const forecastData = [
  { day: "Пн", tempC: 18, description: "Хмарно ☁️" },
  { day: "Вт", tempC: 22, description: "Ясно ☀️" },
  { day: "Ср", tempC: 15, description: "Дощ 🌧️" },
  { day: "Чт", tempC: -2, description: "Сніг ❄️" }, // Морозний день для перевірки
  { day: "Пт", tempC: 0, description: "Хмарно ☁️" },
  { day: "Сб", tempC: -5, description: "Заметіль 🌨️" }, // Ще один морозний день
  { day: "Нд", tempC: 5, description: "Ясно ☀️" },
];

//  Вибираємо контейнери на сторінці
const listContainer = document.querySelector("#forecast-list");
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
renderForecast(forecastData);

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
    day: newDay,
    tempC: newTemp,
    description: newDesc,
  };

  // Додаємо новий об'єкт у масив
  forecastData.push(newForecastItem);

  // Перемальовуємо список (викликаємо функцію з ПР7)
  renderForecast(forecastData);

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
      currentIcon.src = "assets/img/rain.svg"; // Заміни на сніг, якщо маєш таку іконку
    } else {
      currentIcon.src = "assets/img/sunny.svg";
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
