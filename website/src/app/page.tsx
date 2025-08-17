import { NotesTest } from "@/components/notes-test";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          📑 Notes Sentiment App
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <NotesTest />
        </div>
      </div>
    </div>
  );
}
