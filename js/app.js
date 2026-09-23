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
