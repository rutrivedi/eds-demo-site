// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Features Block
 *
 * Displays feature items with optional header (subheading, heading, description).
 * 
 * Content Structure (from document):
 * | features |
 * | Subheading |
 * | Heading |
 * | Description |
 * | Icon | Title | Description |
 * | Icon | Title | Description |
 * | ... |
 *
 * First 3 rows are header content, remaining rows are feature items.
 */

import { decorateIcons } from '../../scripts/aem.js';

/**
 * HTML template for a single feature item
 */
function createFeatureItemHTML(icon, title, description, isCardVariant = false, isSolutionsVariant = false, link = '') {
  if (isSolutionsVariant) {
    return `
      <div class="solution-feature-item">
        ${icon ? `
          <div class="featured-icon">
            ${icon}
          </div>
        ` : ''}
        <div class="solution-feature-content">
          <div class="solution-feature-text">
            ${title ? `<h3 class="solution-feature-title">${title}</h3>` : ''}
            ${description ? `<p class="solution-feature-description">${description}</p>` : ''}
          </div>
          <a href="#" class="solution-feature-link">
            <span>Learn more</span>
            <span class="icon icon-arrow-right"></span>
          </a>
        </div>
      </div>
    `;
  }

  if (isCardVariant) {
    return `
      <div class="feature-card">
        ${icon ? `
          <div class="featured-icon">
            ${icon}
          </div>
        ` : ''}
        <div class="feature-card-content">
          <div class="feature-card-text">
            ${title ? `<h3 class="feature-card-title">${title}</h3>` : ''}
            ${description ? `<p class="feature-card-description">${description}</p>` : ''}
          </div>
          <a href="#" class="feature-card-link">
            <span>Learn more</span>
            <span class="icon icon-arrow-right"></span>
          </a>
        </div>
      </div>
    `;
  }

  return `
    <div class="feature-item">
      ${icon ? `
        <div class="featured-icon">
          ${icon}
        </div>
      ` : ''}
      <div class="feature-item-content">
        ${title ? `<h3 class="feature-item-title">${title}</h3>` : ''}
        ${description ? `<p class="feature-item-description">${description}</p>` : ''}
        ${link ? `<div class="feature-item-link">${link}</div>` : ''}
      </div>
    </div>
  `;
}

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
 * Decorates the features block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Check variants
  const isCardVariant = block.classList.contains('cards');
  const isSolutionsVariant = block.classList.contains('solutions');

  // Extract header content (first 3 rows if they don't have icons)
  let subheading = '';
  let heading = '';
  let description = '';
  let featureRows = rows;

  // Check if first row is a subheading (no icon, short text)
  if (rows.length >= 3) {
    const firstCell = rows[0].querySelector(':scope > div');
    const hasIcon = firstCell && extractIcon(firstCell);
    
    if (!hasIcon) {
      // First 3 rows are header content
      subheading = getTextContent(rows[0].querySelector(':scope > div'));
      heading = getTextContent(rows[1].querySelector(':scope > div'));
      description = getTextContent(rows[2].querySelector(':scope > div'));
      featureRows = rows.slice(3);
    }
  }

  // Extract image for solutions variant
  let imageHTML = '';
  if (isSolutionsVariant && featureRows.length > 0) {
    const lastRow = featureRows[featureRows.length - 1];
    const lastCell = lastRow.querySelector(':scope > div:last-child');
    const img = lastCell?.querySelector('img');

    if (img) {
      imageHTML = `<div class="solutions-image">${img.parentElement.outerHTML}</div>`;
      featureRows = featureRows.slice(0, -1);
    }
  }

  // Build feature items HTML
  const featuresHTML = featureRows.map((row) => {
    let cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length === 0) {
      cells = [row];
    }

    let icon = '';
    let title = '';
    let desc = '';
    let link = '';

    if (cells.length === 1) {
      const cell = cells[0];
      icon = extractIcon(cell);
      const headingEl = cell.querySelector('h3, h4, strong');
      title = headingEl ? headingEl.textContent.trim() : '';

      const clone = cell.cloneNode(true);
      const headingInClone = clone.querySelector('h3, h4, strong');
      if (headingInClone) headingInClone.remove();
      const iconInClone = clone.querySelector('span.icon, picture, img');
      if (iconInClone) iconInClone.remove();
      desc = clone.textContent.trim();
    } else if (cells.length === 2) {
      icon = extractIcon(cells[0]);
      const contentCell = cells[1];
      const headingEl = contentCell.querySelector('h3, h4, strong');
      title = headingEl ? headingEl.textContent.trim() : '';

      const clone = contentCell.cloneNode(true);
      const headingInClone = clone.querySelector('h3, h4, strong');
      if (headingInClone) headingInClone.remove();
      desc = clone.textContent.trim();
    } else if (cells.length === 3) {
      icon = extractIcon(cells[0]);
      const titleEl = cells[1].querySelector('strong');
      title = titleEl ? titleEl.textContent.trim() : getTextContent(cells[1]);
      desc = getTextContent(cells[2]);
    } else if (cells.length >= 4) {
      icon = extractIcon(cells[0]);
      title = getTextContent(cells[1]);
      desc = getTextContent(cells[2]);
      const linkEl = cells[3].querySelector('a');
      if (linkEl) {
        link = linkEl.outerHTML;
      }
    }

    return createFeatureItemHTML(icon, title, desc, isCardVariant, isSolutionsVariant, link);
  }).join('');

  // Build complete block HTML with Figma structure
  const headerHTML = (subheading || heading || description) ? `
    <div class="features-header">
      <div class="features-heading-wrapper">
        ${subheading ? `<p class="features-subheading">${subheading}</p>` : ''}
        ${heading ? `<h2 class="features-heading">${heading}</h2>` : ''}
      </div>
      ${description ? `<p class="features-description">${description}</p>` : ''}
    </div>
  ` : '';

  if (isSolutionsVariant) {
    block.innerHTML = `
      <div class="solutions-header-container">
        ${headerHTML}
      </div>
      <div class="solutions-content-container">
        <div class="solutions-features">
          ${featuresHTML}
        </div>
        ${imageHTML}
      </div>
    `;
  } else {
    block.innerHTML = `
      ${headerHTML}
      <div class="features-content">
        <div class="features-grid">
          ${featuresHTML}
        </div>
      </div>
    `;
  }

  // Decorate icons
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
