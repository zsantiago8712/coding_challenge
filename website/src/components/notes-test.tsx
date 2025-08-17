"use client";

import { useNotes, useCreateNote, Sentiment } from "@/lib/hooks";
import { Button } from "@/components/ui/button";

export function NotesTest() {
  const { data: notes, isLoading, error } = useNotes();
  const createNoteMutation = useCreateNote();

  const handleCreateNote = () => {
    createNoteMutation.mutate({
      text: "Nota de prueba desde el frontend!",
      sentiment: Sentiment.Happy,
    });
  };

  if (isLoading)
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando notas...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-red-800">
          ❌ Error de Conexión
        </h2>
        <p className="text-red-700 mb-2">Error: {error.message}</p>
        <details className="text-sm text-red-600">
          <summary className="cursor-pointer font-medium">
            Ver detalles técnicos
          </summary>
          <pre className="mt-2 bg-red-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📝 Test de Notas</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Conectado</span>
        </div>
      </div>

      <div className="mb-6">
        <Button
          onClick={handleCreateNote}
          disabled={createNoteMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {createNoteMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creando...
            </>
          ) : (
            "✨ Crear Nota de Prueba"
          )}
        </Button>

        {createNoteMutation.error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ Error al crear nota: {createNoteMutation.error.message}
            </p>
          </div>
        )}

        {createNoteMutation.isSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Nota creada exitosamente!
            </p>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Notas
          </h3>
          <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
            {notes?.items?.length || 0} notas
          </span>
        </div>

        {!notes?.items?.length ? (
          <div className="text-center py-8 text-gray-500">
            <p>📭 No hay notas aún</p>
            <p className="text-sm mt-1">
              Crea tu primera nota usando el botón de arriba
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes?.items?.map((note) => (
              <div
                key={note?.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <p className="text-gray-900 mb-2">{note?.text}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="mr-1">😊</span>
                    {note?.sentiment}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-1">📅</span>
                    {new Date(note?.dateCreated).toLocaleString("es-ES")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
