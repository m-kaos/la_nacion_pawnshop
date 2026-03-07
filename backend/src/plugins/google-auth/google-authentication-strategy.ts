import {
    AuthenticationStrategy,
    ExternalAuthenticationService,
    Injector,
    RequestContext,
    User,
} from '@vendure/core';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthenticationStrategy implements AuthenticationStrategy<any> {
    readonly name = 'google';
    private client: OAuth2Client;
    private externalAuthenticationService!: ExternalAuthenticationService;

    constructor(private clientId: string) {
        // We initialize the client with the Google Client ID.
        // If not provided (during dev), it still needs to work gracefully when testing without the proper token verification,
        // although it's safer to always use it.
        this.client = new OAuth2Client(clientId);
    }

    init(injector: Injector) {
        // Inject ExternalAuthenticationService to easily create Users and Customers
        this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
    }

    defineInputType(): DocumentNode {
        // Extend the Authenticate mutation with custom input for our strategy
        return gql`
            input GoogleAuthInput {
                token: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: { token: string }): Promise<User | false | string> {
        try {
            // Verify token sent from the client
            const ticket = await this.client.verifyIdToken({
                idToken: data.token,
                audience: (this.client as any).clientId, // audience should match client ID
            });

            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                return 'No payload or email found in Google Token';
            }

            // This powerful helper will automatically check if the user exists
            // by comparing the externalIdentifier or email.
            // If the user doesn't exist, it creates a new Customer and User!
            return this.externalAuthenticationService.createCustomerAndUser(ctx, {
                strategy: this.name,
                externalIdentifier: payload.sub, // 'sub' is the unique Google user ID
                verified: payload.email_verified || false,
                emailAddress: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
            });

        } catch (e: any) {
            console.error('Error authenticating with Google:', e.message);
            return e.message || 'Error executing Google authentication';
        }
    }
}
