/* ==========================================================================
   1. DOM ELEMENTS
   ========================================================================== */

document.documentElement.classList.add("js-enabled");

// --- global ---
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

const header = document.querySelector('[data-js="site-header"]');
const mobileNav = document.querySelector('[data-js="mobile-nav"]');

// --- booking modal ---
const bookingDialog = document.querySelector('[data-js="booking-dialog"]');
const bookingButtons = document.querySelectorAll('[data-js="open-booking"]');
const closeBookingButton = document.querySelector('[data-js="close-booking"]');

// --- hero section ---
const hero = document.querySelector('[data-js="hero"]');
const heroBackgroundCurrent = document.querySelector('[data-js="hero-bg-current"]');
const heroBackgroundNext = document.querySelector('[data-js="hero-bg-next"]');
const seasonTitle = document.querySelector('[data-js="season-title"]');
const seasonDescription = document.querySelector('[data-js="season-description"]');
const seasonHours = document.querySelectorAll('[data-js="season-hours"]');
const seasonStatus = document.querySelector('[data-js="season-status"]');
const seasonPeriod = document.querySelector('[data-js="season-period"]');
const currentPill = document.querySelector('[data-js="current-pill"]');
const seasonButtons = [...document.querySelectorAll("[data-season]")];

// --- events section ---
// const eventsHolder = document.querySelector('[data-js="events-holder"]');
const featuredEvent = document.querySelector('[data-js="featured-event"]');
const carousel = document.querySelector('.events-holder'); //carousel
const eventCards = document.querySelectorAll("[data-event-name]"); // takes all event cards
const eventDialog = document.querySelector('[data-js="event-dialog"]');
const eventDialogTitle = document.querySelector('[data-js="event-dialog-title"]');
const closeEventButton = document.querySelector('[data-js="close-event"]');

// --- the map ---
const mapWrapper = document.querySelector('[data-js="map-wrapper"]');
const mapElement = document.querySelector('[data-js="map"]');
const mapPointers = [...document.querySelectorAll(".map-pointer")];
const panZones = document.querySelectorAll("[data-pan]");

// --- map pins ---
const pinInfo = document.querySelector('[data-js="pin-info"]');
const pinLocation = document.querySelector('[data-js="pin-location"]');
const pinTitle = document.querySelector('[data-js="pin-title"]');
const pinDescription = document.querySelector('[data-js="pin-description"]');
const closePinInfoButton = document.querySelector('[data-js="close-pin-info"]');

// --- Footer gallery ---
const galleryImgs = document.querySelectorAll(".footer-gallery-img");
const galleryDialog = document.querySelector('.gallery-dialog');
const closeGallery = document.querySelector('[data-js="close-gallery"]');
const dialogImage = document.querySelector('[data-js="dialog-image"]');

// --- Gallery ---
const imgDialog = document.querySelector(".img-dialog")
const imageGallery = document.querySelector('[data-js="gallery-img"]')
const blazeTracks = document.querySelectorAll(".blaze-track");
let currentGalleryRoot = document;

// --- scroll animation targets ---
const heroRevealItems = document.querySelectorAll(
  ".promo-text-hldr, .info-text-hldr, .hero-section .section-content > .button, .tags-hldr"
);
const scrollRevealTargets = [
  { element: document.querySelector(".events-section"), threshold: 0.2 },
  { element: document.querySelector(".map-section"), threshold: 0.18 },
  { element: document.querySelector(".news-section"), threshold: 0.16 },
  { element: document.querySelector(".footer-content"), threshold: 0.22 },
  { element: document.querySelector(".footer-gallery"), threshold: 0.2 },
];

const seasons = {
  low: {
    title: "Low season",
    image: "assets/bg-img-winter.webp",
    description:
      "Enjoy a quieter visit to the original Popeye's Film Set, with village activities, live entertainment, scenic walks, and family attractions included throughout the day.",
    hours: "09:30 - 17:00",
    period: "6 Nov - 30 Apr",
  },
  high: {
    title: "High season",
    image: "assets/bg-img-summer.webp",
    description:
      "Enjoy full access to the original Popeye's Film Set, which features live animation shows, traditional games, and a 15-minute documentary screening. Dive into the fun of our various kids' play pools and water assault courses, and enjoy our 9-hole mini-golf course, sunbeds, and umbrellas.",
    hours: "09:30 - 18:00",
    period: "Until 30 Sept",
  },
  mid: {
    title: "Mid season",
    image: "assets/bg-img-autumn-spring.webp",
    description:
      "Explore the original film set with live entertainment, traditional games, village activities, and family attractions during the milder spring and autumn season.",
    hours: "09:30 - 17:30",
    period: "1 May - 29 May / 1 Oct - 5 Nov",
  },
};

