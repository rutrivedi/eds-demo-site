// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Logo Bar Block
 *
 * Displays a row of partner/client logos with optional heading.
 * Used for "Trusted by X companies" sections.
 *
 * Content Structure (from document):
 * | logo-bar |
 * | Trusted by 4,000+ companies |
 * | Logo 1 + Company Name | Logo 2 + Company Name | ... |
 *
 * Each logo cell can contain:
 * - An image (logomark)
 * - A span with the company name (logotext)
 *
 * Features:
 * - Horizontal scrolling on mobile
 * - Centered layout on desktop
 * - Gradient masks on edges
 */

/**
 * HTML template for a single logo item
 */
function createLogoItemHTML(logoHTML, companyName) {
  return `
    <div class="logo-bar-item">
      <div class="logo-bar-mark">${logoHTML}</div>
      ${companyName ? `<span class="logo-bar-text">${companyName}</span>` : ''}
    </div>
  `;
}

/**
 * HTML template for the logo bar
 */
function createLogoBarHTML(heading, logos) {
  const logosHTML = logos.map((logo) => createLogoItemHTML(logo.image, logo.name)).join('');

  return `
    ${heading ? `<p class="logo-bar-heading">${heading}</p>` : ''}
    <div class="logo-bar-logos">
      <div class="logo-bar-track">
        ${logosHTML}
      </div>
    </div>
  `;
}

/**
 * Decorates the logo bar block
 * @param {Element} block - The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let heading = '';
  const logos = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Check if this row contains images (logos)
    const hasImages = cells.some((cell) => cell.querySelector('img, picture, svg'));

    if (hasImages) {
      // Extract each logo with its company name
      cells.forEach((cell) => {
        const picture = cell.querySelector('picture');
        const img = cell.querySelector('img');
        const svg = cell.querySelector('svg');
        const span = cell.querySelector('span');

        let imageHTML = '';
        if (picture) {
          imageHTML = picture.outerHTML;
        } else if (img) {
          imageHTML = img.outerHTML;
        } else if (svg) {
          imageHTML = svg.outerHTML;
        }

        // Get company name from span or remaining text
        let companyName = '';
        if (span) {
          companyName = span.textContent.trim();
        } else {
          // Try to get text content that's not part of the image
          const clone = cell.cloneNode(true);
          const imgInClone = clone.querySelector('picture, img, svg');
          if (imgInClone) imgInClone.remove();
          companyName = clone.textContent.trim();
        }

        if (imageHTML) {
          logos.push({ image: imageHTML, name: companyName });
        }
      });
    } else {
      // Text row - likely the heading
      const text = row.textContent.trim();
      if (text && !heading) {
        heading = text;
      }
    }
  });

  // Build logo bar HTML
  block.innerHTML = createLogoBarHTML(heading, logos);
}
// AI Generated Code by Deloitte + Cursor (END)
