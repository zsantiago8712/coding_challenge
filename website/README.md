# 📑 Frontend - App Notes Sentiment (Coding Challenge)

Este proyecto corresponde al frontend de la aplicación de notas con sentimiento, parte del reto técnico. Está construido con **React**, **Next.js** y **Tailwind CSS**, siguiendo los lineamientos del reto.

## 🚀 Objetivo

Permitir a los usuarios crear y visualizar notas, cada una asociada a un sentimiento (`happy`, `sad`, `neutral`, `angry`). La interfaz es simple, moderna y funcional, priorizando usabilidad y claridad visual.

## 🛠️ Stack Tecnológico

- **React** + **Next.js** (App Router, TypeScript)
- **Tailwind CSS** para estilos rápidos y consistentes
- **Bun** como package manager por su velocidad y simplicidad
- **Eslint** y **Prettier** para mantener calidad de código

## 📦 Instalación

```bash
bun install
bun dev
```

## 📐 Estructura

El código fuente vive en el directorio `src/`, siguiendo la convención recomendada por Next.js para proyectos modernos.

## ⚙️ Decisiones técnicas y cambios sobre Next.js

**Uso de Bun:** Elegí Bun por su rapidez y manejo eficiente de dependencias, lo que mejora la experiencia de desarrollo y reduce tiempos de CI/CD.
**App Router y TypeScript:** El proyecto usa el nuevo App Router de Next.js y está completamente tipado con TypeScript para mayor robustez.
**Tailwind CSS:** Permite iterar rápido en el diseño y mantener una UI limpia y responsiva.
**Import Alias (@):** Configuré el alias `@/*` para facilitar imports y mejorar la organización del código.
**Eslint y Prettier:** Se integran para asegurar buenas prácticas y estilo consistente.
**Commits paso a paso:** El desarrollo se realiza en pasos pequeños y claros, con commits lógicos y descriptivos para facilitar el seguimiento y revisión.
**shadcn/ui:** Se eligió shadcn/ui como librería de componentes UI por su flexibilidad, diseño moderno y fácil integración con Tailwind CSS. La instalación y configuración se realizó directamente en el directorio `website`, siguiendo las recomendaciones oficiales para proyectos Next.js. Esto permite construir interfaces accesibles y personalizables de forma eficiente.

## 📝 Funcionalidades

- Crear notas con texto y sentimiento.
- Visualizar notas paginadas, filtrables por sentimiento y con fecha de creación.
- Interfaz responsiva y accesible.

## 📄 Documentación y decisiones

Cada decisión técnica relevante se documenta en los archivos del proyecto y en los mensajes de commit. Si se realiza algún cambio importante sobre Next.js, librerías o estructura, se explica aquí y en los comentarios del código.

## 🧑‍💻 Desarrollo

Sigue los pasos y recomendaciones del reto, asegurando calidad y claridad en cada avance.

---
