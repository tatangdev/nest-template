import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { MediaModule } from './modules/media/media.module';

const routes: Routes = [
  { path: '/auth', module: AuthModule },
  {
    path: '/media',
    module: MediaModule,
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AuthModule,
    ProvidersModule,
    MediaModule,
  ],
})
export class AppRoutingModule {}
