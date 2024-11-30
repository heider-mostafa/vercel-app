declare global {
  interface Window {
    ShopifyBuy: {
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => {
        UI: {
          onReady: (client: any) => Promise<{
            createComponent: (type: string, config: any) => void;
          }>;
        };
      };
      UI: {
        onReady: (client: any) => Promise<{
          createComponent: (type: string, config: any) => void;
        }>;
      };
    };
  }
}

export {};