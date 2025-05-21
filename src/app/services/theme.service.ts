import { Injectable, type Renderer2, type RendererFactory2 } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export type Theme = "light" | "dark"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private renderer: Renderer2
  private currentThemeSubject = new BehaviorSubject<Theme>(this.getInitialTheme())
  public currentTheme$ = this.currentThemeSubject.asObservable()

  constructor(rendererFactory: RendererFactory2) {
    console.log("ThemeService: Constructor iniciado")
    this.renderer = rendererFactory.createRenderer(null, null)
    this.initTheme()
    console.log("ThemeService: Constructor completado")
  }

  private getInitialTheme(): Theme {
    console.log("ThemeService: Obteniendo tema inicial")
    // Obtener tema del localStorage o usar preferencia del sistema
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      console.log(`ThemeService: Tema encontrado en localStorage: ${savedTheme}`)
      return savedTheme
    }

    // Usar preferencia del sistema como fallback
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    console.log(`ThemeService: Preferencia del sistema - modo oscuro: ${prefersDark}`)
    return prefersDark ? "dark" : "light"
  }

  private initTheme(): void {
    console.log("ThemeService: Inicializando tema")
    const theme = this.currentThemeSubject.value
    console.log(`ThemeService: Tema actual: ${theme}`)
    this.setTheme(theme)
  }

  setTheme(theme: Theme): void {
    console.log(`ThemeService: Estableciendo tema: ${theme}`)
    this.currentThemeSubject.next(theme)
    localStorage.setItem("theme", theme)
    console.log(`ThemeService: Tema guardado en localStorage: ${theme}`)

    // Aplicar clase al elemento HTML y BODY
    const html = document.querySelector("html")
    const body = document.body

    if (html && body) {
      console.log(`ThemeService: Aplicando clase de tema a HTML y BODY: ${theme}`)

      if (theme === "dark") {
        html.classList.add("dark-theme")
        html.classList.remove("light-theme")
        body.classList.add("dark-theme")
        body.classList.remove("light-theme")

        // Aplicar estilos directamente para asegurar el cambio visual
        body.style.backgroundColor = "#121212"
        body.style.color = "#f5f5f7"

        console.log("ThemeService: Clase dark-theme añadida, light-theme eliminada")
      } else {
        html.classList.add("light-theme")
        html.classList.remove("dark-theme")
        body.classList.add("light-theme")
        body.classList.remove("dark-theme")

        // Aplicar estilos directamente para asegurar el cambio visual
        body.style.backgroundColor = "#f5f5f7"
        body.style.color = "#1a1a2e"

        console.log("ThemeService: Clase light-theme añadida, dark-theme eliminada")
      }
    } else {
      console.error("ThemeService: No se pudo encontrar el elemento HTML o BODY")
    }

    // Verificar si las clases se aplicaron correctamente
    if (html) {
      console.log(`ThemeService: Clases actuales en HTML: ${html.className}`)
    }
    if (body) {
      console.log(`ThemeService: Clases actuales en BODY: ${body.className}`)
    }

    // Forzar la aplicación de estilos específicos para componentes clave
    this.applySpecificStyles(theme)
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value
    console.log(`ThemeService: Alternando tema. Tema actual: ${currentTheme}`)
    const newTheme: Theme = currentTheme === "light" ? "dark" : "light"
    console.log(`ThemeService: Cambiando a tema: ${newTheme}`)
    this.setTheme(newTheme)
  }

  // Aplicar estilos específicos a componentes clave para asegurar el cambio visual
  private applySpecificStyles(theme: Theme): void {
    console.log("ThemeService: Aplicando estilos específicos a componentes clave")

    // Aplicar estilos al header
    const header = document.querySelector("header")
    if (header) {
      if (theme === "dark") {
        header.setAttribute("style", "background-color: #0f0f1a !important; color: #ffffff !important;")
      } else {
        header.setAttribute("style", "background-color: #1a1a2e !important; color: #ffffff !important;")
      }
    }

    // Aplicar estilos al footer
    const footer = document.querySelector("footer")
    if (footer) {
      if (theme === "dark") {
        footer.setAttribute("style", "background-color: #0f0f1a !important; color: #f5f5f5 !important;")
      } else {
        footer.setAttribute("style", "background-color: #1a1a2e !important; color: #f5f5f5 !important;")
      }
    }

    // Aplicar estilos a las tarjetas de juegos
    const gameCards = document.querySelectorAll(".game-card")
    gameCards.forEach((card) => {
      if (theme === "dark") {
        card.setAttribute(
          "style",
          "background-color: #1e1e1e !important; color: #f5f5f7 !important; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;",
        )
      } else {
        card.setAttribute(
          "style",
          "background-color: white !important; color: #1a1a2e !important; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;",
        )
      }
    })

    // Aplicar estilos a los inputs
    const inputs = document.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      if (theme === "dark") {
        input.setAttribute(
          "style",
          "background-color: #2d2d2d !important; color: #f5f5f7 !important; border-color: #444444 !important;",
        )
      } else {
        input.setAttribute(
          "style",
          "background-color: white !important; color: #1a1a2e !important; border-color: #dddddd !important;",
        )
      }
    })

    // Aplicar estilos a todos los textos y títulos
    this.applyTextStyles(theme)
  }

  // Aplicar estilos específicos a textos y títulos
  private applyTextStyles(theme: Theme): void {
    console.log("ThemeService: Aplicando estilos a textos y títulos")

    // Colores para modo oscuro
    const darkTextPrimary = "#f5f5f7"
    const darkTextSecondary = "#b0b0b0"
    const darkTextTertiary = "#808080"
    const darkLinkColor = "#ff6b8b"
    const darkHeadingColor = "#ffffff"

    // Colores para modo claro
    const lightTextPrimary = "#1a1a2e"
    const lightTextSecondary = "#666666"
    const lightTextTertiary = "#999999"
    const lightLinkColor = "#e94560"
    const lightHeadingColor = "#1a1a2e"

    // Aplicar estilos a párrafos
    const paragraphs = document.querySelectorAll("p")
    paragraphs.forEach((p) => {
      if (theme === "dark") {
        p.style.color = darkTextSecondary
      } else {
        p.style.color = lightTextSecondary
      }
    })

    // Aplicar estilos a títulos
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading) => {
      if (theme === "dark") {
        heading.style.color = darkHeadingColor
      } else {
        heading.style.color = lightHeadingColor
      }
    })

    // Aplicar estilos a enlaces
    const links = document.querySelectorAll("a:not(.btn)")
    links.forEach((link) => {
      if (theme === "dark") {
        link.style.color = darkLinkColor
      } else {
        link.style.color = lightLinkColor
      }
    })

    // Aplicar estilos a etiquetas span
    const spans = document.querySelectorAll("span")
    spans.forEach((span) => {
      // No cambiar el color de spans dentro de botones o con clases específicas
      if (!span.closest("button") && !span.classList.contains("cart-count")) {
        if (theme === "dark") {
          span.style.color = darkTextSecondary
        } else {
          span.style.color = lightTextSecondary
        }
      }
    })

    // Aplicar estilos a elementos específicos por clase
    const gameCategories = document.querySelectorAll(".game-category")
    gameCategories.forEach((category) => {
      if (theme === "dark") {
        category.setAttribute("style", "color: #b0b0b0 !important;")
      } else {
        category.setAttribute("style", "color: #666666 !important;")
      }
    })

    const gameTitles = document.querySelectorAll(".game-title a")
    gameTitles.forEach((title) => {
      if (theme === "dark") {
        title.setAttribute("style", "color: #ffffff !important;")
      } else {
        title.setAttribute("style", "color: #1a1a2e !important;")
      }
    })

    const sectionHeaders = document.querySelectorAll(".section-header h2")
    sectionHeaders.forEach((header) => {
      if (theme === "dark") {
        header.setAttribute("style", "color: #ffffff !important;")
      } else {
        header.setAttribute("style", "color: #1a1a2e !important;")
      }
    })

    // Aplicar estilos a descripciones de juegos
    const gameDescriptions = document.querySelectorAll(".game-description p")
    gameDescriptions.forEach((desc) => {
      if (theme === "dark") {
        desc.setAttribute("style", "color: #b0b0b0 !important;")
      } else {
        desc.setAttribute("style", "color: #666666 !important;")
      }
    })
  }

  // Método para depuración
  logCurrentState(): void {
    const html = document.querySelector("html")
    const body = document.body
    const currentTheme = this.currentThemeSubject.value
    const localStorageTheme = localStorage.getItem("theme")
    const htmlClasses = html ? html.className : "No se pudo acceder a HTML"
    const bodyClasses = body ? body.className : "No se pudo acceder a BODY"
    const bodyStyles = body ? body.style.cssText : "No se pudo acceder a BODY"

    console.group("Estado actual del tema")
    console.log(`Tema en servicio: ${currentTheme}`)
    console.log(`Tema en localStorage: ${localStorageTheme}`)
    console.log(`Clases en HTML: ${htmlClasses}`)
    console.log(`Clases en BODY: ${bodyClasses}`)
    console.log(`Estilos en BODY: ${bodyStyles}`)
    console.groupEnd()
  }
}
