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
 * - An image (logomark) - either embedded or as a URL/link
 * - Text with the company name
 *
 * Features:
 * - Horizontal scrolling on mobile
 * - Centered layout on desktop
 * - Gradient masks on edges
 * - Supports both embedded images and image URL references
 */

/**
 * Check if a string is an image URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isImageUrl(str) {
  if (!str) return false;
  const imageExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
  const lowerStr = str.toLowerCase();
  return imageExtensions.some((ext) => lowerStr.includes(ext));
}

/**
 * Extract image URL from a cell that might contain a link or text URL
 * @param {Element} cell - The cell element
 * @returns {string|null} - The image URL or null
 */
function extractImageUrl(cell) {
  // Check for anchor links first
  const link = cell.querySelector('a');
  if (link && isImageUrl(link.href)) {
    return link.href;
  }

  // Check for text that looks like an image URL
  const text = cell.textContent.trim();
  const lines = text.split('\n');
  const imageLine = lines.map((line) => line.trim()).find((trimmedLine) => isImageUrl(trimmedLine));

  if (imageLine) {
    // Clean up the URL (remove brackets if present)
    return imageLine.replace(/^\[|\]$/g, '');
  }

  return null;
}

/**
 * Extract company name from cell (text that's not an image URL)
 * @param {Element} cell - The cell element
 * @returns {string} - The company name
 */
function extractCompanyName(cell) {
  const text = cell.textContent.trim();
  const lines = text.split('\n');

  // Find the first non-empty line that's not an image URL
  const companyLine = lines
    .map((line) => line.trim())
    .find((trimmedLine) => trimmedLine && !isImageUrl(trimmedLine));

  return companyLine || '';
}

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

    // Check if this row contains images (embedded or as URLs)
    const hasImages = cells.some((cell) => {
      // Check for embedded images
      if (cell.querySelector('img, picture, svg')) return true;
      // Check for image URLs in text/links
      if (extractImageUrl(cell)) return true;
      return false;
    });

    if (hasImages) {
      // Extract each logo with its company name
      cells.forEach((cell) => {
        const picture = cell.querySelector('picture');
        const img = cell.querySelector('img');
        const svg = cell.querySelector('svg');

        let imageHTML = '';
        let companyName = '';

        if (picture) {
          // Embedded picture element
          imageHTML = picture.outerHTML;
          // Get company name from remaining text
          const clone = cell.cloneNode(true);
          const imgInClone = clone.querySelector('picture');
          if (imgInClone) imgInClone.remove();
          companyName = clone.textContent.trim();
        } else if (img) {
          // Embedded img element
          imageHTML = img.outerHTML;
          const clone = cell.cloneNode(true);
          const imgInClone = clone.querySelector('img');
          if (imgInClone) imgInClone.remove();
          companyName = clone.textContent.trim();
        } else if (svg) {
          // Embedded SVG element
          imageHTML = svg.outerHTML;
          const clone = cell.cloneNode(true);
          const imgInClone = clone.querySelector('svg');
          if (imgInClone) imgInClone.remove();
          companyName = clone.textContent.trim();
        } else {
          // Try to extract image URL from text/links
          const imageUrl = extractImageUrl(cell);
          if (imageUrl) {
            // Create img element from URL
            imageHTML = `<img src="${imageUrl}" alt="" loading="lazy">`;
            companyName = extractCompanyName(cell);
          }
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
