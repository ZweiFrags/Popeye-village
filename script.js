const header = document.querySelector('[data-js="site-header"]');
const mobileNav = document.querySelector('[data-js="mobile-nav"]');
const hero = document.querySelector('[data-js="hero"]');
const heroBackgroundCurrent = document.querySelector('[data-js="hero-bg-current"]');
const heroBackgroundNext = document.querySelector('[data-js="hero-bg-next"]');
const seasonTitle = document.querySelector('[data-js="season-title"]');
const seasonDescription = document.querySelector('[data-js="season-description"]');
const seasonHours = document.querySelector('[data-js="season-hours"]');
const seasonStatus = document.querySelector('[data-js="season-status"]');
const seasonPeriod = document.querySelector('[data-js="season-period"]');
const currentPill = document.querySelector('[data-js="current-pill"]');
const seasonButtons = [...document.querySelectorAll("[data-season]")];
// const headerHours = document.querySelector(".header-time-hldr strong");
const bookingDialog = document.querySelector('[data-js="booking-dialog"]');
const bookingButtons = document.querySelectorAll('[data-js="open-booking"]');
const closeBookingButton = document.querySelector('[data-js="close-booking"]');
const eventCards = document.querySelectorAll("[data-event-name]"); // takes all event cards
const eventDialog = document.querySelector('[data-js="event-dialog"]');
const eventDialogTitle = document.querySelector('[data-js="event-dialog-title"]');
const closeEventButton = document.querySelector('[data-js="close-event"]');
const eventsHolder = document.querySelector('[data-js="events-holder"]');
const featuredEvent = document.querySelector('[data-js="featured-event"]');
const mapWrapper = document.querySelector('[data-js="map-wrapper"]');
const mapElement = document.querySelector('[data-js="map"]');
const mapPointers = [...document.querySelectorAll(".map-pointer")];
const pinInfo = document.querySelector('[data-js="pin-info"]');
const pinLocation = document.querySelector('[data-js="pin-location"]');
const pinTitle = document.querySelector('[data-js="pin-title"]');
const pinDescription = document.querySelector('[data-js="pin-description"]');
const closePinInfoButton = document.querySelector('[data-js="close-pin-info"]');
const panZones = document.querySelectorAll("[data-pan]");
const carousel = document.querySelector('.events-holder'); //carousel
const galleryImgs = document.querySelectorAll(".footer-gallery-img");
const galleryDialog = document.querySelector('.gallery-dialog');
const closeGallery = document.querySelector('[data-js="close-gallery"]');
const dialogImage = document.querySelector('[data-js="dialog-image"]');
const wrapper = document.querySelector('[data-js="map-wrapper"]');
const map = document.querySelector('[data-js="map"]');

const seasons = {
  low: {
    title: "Low season",
    image: "assets/bg-img-winter.png",
    description:
      "Enjoy a quieter visit to the original Popeye's Film Set, with village activities, live entertainment, scenic walks, and family attractions included throughout the day.",
    hours: "09:30 - 17:00",
    period: "6 Nov - 30 Apr",
  },
  high: {
    title: "High season",
    image: "assets/bg-img-summer.png",
    description:
      "Enjoy full access to the original Popeye's Film Set, which features live animation shows, traditional games, and a 15-minute documentary screening. Dive into the fun of our various kids' play pools and water assault courses, and enjoy our 9-hole mini-golf course, sunbeds, and umbrellas.",
    hours: "09:30 - 18:00",
    period: "Until 30 Sept",
  },
  mid: {
    title: "Mid season",
    image: "assets/bg-img-autumn-spring.png",
    description:
      "Explore the original film set with live entertainment, traditional games, village activities, and family attractions during the milder spring and autumn season.",
    hours: "09:30 - 17:30",
    period: "1 May - 29 May / 1 Oct - 5 Nov",
  },
};

let visibleBackground = heroBackgroundCurrent;
let hiddenBackground = heroBackgroundNext;
let backgroundSwapId = 0;
let mapX = 0;
let mapY = 0;
let dragStartX = 0;
let dragStartY = 0;
let mapStartX = 0;
let mapStartY = 0;
let activePointerId = null;
let mapWasDragged = false;
let panFrame = null;
let panDirection = 0;

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 5 && day <= 29) || month === 10 || (month === 11 && day <= 5)) {
    return "mid";
  }

  if ((month === 5 && day >= 30) || (month >= 6 && month <= 9)) {
    return "high";
  }

  return "low";
}

function getCurrentHours(date = new Date()) {
  const month = date.getMonth() + 1;
  return month === 5 && date.getDate() >= 30 ? "09:30 - 17:30" : seasons[getCurrentSeason(date)].hours;
}

const currentSeason = getCurrentSeason();
const currentHours = getCurrentHours();

