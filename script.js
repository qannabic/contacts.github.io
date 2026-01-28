// Функция получения ID
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadContact(id) {
  if (!id) return;

  try {
    const response = await fetch("contacts.json");
    if (!response.ok) throw new Error("Ошибка загрузки базы");

    const contacts = await response.json();
    
    // Проверяем, есть ли человек в базе
    if (!contacts[id]) {
      alert("Контакт не найден в базе");
      return;
    }

    const person = contacts[id];

    // --- ЗАПОЛНЯЕМ ПОЛЯ ВВОДА (INPUTS) ---
    // Используем .value, чтобы текст можно было редактировать
    document.getElementById("firstName").value = person.firstName || "";
    document.getElementById("lastName").value = person.lastName || "";
    document.getElementById("jobTitle").value = person.jobTitle || "";
    document.getElementById("phone").value = person.phone || "";
    document.getElementById("email").value = person.email || "";

    // Фото (не редактируется, только отображается)
    if (person.photo) {
      document.getElementById("userPhoto").src = person.photo;
    }

  } catch (error) {
    console.error(error);
  }
}

function saveVCard() {
  // 1. Читаем данные ПРЯМО ИЗ ПОЛЕЙ (вдруг пользователь их исправил)
  const fName = document.getElementById("firstName").value.trim();
  const lName = document.getElementById("lastName").value.trim();
  const job = document.getElementById("jobTitle").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  // Если пусто, не сохраняем
  if (!fName && !lName) {
    alert("Введите хотя бы имя");
    return;
  }

  const fullName = `${fName} ${lName}`.trim();

  // 2. Формируем VCF файл
  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${lName};${fName};;;
FN:${fullName}
TITLE:${job}
TEL;TYPE=CELL:${phone}
EMAIL;TYPE=WORK:${email}
END:VCARD
  `.trim();

  // 3. Скачиваем
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fullName}.vcf`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Сообщение
  const msg = document.getElementById("statusMessage");
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 3000);
}

// Запуск
document.getElementById("saveBtn").addEventListener("click", saveVCard);

document.addEventListener('DOMContentLoaded', () => {
    const contactId = getQueryParam("id");
    loadContact(contactId);
});
