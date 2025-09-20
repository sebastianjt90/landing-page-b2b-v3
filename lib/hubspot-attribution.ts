/**
 * Sistema de atribución UTM personalizada para HubSpot
 * Implementa estrategia híbrida para superar limitaciones de Source Drilldown
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_id?: string;
  fbclid?: string;
}

export interface AttributionData {
  // UTM Parameters
  utm_source_custom?: string;
  utm_medium_custom?: string;
  utm_campaign_custom?: string;
  utm_content_custom?: string;
  utm_term_custom?: string;
  utm_id_custom?: string;

  // Additional Attribution
  fbclid_custom?: string;
  landing_page_custom?: string;
  referrer_custom?: string;

  // Source Drilldown Custom
  source_detail_1_custom?: string;
  source_detail_2_custom?: string;
  attribution_model_custom?: string;

  // Context Data
  country_target_custom?: string;
  language_target_custom?: string;

  // Native HubSpot Properties (para compatibilidad)
  hs_analytics_source?: string;

  // Timestamps
  first_attribution_date_custom?: string;
  latest_attribution_date_custom?: string;
}

/**
 * Mapea fuentes UTM a valores estándar de HubSpot
 */
const sourceMapping: Record<string, string> = {
  'facebook': 'PAID_SOCIAL',
  'instagram': 'PAID_SOCIAL',
  'linkedin': 'PAID_SOCIAL',
  'twitter': 'PAID_SOCIAL',
  'youtube': 'PAID_SOCIAL',
  'tiktok': 'PAID_SOCIAL',
  'google': 'PAID_SEARCH',
  'bing': 'PAID_SEARCH',
  'yahoo': 'PAID_SEARCH',
  'email': 'EMAIL_MARKETING',
  'newsletter': 'EMAIL_MARKETING',
  'organic': 'ORGANIC_SEARCH',
  'direct': 'DIRECT_TRAFFIC',
  'referral': 'REFERRALS'
};

/**
 * Extrae país objetivo de los parámetros UTM
 */
function extractCountryTarget(utmParams: UTMParams): string {
  const { utm_campaign, utm_content } = utmParams;

  // Buscar en utm_campaign
  if (utm_campaign?.includes('_col')) return 'col';
  if (utm_campaign?.includes('_mx')) return 'mx';

  // Buscar en utm_content
  if (utm_content === 'col') return 'col';
  if (utm_content === 'mx') return 'mx';

  return 'general';
}

/**
 * Extrae idioma objetivo de la URL de landing page
 */
function extractLanguageTarget(landingPage: string): string {
  if (landingPage.includes('/es/') || landingPage.includes('/es?')) return 'es';
  if (landingPage.includes('/en/') || landingPage.includes('/en?')) return 'en';

  // Default para URLs sin especificar idioma
  return 'es';
}

/**
 * Crea los source drilldowns personalizados basados en UTM
 */
function createSourceDrilldowns(utmParams: UTMParams): { detail1: string; detail2: string } {
  const { utm_source, utm_medium, utm_campaign } = utmParams;

  let detail1 = '';
  let detail2 = '';

  if (utm_medium === 'cpc' || utm_medium === 'paid') {
    // Para campañas pagadas
    detail1 = utm_source ? utm_source.charAt(0).toUpperCase() + utm_source.slice(1) : 'Unknown Source';
    detail2 = utm_campaign || 'Unknown Campaign';
  } else if (utm_medium === 'rrss' || utm_medium === 'social') {
    // Para redes sociales
    detail1 = utm_source ? utm_source.charAt(0).toUpperCase() + utm_source.slice(1) : 'Social Media';
    detail2 = utm_campaign || 'Organic Social';
  } else if (utm_medium === 'email') {
    // Para email marketing
    detail1 = 'Email Marketing';
    detail2 = utm_campaign || 'Email Campaign';
  } else {
    // Para otros casos
    detail1 = utm_source ? utm_source.charAt(0).toUpperCase() + utm_source.slice(1) : 'Other';
    detail2 = utm_campaign || utm_medium || 'Other Campaign';
  }

  return { detail1, detail2 };
}

/**
 * Determina el modelo de atribución basado en el contexto
 */
function determineAttributionModel(utmParams: UTMParams): string {
  const { utm_medium } = utmParams;

  if (utm_medium === 'cpc' || utm_medium === 'paid') return 'last_touch';
  if (utm_medium === 'email') return 'multi_touch';
  return 'first_touch';
}

/**
 * Procesa parámetros UTM y genera datos de atribución completos
 */
