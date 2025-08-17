# 📑 Frontend - App Notes Sentiment (Coding Challenge)

Este proyecto corresponde al frontend de la aplicación de notas con sentimiento, parte del reto técnico. Está construido con **React**, **Next.js** y **Tailwind CSS**, siguiendo los lineamientos del reto.

## 🚀 Objetivo

Permitir a los usuarios crear y visualizar notas, cada una asociada a un sentimiento (`happy`, `sad`, `neutral`, `angry`). La interfaz es simple, moderna y funcional, priorizando usabilidad y claridad visual.

## 🛠️ Stack Tecnológico

- **React** + **Next.js** (App Router, TypeScript)
- **Tailwind CSS** para estilos rápidos y consistentes
- **TanStack Query** para manejo de estado servidor y caché
- **AWS Amplify SDK** para conectividad con AppSync/GraphQL
- **GraphQL Code Generation** para tipos TypeScript automáticos
- **Bun** como package manager por su velocidad y simplicidad
- **Eslint** y **Prettier** para mantener calidad de código

## 🎯 Decisiones Técnicas Clave

### **TanStack Query (React Query)**

Se eligió TanStack Query como la solución de manejo de estado del servidor por las siguientes razones:

**✅ Ventajas:**

- **Caché inteligente**: Automáticamente cachea las respuestas del servidor y las mantiene sincronizadas
- **Background updates**: Actualiza los datos en segundo plano sin bloquear la UI
- **Optimistic updates**: Permite actualizar la UI inmediatamente antes de confirmar con el servidor
- **Error handling**: Manejo robusto de errores con reintentos automáticos
- **DevTools**: Excelentes herramientas de desarrollo para debugging
- **SSR/SSG friendly**: Funciona perfectamente con Next.js y hidratación
- **Paginación**: Soporte nativo para paginación infinita y estándar

**🔄 Patrón Singleton:**
Se implementó un patrón singleton para el QueryClient que:

- Evita recrear instancias innecesariamente en re-renders
- Maneja correctamente la hidratación SSR/CSR
- Optimiza el uso de memoria en el cliente

### **AWS Amplify SDK**

Se eligió el SDK oficial de AWS Amplify para la conectividad con AppSync por:

**✅ Ventajas:**

- **Integración nativa**: Diseñado específicamente para servicios AWS (AppSync, Cognito, S3, etc.)
- **Autenticación automática**: Manejo transparente de API Keys, JWT tokens, etc.
- **Tipos TypeScript**: Soporte completo de tipos para mayor seguridad
- **Subscriptions**: Soporte nativo para GraphQL subscriptions en tiempo real
- **Offline support**: Capacidades offline y sincronización automática
- **Error handling**: Manejo especializado de errores de AWS
- **Caching**: Integra bien con estrategias de caché personalizadas

**🔗 Integración con TanStack Query:**
La combinación de ambas tecnologías proporciona:

- **Lo mejor de ambos mundos**: Conectividad robusta con AWS + manejo de estado avanzado
- **Flexibilidad**: Amplify maneja la conectividad, TanStack Query maneja el estado y caché
- **Escalabilidad**: Preparado para crecer con funcionalidades como auth, storage, etc.
- **Developer Experience**: Excelente DX con tipado automático y herramientas de desarrollo

### **Alternativas Consideradas**

- **SWR**: Menos funcionalidades que TanStack Query para casos complejos
- **Apollo Client**: Más pesado y específico para GraphQL, menos flexible para otros tipos de APIs
- **React Query + graphql-request**: Requiere más configuración manual vs Amplify SDK

## 📦 Instalación

```bash
bun install
bun dev
```

## 🏗️ Arquitectura de Datos

La aplicación sigue una arquitectura cliente-servidor moderna:

```
┌─────────────────┐    GraphQL     ┌─────────────────┐
│   React App     │◄──────────────►│   AWS AppSync   │
│                 │                │                 │
│ ┌─────────────┐ │                │ ┌─────────────┐ │
│ │TanStack     │ │                │ │  Resolvers  │ │
│ │Query        │ │                │ │             │ │
│ │(Cache)      │ │                │ └─────────────┘ │
│ └─────────────┘ │                │                 │
│                 │                │ ┌─────────────┐ │
│ ┌─────────────┐ │                │ │  DynamoDB   │ │
│ │Amplify SDK  │ │                │ │             │ │
│ │(GraphQL     │ │                │ │             │ │
│ │ Client)     │ │                │ │             │ │
│ └─────────────┘ │                │ └─────────────┘ │
└─────────────────┘                └─────────────────┘
```