function swapHeroBackground(source) {
  if (visibleBackground.getAttribute("src") === source) {
    return;
  }

  const swapId = ++backgroundSwapId;
  const nextLayer = hiddenBackground;
  const currentLayer = visibleBackground;
  nextLayer.src = source;

  const revealBackground = () => {
    if (swapId !== backgroundSwapId) {
      return;
    }

    nextLayer.classList.add("is-visible");
    currentLayer.classList.remove("is-visible");
    visibleBackground = nextLayer;
    hiddenBackground = currentLayer;
  };

  if (nextLayer.complete) {
    revealBackground();
  } else {
    nextLayer.addEventListener("load", revealBackground, { once: true });
  }
}

function selectSeason(seasonKey, animateBackground = true) {
  const season = seasons[seasonKey];
  hero.dataset.season = seasonKey;

  seasonTitle.textContent = season.title;
  seasonDescription.textContent = season.description;
  seasonHours.textContent = seasonKey === currentSeason ? currentHours : season.hours;
  seasonStatus.textContent =
    seasonKey === currentSeason ? `Now: ${season.title}` : `Preview: ${season.title}`;
  seasonPeriod.textContent = season.period;
  currentPill.classList.toggle("is-hidden", seasonKey !== currentSeason);

  seasonButtons.forEach((button) => {
    const isSelected = button.dataset.season === seasonKey;
    const isCurrent = button.dataset.season === currentSeason;
    button.classList.toggle("selected-season", isSelected);
    button.classList.toggle("current-season", isCurrent);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (animateBackground) {
    swapHeroBackground(season.image);
  } else {
    visibleBackground.src = season.image;
    hiddenBackground.src = season.image;
  }
}



seasonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectSeason(button.dataset.season);
  });
});

bookingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bookingDialog.showModal();
  });
});

closeBookingButton.addEventListener("click", () => {
  bookingDialog.close();
});

bookingDialog.addEventListener("click", (event) => {
  const bounds = bookingDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) {
    bookingDialog.close();
  }
});

eventCards.forEach((card) => {
  card.addEventListener("click", () => {
    eventDialogTitle.textContent = card.dataset.eventName;
    eventDialog.showModal();
  });
}); // listen to every event card click

closeEventButton.addEventListener("click", () => {
  eventDialog.close();
});

eventDialog.addEventListener("click", (event) => {
  const bounds = eventDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) {
    eventDialog.close();
  }
});



function centerFeaturedEvent() {
  if (window.innerWidth > 900) {
    eventsHolder.scrollLeft = 0;
    return;
  }

  const holderBounds = eventsHolder.getBoundingClientRect();
  const cardBounds = featuredEvent.getBoundingClientRect();
  eventsHolder.scrollLeft +=
    cardBounds.left -
    holderBounds.left -
    (eventsHolder.clientWidth - featuredEvent.offsetWidth) / 2;
}

function getMapBounds() {
  return {
    minX: Math.min(0, mapWrapper.clientWidth - mapElement.offsetWidth),
    maxX: 0,
    minY: Math.min(0, mapWrapper.clientHeight - mapElement.offsetHeight),
    maxY: 0,
  };
}

function updateMapPosition() {
  const bounds = getMapBounds();
  mapX = Math.min(bounds.maxX, Math.max(bounds.minX, mapX));
  mapY = Math.min(bounds.maxY, Math.max(bounds.minY, mapY));
  mapElement.style.setProperty("--map-x", `${mapX}px`);
  mapElement.style.setProperty("--map-y", `${mapY}px`);
}

function setInitialMapPosition() {
  const focusRatio = window.innerWidth <= 900 ? 0.56 : 0.5;
  mapX = mapWrapper.clientWidth / 2 - mapElement.offsetWidth * focusRatio;
  mapY = 0;
  updateMapPosition();
}

function closePinInfo() {
  const activePin = document.querySelector(".map-pointer.is-active");
  activePin?.classList.remove("is-active");

  if (pinInfo.hidden) {
    return;
  }

  pinInfo.classList.remove("is-visible");
  pinInfo.classList.add("is-closing");

  window.setTimeout(() => {
    if (!pinInfo.classList.contains("is-visible")) {
      pinInfo.hidden = true;
      pinInfo.classList.remove("is-closing");
    }
  }, 190);
}

function keepPinVisible(pin) {
  if (window.innerWidth > 900) {
    return;
  }

  const wrapperBounds = mapWrapper.getBoundingClientRect();
  const pinBounds = pin.getBoundingClientRect();
  const safeLeft = wrapperBounds.left + 72;
  const safeRight = wrapperBounds.right - 72;

  if (pinBounds.left < safeLeft) {
    mapX += safeLeft - pinBounds.left;
  } else if (pinBounds.right > safeRight) {
    mapX -= pinBounds.right - safeRight;
  }

  updateMapPosition();
}

