/**
 * Separator Block
 * 
 * Displays a horizontal divider line between sections.
 * No content structure needed - just renders a simple divider.
 */

export default async function decorate(block) {
  block.innerHTML = `
    <div class="separator-line"></div>
  `;
}
