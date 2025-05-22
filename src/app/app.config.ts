import { type ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { BrowserModule } from "@angular/platform-browser"

import { routes } from "./app.routes"
import { authInterceptor } from "./interceptors/auth.interceptor"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(BrowserModule)
  ],
}