function openPinInfo(pin) {
  mapPointers.forEach((item) => item.classList.toggle("is-active", item === pin));

  pinLocation.dataset.value = pin.dataset.id;
  pinTitle.textContent = pin.dataset.title;
  pinDescription.textContent = pin.dataset.descr;
  pinInfo.hidden = false;
  pinInfo.classList.remove("is-closing");

  requestAnimationFrame(() => {
    pinInfo.classList.add("is-visible");
  });

  keepPinVisible(pin);
}

mapWrapper.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".map-pointer, .map-abs")) {
    return;
  }

  activePointerId = event.pointerId;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  mapStartX = mapX;
  mapStartY = mapY;
  mapWasDragged = false;
  mapWrapper.classList.add("is-dragging");
  mapWrapper.setPointerCapture(event.pointerId);
});

mapWrapper.addEventListener("pointermove", (event) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;
  mapWasDragged = mapWasDragged || Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;
  mapX = mapStartX + deltaX;
  mapY = mapStartY + deltaY;
  updateMapPosition();
});

function finishMapDrag(event) {
  if (event.pointerId !== activePointerId) {
    return;
  }

  mapWrapper.releasePointerCapture(event.pointerId);
  mapWrapper.classList.remove("is-dragging");
  activePointerId = null;
}

mapWrapper.addEventListener("pointerup", finishMapDrag);
mapWrapper.addEventListener("pointercancel", finishMapDrag);

mapPointers.forEach((pin) => {
  pin.addEventListener("click", (event) => {
    if (mapWasDragged) {
      event.preventDefault();
      mapWasDragged = false;
      return;
    }

    openPinInfo(pin);
  });
});

closePinInfoButton.addEventListener("click", closePinInfo);

function runEdgePan() {
  if (!panDirection || activePointerId !== null) {
    panFrame = null;
    return;
  }

  mapX += panDirection * 6;
  updateMapPosition();
  panFrame = requestAnimationFrame(runEdgePan);
}

panZones.forEach((zone) => {
  zone.addEventListener("pointerenter", () => {
    panDirection = Number(zone.dataset.pan);
    if (!panFrame && activePointerId === null) {
      panFrame = requestAnimationFrame(runEdgePan);
    }
  });

  zone.addEventListener("pointerleave", () => {
    panDirection = 0;
  });
});




function initMapPosition() {
  // 1. Get the actual rendered widths
  const wrapperWidth = wrapper.offsetWidth;
  const mapWidth = map.offsetWidth;

  // 2. Calculate how many pixels the map overflows, and divide by 2
  // This will be a negative number (e.g., -400px), shifting the map left perfectly
  const centerX = (wrapperWidth - mapWidth) / 2;

  // 3. Apply it to your CSS variable
  map.style.setProperty('--map-x', `${centerX}px`);

  // 4. IMPORTANT FOR YOUR DRAG SCRIPT:
  // Your dragging script likely has a variable tracking the current X position 
  // (e.g., currentX, mapX, posX). You MUST update that variable with this starting value.
  // Example: 
  // myMapTracker.x = centerX;
}

// Run it once the DOM and assets are fully loaded so dimensions are accurate
window.addEventListener('load', initMapPosition);

//Map section ^


// headerHours.textContent = currentHours;
// selectSeason(currentSeason, false);
// requestAnimationFrame(centerFeaturedEvent);
// requestAnimationFrame(setInitialMapPosition);



// Carousel


function centerCarousel() {
  const totalWidth = carousel.scrollWidth;
  const visibleWidth = carousel.clientWidth;
  
  // 1. Check if the content actually overflows the screen
  if (totalWidth <= visibleWidth) {
    // If it fits completely, lock scrolling entirely
    carousel.style.overflowX = 'hidden';
    carousel.scrollLeft = 0; // Reset scroll to default
  } else {
    // If it overflows, enable scrolling and calculate the center
    carousel.style.overflowX = 'auto';
    
    const centerPosition = (totalWidth - visibleWidth) / 2;
    carousel.scrollLeft = centerPosition;
  }
}

// The same debounce wrapper from before to protect performance
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const optimizedResize = debounce(centerCarousel, 300);

window.addEventListener('load', centerCarousel);
window.addEventListener('resize', optimizedResize);



// gallery image pop-up

// const galleryImgs = document.querySelectorAll(".footer-gallery-img");
// const galleryDialog = document.querySelector('.gallery-dialog');


galleryImgs.forEach((card) => {
  card.addEventListener("click", () => {
    const clickedImgElement = card.querySelector("img");
    dialogImage.src = clickedImgElement.src;
    dialogImage.alt = clickedImgElement.alt;
    galleryDialog.showModal();
  });
}); // listen to every event card click

closeGallery.addEventListener("click", () => {
  galleryDialog.close();
});

galleryDialog.addEventListener("click", (event) => {
  const bounds = galleryDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) {
    galleryDialog.close();
  }
});