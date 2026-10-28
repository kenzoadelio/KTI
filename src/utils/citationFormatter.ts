import { Paper, CitationStyle, ReferenceType } from '../types';

/**
 * Format reference according to APA 7th Edition
 */
export function formatAPA(paper: Paper): string {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Penulis Anonim'];
  const year = paper.publicationYear ? `(${paper.publicationYear})` : '(n.d.)';
  const title = paper.title.trim().endsWith('.') ? paper.title.trim() : `${paper.title.trim()}.`;

  let authorStr = '';
  if (authors.length === 1) {
    authorStr = authors[0];
  } else if (authors.length === 2) {
    authorStr = `${authors[0]} & ${authors[1]}`;
  } else if (authors.length <= 20) {
    authorStr = `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`;
  } else {
    authorStr = `${authors.slice(0, 19).join(', ')}, ... ${authors[authors.length - 1]}`;
  }

  const journal = paper.journalName ? paper.journalName : paper.publisher;
  const volIssue = paper.volume
    ? paper.issue
      ? `, ${paper.volume}(${paper.issue})`
      : `, ${paper.volume}`
    : '';
  const pages = paper.pages ? `, ${paper.pages}` : '';
  const doiUrl = paper.doi
    ? ` https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}`
    : paper.url
    ? ` ${paper.url}`
    : '';

  if (paper.itemType === 'book') {
    return `${authorStr} ${year}. ${title} ${paper.publisher || 'Penerbit'}.${doiUrl}`;
  }

  return `${authorStr} ${year}. ${title}${journal ? ` ${journal}${volIssue}${pages}.` : ''}${doiUrl}`;
}

/**
 * Format reference according to MLA 9th Edition
 */
export function formatMLA(paper: Paper): string {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonim'];
  const year = paper.publicationYear || 'n.d.';
  const title = paper.title.trim().replace(/\.$/, '');

  let authorStr = '';
  if (authors.length === 1) {
    authorStr = `${authors[0]}.`;
  } else if (authors.length === 2) {
    authorStr = `${authors[0]}, and ${authors[1]}.`;
  } else {
    authorStr = `${authors[0]}, et al.`;
  }

  const journal = paper.journalName || paper.publisher;
  const vol = paper.volume ? `vol. ${paper.volume}, ` : '';
  const iss = paper.issue ? `no. ${paper.issue}, ` : '';
  const pp = paper.pages ? `pp. ${paper.pages}, ` : '';
  const doiUrl = paper.doi
    ? `https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}`
    : paper.url || '';

  if (paper.itemType === 'book') {
    return `${authorStr} ${title}. ${paper.publisher || 'Publisher'}, ${year}.${doiUrl ? ` ${doiUrl}.` : ''}`;
  }

  return `${authorStr} "${title}." ${journal ? `${journal}, ` : ''}${vol}${iss}${year}${pp ? `, ${pp}` : ''}.${doiUrl ? ` ${doiUrl}.` : ''}`;
}

/**
 * Format reference according to Chicago 17th Edition (Author-Date)
 */
export function formatChicago(paper: Paper): string {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonim'];
  const year = paper.publicationYear || 'n.d.';
  const title = paper.title.trim().replace(/\.$/, '');

  let authorStr = '';
  if (authors.length === 1) {
    authorStr = `${authors[0]}.`;
  } else if (authors.length <= 3) {
    authorStr = `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}.`;
  } else {
    authorStr = `${authors[0]} et al.`;
  }

  const journal = paper.journalName || paper.publisher;
  const volIssue = paper.volume
    ? paper.issue
      ? ` ${paper.volume} (${paper.issue})`
      : ` ${paper.volume}`
    : '';
  const pages = paper.pages ? `: ${paper.pages}` : '';
  const doiUrl = paper.doi
    ? ` https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}.`
    : paper.url
    ? ` ${paper.url}.`
    : '';

  if (paper.itemType === 'book') {
    return `${authorStr} ${year}. ${title}. ${paper.publisher || 'Publisher'}.${doiUrl}`;
  }

  return `${authorStr} ${year}. "${title}." ${journal || ''}${volIssue}${pages}.${doiUrl}`;
}

/**
 * Format reference according to IEEE Style
 */
export function formatIEEE(paper: Paper, index = 1): string {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonim'];
  const year = paper.publicationYear || 'n.d.';
  const title = paper.title.trim().replace(/\.$/, '');

  let authorStr = '';
  if (authors.length <= 3) {
    authorStr = authors.join(', ');
  } else {
    authorStr = `${authors[0]} et al.`;
  }

  const journal = paper.journalName || paper.publisher;
  const vol = paper.volume ? `, vol. ${paper.volume}` : '';
  const iss = paper.issue ? `, no. ${paper.issue}` : '';
  const pp = paper.pages ? `, pp. ${paper.pages}` : '';
  const doi = paper.doi ? `, doi: ${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}` : '';

  return `[${index}] ${authorStr}, "${title}," ${journal || 'Publikasi'}${vol}${iss}, ${year}${pp}${doi}.`;
}

/**
 * Format reference according to Harvard Style
 */
