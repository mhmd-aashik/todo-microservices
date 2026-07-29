import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@Injectable()
export class KeycloakTokenVerifierService {
  private readonly issuer: string;
  private readonly clientId: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(private readonly configService: ConfigService) {
    const keycloakUrl = this.configService.getOrThrow<string>('KEYCLOAK_URL');

    const realm = this.configService.getOrThrow<string>('KEYCLOAK_REALM');

    this.clientId = this.configService.getOrThrow<string>('KEYCLOAK_CLIENT_ID');

    this.issuer = `${keycloakUrl}/realms/${realm}`;

    const jwksUrl = new URL(`${this.issuer}/protocol/openid-connect/certs`);

    this.jwks = createRemoteJWKSet(jwksUrl);
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
      });

      this.validatePayload(payload);

      return {
        sub: payload.sub,
        preferredUsername: this.readOptionalString(
          payload,
          'preferred_username',
        ),
        email: this.readOptionalString(payload, 'email'),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private validatePayload(
    payload: JWTPayload,
  ): asserts payload is JWTPayload & {
    sub: string;
  } {
    if (typeof payload.sub !== 'string' || payload.sub.trim().length === 0) {
      throw new UnauthorizedException(
        'Access token does not contain a valid subject',
      );
    }

    const authorizedParty = this.readOptionalString(payload, 'azp');

    if (authorizedParty !== this.clientId) {
      throw new UnauthorizedException(
        'Access token was not issued for this client',
      );
    }
  }

  private readOptionalString(
    payload: JWTPayload,
    claim: string,
  ): string | undefined {
    const value = payload[claim];

    return typeof value === 'string' ? value : undefined;
  }
}
