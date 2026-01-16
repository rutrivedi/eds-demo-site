/**
 * Content Hero Block
 *
 * Two-column hero section with content on left and image on right.
 * Light background with badge, headline, description, and supporting image.
 */

/**
 * Decorates the content hero block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let badgeText = '';
  let badgeLinkText = '';
  let headline = '';
  let description = '';
  let heroImage = null;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Check for picture (hero image)
    const picture = row.querySelector('picture');
    if (picture) {
      heroImage = picture.outerHTML;
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

    // Get text content for description
    const text = row.textContent.trim();
    if (text && text.length > 20 && !description) {
      description = text;
    }
  });

  // Build the content hero HTML
  const badgeHTML = badgeText ? `
    <div class="content-hero-badge-group">
      <span class="content-hero-badge-primary">
        <span class="content-hero-badge-text">${badgeText}</span>
      </span>
      ${badgeLinkText ? `
        <span class="content-hero-badge-secondary">
          <span>${badgeLinkText}</span>
        </span>
      ` : ''}
    </div>
  ` : '';

  const headlineHTML = headline ? `<h1 class="content-hero-headline">${headline}</h1>` : '';

  const descriptionHTML = description ? `<p class="content-hero-description">${description}</p>` : '';

  const imageHTML = heroImage ? `
    <div class="content-hero-image">
      ${heroImage}
    </div>
  ` : '';

  block.innerHTML = `
    <div class="content-hero-container">
      <div class="content-hero-content">
        <div class="content-hero-text">
          ${badgeHTML}
          ${headlineHTML}
          ${descriptionHTML}
        </div>
      </div>
      ${imageHTML}
    </div>
  `;
}
