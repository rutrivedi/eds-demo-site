// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * CTA Callout Block
 *
 * Displays a call-to-action section with heading, description, and action buttons.
 * 
 * Content Structure (from document):
 * | cta-callout |
 * | Heading |
 * | Description |
 * | Button 1 Text | Button 1 Link |
 * | Button 2 Text | Button 2 Link |
 *
 * First row is heading, second row is description, remaining rows are buttons.
 */

/**
 * Get text content from element
 */
function getTextContent(element) {
  if (!element) return '';
  return element.textContent.trim();
}

/**
 * Decorates the CTA callout block
 * @param {Element} block - The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  if (rows.length < 3) return;

  // Extract heading and description
  const heading = getTextContent(rows[0].querySelector(':scope > div'));
  const description = getTextContent(rows[1].querySelector(':scope > div'));

  // Extract buttons (remaining rows)
  const buttonRows = rows.slice(2);
  const buttonsHTML = buttonRows.map((row, index) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    
    if (cells.length < 2) return '';

    const buttonText = getTextContent(cells[0]);
    const buttonLink = getTextContent(cells[1]);
    
    // First button is secondary, second is primary
    const buttonClass = index === 0 ? 'secondary' : 'primary';

    return `<a href="${buttonLink || '#'}" class="button ${buttonClass} cta-button">${buttonText}</a>`;
  }).join('');

  // Build complete block HTML
  block.innerHTML = `
    <div class="cta-content">
      <div class="cta-text">
        ${heading ? `<h2 class="cta-heading">${heading}</h2>` : ''}
        ${description ? `<p class="cta-description">${description}</p>` : ''}
      </div>
      ${buttonsHTML ? `<div class="cta-actions">${buttonsHTML}</div>` : ''}
    </div>
  `;
}
// AI Generated Code by Deloitte + Cursor (END)
