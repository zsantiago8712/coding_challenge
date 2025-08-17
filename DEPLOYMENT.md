# 🚀 Deployment Guide - Public Access Configuration

Esta guía explica cómo desplegar la aplicación con acceso público (sin autenticación de usuarios).

## 🔓 Configuración de Acceso Público

La aplicación ha sido configurada para permitir acceso público usando **IAM + Cognito Identity Pool** en lugar de autenticación de usuarios. Esto significa que cualquier persona puede usar la aplicación sin necesidad de registrarse o iniciar sesión, pero sin exponer credenciales sensibles en el frontend.

## 📋 Prerrequisitos

1. **AWS CLI** configurado con credenciales apropiadas
2. **Node.js** (versión 18 o superior)
3. **Bun** instalado globalmente
4. **AWS CDK** instalado globalmente: `npm install -g aws-cdk`

## 🏗️ Despliegue del Backend

### 1. Navegar al directorio del backend

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Compilar el proyecto

```bash
npm run build
```

### 4. Desplegar el stack

```bash
npm run deploy
```

### 5. Obtener las variables de entorno

Después del despliegue, CDK mostrará los outputs necesarios:

```bash
✅  NotesBackendStack

Outputs:
NotesBackendStack.GraphQLAPIURL = https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NotesBackendStack.GraphQLAPIId = xxxxxxxxxxxxxxxxxxxxx
NotesBackendStack.IdentityPoolId = us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NotesBackendStack.DynamoDBTableName = Notes
```

## 🌐 Configuración del Frontend

### 1. Navegar al directorio del website

```bash
cd ../website
```

### 2. Crear archivo de variables de entorno

```bash
cp .env.example .env.local
```

### 3. Configurar las variables de entorno

Edita `.env.local` con los valores obtenidos del despliegue:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### 4. Instalar dependencias

```bash
bun install
```

### 5. Probar localmente

```bash
bun dev
```

## 🚀 Despliegue en Amplify

### 1. Conectar repositorio

1. Ve a la consola de AWS Amplify
2. Selecciona "New app" > "Host web app"
3. Conecta tu repositorio de GitHub

### 2. Configurar build settings

Amplify detectará automáticamente que es una aplicación Next.js. El archivo `amplify.yml` ya está configurado.

### 3. Configurar variables de entorno

En la consola de Amplify, ve a "Environment variables" y agrega:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT = https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_IDENTITY_POOL_ID = us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION = us-east-1
```

### 4. Desplegar

Amplify desplegará automáticamente la aplicación. El proceso tomará unos minutos.

## 🔒 Consideraciones de Seguridad

### ✅ Ventajas del Acceso Público

- **Simplicidad**: No requiere gestión de usuarios
- **Acceso inmediato**: Los usuarios pueden probar la app directamente
- **Ideal para demos**: Perfecto para mostrar funcionalidades
- **Seguridad mejorada**: Sin credenciales expuestas en el frontend

### ⚠️ Limitaciones

- **Sin personalización**: Todas las notas son públicas
- **Rate limiting**: AWS limita requests por identidad
- **Monitoreo necesario**: Revisar uso para evitar abusos

### 🛡️ Medidas de Protección Implementadas

- **Credenciales temporales**: AWS genera y rota credenciales automáticamente
- **Permisos IAM granulares**: Solo permisos necesarios para AppSync
- **Rate limiting automático**: AWS proporciona límites por identidad
- **Monitoreo completo**: CloudWatch y CloudTrail registran todas las operaciones
- **Sin exposición de secretos**: No hay API Keys en el código del frontend

## 🔄 Actualización de la Configuración

Si necesitas cambiar de acceso público a autenticación de usuarios:

1. **Modificar el backend**: Cambiar `AuthorizationType.API_KEY` a `AuthorizationType.USER_POOL`
2. **Agregar Cognito**: Configurar User Pool y Identity Pool
3. **Actualizar frontend**: Cambiar `defaultAuthMode` a `"userPool"`
4. **Redesplegar**: Ejecutar `npm run deploy` en el backend

## 📊 Monitoreo y Mantenimiento

### CloudWatch Metrics

- **Request count**: Número de requests por minuto
- **Error rate**: Porcentaje de errores
- **Latency**: Tiempo de respuesta promedio

### Logs

- **AppSync logs**: Queries y mutations ejecutadas
- **DynamoDB logs**: Operaciones en la base de datos
- **Amplify logs**: Despliegues y builds

## 🆘 Troubleshooting

### Error: "API Key expired"

- Generar nueva API Key en la consola de AppSync
- Actualizar variable de entorno en Amplify

### Error: "Access denied"

- Verificar que la API Key esté correctamente configurada
- Revisar permisos de IAM para AppSync

### Error: "GraphQL endpoint not found"

- Verificar que el endpoint esté correctamente configurado
- Revisar que el stack esté desplegado correctamente

---

¡La aplicación ahora está configurada para acceso público y lista para usar! 🎉
