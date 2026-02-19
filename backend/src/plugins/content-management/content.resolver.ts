import { Query, Resolver } from '@nestjs/graphql';
import { Ctx, GlobalSettingsService, RequestContext } from '@vendure/core';

@Resolver()
export class ContentResolver {
  constructor(private globalSettingsService: GlobalSettingsService) {}

  @Query()
  async siteContent(@Ctx() ctx: RequestContext) {
    const settings = await this.globalSettingsService.getSettings(ctx);

    return {
      supportEmail: (settings.customFields as any).supportEmail || 'soporte@kaostore.com',
      contactEmail: (settings.customFields as any).contactEmail || 'contacto@kaostore.com',
      aboutUs: (settings.customFields as any).aboutUs || null,
      shippingPolicy: (settings.customFields as any).shippingPolicy || null,
      returnPolicy: (settings.customFields as any).returnPolicy || null,
      faqContent: (settings.customFields as any).faqContent || null,
      legalContent: (settings.customFields as any).legalContent || null,
      privacyPolicy: (settings.customFields as any).privacyPolicy || null,
      termsOfService: (settings.customFields as any).termsOfService || null,
      socialMedia: {
        facebook: (settings.customFields as any).socialMediaFacebook || null,
        instagram: (settings.customFields as any).socialMediaInstagram || null,
        twitter: (settings.customFields as any).socialMediaTwitter || null,
      },
    };
  }
}
