// Construtores de JSON-LD. Todos os fatos saem do clinica.json — a mesma fonte
// que alimenta o texto visível. Se os dois divergirem, o schema vira ruído.
//
// O QUE NÃO ENTRA AQUI, DE PROPÓSITO:
//  - `aggregateRating`: as 32 avaliações vivem no Google Business Profile, não
//    no site. Marcar nota agregada em HTML próprio com avaliação coletada por
//    terceiro é território de ação manual (seção 10.4). O canal delas é a F3.
//  - `priceRange`: preço não vai para peça publicitária (seção 11).
//
// TODAS as URLs internas daqui saem COM barra final. O canonical gerado pelo
// Astro (build.format 'directory') é /endodontia/ — apontar para /endodontia
// faz o Cloudflare Pages devolver 308 e o schema passa a citar uma URL que
// redireciona. Manter os dois lados idênticos, byte a byte.
import clinica from '../data/clinica.json';

const SITE = 'https://dradaianecarvalho.com.br';

const enderecoPostal = {
  '@type': 'PostalAddress',
  streetAddress: clinica.endereco.logradouro,
  addressLocality: clinica.endereco.cidade,
  addressRegion: clinica.endereco.uf,
  postalCode: clinica.endereco.cep,
  addressCountry: 'BR',
};

// Derivado do clinica.json: agrupa dias com o mesmo intervalo, ignora fechados.
function horarios() {
  const grupos: { dias: string[]; abre: string; fecha: string }[] = [];
  for (const d of clinica.horario) {
    if (!d.aberto || !d.abre || !d.fecha) continue;
    const g = grupos.find((x) => x.abre === d.abre && x.fecha === d.fecha);
    if (g) g.dias.push(d.chave);
    else grupos.push({ dias: [d.chave], abre: d.abre, fecha: d.fecha });
  }
  return grupos.map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.dias.map((d) => `https://schema.org/${d}`),
    opens: g.abre,
    closes: g.fecha,
  }));
}

export function dentist() {
  return {
    '@type': 'Dentist',
    '@id': `${SITE}/#consultorio`,
    name: clinica.nome,
    url: `${SITE}/`,
    telephone: clinica.telefoneInternacional,
    // `image` é exigência do Google para LocalBusiness e `logo` para
    // Organization. Como Dentist herda dos dois, a ausência de imagem era
    // reportada uma vez por tipo herdado — era este o campo inválido.
    image: [
      `${SITE}/assets/images/Hero-principal.jpg`,
      `${SITE}/assets/images/Consultorio-Dental1.jpg`,
      `${SITE}/assets/og.jpg`,
    ],
    logo: `${SITE}/favicon-512.png`,
    address: enderecoPostal,
    geo: { '@type': 'GeoCoordinates', latitude: -23.5312865, longitude: -46.6662844 },
    openingHoursSpecification: horarios(),
    medicalSpecialty: 'Endodontic',
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'Place', name: 'Barra Funda, São Paulo' },
    ],
    // Exatamente as quatro áreas divulgadas (1.2.1). Nada além: schema que
    // lista procedimento não realizado ou não divulgado é pior que ausente.
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Tratamento de canal (endodontia)', url: `${SITE}/endodontia/` },
      { '@type': 'MedicalProcedure', name: 'Clareamento dental', url: `${SITE}/clareamento/` },
      { '@type': 'MedicalProcedure', name: 'Limpeza dental (remoção de tártaro e placa)' },
      { '@type': 'MedicalProcedure', name: 'Restauração dentária' },
    ],
    sameAs: [clinica.instagram],
    isAcceptingNewPatients: true,
    paymentAccepted: undefined,
    employee: { '@id': `${SITE}/#dra-daiane` },
  };
}

export function person() {
  return {
    '@type': 'Person',
    '@id': `${SITE}/#dra-daiane`,
    name: clinica.nome,
    jobTitle: 'Cirurgiã-dentista',
    // 11.6.1: a formação é declarada como credencial concluída; o TÍTULO de
    // especialista só entra quando o registro for publicado no CRO (~nov/2026).
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: 'Graduação em Odontologia',
        recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Universidade Nove de Julho' } },
      { '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Especialização',
        name: 'Especialização em Endodontia',
        recognizedBy: { '@type': 'CollegeOrUniversity', name: 'São Leopoldo Mandic' } },
    ],
    identifier: { '@type': 'PropertyValue', propertyID: 'CRO-SP', value: '170242' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universidade Nove de Julho' },
      { '@type': 'CollegeOrUniversity', name: 'São Leopoldo Mandic' },
    ],
    knowsAbout: ['Endodontia', 'Tratamento de canal', 'Clareamento dental', 'Limpeza dental', 'Restauração dentária'],
    worksFor: { '@id': `${SITE}/#consultorio` },
    image: `${SITE}/assets/images/Dra-Daiane-Carvalho.jpg`,
    url: `${SITE}/`,
    sameAs: [clinica.instagram],
  };
}

export function faqPage(itens: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: itens.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function servico(opcoes: { nome: string; descricao: string; caminho: string }) {
  return {
    '@type': 'MedicalProcedure',
    name: opcoes.nome,
    description: opcoes.descricao,
    url: `${SITE}${opcoes.caminho}`,
    provider: { '@id': `${SITE}/#consultorio` },
    procedureType: 'https://schema.org/TherapeuticProcedure',
  };
}

export function breadcrumb(nome: string, caminho: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dra. Daiane Carvalho', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: nome, item: `${SITE}${caminho}` },
    ],
  };
}

/** Empacota tudo num @graph só e serializa, removendo chaves indefinidas. */
export function grafo(...nos: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nos },
    (_k, v) => (v === undefined ? undefined : v));
}
