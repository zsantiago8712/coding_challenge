# 🧗 Coding Challenge

¡Gracias por tu interés en unirte a nuestro equipo! Esta prueba está diseñada para evaluar tus habilidades técnicas, tu forma de resolver problemas, tu capacidad de aprender y tu habilidad para seguir instrucciones con claridad.

> Debes ser capaz de resolver problemas y construir soluciones en una tercera parte del tiempo que tardaría un desarrollador competente promedio, manteniendo altos estándares de calidad.

## 🎯 Objetivo

Crear una aplicación web que permita publicar y leer notas con un "sentimiento". Esta aplicación debe ser completamente funcional y desplegada en producción. Opcionalmente, puedes agregar un notebook de analítica y desplegar el backend como infraestructura como código.

## 🗓️ Alcance

- Tiempo estimado: **2 días de trabajo**
- Modalidad: **Trabajo individual**
- Puedes usar cualquier herramienta de inteligencia artificial como apoyo.

## 🧱 Contenido del repositorio

```bash
.
├── README.md
├── website/              # Código del frontend con React con Next.js y Tailwind CSS
├── backend/              # (Opcional) Infraestructura como código con CDK
└── analytics.ipynb       # (Opcional) Jupyter Notebook con analíticos básicos
```

### 📂 Detalles

- **Haz un fork** de este repositorio y trabaja desde ahí.
- El código del **frontend** debe vivir en el folder `website/`.
- Puedes implementar el **backend** directamente en la consola de AWS (AppSync, DynamoDB y Amplify) o usar **CDK** para definirlo como infraestructura como código (IaC) en el folder `backend/`.
- La aplicación debe estar desplegada en producción con **Amplify**.

## 🖥️ Requisitos funcionales (obligatorios)

La aplicación debe permitir:

1. **Crear una nota** con:

   - Texto libre
   - Un sentimiento: `happy`, `sad`, `neutral`, `angry`

2. **Visualizar notas existentes**:

   - Mostrar las notas paginadas en bloques de 10
   - Posibilidad de filtrar por sentimiento
   - Mostrar la fecha de creación de la nota

3. **Despliegue**:
   - La aplicación debe estar **en producción**
   - **Acceso público**: No requiere autenticación de usuarios

## ⚙️ Requisitos técnicos (obligatorios)

- **Frontend**: [React](https://react.dev/) con [Next.js](https://nextjs.org/) y [Tailwind CSS](https://tailwindcss.com/)
- **API**: [GraphQL](https://aws.amazon.com/graphql/) sobre [AppSync](https://aws.amazon.com/appsync/)
- **Base de datos**: [DynamoDB](https://aws.amazon.com/dynamodb/)
- **Hosting**: [Amplify](https://aws.amazon.com/amplify/hosting/)

### 🔧 Esquema esperado de GraphQL

```graphql
enum Sentiment {
  happy
  sad
  neutral
  angry
}

type Note {
  id: ID!
  text: String!
  sentiment: Sentiment!
  dateCreated: AWSDateTime!
}

type NoteQueryResults {
  items: [Note]
  nextToken: String
  scannedCount: Int
}

type Query {
  getNotes(
    sentiment: Sentiment
    limit: Int
    nextToken: String
  ): NoteQueryResults
}

type Mutation {
  createNote(text: String!, sentiment: Sentiment!): Note
}
```

> Te recomendamos que utilices [ULID](https://github.com/ulid/spec) para generar los IDs de las notas. Esto va a ser útil para filtrar los resultados en base a tiempo.

## 🏆 Extras (opcionales)

Hay dos entregables opcionales que puedes hacer para demostrar habilidades excepcionales.

### 📊 Notebook de analítica

Crea un archivo `analytics.ipynb` con visualizaciones de las notas:

- Un **histograma** de cantidad de notas por día
- Un **gráfico circular** con la proporción de sentimientos publicados

### 🚀 Infraestructura como código

Utiliza CDK para crear el backend de la aplicación dentro del folder `backend/`.

> Si no utilizas CDK, crea todos los recursos a través de la consola de AWS.

## ✅ Entregables

1. URL de la aplicación en producción (AWS Amplify)
2. Enlace al repositorio con tu fork
3. (Opcional) Notebook con analítica
4. (Opcional) Infraestructura como código

## 🧠 Qué evaluaremos

- Funcionamiento y calidad visual de la aplicación
- Claridad del código y estructura del proyecto
- Uso correcto de AWS y el stack propuesto
- Autonomía para aprender nuevas tecnologías (GraphQL, DynamoDB, CDK, etcétera)
- Buenas prácticas de versionado con Git y GitHub

## 💡 Tips

- Documenta cualquier decisión técnica que hayas tomado
- Si algo no está claro, elige una solución razonada y explícalo
- Haz un UI simple, cuida usabilidad y presentación
- Haz `commits` lógicos, claros y estructurados
- Usa IA a tu favor, pero entiende lo que estás haciendo

---

¡Éxito! Estamos emocionados de ver tu trabajo 🚀
