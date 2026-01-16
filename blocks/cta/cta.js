// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * CTA (Call-to-Action) Block
 *
 * Full-width call-to-action section with heading, description, and buttons.
 * Used for "Start your free trial" or "Get started" sections.
 *
 * Content Structure (from document):
 * | cta |
 * | Heading |
 * | Description |
 * | Primary CTA | Secondary CTA |
 *
 * Variants:
 * - cta (default): Centered layout with neutral background
 * - cta brand: Brand colored background
 */

import { decorateIcons } from '../../scripts/aem.js';

/**
 * HTML template for CTA content
 */
function createCTAHTML(data, isBrand = false) {
  const bgClass = isBrand ? 'cta-brand' : '';

  return `
    <div class="cta-content ${bgClass}">
      ${data.heading ? `<h2 class="cta-heading">${data.heading}</h2>` : ''}
      ${data.description ? `<p class="cta-description">${data.description}</p>` : ''}
      ${data.primaryCTA || data.secondaryCTA ? `
        <div class="cta-actions">
          ${data.secondaryCTA ? `
            <a href="${data.secondaryCTA.href}" class="button secondary button-xl">${data.secondaryCTA.text}</a>
          ` : ''}
          ${data.primaryCTA ? `
            <a href="${data.primaryCTA.href}" class="button primary button-xl">${data.primaryCTA.text}</a>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Get text from row, handling nested cells
 */
function getRowText(row) {
  const cell = row.querySelector(':scope > div');
  return cell ? cell.textContent.trim() : row.textContent.trim();
}

/**
 * Get link from element
 */
function getLink(element) {
  if (!element) return null;
  const link = element.querySelector('a');
  if (link) {
    return { href: link.href, text: link.textContent.trim() };
  }
  return null;
}

/**
 * Decorates the CTA block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const data = {
    heading: '',
    description: '',
    primaryCTA: null,
    secondaryCTA: null,
  };

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Check for links in cells
    if (cells.length >= 2) {
      const link1 = getLink(cells[0]);
      const link2 = getLink(cells[1]);

      if (link1 && link2) {
        data.secondaryCTA = link1;
        data.primaryCTA = link2;
        return;
      }
    }

    // Check for single cell with link
    if (cells.length === 1) {
      const link = getLink(cells[0]);
      if (link && !data.primaryCTA) {
        data.primaryCTA = link;
        return;
      }
    }

    // Check for heading
    const heading = row.querySelector('h1, h2, h3');
    if (heading) {
      data.heading = heading.textContent.trim();
      return;
    }

    // Text content
    const text = getRowText(row);
    if (text && !data.heading) {
      data.heading = text;
    } else if (text && !data.description) {
      data.description = text;
    }
  });

  // Check for brand variant
  const isBrand = block.classList.contains('brand');

  // Build CTA HTML
  block.innerHTML = createCTAHTML(data, isBrand);

  // Decorate icons
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
