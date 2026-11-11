// Kept apart from the scene so the contact form never pulls three.js into its bundle.
export const pulseMark = () => window.dispatchEvent(new Event('zx:pulse'));
export const markSent = () => window.dispatchEvent(new Event('zx:sent'));
