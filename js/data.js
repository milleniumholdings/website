/**
 * Millenium Holdings Family Trust
 * Trust Data Configuration
 *
 * Update these values quarterly or as needed.
 * This file is separate from main.js for easier maintenance.
 */

const TRUST_DATA = {
    // Funds Under Management - Edit this value
    fundsUnderManagement: "$22K",

    // Contributions for current year (e.g., "2026 Contributions")
    // The year is auto-detected, just update the amount
    annualContributions: "$2,075",

    // Lifetime Performance - Edit this value
    lifetimePerformance: "+31%"
};

/**
 * How to update performance data:
 *
 * Option 1: Edit this file (data.js)
 *   1. Open js/data.js in any text editor
 *   2. Update the values in the TRUST_DATA object
 *   3. Save the file
 *
 * Option 2: Edit directly in HTML
 *   Find the stat-value elements in index.html:
 *   <div class="stat-value" data-value="$500 M">$500 M</div>
 *   and update the text content and data-value attribute.
 *
 * Note: The animated counters will animate from 0 to the new value
 * when the page loads or when the section scrolls into view.
 *
 * 2026 Contributions - This value displays the total invested in the
 * current year. The year label updates automatically. Great for
 * encouraging DCA (Dollar Cost Averaging) behavior!
 */

// Export for use in other scripts (if using modules)
// For traditional script usage, TRUST_DATA is available globally
