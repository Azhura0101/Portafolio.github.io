# Azhura.dev — Portafolio Personal

Notas personales y changelog del proyecto.

---

## TODO

- [ ] Subir badge "Comisionado" a Stride Base, Catálogo y Donde Juan
- [ ] Revisar responsive del CV en móvil
- [ ] Agregar más proyectos cuando estén listos

---

## Changelog Reciente

### 2026-07-18
- Badges "Comisionado" / "Demo" en proyectos
- Limpieza CSS completa: variables unificadas, dead code eliminado
- CV unificado y profesional (PDF generado con Python)
- Términos y Condiciones mejorados (7 puntos, sin animación)
- Modal de términos estático (sin tilt 3D)
- Link CV actualizado
- Hue-rotate + noise texture en background
- Light theme eliminado completamente
- Cards unificadas (padding, hover, opacidad, backdrop-filter)

### 2026-05
- Refactor: JS inline → script.js, traducciones → translations.js
- Sistema i18n completo (ES/EN)
- Canvas background con partículas y nebulosas
- Chatbot bilingüe
- PWA + service worker

---

## Arranque Rápido

```bash
# Abrir directo en navegador
open index.html
# o en Linux:
xdg-open index.html
```

No necesita build ni dependencias.

---

## Archivos Principales

- `index.html` — Estructura
- `style.css` — Estilos completos
- `script.js` — Lógica, animaciones, canvas, chat
- `translations.js` — i18n (ES/EN)
