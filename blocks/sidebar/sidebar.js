/**
 * Sidebar Block
 *
 * Sticky sidebar with table of contents navigation and social share buttons
 */

/**
 * Decorates the sidebar block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let activeSection = '';
  const tocItems = [];
  const socialLinks = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    
    // First row with single cell is the active section heading
    if (cells.length === 1 && !activeSection) {
      activeSection = cells[0].textContent.trim();
      return;
    }

    // Check if it's a link (TOC item or social link)
    const link = row.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      
      // Social links have icon indicators or specific domains
      if (href && (href.includes('twitter.com') || href.includes('linkedin.com') || 
          href.includes('facebook.com') || href.startsWith('#share'))) {
        socialLinks.push({ href, text });
      } else {
        // Regular TOC links
        tocItems.push({ href, text });
      }
    } else if (cells.length === 1) {
      // Plain text TOC items (without links)
      const text = cells[0].textContent.trim();
      if (text) {
        tocItems.push({ href: `#${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, text });
      }
    }
  });

  // Build sidebar HTML
  const tocHTML = tocItems.map(item => `
    <li class="sidebar-toc-item">
      <a href="${item.href}" class="sidebar-toc-link">${item.text}</a>
    </li>
  `).join('');

  block.innerHTML = `
    <div class="sidebar-container">
      <div class="sidebar-divider"></div>
      
      <div class="sidebar-content">
        <div class="sidebar-heading">${activeSection}</div>
        <nav class="sidebar-toc" aria-label="Table of contents">
          <ul class="sidebar-toc-list">
            ${tocHTML}
          </ul>
        </nav>
      </div>
      
      <div class="sidebar-divider"></div>
      
      <div class="sidebar-social">
        <button class="sidebar-social-btn" aria-label="Copy link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5893 15.3032L9.4108 16.4817C7.78361 18.1089 5.14542 18.1089 3.51824 16.4817C1.89106 14.8546 1.89106 12.2164 3.51824 10.5892L4.69675 9.41068M15.3034 10.5892L16.4819 9.41067C18.109 7.78349 18.109 5.1453 16.4819 3.51812C14.8547 1.89093 12.2165 1.89093 10.5893 3.51812L9.4108 4.69663M7.08339 12.9166L12.9167 7.08325" stroke="#A4A7AE" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <a href="https://twitter.com/intent/tweet" class="sidebar-social-btn" target="_blank" rel="noopener" aria-label="Share on X">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1387 18.75L8.72444 12.458L3.19827 18.75H0.860352L7.6872 10.9793L0.860352 1.25H6.86281L11.0233 7.18013L16.2361 1.25H18.574L12.064 8.66084L19.1412 18.75H13.1387ZM15.7423 16.9762H14.1683L4.2079 3.02386H5.7821L9.77131 8.61047L10.4612 9.57989L15.7423 16.9762Z" fill="#A4A7AE"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php" class="sidebar-social-btn" target="_blank" rel="noopener" aria-label="Share on Facebook">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_fb)">
              <path d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="#A4A7AE"/>
            </g>
            <defs>
              <clipPath id="clip0_fb">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/" class="sidebar-social-btn" target="_blank" rel="noopener" aria-label="Share on LinkedIn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_li)">
              <path d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42188 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043Z" fill="#A4A7AE"/>
            </g>
            <defs>
              <clipPath id="clip0_li">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </a>
      </div>
    </div>
  `;
}
