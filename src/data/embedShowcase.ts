export interface EmbedShowcaseItem {
  name: string;
  url: string;
  calculator: string;
  note: string;
}

export interface EmbedPartnerLogo {
  name: string;
  logo: string;
}

export async function getEmbedShowcase(): Promise<EmbedShowcaseItem[]> {
  const response = await fetch('/data/embedShowcase.json', { cache: 'no-store' });
  if (!response.ok) {
    return [];
  }
  return (await response.json()) as EmbedShowcaseItem[];
}

export async function getEmbedPartners(): Promise<EmbedPartnerLogo[]> {
  const response = await fetch('/data/embedPartners.json', { cache: 'no-store' });
  if (!response.ok) {
    return [];
  }
  return (await response.json()) as EmbedPartnerLogo[];
}
