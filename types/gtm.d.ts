declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>;
    hbspt?: {
      identify?: (properties: Record<string, any>) => void;
      forms?: any;
      cta?: any;
    };
    _hsq?: Array<any>;
  }
}

export {};