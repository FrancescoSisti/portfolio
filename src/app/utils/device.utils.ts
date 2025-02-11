/**
 * Checks if the current device is a mobile device based on screen width and user agent
 * @returns boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

    // Check screen width
    const isMobileWidth = window.innerWidth <= 768;

    // Check user agent for mobile keywords
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));

    return isMobileWidth || isMobileUserAgent;
}
