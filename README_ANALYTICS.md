# Analytics Notebook

Este notebook de Jupyter (`analytics.ipynb`) proporciona análisis de datos para las notas almacenadas en DynamoDB, generando visualizaciones útiles para entender patrones de uso y distribución de sentimientos.

## Funcionalidades

### Análisis Incluidos

1. **Histograma de Notas por Día**: Visualiza la cantidad de notas creadas cada día
2. **Gráfico Circular de Sentimientos**: Muestra la proporción de sentimientos (positivo, negativo, neutral, mixto) en las notas

### Características Técnicas

- **Conexión automática a DynamoDB** mediante AWS SDK
- **Obtención de parámetros** desde CloudFormation Stack outputs
- **Procesamiento de datos** con Pandas
- **Visualizaciones** con Matplotlib y Seaborn
- **Manejo de errores** y fallbacks para conexiones

## Configuración del Entorno

### Prerequisitos

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) instalado
- AWS CLI configurado con credenciales válidas
- Backend desplegado en AWS (stack `BackendStack`)

### Instalación Rápida

Si quieres usar exactamente el mismo entorno que usamos para desarrollo:

```bash
Clonar el repositorio y navegar al directorio
cd coding_challenge

Sincronizar el entorno virtual con las dependencias exactas
uv sync
```

El comando `uv sync` leerá el archivo `uv.lock` y recreará exactamente el mismo entorno virtual con las mismas versiones de dependencias que usamos durante el desarrollo.

### Instalación Manual

Si prefieres instalar las dependencias manualmente:

```bash
Crear y activar entorno virtual
uv venv
source .venv/bin/activate
.venv\Scripts\activate

Instalar dependencias principales
uv add pandas numpy matplotlib seaborn boto3 jupyter
```

## Uso del Notebook

### 1. Activar el entorno virtual

```bash
Si usaste uv sync
source .venv/bin/activate

O activar el entorno que creaste manualmente
source .venv/bin/activate
```

### 2. Iniciar Jupyter Lab/Notebook

```bash
jupyter lab
jupyter lab

jupyter notebook
jupyter notebook
```

### 3. Abrir el notebook

Navega a `analytics.ipynb` y ejecuta las celdas secuencialmente.

## Estructura del Notebook

```
analytics.ipynb
├── 1. Import Required Libraries      # Importación de dependencias
├── 2. Database Connection Setup      # Conexión a AWS DynamoDB
├── 3. Data Extraction and Preparation # Extracción y limpieza de datos
├── 4. Daily Notes Histogram          # Análisis temporal de notas
└── 5. Sentiment Proportion Pie Chart # Análisis de sentimientos
```

## Configuración AWS

### Credenciales AWS

Asegúrate de tener AWS CLI configurado:

```bash
aws configure
```

### Stack Requerido

El notebook espera que tengas desplegado el stack `BackendStack` con los siguientes outputs:

- `DynamoDBTableName`: Nombre de la tabla de notas

### Región AWS

Por defecto, el notebook usa la región `us-east-1`. Si tu stack está en otra región, modifica la variable `AWS_REGION` en la segunda celda del notebook.

## Resultados Esperados

### Histograma de Notas Diarias

- **Gráfico de barras**: Notas creadas por día
- **Histograma de distribución**: Frecuencia de días por cantidad de notas
- **Estadísticas**: Promedio, máximo, mínimo de notas por día

### Análisis de Sentimientos

- **Pie chart**: Proporción visual de cada tipo de sentimiento
- **Gráfico de barras**: Cantidad exacta de notas por sentimiento
- **Estadísticas detalladas**: Conteo y porcentajes por sentimiento

## Troubleshooting

### Error de conexión a DynamoDB

```
Error connecting to DynamoDB: ...
```

**Solución**: Verifica que:

- AWS CLI esté configurado correctamente
- Tu usuario tenga permisos para DynamoDB y CloudFormation
- El stack `BackendStack` esté desplegado

### Tabla no encontrada

```
Table name not found in stack outputs
```

**Solución**: El notebook usará el nombre fallback `"Notes"`. Verifica que la tabla exista con ese nombre.

### Error de importación

```
ModuleNotFoundError: No module named 'pandas'
```

**Solución**: Asegúrate de activar el entorno virtual antes de ejecutar Jupyter:

```bash
source .venv/bin/activate
jupyter lab
```

## Dependencias Principales

- `pandas`: Manipulación y análisis de datos
- `numpy`: Operaciones numéricas
- `matplotlib`: Visualizaciones básicas
- `seaborn`: Visualizaciones estadísticas mejoradas
- `boto3`: SDK de AWS para Python
- `jupyter`: Entorno de notebooks

## Actualizaciones

Para mantener el entorno actualizado:

```bash
# Actualizar dependencias (mantiene compatibilidad)
uv sync

# O actualizar a las últimas versiones disponibles
uv lock --upgrade
uv sync
```

## Tips de Uso

1. **Ejecuta las celdas secuencialmente** para evitar errores de dependencias
2. **Reinicia el kernel** si modificas las funciones y quieres reejecutar
3. **Revisa la región AWS** si no encuentras tu stack
4. **Usa el modo dark** de Jupyter para mejor visualización de los gráficos

---

**Nota**: El archivo `uv.lock` contiene las versiones exactas de todas las dependencias usadas durante el desarrollo, garantizando reproducibilidad del entorno.
