// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Banner Block
 *
 * Displays a banner with configurable background image and content overlay.
 *
 * Content Structure (from document):
 * | banner |
 * | Background Image |
 * | Subheading |
 * | Heading |
 * | Description |
 * | Icon | Title | Description |
 * | Icon | Title | Description |
 * | ... |
 *
 * First row is background image, next 3 rows are header content, remaining rows are feature items.
 */

import { decorateIcons } from '../../scripts/aem.js';

/**
 * Get text content from element
 */
function getTextContent(element) {
  if (!element) return '';
  return element.textContent.trim();
}

/**
 * Extract icon from element
 */
function extractIcon(element) {
  if (!element) return '';

  const iconSpan = element.querySelector('span.icon');
  if (iconSpan) {
    // Create a clean icon span without img children (to avoid duplication when decorateIcons runs)
    const iconClasses = Array.from(iconSpan.classList).join(' ');
    return `<span class="${iconClasses}"></span>`;
  }

  const picture = element.querySelector('picture');
  if (picture) {
    return picture.outerHTML;
  }

  const img = element.querySelector('img');
  if (img) {
    return img.outerHTML;
  }

  const svg = element.querySelector('svg');
  if (svg) {
    return svg.outerHTML;
  }

  return '';
}

/**
 * Decorates the banner block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  if (rows.length === 0) return;

  // Extract background image from first row
  let backgroundImage = '';
  const firstRow = rows[0];
  const firstCell = firstRow.querySelector(':scope > div');
  const img = firstCell?.querySelector('img');

  if (img) {
    backgroundImage = img.src;
  }

  // Extract header content (rows 1-3 after background)
  let subheading = '';
  let heading = '';
  let description = '';
  let featureRows = [];

  if (rows.length >= 4) {
    subheading = getTextContent(rows[1].querySelector(':scope > div'));
    heading = getTextContent(rows[2].querySelector(':scope > div'));
    description = getTextContent(rows[3].querySelector(':scope > div'));
    featureRows = rows.slice(4);
  }

  // Build feature items HTML
  const featuresHTML = featureRows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length < 2) return '';

    const icon = extractIcon(cells[0]);
    const contentCell = cells[1];

    const titleEl = contentCell.querySelector('strong');
    const title = titleEl ? titleEl.textContent.trim() : '';

    const clone = contentCell.cloneNode(true);
    const titleInClone = clone.querySelector('strong');
    if (titleInClone) titleInClone.remove();
    const desc = clone.textContent.trim();

    return `
      <div class="banner-feature-item">
        ${icon ? `<div class="banner-featured-icon">${icon}</div>` : ''}
        <div class="banner-feature-content">
          ${title ? `<h3 class="banner-feature-title">${title}</h3>` : ''}
          ${desc ? `<p class="banner-feature-description">${desc}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Build complete block HTML
  block.innerHTML = `
    <div class="banner-background" style="background-image: url('${backgroundImage}')"></div>
    <div class="banner-container">
      <div class="banner-content-wrapper">
        <div class="banner-header">
          ${subheading ? `<p class="banner-subheading">${subheading}</p>` : ''}
          ${heading ? `<h2 class="banner-heading">${heading}</h2>` : ''}
          ${description ? `<p class="banner-description">${description}</p>` : ''}
        </div>
        ${featuresHTML ? `<div class="banner-features">${featuresHTML}</div>` : ''}
      </div>
    </div>
  `;

  // Decorate icons
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
