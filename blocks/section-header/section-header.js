// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Section Header Block
 *
 * A reusable block for section headings with subheading, title, and description.
 * Used across Features, Pricing, Why Us, and other sections.
 *
 * Content Structure (from document):
 * | section-header |
 * | Subheading text |
 * | Main Heading |
 * | Supporting description text |
 *
 * Variants:
 * - section-header-centered: Centers all text (default)
 * - section-header-left: Left-aligns text
 */

/**
 * Creates the section header HTML structure
 * @param {string} subheading - The subheading/label text
 * @param {string} heading - The main heading text
 * @param {string} description - The supporting description text
 * @param {boolean} centered - Whether to center the content
 * @returns {string} HTML string
 */
function createSectionHeaderHTML(subheading, heading, description, centered = true) {
  const alignmentClass = centered ? 'section-header-centered' : 'section-header-left';

  return `
    <div class="section-header-content ${alignmentClass}">
      <div>
        ${subheading ? `<p class="section-header-subheading">${subheading}</p>` : ''}
        ${heading ? `<h2 class="section-header-heading">${heading}</h2>` : ''}
      </div>
      ${description ? `<p class="section-header-description">${description}</p>` : ''}
    </div>
  `;
}

/**
 * Get text from row, handling nested cell structure
 */
function getRowText(row) {
  if (!row) return '';

  // Check for nested div (cell)
  const cell = row.querySelector(':scope > div');
  if (cell) {
    return cell.textContent.trim();
  }

  return row.textContent.trim();
}

/**
 * Decorates the section header block
 * @param {Element} block - The block element
 */
export default function decorate(block) {
  // Get content from rows
  const rows = [...block.querySelectorAll(':scope > div')];

  let subheading = '';
  let heading = '';
  let description = '';

  // Extract content from rows
  rows.forEach((row, index) => {
    const content = getRowText(row);
    if (index === 0) {
      subheading = content;
    } else if (index === 1) {
      heading = content;
    } else if (index === 2) {
      description = content;
    }
  });

  // Check for centered variant (default is centered)
  const isCentered = !block.classList.contains('left');

  // Clear block and add new structure
  block.innerHTML = createSectionHeaderHTML(subheading, heading, description, isCentered);
}
// AI Generated Code by Deloitte + Cursor (END)
