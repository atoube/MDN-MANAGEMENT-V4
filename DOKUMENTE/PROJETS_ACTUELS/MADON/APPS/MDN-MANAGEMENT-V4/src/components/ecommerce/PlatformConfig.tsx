import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { ecommerceService } from '@/services/ecommerce';
import { toast } from 'sonner';

export const PlatformConfig: React.FC = () => {
  const [wooCommerceConfig, setWooCommerceConfig] = useState({
    url: '',
    consumerKey: '',
    consumerSecret: ''
  });

  const [shopifyConfig, setShopifyConfig] = useState({
    shopName: '',
    accessToken: ''
  });

  const handleSaveWooCommerce = async () => {
    try {
      await ecommerceService.setWooCommerceConfig(wooCommerceConfig);
      toast.success('Configuration WooCommerce sauvegardée avec succès');
    } catch {
      toast.error('Erreur lors de la sauvegarde de la configuration WooCommerce');
    }
  };

  const handleSaveShopify = async () => {
    try {
      await ecommerceService.setShopifyConfig(shopifyConfig);
      toast.success('Configuration Shopify sauvegardée avec succès');
    } catch {
      toast.error('Erreur lors de la sauvegarde de la configuration Shopify');
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration WooCommerce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="woo-url">URL du site</Label>
            <Input
              id="woo-url"
              value={wooCommerceConfig.url}
              onChange={(e) => setWooCommerceConfig({ ...wooCommerceConfig, url: e.target.value })}
              placeholder="https://votre-site.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="woo-key">Consumer Key</Label>
            <Input
              id="woo-key"
              value={wooCommerceConfig.consumerKey}
              onChange={(e) => setWooCommerceConfig({ ...wooCommerceConfig, consumerKey: e.target.value })}
              type="password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="woo-secret">Consumer Secret</Label>
            <Input
              id="woo-secret"
              value={wooCommerceConfig.consumerSecret}
              onChange={(e) => setWooCommerceConfig({ ...wooCommerceConfig, consumerSecret: e.target.value })}
              type="password"
            />
          </div>
          <Button onClick={handleSaveWooCommerce}>Sauvegarder</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Shopify</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopify-name">Nom de la boutique</Label>
            <Input
              id="shopify-name"
              value={shopifyConfig.shopName}
              onChange={(e) => setShopifyConfig({ ...shopifyConfig, shopName: e.target.value })}
              placeholder="votre-boutique"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopify-token">Access Token</Label>
            <Input
              id="shopify-token"
              value={shopifyConfig.accessToken}
              onChange={(e) => setShopifyConfig({ ...shopifyConfig, accessToken: e.target.value })}
              type="password"
            />
          </div>
          <Button onClick={handleSaveShopify}>Sauvegarder</Button>
        </CardContent>
      </Card>
    </div>
  );
}; 