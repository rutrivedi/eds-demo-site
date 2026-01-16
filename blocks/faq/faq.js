// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * FAQ Block
 *
 * Displays frequently asked questions with icons.
 * 
 * Content Structure (from document):
 * | faq |
 * | Heading |
 * | Description |
 * | Icon | Question | Answer |
 * | Icon | Question | Answer |
 * | ... |
 * | CTA Heading |
 * | CTA Description |
 * | Button Text | Button Link |
 *
 * First 2 rows are header, FAQ items follow, last 3 rows are CTA section.
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
    const iconClasses = Array.from(iconSpan.classList).join(' ');
    return `<span class="${iconClasses}"></span>`;
  }

  return '';
}

/**
 * Decorates the FAQ block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  if (rows.length < 5) return;

  // Extract header (first 2 rows)
  const heading = getTextContent(rows[0].querySelector(':scope > div'));
  const description = getTextContent(rows[1].querySelector(':scope > div'));

  // Extract CTA section (last 3 rows)
  const ctaHeading = getTextContent(rows[rows.length - 3].querySelector(':scope > div'));
  const ctaDescription = getTextContent(rows[rows.length - 2].querySelector(':scope > div'));
  
  const buttonRow = rows[rows.length - 1];
  const buttonCells = [...buttonRow.querySelectorAll(':scope > div')];
  const buttonText = getTextContent(buttonCells[0]);
  const buttonLink = buttonCells[1] ? getTextContent(buttonCells[1]) : '#';

  // Extract FAQ items (rows between header and CTA)
  const faqRows = rows.slice(2, rows.length - 3);

  const faqItemsHTML = faqRows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    
    if (cells.length < 3) return '';

    const icon = extractIcon(cells[0]);
    const question = getTextContent(cells[1]);
    const answer = getTextContent(cells[2]);

    return `
      <div class="faq-item">
        ${icon ? `<div class="faq-icon">${icon}</div>` : ''}
        <h3 class="faq-question">${question}</h3>
        <p class="faq-answer">${answer}</p>
      </div>
    `;
  }).join('');

  // Build complete block HTML
  block.innerHTML = `
    <div class="faq-header-container">
      <div class="faq-header">
        ${heading ? `<h2 class="faq-heading">${heading}</h2>` : ''}
        ${description ? `<p class="faq-description">${description}</p>` : ''}
      </div>
    </div>
    <div class="faq-items-container">
      <div class="faq-items-grid">
        ${faqItemsHTML}
      </div>
    </div>
    <div class="faq-cta-container">
      <div class="faq-cta">
        ${ctaHeading ? `<h3 class="faq-cta-heading">${ctaHeading}</h3>` : ''}
        ${ctaDescription ? `<p class="faq-cta-description">${ctaDescription}</p>` : ''}
        ${buttonText ? `<a href="${buttonLink}" class="button primary faq-cta-button">${buttonText}</a>` : ''}
      </div>
    </div>
  `;

  // Decorate icons
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