// --- Hero Background Swap State ---
let visibleBackground = heroBackgroundCurrent;
let hiddenBackground = heroBackgroundNext;
let backgroundSwapId = 0;

// --- Map Drag & Pan State ---
let mapX = 0;
let dragStartX = 0;
let dragStartY = 0;
let mapStartX = 0;
let mapStartY = 0;
let activePointerId = null;
let mapWasDragged = false;
let panFrame = null;
let panDirection = 0;



/*
 * Determines the current season (low, mid, high) based on a given date.
 */
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

/**
 * Retrieves the operational hours matching the current date and season rules.
 */
function getCurrentHours(date = new Date()) {
  const month = date.getMonth() + 1;
  return month === 5 && date.getDate() >= 30 ? "09:30 - 17:30" : seasons[getCurrentSeason(date)].hours;
}

// Calculate runtime global values
const currentSeason = getCurrentSeason();
const currentHours = getCurrentHours();

/**
 * Limits the rate at which a function execution can be triggered.
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


/* ==========================================================================
   4. Hero section / seasons
   ========================================================================== */

/**
 * Transitions the hero background image
 */
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

/**
 * Change hero content when a target season is chosen.
 */
function selectSeason(seasonKey, animateBackground = true) {
  const season = seasons[seasonKey];
  hero.dataset.season = seasonKey;

  const contentHolder = document.querySelector(".info-text-hldr"); //new
  // contentHolder.classList.remove("animate-in");
  hero.classList.remove("hero-switch");
  
  void contentHolder.offsetWidth;

  seasonTitle.textContent = season.title;
  seasonDescription.textContent = season.description;
  // seasonHours.textContent = seasonKey === currentSeason ? currentHours : season.hours;

  seasonHours.forEach((item) => item.textContent = seasonKey === currentSeason ? currentHours : season.hours);
  
  seasonStatus.textContent =
    seasonKey === currentSeason ? `Now: ${season.title}` : `Preview: ${season.title}`;
  seasonPeriod.textContent = season.period;
  currentPill.classList.toggle("is-hidden", seasonKey !== currentSeason);

  // contentHolder.classList.add("animate-in"); //new
  hero.classList.add("hero-switch");

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

// --- Season Event Listeners ---
seasonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectSeason(button.dataset.season);
  });
});


/* ==========================================================================
   5. Events
   ========================================================================== */

/**
 * Scrolls the event container horizontally to put focus on the featured card.
 */
function centerFeaturedEvent() {
  if (window.innerWidth > 900) {
    carousel.scrollLeft = 0;
    return;
  }

  const holderBounds = carousel.getBoundingClientRect();
  const cardBounds = featuredEvent.getBoundingClientRect();
  carousel.scrollLeft +=
    cardBounds.left -
    holderBounds.left -
    (carousel.clientWidth - featuredEvent.offsetWidth) / 2;
}

/**
 * Automatically calculates and centers carousel content, locking overflow if items fit.
 */
if(carousel){
function centerCarousel() {
  const totalWidth = carousel.scrollWidth;
  const visibleWidth = carousel.clientWidth;
  
  if (totalWidth <= visibleWidth) {
    carousel.style.overflowX = 'hidden';
    carousel.scrollLeft = 0;
  } else {
    carousel.style.overflowX = 'auto';
    const centerPosition = (totalWidth - visibleWidth) / 2;
    carousel.scrollLeft = centerPosition;
  }
}

const optimizedResize = debounce(centerCarousel, 300);

// --- Events & Carousel Listeners ---


window.addEventListener('load', centerCarousel);
window.addEventListener('resize', optimizedResize);
}



/* ==========================================================================
   6. Interactive map
   ========================================================================== */

