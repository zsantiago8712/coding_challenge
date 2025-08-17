export const GET_NOTES = `
  query GetNotes($sentiment: Sentiment, $limit: Int, $nextToken: String) {
    getNotes(sentiment: $sentiment, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        sentiment
        dateCreated
      }
      nextToken
      scannedCount
    }
  }
`;

export const CREATE_NOTE = `
  mutation CreateNote($text: String!, $sentiment: Sentiment!) {
    createNote(text: $text, sentiment: $sentiment) {
      id
      text
      sentiment
      dateCreated
    }
  }
`;

export const GET_NOTES_STATS = `
  query GetNotesStats {
    getNotesStats {
      totalNotes
      notesBySentiment {
        sentiment
        count
      }
      mostPopularSentiment
      notesToday
    }
  }
`;
