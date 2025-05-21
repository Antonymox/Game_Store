import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"
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
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      console.log(`ThemeService: Tema encontrado en localStorage: ${savedTheme}`)
      return savedTheme
    }

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

    const html = document.querySelector("html")
    const body = document.body

    if (html && body) {
      console.log(`ThemeService: Aplicando clase de tema a HTML y BODY: ${theme}`)

      if (theme === "dark") {
        html.classList.add("dark-theme")
        html.classList.remove("light-theme")
        body.classList.add("dark-theme")
        body.classList.remove("light-theme")
        body.style.backgroundColor = "#121212"
        body.style.color = "#f5f5f7"
        console.log("ThemeService: Clase dark-theme añadida, light-theme eliminada")
      } else {
        html.classList.add("light-theme")
        html.classList.remove("dark-theme")
        body.classList.add("light-theme")
        body.classList.remove("dark-theme")
        body.style.backgroundColor = "#f5f5f7"
        body.style.color = "#1a1a2e"
        console.log("ThemeService: Clase light-theme añadida, dark-theme eliminada")
      }
    } else {
      console.error("ThemeService: No se pudo encontrar el elemento HTML o BODY")
    }

    if (html) {
      console.log(`ThemeService: Clases actuales en HTML: ${html.className}`)
    }
    if (body) {
      console.log(`ThemeService: Clases actuales en BODY: ${body.className}`)
    }

    this.applySpecificStyles(theme)
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value
    console.log(`ThemeService: Alternando tema. Tema actual: ${currentTheme}`)
    const newTheme: Theme = currentTheme === "light" ? "dark" : "light"
    console.log(`ThemeService: Cambiando a tema: ${newTheme}`)
    this.setTheme(newTheme)
  }

  private applySpecificStyles(theme: Theme): void {
    console.log("ThemeService: Aplicando estilos específicos a componentes clave")

    const header = document.querySelector("header")
    if (header) {
      if (theme === "dark") {
        header.setAttribute("style", "background-color: #0f0f1a !important; color: #ffffff !important;")
      } else {
        header.setAttribute("style", "background-color: #1a1a2e !important; color: #ffffff !important;")
      }
    }

    const footer = document.querySelector("footer")
    if (footer) {
      if (theme === "dark") {
        footer.setAttribute("style", "background-color: #0f0f1a !important; color: #f5f5f5 !important;")
      } else {
        footer.setAttribute("style", "background-color: #1a1a2e !important; color: #f5f5f5 !important;")
      }
    }

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

    this.applyTextStyles(theme)
  }

  private applyTextStyles(theme: Theme): void {
    console.log("ThemeService: Aplicando estilos a textos y títulos")

    const darkTextSecondary = "#b0b0b0"
    const darkLinkColor = "#ff6b8b"
    const darkHeadingColor = "#ffffff"

    const lightTextSecondary = "#666666"
    const lightLinkColor = "#e94560"
    const lightHeadingColor = "#1a1a2e"

    const paragraphs = document.querySelectorAll("p")
    paragraphs.forEach((p) => {
      (p as HTMLElement).style.color = theme === "dark" ? darkTextSecondary : lightTextSecondary
    })

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading) => {
      (heading as HTMLElement).style.color = theme === "dark" ? darkHeadingColor : lightHeadingColor
    })

    const links = document.querySelectorAll("a:not(.btn)")
    links.forEach((link) => {
      (link as HTMLElement).style.color = theme === "dark" ? darkLinkColor : lightLinkColor
    })

    const spans = document.querySelectorAll("span")
    spans.forEach((span) => {
      if (!span.closest("button") && !span.classList.contains("cart-count")) {
        (span as HTMLElement).style.color = theme === "dark" ? darkTextSecondary : lightTextSecondary
      }
    })

    const gameCategories = document.querySelectorAll(".game-category")
    gameCategories.forEach((category) => {
      category.setAttribute("style", `color: ${theme === "dark" ? darkTextSecondary : lightTextSecondary} !important;`)
    })

    const gameTitles = document.querySelectorAll(".game-title a")
    gameTitles.forEach((title) => {
      title.setAttribute("style", `color: ${theme === "dark" ? "#ffffff" : "#1a1a2e"} !important;`)
    })

    const sectionHeaders = document.querySelectorAll(".section-header h2")
    sectionHeaders.forEach((header) => {
      header.setAttribute("style", `color: ${theme === "dark" ? "#ffffff" : "#1a1a2e"} !important;`)
    })

    const gameDescriptions = document.querySelectorAll(".game-description p")
    gameDescriptions.forEach((desc) => {
      desc.setAttribute("style", `color: ${theme === "dark" ? darkTextSecondary : lightTextSecondary} !important;`)
    })
  }

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