if(mapWrapper){

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  let isHovered = false; // Tracks if the mouse is inside the wrapper

  // 1. Shared Centering Function
  function centerMap() {
    const maxPanDistance = mapElement.offsetWidth - mapWrapper.offsetWidth;
    if (maxPanDistance <= 0) return;

    if (isTouchDevice) {
        // Touch devices: Center by scrolling the wrapper container natively
        console.log(maxPanDistance / 2)
        mapWrapper.scrollLeft = maxPanDistance / 2;
    } else {
        // Desktop: Update target position for the animation loop
        targetX = -(maxPanDistance / 2);
    }
  }
  // const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // function centerMap() {
  //   mapWrapper.scrollLeft = (mapElement.scrollWidth - mapWrapper.clientWidth) / 2;
  // }

  // // Ensure dimensions have been laid out before centering.
  // requestAnimationFrame(centerMap);
  // window.addEventListener("resize", centerMap);

  // 1. Feature Detection: Exit if the user is on a touch screen

  if (!isTouchDevice) {
    // 1. Core State Variables
    let targetX = 0;       // Where the map wants to go based on mouse movement
    let currentX = 0;      // Where the map actually is right now (smoothed)

    // 2. Adjust these numbers to tweak the physics
    const easeFactor = 0.03;  // Lower = slower/smoother pan. Higher = snappier.
    const speedMultiplier = .35; // How much the map moves relative to mouse movement

    // 2. Function to center the map horizontally
    // function centerMap() {
    //     const maxPanDistance = mapElement.offsetWidth - mapWrapper.offsetWidth;
    //     // Safety check: only pan if the map is actually wider than the wrapper
    //     if (maxPanDistance > 0) {
    //         targetX = -(maxPanDistance / 2);
    //     } else {
    //         targetX = 0;
    //     }
    // }

    // 3. Track Mouse Movement
    mapWrapper.addEventListener('mouseenter', () => isHovered = true);
    // Center the map when the mouse leaves the wrapper area
    mapWrapper.addEventListener('mouseleave', () => {
        isHovered = false;
        // centerMap();
    });


    mapWrapper.addEventListener('pointermove', (e) => {
        if (!isHovered) return;

        // Calculate mouse position as a percentage (0 to 1) inside the wrapper
        const rect = mapWrapper.getBoundingClientRect();
        const mouseXPercentage = (e.clientX - rect.left) / rect.width;

        // Determine the maximum distance the map can physically pan
        const maxPanDistance = mapElement.offsetWidth - mapWrapper.offsetWidth;

        // Calculate target position based on percentage (inverted to map natural direction)
        // Moving mouse right moves map left, revealing hidden right content
        targetX = -(mouseXPercentage * maxPanDistance) * speedMultiplier;

        // Clamp targetX to ensure it never reveals empty space beyond bounds
        targetX = Math.max(-maxPanDistance, Math.min(0, targetX));
    });

    // 4. Smooth Animation Loop (Lerp + Momentum)
    function updatePan() {
        // Distance between where the map is and where it wants to be
        const distanceX = targetX - currentX;

        // Linear interpolation creates the slow down / momentum glide effect
        // currentX += distanceX * easeFactor;
        currentX += (targetX - currentX) * easeFactor

        // Apply the smoothed coordinate via hardware-accelerated transform
        mapElement.style.transform = `translateX(${currentX}px)`;

        // Run continuously
        requestAnimationFrame(updatePan);
    }

    // centerMap();
    // // Snap the current position immediately on first load so it doesn't visibly animate in
    // currentX = targetX; 
    // updatePan();
  }

    // Start the loop
    window.addEventListener('DOMContentLoaded', () => {
    // A small timeout ensures the browser has fully calculated layout dimensions
      setTimeout(() => {
          centerMap();
          if (!isTouchDevice) {
              currentX = targetX; 
              updatePan();
          }
      }, 50);
    });

    window.addEventListener('resize', () => {
      if (isTouchDevice || !isHovered) {
          centerMap();
      }
    });


    /**  
     * ========== PINS ======Hides the informational pin drawer overlay with an animated state transition.
     */
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
    /**
     * Checks constraints and adjusts layout horizontally to keep pins visible on mobile screen widths.
     */
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
    /**
     * Sets targeted datasets/text contents inside the info layout and toggles active classes.
     */
    function openPinInfo(pin) {
      mapPointers.forEach((item) => item.classList.toggle("is-active", item === pin));

      const currentIcon = [...pinLocation.classList].find(c => c.startsWith('icon-'));
      const newIcon = [...pin.classList].find(c => c.startsWith('icon-'));
      pinLocation.classList.replace(currentIcon, newIcon);


      pinLocation.dataset.value = pin.dataset.id;
      pinTitle.textContent = pin.dataset.title;
      pinDescription.textContent = pin.dataset.descr;
      pinInfo.hidden = false;
      pinInfo.classList.remove("is-closing");
      // pinLocation
      requestAnimationFrame(() => {
        pinInfo.classList.add("is-visible");
      });

      keepPinVisible(pin);
    }

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

    panZones.forEach((zone) => {
      zone.addEventListener("pointerenter", () => {
        panDirection = Number(zone.dataset.pan);
        // if (!panFrame && activePointerId === null) {
        //   panFrame = requestAnimationFrame(runEdgePan);
        // }
      });

      zone.addEventListener("pointerleave", () => {
        panDirection = 0;
      });
    });
}

