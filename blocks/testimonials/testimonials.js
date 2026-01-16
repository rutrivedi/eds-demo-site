/**
 * Testimonials Block - Carousel Style
 *
 * Displays customer testimonials in a horizontal carousel with background images.
 * Includes heading and description within the same dark background container.
 *
 * Structure:
 * - testimonials (background applied here)
 *   - title-text-container (heading + description)
 *   - cards-container (carousel + navigation)
 *
 * Content Structure (from document):
 * First row: Heading | Supporting Text (optional)
 * Subsequent rows: Image | Rating | Quote | Name | Title
 *
 * Features:
 * - Horizontal carousel with navigation
 * - Background images per testimonial
 * - Decorative background elements
 * - Star rating display
 * - Heading and description integrated in layout
 * - Responsive design
 */

/**
 * SVG for filled star
 */
const STAR_FILLED_SVG = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_star)">
      <path d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_star">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
`;

/**
 * Generate star rating HTML
 */
function createStarRatingHTML(rating = 5) {
  const stars = [];
  const numStars = Math.min(5, Math.max(0, parseInt(rating, 10) || 5));

  for (let i = 0; i < numStars; i += 1) {
    stars.push(STAR_FILLED_SVG);
  }

  return `<div class="testimonial-stars">${stars.join('')}</div>`;
}

/**
 * HTML template for a testimonial card
 */
function createTestimonialCardHTML(testimonial, index) {
  // Use local carousel images, cycling through available images
  const imageNumber = (index % 4) + 1;
  const bgImage = testimonial.image || `/images/carousel-image-${imageNumber}.jpg`;

  return `
    <div class="testimonial-card-wrapper">
      <div class="testimonial-card-image" style="background-image: url('${bgImage}')">
        <div class="testimonial-card-overlay">
          <div class="testimonial-attribution-card">
            ${createStarRatingHTML(testimonial.rating)}
            <h3 class="testimonial-name">${testimonial.name}</h3>
            <div class="testimonial-details">
              <p class="testimonial-title">${testimonial.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Parse testimonials from document content
 */
function parseTestimonials(rows) {
  const result = {
    heading: "Don't just take our word for it",
    description: 'Hear from some of our amazing customers who are transforming their business.',
    testimonials: [],
  };

  // Parse testimonial rows
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length === 0) return;

    const testimonial = {
      image: '',
      rating: 5,
      quote: '',
      name: '',
      title: '',
    };

    if (cells.length >= 5) {
      // Image | Rating | Quote | Name | Title
      const img = cells[0].querySelector('img');
      if (img) {
        testimonial.image = img.src;
      }
      testimonial.rating = parseInt(cells[1].textContent.trim(), 10) || 5;
      testimonial.quote = cells[2].textContent.trim();
      testimonial.name = cells[3].textContent.trim();
      testimonial.title = cells[4].textContent.trim();
    } else if (cells.length === 4) {
      // Image | Quote | Name | Title
      const img = cells[0].querySelector('img');
      if (img) {
        testimonial.image = img.src;
      }
      testimonial.quote = cells[1].textContent.trim();
      testimonial.name = cells[2].textContent.trim();
      testimonial.title = cells[3].textContent.trim();
    } else if (cells.length === 3) {
      // Quote | Name | Title
      testimonial.quote = cells[0].textContent.trim();
      testimonial.name = cells[1].textContent.trim();
      testimonial.title = cells[2].textContent.trim();
    }

    if (testimonial.name) {
      result.testimonials.push(testimonial);
    }
  });

  return result;
}

/**
 * Initialize carousel navigation
 */
function initCarousel(block) {
  const carousel = block.querySelector('.testimonials-carousel');
  const prevBtn = block.querySelector('.carousel-btn-prev');
  const nextBtn = block.querySelector('.carousel-btn-next');

  if (!carousel || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = carousel.querySelectorAll('.testimonial-card-wrapper');
  const totalCards = cards.length;

  function updateCarousel() {
    const cardWidth = cards[0]?.offsetWidth || 288;
    const gap = 24; // Match CSS gap
    const scrollPosition = currentIndex * (cardWidth + gap);
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    const visibleCards = Math.floor(carousel.offsetWidth / (cards[0]?.offsetWidth || 288));
    if (currentIndex < totalCards - visibleCards) {
      currentIndex += 1;
      updateCarousel();
    }
  });
}

/**
 * Decorates the testimonials block
 * @param {Element} block - The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Parse content (heading, description, and testimonials)
  const { heading, description, testimonials } = parseTestimonials(rows);

  // Build testimonials HTML
  const cardsHTML = testimonials.map((t, index) => createTestimonialCardHTML(t, index)).join('');

  block.innerHTML = `
    <div class="testimonials-background">
      <div class="title-text-container">
        <div class="testimonials-header">
          <h2 class="testimonials-heading">${heading}</h2>
          <p class="testimonials-description">${description}</p>
        </div>
      </div>
      <div class="cards-container">
        <div class="testimonials-carousel">
          ${cardsHTML}
        </div>
        <div class="testimonials-navigation">
          <button class="carousel-btn carousel-btn-prev" aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8333 9.99984H4.16663M4.16663 9.99984L9.99996 15.8332M4.16663 9.99984L9.99996 4.1665" stroke="#A4A7AE" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="carousel-btn carousel-btn-next" aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.16663 9.99984H15.8333M15.8333 9.99984L9.99996 4.1665M15.8333 9.99984L9.99996 15.8332" stroke="#A4A7AE" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Initialize carousel functionality
  initCarousel(block);
}
