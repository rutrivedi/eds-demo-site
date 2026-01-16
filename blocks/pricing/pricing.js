// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Pricing Block
 *
 * Displays pricing tier cards with header (subheading, heading, description).
 *
 * Content Structure (from document):
 * | pricing |
 * | Subheading |
 * | Heading |
 * | Description |
 * | Package Label | Package Name | Description | Primary CTA | Secondary CTA |
 * | Feature 1 |
 * | Feature 2 |
 * | --- | (separator for next card)
 * | Package Label | Package Name | ... |
 *
 * First 3 rows are header content, remaining rows are pricing cards.
 */

import { decorateIcons } from '../../scripts/aem.js';

/**
 * SVG for check circle icon
 */
const CHECK_ICON_SVG = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

/**
 * HTML template for a feature list item
 */
function createFeatureItemHTML(text) {
  return `
    <li class="pricing-feature-item">
      <span class="pricing-feature-icon">${CHECK_ICON_SVG}</span>
      <span class="pricing-feature-text">${text}</span>
    </li>
  `;
}

/**
 * HTML template for a pricing card
 */
function createPricingCardHTML(card) {
  const popularBadge = card.isPopular ? `
    <span class="pricing-badge">Popular</span>
  ` : '';

  const featuresHTML = card.features.map((f) => createFeatureItemHTML(f)).join('');

  const inheritText = card.inheritsFrom ? `
    <p class="pricing-inherits">
      Everything in <strong>${card.inheritsFrom}</strong> plus....
    </p>
  ` : '';

  return `
    <div class="pricing-card ${card.isPopular ? 'pricing-card-popular' : ''}">
      <div class="pricing-card-header">
        <div class="pricing-card-header-top">
          <span class="pricing-card-label">${card.label}</span>
          ${popularBadge}
        </div>
        <h3 class="pricing-card-name">${card.name}</h3>
        <p class="pricing-card-description">${card.description}</p>
        <div class="pricing-card-actions">
          ${card.primaryCTA ? `
            <a href="${card.primaryCTA.href}" class="button primary button-xl">${card.primaryCTA.text}</a>
          ` : ''}
          ${card.secondaryCTA ? `
            <a href="${card.secondaryCTA.href}" class="button secondary button-xl">${card.secondaryCTA.text}</a>
          ` : ''}
        </div>
      </div>
      <div class="pricing-card-content">
        <div class="pricing-features-header">
          <span class="pricing-features-label">FEATURES</span>
          ${inheritText}
        </div>
        <ul class="pricing-features-list">
          ${featuresHTML}
        </ul>
      </div>
    </div>
  `;
}

/**
 * Get text content from row, handling nested cells
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
  const text = element.textContent.trim();
  if (text) {
    return { href: '#', text };
  }
  return null;
}

/**
 * Parse pricing data from rows
 */
function parsePricingCards(rows) {
  const cards = [];
  let currentCard = null;

  rows.forEach((row) => {
    // Get cells from row
    const cells = [...row.querySelectorAll(':scope > div')];
    const rowText = getRowText(row);

    // Check for separator
    if (rowText === '---' || row.querySelector('hr')) {
      if (currentCard && currentCard.features.length > 0) {
        cards.push(currentCard);
        currentCard = null;
      }
      return;
    }

    // Check if this is a header row (has 3+ cells - label, name, description, etc.)
    if (cells.length >= 3 && !currentCard) {
      currentCard = {
        label: cells[0]?.textContent.trim() || '',
        name: cells[1]?.textContent.trim() || '',
        description: cells[2]?.textContent.trim() || '',
        primaryCTA: null,
        secondaryCTA: null,
        features: [],
        isPopular: false,
        inheritsFrom: null,
      };

      // Check for Popular in label
      if (currentCard.label.toLowerCase().includes('popular')) {
        currentCard.isPopular = true;
        currentCard.label = currentCard.label.replace(/popular/gi, '').trim();
      }

      // Extract CTAs from cells 3 and 4
      if (cells[3]) {
        currentCard.primaryCTA = getLink(cells[3]);
      }
      if (cells[4]) {
        currentCard.secondaryCTA = getLink(cells[4]);
      }

      return;
    }

    // If we have a current card, add features
    if (currentCard) {
      // Check for "Everything in X" text
      if (rowText.toLowerCase().includes('everything in')) {
        const match = rowText.match(/everything in\s+(\w+)/i);
        if (match) {
          currentCard.inheritsFrom = match[1];
        }
        return;
      }

      // Add as feature if has content and not a separator
      if (rowText && rowText !== '---') {
        currentCard.features.push(rowText);
      }
    }
  });

  // Don't forget the last card
  if (currentCard && currentCard.features.length > 0) {
    cards.push(currentCard);
  }

  return cards;
}

/**
 * Decorates the pricing block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Extract header content (first 3 rows if they don't have 3+ cells)
  let subheading = '';
  let heading = '';
  let description = '';
  let pricingRows = rows;

  // Check if first row is a subheading (single cell, short text)
  if (rows.length >= 3) {
    const firstCells = rows[0].querySelectorAll(':scope > div');
    if (firstCells.length === 1) {
      // First 3 rows are header content
      subheading = getRowText(rows[0]);
      heading = getRowText(rows[1]);
      description = getRowText(rows[2]);
      pricingRows = rows.slice(3);
    }
  }

  // Parse pricing cards
  const cards = parsePricingCards(pricingRows);

  // Build header HTML
  const headerHTML = (subheading || heading || description) ? `
    <div class="pricing-header">
      <div class="pricing-heading-wrapper">
        ${subheading ? `<p class="pricing-subheading">${subheading}</p>` : ''}
        ${heading ? `<h2 class="pricing-heading">${heading}</h2>` : ''}
      </div>
      ${description ? `<p class="pricing-description">${description}</p>` : ''}
    </div>
  ` : '';

  // Build pricing HTML
  const cardsHTML = cards.map((card) => createPricingCardHTML(card)).join('');

  block.innerHTML = `
    ${headerHTML}
    <div class="pricing-content">
      <div class="pricing-cards">
        ${cardsHTML}
      </div>
    </div>
  `;

  // Decorate icons if needed
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