//-------------------- map smooth pan end
/* ==========================================================================
   7. Scroll animations
   ========================================================================== */

function getCssPercentValue(element, propertyName) {
  return parseFloat(element.style.getPropertyValue(propertyName)) || 0;
}

function prepareScrollAnimations() {
  // heroRevealItems.forEach((item, index) => {
  //   item.style.setProperty("--reveal-delay", `${index * 110}ms`);
  // });

  requestAnimationFrame(() => {
    hero?.classList.add("hero-loaded", "hero-switch");
  });

document
  .querySelectorAll(".history-info .info, .history-info .cover-carousel .gallery-item, .history-info .google-map")
  .forEach((item) => item.classList.add("scroll-fade"));

  document.querySelectorAll(".history-info .text-reveal").forEach((element) => {
    if (element.dataset.revealPrepared === "true") {
      return;
    }

    const text = element.textContent.trim();
    if (!text) {
      return;
    }

    const parts = text.match(/[^.!?]+[.!?]?|\S+/g) || [text];
    element.textContent = "";
    element.dataset.revealPrepared = "true";

    parts.forEach((part, index) => {
      const span = document.createElement("span");
      span.className = "reveal-part";
      span.style.setProperty("--reveal-delay", `${Math.min(index * 45, 720)}ms`);
      span.textContent = `${part.trim()}${index === parts.length - 1 ? "" : " "}`;
      element.append(span);
    });
  });

  mapPointers.forEach((pin, index) => {
    const y = getCssPercentValue(pin, "--y");
    const regionDelay = y < 45 ? 0 : y < 60 ? 180 : 360;
    pin.style.setProperty("--pin-delay", `${regionDelay + (index % 10) * 36}ms`);
  });

  document.querySelectorAll(".event-card").forEach((card, index) => {
    card.style.setProperty("--card-delay", `${250 + index * 150}ms`);
  });

  document.querySelectorAll(".news-item").forEach((card, index) => {
    card.style.setProperty("--news-delay", `${index * 110}ms`);
  });

  document.querySelectorAll(".footer-gallery-img").forEach((item, index) => {
    item.style.setProperty("--gallery-delay", `${index * 100}ms`);
  });
}

function initializeScrollAnimations() {
  // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //   document.documentElement.classList.add("reduced-motion");
  //   return;
  // }

  prepareScrollAnimations();

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        entry.target.classList.remove("is-in-view");
        return;
      }

      entry.target.classList.add("is-in-view");
      // activeObserver.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: [0.16, 0.2, 0.22],
  });

  scrollRevealTargets.forEach(({ element }) => {
    if (element) {
      observer.observe(element);
    }
  });

  document
    .querySelectorAll(".history-info .scroll-fade, .history-info .text-reveal")
    .forEach((element) => {
      observer.observe(element);
    });
}

initializeScrollAnimations();


/* ==========================================================================
   7. Gallery carousel
   ========================================================================== */
document.querySelectorAll(".blaze-slider").forEach((el) => {
  const isCoverCarousel = el.classList.contains("cover-carousel");

  new BlazeSlider(el, {
    all: {
      enableAutoplay: true,
      autoplayInterval: isCoverCarousel ? 2600 : 3000,
      transitionDuration: isCoverCarousel ? 900 : 1000,
      slidesToShow: 5,
    },
    "(max-width: 1400px)": {
    slidesToShow: 5,
    },
    "(max-width: 1200px)": {
      slidesToShow: 4,
    },
    "(max-width: 900px)": {
      slidesToShow: 3,
    },
    "(max-width: 640px)": {
      slidesToShow: 2,
    },
  });
});
/* ==========================================================================
   MODAL UTILITIES (DRY CONFIGURATION)
   ========================================================================== */

/**
 * Attaches generic overlay click tracking to close a dialog when its backdrop is clicked.
 */
function handleBackdropClick(event) {
  const dialog = event.currentTarget;
  const bounds = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) {
    dialog.close();
  }
}

/**
 * Centralized setup helper to attach close actions and backdrop handlers to a dialog.
 */
function setupDialog(dialogElement, closeButtonElement) {
  if (!dialogElement) return;

  if (closeButtonElement) {
    closeButtonElement.addEventListener("click", () => dialogElement.close());
  }

  dialogElement.addEventListener("click", handleBackdropClick);
}


/* ==========================================================================
   MODAL INITIALIZATION & EVENT LISTENERS
   ========================================================================== */

