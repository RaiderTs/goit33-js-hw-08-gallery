// Подключаем галерею изображений
import galleryData from "./gallery-items.js";

// получаем рефы

const refs = {
  galleryList: document.querySelector(".js-gallery"),
  btnCloseModal: document.querySelector('[data-action="close-lightbox"]'),
  lightboxEl: document.querySelector(".js-lightbox"),
  lightboxImageEl: document.querySelector(".lightbox__image"),
  btnLeft: document.querySelector(".slider-arrow-left"),
  btnRight: document.querySelector(".slider-arrow-right"),
  backdropModal: document.querySelector(".lightbox__overlay"),
};

// Переменная для функции
const cardMarkup = createCardImagesMarkup(galleryData);

refs.galleryList.insertAdjacentHTML("beforeend", cardMarkup);

// Функция для рендера разметки

function createCardImagesMarkup(images) {
  return images
    .map(({ preview, original, description }) => {
      return `
      <li class="gallery__item">
      <a class="gallery__link"
         href="${original}">
        <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>`;
    })
    .join("");
}

// ставим слушателей

refs.galleryList.addEventListener("click", onImageClick);
refs.btnCloseModal.addEventListener("click", onCloseModal);
refs.backdropModal.addEventListener("click", onBackdropClick); //  закрываем модалку по кнопке
refs.btnLeft.addEventListener("click", () => {
  changeSlide("left");
});
refs.btnRight.addEventListener("click", () => {
  changeSlide("right");
});
// функция проверки клика по IMG

function onImageClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== "IMG") {
    return;
  }
  // Если да, открываем модалку
  onOpenModal(event);
  refs.lightboxImageEl.src = event.target.dataset.source;
  refs.lightboxImageEl.alt = event.target.alt;

  window.addEventListener("keydown", onEscPress);
}

function onOpenModal(event) {
  refs.lightboxEl.classList.add("is-open");
}

// функция для закрытия модалки

function onCloseModal(event) {
  refs.lightboxEl.classList.remove("is-open");
  refs.lightboxImageEl.src = "";
  refs.lightboxImageEl.alt = "";
}

//  Функция для закрытия модалки по esc

function onEscPress(event) {
  const ESC_KEY_CODE = "Escape";
  if (event.code === ESC_KEY_CODE) {
    onCloseModal();
  }
}

// Функция на закрытие модалки по бэкдроп

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    onCloseModal();
  }
}

// функция для листания слайдера кнопками
document.addEventListener("keydown", (event) => {
  const RIGHT_KEY_CODE = "ArrowRight";
  const LEFT_KEY_CODE = "ArrowLeft";
  if (event.key === LEFT_KEY_CODE) {
    changeSlide("left");
  } else if (event.key === RIGHT_KEY_CODE) {
    changeSlide("right");
  }
});

// Функция для слайдера

let currentIndex = 0;

function changeSlide(direction) {
  if (direction === "right") {
    currentIndex += 1;
    if (currentIndex === galleryData.length) {
      currentIndex = 0;
    }
  } else if (direction === "left") {
    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = galleryData.length - 1;
    }
  }
  refs.lightboxImageEl.src = galleryData[currentIndex].original;
  refs.lightboxImageEl.alt = galleryData[currentIndex].description;
}
