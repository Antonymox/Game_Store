import { Component, type OnInit, type Renderer2 } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "../components/header.component"
import { FooterComponent } from "../components/footer.component"
import type { ThemeService } from "../services/theme.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container" [ngClass]="{'dark-theme': isDarkTheme, 'light-theme': !isDarkTheme}">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .main-content {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    
    /* Estilos específicos para tema oscuro */
    .app-container.dark-theme {
      background-color: #121212;
      color: #f5f5f7;
    }
    
    /* Estilos específicos para tema claro */
    .app-container.light-theme {
      background-color: #f5f5f7;
      color: #1a1a2e;
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  title = "GameStore"
  isDarkTheme = false

  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2,
  ) {
    console.log("AppComponent: Constructor iniciado")
  }

  ngOnInit(): void {
    console.log("AppComponent: ngOnInit iniciado")

    // Suscribirse a cambios de tema
    this.themeService.currentTheme$.subscribe((theme) => {
      console.log(`AppComponent: Tema recibido: ${theme}`)
      this.isDarkTheme = theme === "dark"

      // Aplicar clase al elemento raíz de la aplicación
      const appContainer = document.querySelector(".app-container")
      if (appContainer) {
        if (this.isDarkTheme) {
          this.renderer.addClass(appContainer, "dark-theme")
          this.renderer.removeClass(appContainer, "light-theme")
        } else {
          this.renderer.addClass(appContainer, "light-theme")
          this.renderer.removeClass(appContainer, "dark-theme")
        }
      }
    })

    // Registrar el estado actual del tema después de un breve retraso
    setTimeout(() => {
      console.log("AppComponent: Registrando estado del tema")
      this.themeService.logCurrentState()
    }, 500)

    console.log("AppComponent: ngOnInit completado")
  }
}
