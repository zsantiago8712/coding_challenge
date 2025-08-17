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

### Backend Stack (NotesBackendStack):

- **AppSync GraphQL API**: Expone los endpoints para crear y consultar notas
- **DynamoDB**: Base de datos NoSQL para almacenar las notas
- **Cognito Identity Pool**: Autenticación para usuarios no autenticados
- **Roles y permisos IAM**: Seguridad y acceso entre servicios
- **Resolvers VTL**: Lógica de negocio para queries y mutations

### Hosting Stack (NotesHostingStack):

- **AWS Amplify**: Hosting para la aplicación Next.js
- **Build automático**: CI/CD integrado con GitHub
- **Variables de entorno**: Configuración automática del frontend
- **Dominio personalizado**: URL pública para la aplicación

## 🛠️ Cómo usar

1. Instala dependencias:
   ```fish
   bun install
   ```
2. Sintetiza la infraestructura:
   ```fish
   bun run build
   bun run diff
   ```
3. Despliega en AWS:

   ```bash
   # Deployment completo (backend + hosting)
   bun run deploy:full

   # O por separado:
   bun run deploy:backend  # Solo API + Database
   bun run deploy:hosting  # Solo Amplify hosting
   ```

4. Configuración post-deployment:

   ```bash
   # Poblar base de datos con datos de prueba
   bun run seed

   # Conectar repositorio GitHub en Amplify Console
   # (Usar la Console URL de los outputs)
   ```

Para una guía detallada, consulta [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🌱 Seeding de la Base de Datos

Para poblar la base de datos con datos de prueba, utiliza los scripts de seeding incluidos:

### Scripts Disponibles

```bash
bun run seed         # 50 notas (dataset estándar)
bun run seed:small   # 10 notas (testing rápido)
bun run seed:large   # 100 notas (testing de performance)
```

### Configuración

```bash
# Variables de entorno opcionales
DYNAMODB_TABLE_NAME=Notes      # Nombre de la tabla (default: Notes)
AWS_REGION=us-east-1          # Región AWS (default: us-east-1)
SEED_COUNT=25                 # Cantidad personalizada de notas
```

### Características del Seeding

- **🗑️ Limpieza automática**: Borra datos existentes antes de insertar
- **📝 Contenido realista**: Notas en español apropiadas para cada sentimiento
- **📊 Distribución balanceada**: Sentimientos distribuidos aleatoriamente
- **📅 Fechas variadas**: Últimos 30 días para simular uso real
- **📈 Estadísticas**: Reporte detallado de lo que se creó

### Ejemplo de Uso

```bash
# Workflow completo de desarrollo
bun run deploy && bun run seed

# Testing rápido
bun run seed:small

# Datos personalizados
SEED_COUNT=75 bun run seed
```

Para más detalles, consulta `scripts/README.md`.

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
