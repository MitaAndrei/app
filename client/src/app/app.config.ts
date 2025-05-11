import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, withComponentInputBinding,} from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClientModule, provideHttpClient} from '@angular/common/http';
import {noopInterceptorProvider} from "./services/http-interceptor.service";
import {provideNativeDateAdapter} from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    noopInterceptorProvider,
    provideNativeDateAdapter(),
  ]
};
