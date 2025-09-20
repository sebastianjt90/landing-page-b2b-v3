/**
 * API Route para manejo de contactos con atribución UTM personalizada
 * Integra directamente con HubSpot usando propiedades custom
 */

import { NextRequest, NextResponse } from 'next/server';
import { processAttribution, sendAttributionToHubSpot, UTMParams, AttributionData } from '@/lib/hubspot-attribution';

export interface ContactFormData {
  // Datos del contacto
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  message?: string;

  // Datos de atribución (enviados desde el frontend)
  utmParams?: UTMParams;
  landingPage?: string;
  referrer?: string;
  isFirstTouch?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validar datos requeridos
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar API key de HubSpot
    const apiKey = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY;
    if (!apiKey) {
      console.error('❌ HUBSPOT_PRIVATE_ACCESS_TOKEN o HUBSPOT_API_KEY no configurada');
      return NextResponse.json(
        { success: false, error: 'Configuración de API incompleta' },
        { status: 500 }
      );
    }

    // Extraer datos del contacto
    const contactData = {
      email: body.email,
      firstname: body.firstname,
      lastname: body.lastname,
      phone: body.phone,
      company: body.company
    };

    // Procesar datos de atribución si están presentes
    let attributionData: AttributionData = {};

    if (body.utmParams || body.landingPage) {
      const utmParams = body.utmParams || {};
      const landingPage = body.landingPage || request.url;
      const referrer = body.referrer || request.headers.get('referer') || '';
      const isFirstTouch = body.isFirstTouch !== false; // default true

      attributionData = processAttribution(
        utmParams,
        landingPage,
        referrer,
        isFirstTouch
      );

      console.log('📊 Datos de atribución procesados:', {
        source: attributionData.utm_source_custom,
        medium: attributionData.utm_medium_custom,
        campaign: attributionData.utm_campaign_custom,
        country: attributionData.country_target_custom,
        language: attributionData.language_target_custom
      });
    }

    // Enviar a HubSpot
    const result = await sendAttributionToHubSpot(contactData, attributionData, apiKey);

    if (result.success) {
      console.log('✅ Contacto procesado exitosamente:', result.contactId);

      return NextResponse.json({
        success: true,
        contactId: result.contactId,
        message: 'Contacto registrado con atribución completa'
      });
    } else {
      console.error('❌ Error en HubSpot:', result.error);

      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Error interno del servidor'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error procesando contacto:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

// Método GET para testing (opcional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extraer UTMs de los query parameters
  const utmParams: UTMParams = {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_id: searchParams.get('utm_id') || undefined,
    fbclid: searchParams.get('fbclid') || undefined
  };

  const landingPage = request.url;
  const referrer = request.headers.get('referer') || '';

  // Procesar atribución para testing
  const attributionData = processAttribution(utmParams, landingPage, referrer, true);

  return NextResponse.json({
    success: true,
    message: 'Test de procesamiento de atribución',
    utmParams,
    attributionData,
    instructions: {
      usage: 'POST /api/contact con datos del formulario',
      example: {
        email: 'test@example.com',
        firstname: 'Juan',
        lastname: 'Pérez',
        utmParams: {
          utm_source: 'facebook',
          utm_medium: 'cpc',
          utm_campaign: 'Campana_VSL_B2B_col_mx',
          utm_content: 'video_ad_2_b2b'
        },
        landingPage: 'https://www.lahaus.ai/es/vsl',
        referrer: 'https://facebook.com'
      }
    }
  });
}