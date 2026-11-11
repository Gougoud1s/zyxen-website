import type { ContactInput } from './schema';

// Best-guess Segment (a select in the Leads data source) from the chosen service.
const SEGMENTS: Record<ContactInput['service'], string> = {
  'Business website': 'Local business',
  'Website care': 'Local business',
  'Monthly development partnership': 'Company (C# / full-stack)',
  'Enterprise Web & CMS (Umbraco)': 'Company (C# / full-stack)',
  'High-Scale E-Commerce': 'Online shop',
  'Custom SaaS & Mobile (Flutter)': 'Company (C# / full-stack)',
  'AI Integration & Automation': 'Company (C# / full-stack)',
  'Architectural Consulting': 'Company (C# / full-stack)',
};

/** Notion rich text holds at most 2000 characters per item. */
const richText = (s: string) => (s.match(/[\s\S]{1,2000}/g) ?? ['']).slice(0, 100).map((content) => ({ text: { content } }));

export function leadProperties(lead: ContactInput, source: string) {
  const notes = [`Service: ${lead.service}`, `Budget: ${lead.budget || 'Not specified'}`, '', lead.message].join('\n');
  return {
    Company: { title: richText(lead.name) },
    'Contact person': { rich_text: richText(lead.name) },
    Email: { email: lead.email },
    ...(lead.website ? { Website: { url: lead.website } } : {}),
    Stage: { status: { name: 'Replied' } },
    Segment: { select: { name: SEGMENTS[lead.service] } },
    Language: { select: { name: 'English' } },
    Source: { url: source },
    Notes: { rich_text: richText(notes) },
  };
}

/**
 * Create the lead in the Notion Leads data source. Returns false (never throws) when Notion
 * is not configured or fails, so the email path is never blocked.
 */
export async function createNotionLead(lead: ContactInput, source: string): Promise<boolean> {
  const token = process.env.NOTION_TOKEN;
  const dataSource = process.env.NOTION_LEADS_DATA_SOURCE_ID;
  if (!token || !dataSource) {
    console.warn('Notion lead skipped: NOTION_TOKEN or NOTION_LEADS_DATA_SOURCE_ID not set');
    return false;
  }
  try {
    const res = await fetch(`${process.env.NOTION_API_URL || 'https://api.notion.com'}/v1/pages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2025-09-03', 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent: { type: 'data_source_id', data_source_id: dataSource }, properties: leadProperties(lead, source) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      // Status and Notion's error code only: the response body can echo the lead's details.
      const body = (await res.json().catch(() => null)) as { code?: string } | null;
      console.error('Notion lead failed:', res.status, body?.code ?? '');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Notion lead failed:', (error as Error).name);
    return false;
  }
}
