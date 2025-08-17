# Backend - Infraestructura como Código (CDK)

Este folder contiene la definición y despliegue de la infraestructura del backend para la aplicación de notas con sentimiento, utilizando AWS CDK (Cloud Development Kit).

## 📦 Estructura del folder

```
backend/
├── bin/                  # Entry point para la app de CDK
│   └── backend.ts
├── lib/                  # Stacks y constructores de CDK
│   └── backend-stack.ts
├── test/                 # Pruebas unitarias para la infraestructura
│   └── backend.test.ts
├── schema/               # (Opcional) Esquemas GraphQL
├── resolvers/            # (Opcional) Resolvers para GraphQL
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
├── cdk.json              # Configuración de CDK
└── README.md             # Este archivo
```

## 🚀 ¿Qué se despliega?

- **AppSync GraphQL API**: Expone los endpoints para crear y consultar notas.
- **DynamoDB**: Base de datos NoSQL para almacenar las notas.
- **Roles y permisos IAM**: Seguridad y acceso entre servicios.
- **(Opcional) Resolvers y esquemas**: Puedes definir el esquema GraphQL y los resolvers en los folders `schema/` y `resolvers/`.

## 🛠️ Cómo usar

1. Instala dependencias:
   ```fish
   bun install
   ```
2. Sintetiza la infraestructura:
   ```fish
   bun cdk synth
   ```
3. Despliega en AWS:
   ```fish
   bun cdk deploy
   ```

## 📑 Esquema GraphQL esperado

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

## 💡 Decisiones técnicas

- **Infraestructura como código**: Se eligió AWS CDK para definir y versionar la infraestructura, facilitando reproducibilidad y cambios controlados.
- **AppSync + DynamoDB**: Permite una arquitectura serverless, escalable y de bajo mantenimiento.
- **ULID para IDs**: Se recomienda ULID para los IDs de las notas, permitiendo orden temporal y fácil paginación.
- **Separación de esquemas y resolvers**: Los folders `schema/` y `resolvers/` permiten mantener el código organizado y escalable.
- **TypeScript**: Facilita el desarrollo seguro y mantenible.

## 📝 Notas adicionales

- Puedes modificar el stack en `lib/backend-stack.ts` para agregar más recursos o cambiar configuraciones.
- Las pruebas unitarias están en `test/backend.test.ts`.
- Si tienes dudas, consulta la documentación oficial de [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html).

---

Si tomaste alguna decisión diferente a lo aquí documentado, ¡explícalo en esta sección!
