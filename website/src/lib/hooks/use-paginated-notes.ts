"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../graphql-client";
import { GET_NOTES } from "../graphql/queries";
import type {
  Sentiment,
  Note,
  NoteQueryResults,
  QueryGetNotesArgs,
} from "../graphql/graphql";

interface PageData {
  data: NoteQueryResults | null;
  nextToken: string | null;
  pageNumber: number;
}

interface UsePaginatedNotesReturn {
  // Datos de la página actual
  currentPageData: Note[];
  totalScanned: number;
  isLoading: boolean;
  error: Error | null;

  // Estado de paginación
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoadingNextPage: boolean;

  // Acciones
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  refetch: () => void;
}

/**
 * Hook para manejar paginación correcta con nextToken de AWS
 * Mantiene un cache de páginas para permitir navegación bidireccional
 */
export function usePaginatedNotes(
  sentiment?: Sentiment | "all" | null,
  limit: number = 10
): UsePaginatedNotesReturn {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCache, setPagesCache] = useState<PageData[]>([]);

  // Convertir sentiment para el query
  const sentimentFilter =
    sentiment === "all" || !sentiment ? undefined : (sentiment as Sentiment);

  // Obtener el nextToken para la página actual
  const currentNextToken = useMemo(() => {
    if (currentPage === 1) return null;
    const previousPage = pagesCache[currentPage - 2];
    return previousPage?.nextToken || null;
  }, [currentPage, pagesCache]);

  // Query principal para la página actual
  const {
    data: queryData,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: [
      "paginated-notes",
      sentimentFilter,
      limit,
      currentNextToken,
      currentPage,
    ],
    queryFn: async (): Promise<NoteQueryResults | null> => {
      const variables: QueryGetNotesArgs = {
        sentiment: sentimentFilter,
        limit,
        nextToken: currentNextToken,
      };

      const response = await client.graphql({
        query: GET_NOTES,
        variables,
      });

      if ("data" in response) {
        return response.data.getNotes;
      }
      return null;
    },
    enabled: true,
    staleTime: 30 * 1000, // 30 segundos
  });

  const { isLoading: isLoadingNextPage } = useQuery({
    queryKey: [
      "paginated-notes-next",
      sentimentFilter,
      limit,
      queryData?.nextToken,
    ],
    queryFn: async (): Promise<boolean> => {
      if (!queryData?.nextToken) return false;

      const variables: QueryGetNotesArgs = {
        sentiment: sentimentFilter,
        limit: 1,
        nextToken: queryData.nextToken,
      };

      const response = await client.graphql({
        query: GET_NOTES,
        variables,
      });

      if ("data" in response) {
        return (response.data.getNotes?.items?.length || 0) > 0;
      }
      return false;
    },
    enabled: !!queryData?.nextToken,
    staleTime: 60 * 1000,
  });

  useMemo(() => {
    if (queryData && !isLoading) {
      setPagesCache((prev) => {
        const newCache = [...prev];

        while (newCache.length < currentPage) {
          newCache.push({
            data: null,
            nextToken: null,
            pageNumber: newCache.length + 1,
          });
        }

        newCache[currentPage - 1] = {
          data: queryData,
          nextToken: queryData.nextToken || null,
          pageNumber: currentPage,
        };

        return newCache;
      });
    }
  }, [queryData, isLoading, currentPage]);

  // Procesar datos de la página actual
  const currentPageData = useMemo(() => {
    return (
      queryData?.items?.filter((note): note is Note => note !== null) || []
    );
  }, [queryData]);

  const totalScanned = queryData?.scannedCount || 0;
  const hasNextPage = !!queryData?.nextToken;
  const hasPreviousPage = currentPage > 1;

  // Acciones de navegación
  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const refetch = () => {
    // Limpiar cache y refetch
    setPagesCache([]);
    setCurrentPage(1);
    queryClient.invalidateQueries({
      queryKey: ["paginated-notes"],
    });
    refetchQuery();
  };

  return {
    // Datos
    currentPageData,
    totalScanned,
    isLoading,
    error: error as Error | null,

    // Estado de paginación
    currentPage,
    hasNextPage,
    hasPreviousPage,
    isLoadingNextPage,

    // Acciones
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    refetch,
  };
}
