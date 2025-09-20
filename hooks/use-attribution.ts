/**
 * Hook personalizado para captura automática de datos de atribución UTM
 * Se ejecuta en el cliente para capturar todos los parámetros necesarios
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { extractUTMsFromURL, UTMParams } from '@/lib/hubspot-attribution';

export interface AttributionState {
  utmParams: UTMParams;
  landingPage: string;
  referrer: string;
  sessionId: string;
  isFirstTouch: boolean;
  touchCount: number;
  lastTouchTime: string;
}

export interface UseAttributionReturn extends AttributionState {
  updateTouch: () => void;
  submitAttribution: (contactData: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

// Claves para localStorage
const STORAGE_KEYS = {
  SESSION_ID: 'lahaus_session_id',
  FIRST_TOUCH_UTMS: 'lahaus_first_touch_utms',
  TOUCH_COUNT: 'lahaus_touch_count',
  LAST_TOUCH_TIME: 'lahaus_last_touch_time'
} as const;

/**
 * Genera un ID de sesión único
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene o crea un ID de sesión persistente
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  return sessionId;
}

/**
 * Hook principal para manejo de atribución
 */
export function useAttribution(): UseAttributionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [attributionState, setAttributionState] = useState<AttributionState>({
    utmParams: {},
    landingPage: '',
    referrer: '',
    sessionId: '',
    isFirstTouch: true,
    touchCount: 0,
    lastTouchTime: ''
  });

  /**
   * Inicializa los datos de atribución al cargar la página
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;
    const currentReferrer = document.referrer;
    const sessionId = getOrCreateSessionId();

    // Extraer UTMs actuales
    const currentUTMs = extractUTMsFromURL(currentUrl);

    // Recuperar datos de primera visita
    const firstTouchUTMs = localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH_UTMS);
    const storedTouchCount = parseInt(localStorage.getItem(STORAGE_KEYS.TOUCH_COUNT) || '0');
    const lastTouchTime = localStorage.getItem(STORAGE_KEYS.LAST_TOUCH_TIME) || '';

    let isFirstTouch = storedTouchCount === 0;
    let finalUTMs = currentUTMs;

    // Si es la primera visita y hay UTMs, guardarlos
    if (isFirstTouch && Object.keys(currentUTMs).some(key => currentUTMs[key as keyof UTMParams])) {
      localStorage.setItem(STORAGE_KEYS.FIRST_TOUCH_UTMS, JSON.stringify(currentUTMs));
      console.log('🎯 Primera visita con UTMs detectada:', currentUTMs);
    } else if (!isFirstTouch && firstTouchUTMs) {
      // Para visitas posteriores, usar UTMs de primera visita si no hay UTMs actuales
      const parsedFirstTouch = JSON.parse(firstTouchUTMs);
      const hasCurrentUTMs = Object.keys(currentUTMs).some(key => currentUTMs[key as keyof UTMParams]);

      if (!hasCurrentUTMs) {
        finalUTMs = parsedFirstTouch;
        console.log('🔄 Usando UTMs de primera visita:', parsedFirstTouch);
      }
    }

    // Incrementar contador de visitas
    const newTouchCount = storedTouchCount + 1;
    const currentTime = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.TOUCH_COUNT, newTouchCount.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_TOUCH_TIME, currentTime);

    setAttributionState({
      utmParams: finalUTMs,
      landingPage: currentUrl,
      referrer: currentReferrer,
      sessionId,
      isFirstTouch,
      touchCount: newTouchCount,
      lastTouchTime: currentTime
    });

    console.log('📊 Estado de atribución inicializado:', {
      isFirstTouch,
      touchCount: newTouchCount,
      hasUTMs: Object.keys(finalUTMs).length > 0,
      source: finalUTMs.utm_source,
      campaign: finalUTMs.utm_campaign
    });

  }, []);

  /**
   * Actualiza el touchpoint actual
   */
  const updateTouch = useCallback(() => {
    if (typeof window === 'undefined') return;

    const currentTime = new Date().toISOString();
    const currentTouchCount = attributionState.touchCount + 1;

    localStorage.setItem(STORAGE_KEYS.TOUCH_COUNT, currentTouchCount.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_TOUCH_TIME, currentTime);

    setAttributionState(prev => ({
      ...prev,
      touchCount: currentTouchCount,
      lastTouchTime: currentTime,
      isFirstTouch: false
    }));

    console.log('👆 Touchpoint actualizado:', { touchCount: currentTouchCount, time: currentTime });
  }, [attributionState.touchCount]);

  /**
   * Envía datos de atribución junto con el contacto
   */
  const submitAttribution = useCallback(async (contactData: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
  }) => {
    setIsLoading(true);

    try {
      console.log('🚀 Enviando contacto con atribución:', {
        email: contactData.email,
        utmSource: attributionState.utmParams.utm_source,
        isFirstTouch: attributionState.isFirstTouch,
        touchCount: attributionState.touchCount
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...contactData,
          utmParams: attributionState.utmParams,
          landingPage: attributionState.landingPage,
          referrer: attributionState.referrer,
          isFirstTouch: attributionState.isFirstTouch
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Contacto enviado exitosamente:', result.contactId);

        // Actualizar touchpoint después del envío exitoso
        updateTouch();

        return { success: true };
      } else {
        console.error('❌ Error del servidor:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('❌ Error enviando contacto:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, [attributionState, updateTouch]);

  return {
    ...attributionState,
    updateTouch,
    submitAttribution,
    isLoading
  };
}

/**
 * Hook simplificado para solo obtener UTMs actuales
 */
export function useCurrentUTMs(): UTMParams {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = extractUTMsFromURL(window.location.href);
      setUtmParams(params);
    }
  }, []);

  return utmParams;
}

/**
 * Función de utilidad para limpiar datos de atribución (para testing)
 */
export function clearAttributionData(): void {
  if (typeof window === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('🧹 Datos de atribución limpiados');
}

/**
 * Función de utilidad para obtener resumen de atribución
 */
export function getAttributionSummary(): {
  hasFirstTouchData: boolean;
  touchCount: number;
  sessionId: string | null;
  firstTouchUTMs: UTMParams | null;
} {
  if (typeof window === 'undefined') {
    return {
      hasFirstTouchData: false,
      touchCount: 0,
      sessionId: null,
      firstTouchUTMs: null
    };
  }

  const firstTouchData = localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH_UTMS);
  const touchCount = parseInt(localStorage.getItem(STORAGE_KEYS.TOUCH_COUNT) || '0');
  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

  return {
    hasFirstTouchData: !!firstTouchData,
    touchCount,
    sessionId,
    firstTouchUTMs: firstTouchData ? JSON.parse(firstTouchData) : null
  };
}