// 1. Booking Modal Setup
bookingButtons.forEach((button) => {
  button.addEventListener("click", () => bookingDialog.showModal());
});
setupDialog(bookingDialog, closeBookingButton);

// 2. Event Modal Setup
eventCards.forEach((card) => {
  card.addEventListener("click", () => {
    eventDialogTitle.textContent = card.dataset.eventName;
    eventDialog.showModal();
  });
});
setupDialog(eventDialog, closeEventButton);

// 3. Gallery Modal Setup

// ============= FOOTER GALLERY ==========
// galleryImgs.forEach((card) => {
//   card.addEventListener("click", () => {
//     if (!galleryDialog || !dialogImage) {
//       return;
//     }

//     const clickedImgElement = card.querySelector("img");
//     dialogImage.src = clickedImgElement.src;
//     dialogImage.alt = clickedImgElement.alt;
//     galleryDialog.showModal();
//   });
// });
// setupDialog(galleryDialog, closeGallery);
// ============= FOOTER GALLERY ==========

const prevImgBtn = document.getElementById("prevImgBtn");
const nextImgBtn = document.getElementById("nextImgBtn");

// let currentImgIndex = 0;
// NEW CHANGES LOOK INTO currentImgIndex. TODO

// 2. Dynamically gather ONLY the unique/original image sources
// This ignores any cloning issues entirely
function getGalleryImagesData(root = currentGalleryRoot) {
  const allImgs = Array.from(root.querySelectorAll(".gallery-img"));
  
  // Filter out duplicates by tracking unique src strings
  const uniqueImgs = [];
  const seenSrcs = new Set();
  
  allImgs.forEach(img => {
    if (!seenSrcs.has(img.src)) {
      seenSrcs.add(img.src);
      uniqueImgs.push({ src: img.src, alt: img.alt });
    }
  });
  
  return uniqueImgs;
}

// 3. Helper to update the modal display
function updateModalImage(index, imagesData) {
  if (!imagesData[index] || !imageGallery) return;
  imageGallery.src = imagesData[index].src;
  imageGallery.alt = imagesData[index].alt;
}

/* ==========================================================================
   Gallery Modal Setup (Event Delegation)
   ========================================================================== */
// =========== CAN DELETE THIS ===========
// if (blazeTracks.length) {
//   blazeTracks.forEach((track) => track.addEventListener("click", (event) => {
//     // Find if the click happened on or inside a gallery-item
//     const item = event.target.closest(".gallery-item");
//     if (!item) return;
    
//     const targetImg = item.querySelector("img");
//     if (!targetImg) return;

//     currentGalleryRoot = item.closest(".blaze-slider") || document;

//     if (!imgDialog || !imageGallery) {
//       if (galleryDialog && dialogImage) {
//         dialogImage.src = targetImg.src;
//         dialogImage.alt = targetImg.alt;
//         galleryDialog.showModal();
//       }
//       return;
//     }

//     const imagesData = getGalleryImagesData();
    
//     // Find the correct index by matching the image source URL
//     currentImgIndex = imagesData.findIndex(img => img.src === targetImg.src);

//     if (currentImgIndex !== -1) {
//       updateModalImage(currentImgIndex, imagesData);
//       imgDialog.showModal();
//     }
//   }));
//   setupDialog(imgDialog, closeGallery);

// // Next Button Click
// nextImgBtn?.addEventListener("click", () => {
//   const imagesData = getGalleryImagesData();
//   if (!imagesData.length) return;
//   currentImgIndex = (currentImgIndex + 1) % imagesData.length;
//   updateModalImage(currentImgIndex, imagesData);
// });

// // Prev Button Click
// prevImgBtn?.addEventListener("click", () => {
//   const imagesData = getGalleryImagesData();
//   if (!imagesData.length) return;
//   currentImgIndex = (currentImgIndex - 1 + imagesData.length) % imagesData.length;
//   updateModalImage(currentImgIndex, imagesData);
// });
// }
// =========== CAN DELETE THIS ===========

/* ==========================================================================
   Navigation selector
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Get the current page filename (e.g., "weddings.html" or "index.html")
  let currentFile = window.location.pathname.split("/").pop();
  
  // If the URL ends in a slash (like http://localhost:5500/), the filename is empty.
  // In that case, we default it to "index.html".
  if (currentFile === "") {
    currentFile = "index.html";
  }

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    // 2. Get the filename from the link's href attribute
    const linkFile = link.getAttribute("href").split("/").pop();

    // 3. Compare them. If they match, add the active class!
    if (currentFile === linkFile) {
      link.classList.add("active");
    } else {
      // Clean up any lingering active classes just in case
      link.classList.remove("active");
    }
  });
});
