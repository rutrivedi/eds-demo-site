// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Hero Block
 *
 * Full-width hero section with background image, headline, description, and CTAs.
 */

import { decorateIcons } from '../../scripts/aem.js';

/**
 * Decorates the hero block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let badgeText = '';
  let badgeLinkText = '';
  let headline = '';
  let description = '';
  let primaryCTA = null;
  let secondaryCTA = null;
  let backgroundImage = '';

  rows.forEach((row) => {
    // Get all cells in this row
    const cells = [...row.querySelectorAll(':scope > div')];

    // Check for picture first (background image)
    const picture = row.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
      backgroundImage = picture.outerHTML;
      return;
    }

    // Check for links (CTAs)
    const links = [...row.querySelectorAll('a')];
    if (links.length >= 2) {
      secondaryCTA = { href: links[0].href, text: links[0].textContent.trim() };
      primaryCTA = { href: links[1].href, text: links[1].textContent.trim() };
      return;
    }
    if (links.length === 1 && !primaryCTA) {
      primaryCTA = { href: links[0].href, text: links[0].textContent.trim() };
      return;
    }

    // Check for heading
    const h1 = row.querySelector('h1');
    if (h1) {
      headline = h1.textContent.trim();
      return;
    }

    // Check for badge (two cells with short text)
    if (cells.length >= 2) {
      const text1 = cells[0]?.textContent.trim() || '';
      const text2 = cells[1]?.textContent.trim() || '';
      if (text1 && text2 && text1.length < 50 && text2.length < 100 && !badgeText) {
        badgeText = text1;
        badgeLinkText = text2;
        return;
      }
    }

    // Get text content
    const text = row.textContent.trim();
    if (text && text.length > 0) {
      if (!headline && text.length < 80) {
        headline = text;
      } else if (!description && text.length > 20) {
        description = text;
      }
    }
  });

  // Build the hero HTML
  const badgeHTML = badgeText ? `
    <div class="hero-badge-group">
      <span class="hero-badge">
        <span class="hero-badge-dot"></span>
        <span class="hero-badge-text">${badgeText}</span>
      </span>
      ${badgeLinkText ? `
        <span class="hero-badge-link">
          <span>${badgeLinkText}</span>
          <span class="icon icon-arrow-right"></span>
        </span>
      ` : ''}
    </div>
  ` : '';

  const headlineHTML = headline ? `<h1 class="hero-headline">${headline}</h1>` : '';

  const descriptionHTML = description ? `<p class="hero-description">${description}</p>` : '';

  let actionsHTML = '';
  if (primaryCTA || secondaryCTA) {
    actionsHTML = '<div class="hero-actions">';
    if (secondaryCTA) {
      actionsHTML += `
        <a href="${secondaryCTA.href}" class="button secondary button-xl">
          <span class="icon icon-play-circle"></span>
          <span>${secondaryCTA.text}</span>
        </a>
      `;
    }
    if (primaryCTA) {
      actionsHTML += `
        <a href="${primaryCTA.href}" class="button primary button-xl">
          <span>${primaryCTA.text}</span>
        </a>
      `;
    }
    actionsHTML += '</div>';
  }

  block.innerHTML = `
    <div class="hero-background">
      ${backgroundImage}
      <div class="hero-overlay"></div>
    </div>
    <div class="hero-inner">
      <div class="hero-content">
        ${badgeHTML}
        <div class="hero-heading-section">
          ${headlineHTML}
          ${descriptionHTML}
        </div>
        ${actionsHTML}
      </div>
    </div>
  `;

  // Decorate icons
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