export function processAttribution(
  utmParams: UTMParams,
  landingPage: string,
  referrer?: string,
  isFirstTouch: boolean = false
): AttributionData {
  const currentTimestamp = new Date().toISOString();
  const countryTarget = extractCountryTarget(utmParams);
  const languageTarget = extractLanguageTarget(landingPage);
  const { detail1, detail2 } = createSourceDrilldowns(utmParams);
  const attributionModel = determineAttributionModel(utmParams);

  // Mapear utm_source a valor HubSpot estándar
  const hubspotSource = utmParams.utm_source ?
    sourceMapping[utmParams.utm_source.toLowerCase()] || 'OTHER_CAMPAIGNS' :
    'DIRECT_TRAFFIC';

  const attributionData: AttributionData = {
    // UTM Parameters Custom
    utm_source_custom: utmParams.utm_source,
    utm_medium_custom: utmParams.utm_medium,
    utm_campaign_custom: utmParams.utm_campaign,
    utm_content_custom: utmParams.utm_content,
    utm_term_custom: utmParams.utm_term,
    utm_id_custom: utmParams.utm_id,

    // Additional Attribution
    fbclid_custom: utmParams.fbclid,
    landing_page_custom: landingPage,
    referrer_custom: referrer,

    // Source Drilldown Custom (equivalente a las propiedades bloqueadas)
    source_detail_1_custom: detail1,
    source_detail_2_custom: detail2,
    attribution_model_custom: attributionModel,

    // Context Data
    country_target_custom: countryTarget,
    language_target_custom: languageTarget,

    // Native HubSpot Properties (para compatibilidad básica)
    hs_analytics_source: hubspotSource,

    // Timestamps
    latest_attribution_date_custom: currentTimestamp
  };

  // Agregar first touch timestamp solo si es el primer touchpoint
  if (isFirstTouch) {
    attributionData.first_attribution_date_custom = currentTimestamp;
  }

  return attributionData;
}

/**
 * Envía datos de atribución a HubSpot
 */
export async function sendAttributionToHubSpot(
  contactData: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
  },
  attributionData: AttributionData,
  apiKey: string
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    // Combinar datos del contacto con datos de atribución
    const combinedProperties = {
      ...contactData,
      ...attributionData
    };

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: combinedProperties
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Contacto creado con atribución custom:', result.id);
      return { success: true, contactId: result.id };
    } else {
      const error = await response.json();

      // Si el contacto ya existe, actualizarlo
      if (error.message && error.message.includes('Contact already exists')) {
        return await updateExistingContact(contactData.email, attributionData, apiKey);
      }

      console.error('❌ Error creando contacto:', error.message);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Actualiza contacto existente con nueva atribución
 */
async function updateExistingContact(
  email: string,
  attributionData: AttributionData,
  apiKey: string
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    // Buscar contacto por email
    const searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }]
      })
    });

    if (!searchResponse.ok) {
      const error = await searchResponse.json();
      return { success: false, error: error.message };
    }

    const searchResult = await searchResponse.json();
    if (searchResult.results.length === 0) {
      return { success: false, error: 'Contact not found' };
    }

    const contactId = searchResult.results[0].id;

    // Actualizar solo con los datos más recientes (latest attribution)
    const updateData = {
      // Mantener datos de first touch si ya existen, solo actualizar latest
      utm_source_custom: attributionData.utm_source_custom,
      utm_medium_custom: attributionData.utm_medium_custom,
      utm_campaign_custom: attributionData.utm_campaign_custom,
      utm_content_custom: attributionData.utm_content_custom,
      utm_term_custom: attributionData.utm_term_custom,
      utm_id_custom: attributionData.utm_id_custom,
      fbclid_custom: attributionData.fbclid_custom,
      landing_page_custom: attributionData.landing_page_custom,
      referrer_custom: attributionData.referrer_custom,
      source_detail_1_custom: attributionData.source_detail_1_custom,
      source_detail_2_custom: attributionData.source_detail_2_custom,
      country_target_custom: attributionData.country_target_custom,
      language_target_custom: attributionData.language_target_custom,
      latest_attribution_date_custom: attributionData.latest_attribution_date_custom
    };

    const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: updateData
      })
    });

    if (updateResponse.ok) {
      console.log('✅ Contacto actualizado con nueva atribución:', contactId);
      return { success: true, contactId };
    } else {
      const error = await updateResponse.json();
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('❌ Error actualizando contacto:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Función de utilidad para extraer UTMs de la URL actual
 */
export function extractUTMsFromURL(url: string = window.location.href): UTMParams {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;

  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_id: params.get('utm_id') || undefined,
    fbclid: params.get('fbclid') || undefined
  };
}