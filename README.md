# Kyubi — Landing Page Oficial

Portal web oficial del **Proyecto Kyubi**, diseñado con una estética inmersiva **Universal Liquid Glass**, visualización dinámica de salas en tiempo real, widget interactivo de Discord y centro de distribución de la beta para Android.

---

## 🌟 Propuesta de Valor

Kyubi es la plataforma social y de roleplay de nueva generación para Android que unifica:
- **Salas Híbridas 3-en-1**: Alternancia fluida entre Chat de Voz HD, Sala de Cine sincronizada (Watch Party) y Modo Roleplay narrativo.
- **Roleplay con Fichas Vivas**: Creación de personajes con slots asignables, tiradas de dados y estados en tiempo real.
- **Identidad Cósmica**: Perfiles con estética anime, marcos orbitales y progresión de niveles.
- **Comunidad en Vivo**: Conexión directa con la comunidad de Discord para tertulias, soporte y eventos.

---

## 🛠️ Stack Tecnológico

El proyecto está construido priorizando rendimiento, accesibilidad y cero dependencias pesadas:
- **HTML5 Semántico**: Estructura limpia y optimizada para SEO y accesibilidad (ARIA).
- **CSS3 Moderno**: 
  - Sistema de diseño propio **Liquid Glass** (Glassmorphism mediante `backdrop-filter`, paleta cósmica en Custom Properties).
  - Maquetación responsiva con CSS Grid y Flexbox.
  - Iconografía vectorial SVG pura (política estricta de cero emojis para un diseño cohesivo).
- **JavaScript Vanilla Modular**: 
  - Componentes reactivos sin frameworks.
  - Animaciones coordinadas con `IntersectionObserver`.
  - Integración asíncrona en tiempo real con la API y Widget oficial de Discord.

---

## 🚀 Ejecución Local

Para levantar el servidor web de desarrollo en tu entorno local:

### Opción 1: Con Python (Recomendado)
```bash
python -m http.server 3000
```

### Opción 2: Con Node.js / npx serve
```bash
npx serve . -l 3000
```

Una vez iniciado el servidor, abre tu navegador en `http://localhost:3000`.

---

## 📦 Distribución del APK (Android)

Para evitar almacenar binarios pesados en el historial de Git y garantizar descargas de alta velocidad, el APK oficial de la beta de Kyubi se distribuye a través de **GitHub Releases**:

- **Versión**: `v1.2.0-beta`
- **Arquitectura**: `arm64-v8a` (64 bits)
- **Requisitos mínimos**: Android 8.0 (Oreo) o superior
- **Descarga directa**: [Descargar APK Release desde GitHub](https://github.com/Lol-bit-Rvgl/Kyubi-Social-landing/releases/download/v1.2.0-beta/app-arm64-v8a-release.apk)

---

## 📄 Licencia

Este proyecto está protegido bajo una **Licencia No Comercial Estricta**.

Queda estrictamente prohibido el uso, copia, modificación, distribución, sublicenciamiento o explotación comercial, total o parcial, de este software, marca, diseños o código fuente sin el consentimiento previo, explícito y por escrito de los autores del **Proyecto Kyubi**.

Consulta el archivo [LICENSE](LICENSE) para conocer todos los términos legales.
