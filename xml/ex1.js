/* Этап 1. Подготовка данных */

// Создание экземпляра класса DOMParser
const parser = new DOMParser();

// XML, который мы будем парсить
const xmlString = `
<list>
  <student>
    <name lang="en">
      <first>Ivan</first>
      <second>Ivanov</second>
    </name>
    <age>35</age>
    <prof>teacher</prof>
  </student>
  <student>
    <name lang="ru">
      <first>Петр</first>
      <second>Петров</second>
    </name>
    <age>58</age>
    <prof>driver</prof>
  </student>
</list>
`;

/* Этап 2. Получение данных */

// Парсинг XML
const xmlDOM = parser.parseFromString(xmlString, "text/xml");

// Получение всех DOM-нод
const listNode = xmlDOM.querySelector("list");
const studentNodes = listNode.querySelectorAll("student");

// Создание массива для хранения данных о студентах
const students = [];

// Перебор всех студентов
studentNodes.forEach(studentNode => {
  const nameNode = studentNode.querySelector("name");
  const firstName = nameNode.querySelector("first").textContent;
  const secondName = nameNode.querySelector("second").textContent;
  const age = Number(studentNode.querySelector("age").textContent);
  const prof = studentNode.querySelector("prof").textContent;
  const lang = nameNode.getAttribute("lang");

  // Создание объекта студента и добавление его в массив
  students.push({
    name: `${firstName} ${secondName}`,
    age: age,
    prof: prof,
    lang: lang
  });
});

/* Этап 3. Запись данных в результирующий объект */
const result = {
  list: students
};

console.log('result', result);