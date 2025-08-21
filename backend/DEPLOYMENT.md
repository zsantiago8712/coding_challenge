# 🚀 Deployment Guide - Notes Sentiment App

Esta guía te ayudará a desplegar la aplicación completa usando Infrastructure as Code (IoC) con AWS CDK.

## 📋 Prerequisitos

### 1. AWS CLI Configurado

```bash
aws configure
# Ingresa tu Access Key ID, Secret Access Key, región (us-east-1), y formato (json)
```

### 2. CDK Bootstrap (Solo la primera vez)

```bash
cd backend
npx cdk bootstrap
```

### 3. Verificar Configuración

```bash
bun run check
```

### 4. Variables de Entorno (Opcional)

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita las variables si necesitas personalizar
# Por defecto usa: zsantiago8712/coding_challenge, branch main
export GITHUB_REPOSITORY="tu-usuario/tu-repo"
export BRANCH_NAME="main"  # o "frontend" para desarrollo
```

## 🏗️ Opciones de Deployment

### 🎯 Deployment Completo (Recomendado)

Despliega backend + hosting en un solo comando:

```bash
bun run deploy:full
```

### 🔧 Deployment por Partes

#### 1. Solo Backend (API + Database)

```bash
bun run deploy:backend
```

#### 2. Solo Hosting (Amplify)

```bash
bun run deploy:hosting
```

### 📊 Ver Diferencias Antes del Deploy

```bash
bun run diff:full
```

## 🌱 Post-Deployment: Seeding

Después del deployment, pobla la base de datos:

```bash
bun run seed
```

## 📝 Outputs Importantes

Después del deployment verás:

### Backend Stack:

- **GraphQL Endpoint**: URL de tu API
- **Identity Pool ID**: Para autenticación
- **DynamoDB Table**: Nombre de la tabla

### Hosting Stack:

- **Amplify App ID**: ID de la aplicación
- **Default Domain**: URL de tu sitio web
- **Console URL**: Link a la consola de Amplify

## 🔧 Configuración Manual Requerida

### 1. Conectar Repositorio GitHub

1. Ve a la **Console URL** mostrada en los outputs
2. En la sección "App settings" → "General"
3. Conecta tu repositorio GitHub
4. Autoriza AWS Amplify

### 2. Configurar Build Settings (Si es necesario)

El build spec ya está configurado, pero puedes verificar:

```yaml
version: 1.0
applications:
    - appRoot: website
      frontend:
          phases:
              preBuild:
                  commands:
                      - bun ci
              build:
                  commands:
                      - bun run build
          artifacts:
              baseDirectory: .next
              files:
                  - '**/*'
```

## 🌍 Variables de Entorno

Las siguientes variables se configuran automáticamente:

- `NEXT_PUBLIC_GRAPHQL_ENDPOINT`
- `NEXT_PUBLIC_AWS_REGION`
- `NEXT_PUBLIC_IDENTITY_POOL_ID`

## 🔄 Workflow Completo

```bash
# 0. Verificar configuración
bun run check

# 1. Deploy completo
bun run deploy:full

# 2. Generar variables de entorno para el frontend
bun run setup-frontend

# 3. Poblar base de datos
bun run seed

# 4. ¡Tu app está lista! 🎉
# - Backend: Desplegado automáticamente
# - Frontend: Conectado automáticamente con GitHub token
# - Variables: Configuradas automáticamente en .env.local
```

## 🧹 Cleanup

Para eliminar todos los recursos:

```bash
bun run destroy:all
```

## 🚨 Troubleshooting

### Error: "Repository not connected"

- Ve a Amplify Console y conecta manualmente tu repo GitHub

### Error: "Build failed"

- Verifica que el `appRoot` sea "website"
- Revisa los logs en Amplify Console

### Error: "GraphQL endpoint not found"

- Asegúrate de que el backend se desplegó correctamente
- Verifica los outputs del backend stack

### Error: "Identity pool not found"

- El hosting stack depende del backend
- Despliega primero el backend o usa `deploy:full`

## 📚 Recursos Adicionales

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
