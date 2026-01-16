/**
 * Solution Content Block
 *
 * Rich text content area for solution detail pages with headings, paragraphs,
 * images, quotes, and feature callouts
 */

/**
 * Decorates the solution content block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const content = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const firstCell = cells[0];

    if (!firstCell) return;

    // Check for divider
    if (firstCell.textContent.trim() === '---') {
      content.push('<hr class="solution-content-divider">');
      return;
    }

    // Check for picture (image)
    const picture = row.querySelector('picture');
    if (picture) {
      content.push(`<div class="solution-content-image">${picture.outerHTML}</div>`);
      return;
    }

    // Check for headings
    const h2 = row.querySelector('h2');
    const h3 = row.querySelector('h3');
    if (h2) {
      content.push(h2.outerHTML);
      return;
    }
    if (h3) {
      content.push(h3.outerHTML);
      return;
    }

    // Check for quote (blockquote or starts with ")
    const blockquote = row.querySelector('blockquote');
    const text = firstCell.textContent.trim();

    if (blockquote || text.startsWith('"')) {
      const quoteText = blockquote ? blockquote.textContent.trim() : text;
      const author = cells[1]?.textContent.trim() || '';
      const title = cells[2]?.textContent.trim() || '';

      content.push(`
        <blockquote class="solution-content-quote">
          <p class="solution-content-quote-text">${quoteText}</p>
          ${author || title ? `
            <div class="solution-content-quote-author">
              ${author ? `<div class="solution-content-quote-name">${author}</div>` : ''}
              ${title ? `<div class="solution-content-quote-title">${title}</div>` : ''}
            </div>
          ` : ''}
        </blockquote>
      `);
      return;
    }

    // Check for feature callout (starts with ###)
    if (text.startsWith('###')) {
      const featureContent = text.replace(/^###\s*/, '');
      content.push(`
        <div class="solution-content-feature">
          ${featureContent}
        </div>
      `);
      return;
    }

    // Regular paragraph
    if (text) {
      // Check if first paragraph (intro)
      const isFirst = content.length === 0 || (content.length === 1 && content[0].includes('divider'));
      const className = isFirst ? 'solution-content-paragraph-xl' : '';
      content.push(`<p class="${className}">${text}</p>`);
    }
  });

  block.innerHTML = `<div class="solution-content-wrapper">${content.join('')}</div>`;
}
