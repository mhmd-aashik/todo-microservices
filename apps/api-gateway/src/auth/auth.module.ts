import { Module } from '@nestjs/common';
import { KeycloakTokenVerifierService } from './keycloak-token-verifier.service';
import { KeycloakAuthGuard } from './guards/keycloak-auth.guard';

@Module({
  providers: [KeycloakTokenVerifierService, KeycloakAuthGuard],
  exports: [KeycloakTokenVerifierService, KeycloakAuthGuard],
})
export class AuthModule {}
