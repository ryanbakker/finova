/**
 * Smooth scroll utility function that scrolls to a target element with an offset
 * @param targetId - The ID of the target element (without the #)
 * @param offset - The offset in pixels from the top (default: 50)
 */
export function smoothScrollTo(targetId: string, offset: number = 50) {
  const element = document.getElementById(targetId);
  if (!element) {
    return;
  }

  // Use the same approach as MobileNav
  const yOffset = -offset;
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

/**
 * Handle click events for smooth scrolling navigation links
 * @param event - The click event
 * @param targetId - The ID of the target element (without the #)
 * @param offset - The offset in pixels from the top (default: 50)
 */
export function handleSmoothScrollClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  targetId: string,
  offset: number = 50
) {
  event.preventDefault();
  smoothScrollTo(targetId, offset);
}