export function formatHarvard(paper: Paper): string {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonim'];
  const year = paper.publicationYear || 'n.d.';
  const title = paper.title.trim().replace(/\.$/, '');
  const journal = paper.journalName || paper.publisher;
  const vol = paper.volume ? `${paper.volume}` : '';
  const iss = paper.issue ? `(${paper.issue})` : '';
  const pp = paper.pages ? `, pp. ${paper.pages}` : '';
  const doiUrl = paper.doi ? ` Tersedia di: https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}` : '';

  return `${authors.join(', ')} (${year}) '${title}', ${journal || ''}, ${vol}${iss}${pp}.${doiUrl}`;
}

/**
 * Generate formatted In-Text citation
 */
export function generateInTextCitation(paper: Paper, style: CitationStyle = 'APA', pageNumber?: string): string {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonim'];
  const firstAuthorLastName = authors[0].split(' ').pop() || authors[0];
  const secondAuthorLastName = authors.length > 1 ? authors[1].split(' ').pop() || authors[1] : '';
  const year = paper.publicationYear || 'n.d.';

  switch (style) {
    case 'APA':
      if (authors.length === 1) {
        return `(${firstAuthorLastName}, ${year}${pageNumber ? `, hlm. ${pageNumber}` : ''})`;
      } else if (authors.length === 2) {
        return `(${firstAuthorLastName} & ${secondAuthorLastName}, ${year}${pageNumber ? `, hlm. ${pageNumber}` : ''})`;
      } else {
        return `(${firstAuthorLastName} et al., ${year}${pageNumber ? `, hlm. ${pageNumber}` : ''})`;
      }

    case 'MLA':
      if (authors.length === 1) {
        return `(${firstAuthorLastName}${pageNumber ? ` ${pageNumber}` : ''})`;
      } else if (authors.length === 2) {
        return `(${firstAuthorLastName} and ${secondAuthorLastName}${pageNumber ? ` ${pageNumber}` : ''})`;
      } else {
        return `(${firstAuthorLastName} et al.${pageNumber ? ` ${pageNumber}` : ''})`;
      }

    case 'Chicago':
      if (authors.length === 1) {
        return `(${firstAuthorLastName} ${year}${pageNumber ? `, ${pageNumber}` : ''})`;
      } else if (authors.length <= 3) {
        return `(${authors.map(a => a.split(' ').pop()).join(' and ')} ${year}${pageNumber ? `, ${pageNumber}` : ''})`;
      } else {
        return `(${firstAuthorLastName} et al. ${year}${pageNumber ? `, ${pageNumber}` : ''})`;
      }

    case 'IEEE':
      return `[1]`;

    case 'Harvard':
      if (authors.length === 1) {
        return `(${firstAuthorLastName}, ${year})`;
      } else if (authors.length === 2) {
        return `(${firstAuthorLastName} and ${secondAuthorLastName}, ${year})`;
      } else {
        return `(${firstAuthorLastName} et al., ${year})`;
      }

    default:
      return `(${firstAuthorLastName}, ${year})`;
  }
}

/**
 * Format paper by selected style
 */
export function formatCitationByStyle(paper: Paper, style: CitationStyle, index = 1): string {
  switch (style) {
    case 'APA':
      return formatAPA(paper);
    case 'MLA':
      return formatMLA(paper);
    case 'Chicago':
      return formatChicago(paper);
    case 'IEEE':
      return formatIEEE(paper, index);
    case 'Harvard':
      return formatHarvard(paper);
    default:
      return formatAPA(paper);
  }
}

/**
 * Parse a BibTeX string into an array of Paper objects
 */
