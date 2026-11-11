// Standalone mock of Resend and Notion for the Playwright suite (see playwright.config.ts).
import { startMockServices } from './mock-services.mjs';

const mock = await startMockServices(Number(process.env.MOCK_PORT || 4597));
console.log(`mock services on ${mock.url}`);