**Flujo de datos:**

1. **UI Components** → Usan hooks personalizados (`useNotes`, `useCreateNote`)
2. **Custom Hooks** → Llaman a TanStack Query con funciones de Amplify SDK
3. **TanStack Query** → Maneja caché, sincronización, y estado de carga
4. **Amplify SDK** → Se conecta a AppSync con autenticación automática
5. **AppSync** → Procesa queries/mutations con resolvers VTL
6. **DynamoDB** → Almacena y recupera datos de notas

## 📐 Estructura

El código fuente vive en el directorio `src/`, siguiendo la convención recomendada por Next.js para proyectos modernos.

```
src/
├── app/                          # App Router de Next.js
│   ├── layout.tsx               # Layout principal con providers
│   ├── page.tsx                 # Página principal
│   └── globals.css              # Estilos globales
├── components/                   # Componentes reutilizables
│   └── notes-test.tsx           # Componente de prueba
├── lib/                         # Configuraciones y utilidades
│   ├── hooks/                   # Hooks personalizados
│   │   ├── use-notes.ts         # Hook para CRUD de notas
│   │   ├── use-infinite-notes.ts # Hook para paginación infinita
│   │   └── index.ts             # Exportaciones
│   ├── providers/               # React Context Providers
│   │   ├── app-provider.tsx     # Provider principal
│   │   ├── query-provider.tsx   # TanStack Query provider
│   │   ├── amplify-provider.tsx # AWS Amplify provider
│   │   └── index.ts             # Exportaciones
│   ├── graphql/                 # GraphQL generado automáticamente
│   │   ├── queries.ts           # Queries y mutations
│   │   ├── graphql.ts           # Tipos generados
│   │   └── gql.ts               # Función graphql()
│   ├── constants/               # Constantes de la aplicación
│   │   └── sentiments.ts        # Configuración de sentimientos
│   ├── amplify.ts               # Configuración de AWS Amplify
│   ├── graphql-client.ts        # Cliente GraphQL de Amplify
│   └── utils.ts                 # Utilidades generales
├── schema/                      # Schema GraphQL
│   └── schema.graphql           # Definición del schema
└── codegen.ts                   # Configuración de code generation
```

## 🎣 Hooks Disponibles

### `useNotes(sentiment?, limit?, nextToken?)`

Hook para obtener notas con filtros opcionales y paginación.

```typescript
const { data, isLoading, error } = useNotes(Sentiment.Happy, 10);
```

### `useCreateNote()`

Hook para crear nuevas notas con optimistic updates.

```typescript
const createNote = useCreateNote();
createNote.mutate({ text: "Mi nota", sentiment: Sentiment.Happy });
```

### `useInfiniteNotes(sentiment?, limit?)`

Hook para paginación infinita de notas.

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteNotes(Sentiment.Neutral);
```

## ⚙️ Otras Decisiones Técnicas

**Uso de Bun:** Elegido por su rapidez y manejo eficiente de dependencias, mejorando la experiencia de desarrollo y reduciendo tiempos de CI/CD.

**App Router y TypeScript:** Uso del nuevo App Router de Next.js completamente tipado con TypeScript para mayor robustez y mejor Developer Experience.

**Tailwind CSS:** Permite iterar rápido en el diseño y mantener una UI limpia, responsiva y consistente.

**Import Alias (@):** Configurado para facilitar imports y mejorar la organización del código.

**GraphQL Code Generation:** Genera automáticamente tipos TypeScript desde el schema GraphQL, eliminando errores de tipado y mejorando la productividad.

**Patrón de Providers:** Implementación de providers anidados con patrón singleton para:

- Separar responsabilidades (Amplify config, Query client, etc.)
- Optimizar renders y memoria
- Facilitar testing y mantenimiento

**shadcn/ui:** Librería de componentes UI elegida por su flexibilidad, diseño moderno y fácil integración con Tailwind CSS.

## 📝 Funcionalidades

- Crear notas con texto y sentimiento.
- Visualizar notas paginadas, filtrables por sentimiento y con fecha de creación.
- Interfaz responsiva y accesible.

## 📄 Documentación y decisiones

Cada decisión técnica relevante se documenta en los archivos del proyecto y en los mensajes de commit. Si se realiza algún cambio importante sobre Next.js, librerías o estructura, se explica aquí y en los comentarios del código.

## 🧑‍💻 Desarrollo

Sigue los pasos y recomendaciones del reto, asegurando calidad y claridad en cada avance.

---