export function parseBibTeX(bibtexString: string): Paper[] {
  const papers: Paper[] = [];
  const entries = bibtexString.split(/@(?=[a-zA-Z]+[\s\S]*?\{)/g);

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const match = entry.match(/^([a-zA-Z]+)\s*\{\s*([^,]+),([\s\S]*)\}/);
    if (!match) continue;

    const type = match[1].toLowerCase();
    const body = match[3];

    const getField = (field: string): string => {
      const reg = new RegExp(`${field}\\s*=\\s*["{]([^"}]+)["}]|${field}\\s*=\\s*([^,\\n}]+)`, 'i');
      const m = body.match(reg);
      return (m ? (m[1] || m[2]) : '').trim();
    };

    const title = getField('title');
    if (!title) continue;

    const authorField = getField('author');
    const authors = authorField
      ? authorField.split(/\s+and\s+/i).map((a) => a.trim().replace(/^\{|\}$/g, ''))
      : ['Anonim'];

    const year = getField('year') || '2023';
    const journal = getField('journal') || getField('booktitle') || getField('publisher') || 'Publikasi Ilmiah';
    const doi = getField('doi');
    const volume = getField('volume');
    const issue = getField('number') || getField('issue');
    const pages = getField('pages');
    const url = getField('url');

    const paper: Paper = {
      id: `imported-bib-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      authors,
      publicationYear: year,
      journalName: journal,
      citationCount: 0,
      doi,
      volume,
      issue,
      pages,
      url,
      itemType: type === 'book' ? 'book' : type === 'inproceedings' ? 'conference' : 'journal',
      abstract: getField('abstract') || 'Diimpor dari file BibTeX.',
      source: 'BibTeX Import',
    };

    paper.apaCitation = formatAPA(paper);
    papers.push(paper);
  }

  return papers;
}

/**
 * Parse an RIS file string into an array of Paper objects
 */
export function parseRIS(risString: string): Paper[] {
  const papers: Paper[] = [];
  const records = risString.split(/ER\s{2}-[\r\n]*/);

  for (const rec of records) {
    if (!rec.trim()) continue;

    const lines = rec.split(/\r?\n/);
    let title = '';
    const authors: string[] = [];
    let year = '';
    let journal = '';
    let volume = '';
    let issue = '';
    let sp = '';
    let ep = '';
    let doi = '';
    let abstract = '';
    let url = '';
    let itemType: ReferenceType = 'journal';

    for (const line of lines) {
      const tagMatch = line.match(/^([A-Z0-9]{2})\s{2}-\s*(.*)$/);
      if (!tagMatch) continue;

      const tag = tagMatch[1];
      const val = tagMatch[2].trim();

      switch (tag) {
        case 'TY':
          if (val === 'BOOK') itemType = 'book';
          else if (val === 'CONF') itemType = 'conference';
          else if (val === 'THES') itemType = 'thesis';
          else itemType = 'journal';
          break;
        case 'TI':
        case 'T1':
          title = val;
          break;
        case 'AU':
        case 'A1':
          authors.push(val);
          break;
        case 'PY':
        case 'Y1':
          year = val.substring(0, 4);
          break;
        case 'JO':
        case 'JF':
        case 'T2':
          journal = val;
          break;
        case 'VL':
          volume = val;
          break;
        case 'IS':
          issue = val;
          break;
        case 'SP':
          sp = val;
          break;
        case 'EP':
          ep = val;
          break;
        case 'DO':
          doi = val;
          break;
        case 'AB':
        case 'N2':
          abstract = val;
          break;
        case 'UR':
          url = val;
          break;
      }
    }

    if (title) {
      const pages = sp && ep ? `${sp}-${ep}` : sp || '';
      const paper: Paper = {
        id: `imported-ris-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        authors: authors.length > 0 ? authors : ['Anonim'],
        publicationYear: year || '2023',
        journalName: journal || 'Publikasi Ilmiah',
        citationCount: 0,
        volume,
        issue,
        pages,
        doi,
        url,
        itemType,
        abstract: abstract || 'Diimpor dari file RIS (Zotero / Mendeley / EndNote).',
        source: 'RIS Import',
      };
      paper.apaCitation = formatAPA(paper);
      papers.push(paper);
    }
  }

  return papers;
}

/**
 * Export papers to BibTeX string
 */
export function exportToBibTeX(papers: Paper[]): string {
  return papers
    .map((p) => {
      const firstAuthor = p.authors[0]?.split(' ').pop()?.toLowerCase() || 'ref';
      const key = `${firstAuthor}${p.publicationYear || '2024'}`;
      const type = p.itemType === 'book' ? 'book' : p.itemType === 'conference' ? 'inproceedings' : 'article';
      const authorStr = p.authors.join(' and ');

      return `@${type}{${key},
  title = {${p.title}},
  author = {${authorStr}},
  journal = {${p.journalName}},
  year = {${p.publicationYear || '2024'}}${p.volume ? `,\n  volume = {${p.volume}}` : ''}${p.issue ? `,\n  number = {${p.issue}}` : ''}${p.pages ? `,\n  pages = {${p.pages}}` : ''}${p.doi ? `,\n  doi = {${p.doi}}` : ''}${p.url ? `,\n  url = {${p.url}}` : ''}
}`;
    })
    .join('\n\n');
}

/**
 * Export papers to RIS string (standard for EndNote/Zotero/Mendeley)
 */
export function exportToRIS(papers: Paper[]): string {
  return papers
    .map((p) => {
      const ty = p.itemType === 'book' ? 'BOOK' : p.itemType === 'conference' ? 'CONF' : 'JOUR';
      let ris = `TY  - ${ty}\n`;
      ris += `TI  - ${p.title}\n`;
      for (const a of p.authors) {
        ris += `AU  - ${a}\n`;
      }
      if (p.publicationYear) ris += `PY  - ${p.publicationYear}\n`;
      if (p.journalName) ris += `JO  - ${p.journalName}\n`;
      if (p.volume) ris += `VL  - ${p.volume}\n`;
      if (p.issue) ris += `IS  - ${p.issue}\n`;
      if (p.pages) {
        const parts = p.pages.split('-');
        ris += `SP  - ${parts[0]}\n`;
        if (parts[1]) ris += `EP  - ${parts[1]}\n`;
      }
      if (p.doi) ris += `DO  - ${p.doi}\n`;
      if (p.url) ris += `UR  - ${p.url}\n`;
      if (p.abstract) ris += `AB  - ${p.abstract}\n`;
      ris += `ER  - \n`;
      return ris;
    })
    .join('\n');
}
