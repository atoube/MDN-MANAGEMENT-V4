import axios from 'axios';

interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
}

interface ShopifyConfig {
  shopName: string;
  accessToken: string;
}

export class EcommerceService {
  private wooCommerceConfig: WooCommerceConfig | null = null;
  private shopifyConfig: ShopifyConfig | null = null;

  setWooCommerceConfig(config: WooCommerceConfig) {
    this.wooCommerceConfig = config;
  }

  setShopifyConfig(config: ShopifyConfig) {
    this.shopifyConfig = config;
  }

  async importFromWooCommerce() {
    if (!this.wooCommerceConfig) {
      throw new Error('Configuration WooCommerce manquante');
    }

    try {
      const response = await axios.get(`${this.wooCommerceConfig.url}/wp-json/wc/v3/products`, {
        auth: {
          username: this.wooCommerceConfig.consumerKey,
          password: this.wooCommerceConfig.consumerSecret
        }
      });

      return response.data.map((product: any) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock_quantity,
        sku: product.sku,
        categories: product.categories.map((cat: any) => cat.name),
        images: product.images.map((img: any) => img.src)
      }));
    } catch (error) {
      console.error('Erreur lors de l\'import depuis WooCommerce:', error);
      throw error;
    }
  }

  async importFromShopify() {
    if (!this.shopifyConfig) {
      throw new Error('Configuration Shopify manquante');
    }

    try {
      const response = await axios.get(
        `https://${this.shopifyConfig.shopName}.myshopify.com/admin/api/2024-01/products.json`,
        {
          headers: {
            'X-Shopify-Access-Token': this.shopifyConfig.accessToken
          }
        }
      );

      return response.data.products.map((product: any) => ({
        name: product.title,
        description: product.body_html,
        price: product.variants[0].price,
        stock: product.variants[0].inventory_quantity,
        sku: product.variants[0].sku,
        categories: product.product_type ? [product.product_type] : [],
        images: product.images.map((img: any) => img.src)
      }));
    } catch (error) {
      console.error('Erreur lors de l\'import depuis Shopify:', error);
      throw error;
    }
  }
}

export const ecommerceService = new EcommerceService(); 