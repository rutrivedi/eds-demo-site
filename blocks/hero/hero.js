// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Hero Block
 *
 * Full-width hero section with background image, headline, description, and CTAs.
 * Preserves original picture element for LCP optimization.
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
  let pictureElement = null;

  rows.forEach((row) => {
    // Get all cells in this row
    const cells = [...row.querySelectorAll(':scope > div')];

    // Check for picture first (background image) - preserve the actual DOM element
    const picture = row.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
      // Store the actual DOM element, not outerHTML
      pictureElement = picture;
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

  // Build the hero structure using DOM manipulation to preserve original picture
  const heroBackground = document.createElement('div');
  heroBackground.className = 'hero-background';

  // Append the original picture element (preserves LCP discoverability)
  if (pictureElement) {
    heroBackground.appendChild(pictureElement);
  }

  // Add overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';
  heroBackground.appendChild(overlay);

  // Build inner content
  const heroInner = document.createElement('div');
  heroInner.className = 'hero-inner';

  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  // Badge
  if (badgeText) {
    const badgeGroup = document.createElement('div');
    badgeGroup.className = 'hero-badge-group';
    badgeGroup.innerHTML = `
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
    `;
    heroContent.appendChild(badgeGroup);
  }

  // Heading section
  const headingSection = document.createElement('div');
  headingSection.className = 'hero-heading-section';

  if (headline) {
    const h1 = document.createElement('h1');
    h1.className = 'hero-headline';
    h1.textContent = headline;
    headingSection.appendChild(h1);
  }

  if (description) {
    const p = document.createElement('p');
    p.className = 'hero-description';
    p.textContent = description;
    headingSection.appendChild(p);
  }

  heroContent.appendChild(headingSection);

  // Actions
  if (primaryCTA || secondaryCTA) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';

    if (secondaryCTA) {
      const secondaryBtn = document.createElement('a');
      secondaryBtn.href = secondaryCTA.href;
      secondaryBtn.className = 'button secondary button-xl';
      secondaryBtn.innerHTML = `
        <span class="icon icon-play-circle"></span>
        <span>${secondaryCTA.text}</span>
      `;
      actions.appendChild(secondaryBtn);
    }

    if (primaryCTA) {
      const primaryBtn = document.createElement('a');
      primaryBtn.href = primaryCTA.href;
      primaryBtn.className = 'button primary button-xl';
      primaryBtn.innerHTML = `<span>${primaryCTA.text}</span>`;
      actions.appendChild(primaryBtn);
    }

    heroContent.appendChild(actions);
  }

  heroInner.appendChild(heroContent);

  // Clear block and append new structure
  block.textContent = '';
  block.appendChild(heroBackground);
  block.appendChild(heroInner);

  // Decorate icons
  await decorateIcons(block);
}
// AI Generated Code by Deloitte + Cursor (END)
