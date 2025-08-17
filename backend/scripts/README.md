# 🌱 Database Seeding Scripts

This directory contains scripts for seeding the DynamoDB database with fake data for development and testing purposes.

## 📋 Prerequisites

1. **AWS Credentials**: Ensure your AWS credentials are configured
2. **DynamoDB Table**: The table must be deployed and accessible
3. **Environment Variables**: Set the required environment variables

## 🚀 Quick Start

### Basic Seeding (50 notes)

```bash
bun run seed
```

### Small Dataset (10 notes)

```bash
bun run seed:small
```

### Large Dataset (100 notes)

```bash
bun run seed:large
```

### Custom Amount

```bash
SEED_COUNT=25 bun run seed
```

## ⚙️ Environment Variables

| Variable              | Default     | Description                           |
| --------------------- | ----------- | ------------------------------------- |
| `DYNAMODB_TABLE_NAME` | `Notes`     | Name of the DynamoDB table            |
| `AWS_REGION`          | `us-east-1` | AWS region where the table is located |
| `SEED_COUNT`          | `50`        | Number of notes to generate           |

## 📊 Generated Data

The script generates realistic notes with:

### **Sentiments Distribution**

- 😊 **Happy**: Positive, uplifting messages
- 😢 **Sad**: Melancholic, tired expressions
- 😐 **Neutral**: Work notes, reminders, observations
- 😠 **Angry**: Frustrated, irritated comments

### **Content Structure**

- **Base message**: Sentiment-appropriate opening
- **Additional content**: 1-3 Lorem ipsum sentences
- **Date range**: Last 30 days for variety
- **Unique IDs**: UUID v4 format

### **Example Output**

```
😊 Happy: "Hoy fue un gran día. Lorem ipsum dolor sit amet."
😢 Sad: "Ha sido un día difícil. Consectetur adipiscing elit."
😐 Neutral: "Tomé algunas notas del día. Sed do eiusmod tempor."
😠 Angry: "Esto me frustra. Ut labore et dolore magna aliqua."
```

## 🔄 What the Script Does

1. **🗑️ Clear Table**: Removes all existing notes
2. **📝 Generate Data**: Creates fake notes with realistic content
3. **💾 Insert Data**: Batch inserts all notes into DynamoDB
4. **📊 Display Stats**: Shows breakdown by sentiment

## 🛡️ Safety Features

- **Confirmation**: Script shows what it will do before proceeding
- **Error Handling**: Graceful error handling with descriptive messages
- **Batch Operations**: Efficient bulk operations for large datasets
- **Statistics**: Clear feedback on what was created

## 🧪 Development Usage

### Testing Different Scenarios

```bash
# Test with minimal data
SEED_COUNT=5 bun run seed

# Test with realistic dataset
bun run seed

# Test with large dataset for performance
bun run seed:large
```

### Integration with Development Workflow

```bash
# Reset and seed database
bun run deploy && bun run seed

# Quick reset for testing
bun run seed:small
```

## 📝 Script Details

### Functions Available

- `fakeNote(sentiment)`: Generate a single note with specific sentiment
- `fakeNotes(count)`: Generate multiple notes with random sentiments
- `clearTable()`: Remove all existing notes
- `seedNotes(notes)`: Insert notes into database

### Error Handling

The script handles common errors:

- Missing AWS credentials
- Table not found
- Network connectivity issues
- Permission errors

## 🔧 Customization

To modify the generated content, edit the arrays in `fakeNote()` function:

```typescript
// Add more happy messages
sentiment === 'happy'
  ? faker.random.arrayElement([
      'Your new message here',
      // ... existing messages
    ])
```

## 📈 Performance

- **Small (10 notes)**: ~2 seconds
- **Medium (50 notes)**: ~5 seconds
- **Large (100 notes)**: ~10 seconds

Batch operations ensure efficient database usage regardless of dataset size.
