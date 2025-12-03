/**
 * Custom hook for managing documents
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import DocumentService, { Document } from '../services/documentService';
import { useUser } from '../stores/userStore';

interface UseDocumentsOptions {
  ideaId: string;
  autoFetch?: boolean;
  searchEnabled?: boolean;
  filterEnabled?: boolean;
}

interface UseDocumentsReturn {
  // Data
  documents: Document[];
  filteredDocuments: Document[];
  totalDocumentsFromApi: number; // Total count from API response
  
  // Loading states
  isLoading: boolean;
  isUploading: boolean;
  
  // Error states
  error: string | null;
  uploadError: string | null;
  
  // Search and filter
  searchQuery: string;
  selectedType: string;
  
  // Actions
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File, metadata?: any) => Promise<boolean>;
  downloadDocument: (document: Document) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
  clearError: () => void;
  clearUploadError: () => void;
  
  // Statistics
  getTotalCount: () => number;
  getFilteredCount: () => number;
  getTypeCount: (type: string) => number;
}

export const useDocuments = (options: UseDocumentsOptions): UseDocumentsReturn => {
  const { ideaId, autoFetch = true, searchEnabled = true, filterEnabled = true } = options;
  const user = useUser();

  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalDocumentsFromApi, setTotalDocumentsFromApi] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch documents from API
  const fetchDocuments = useCallback(async () => {
    if (!ideaId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await DocumentService.getDocuments(ideaId);
      
      console.log('useDocuments - Service response:', response);
      
      if (response.success && response.data) {
        if (!Array.isArray(response.data)) {
          console.error('useDocuments - response.data is not an array:', response.data);
          setError('Invalid response format from documents API');
          return;
        }
        
        const transformedDocuments = response.data.map(apiDoc => 
          DocumentService.transformApiDocument(apiDoc)
        );
        
        console.log('useDocuments - Transformed documents:', transformedDocuments);
        
        setDocuments(transformedDocuments);
        setTotalDocumentsFromApi(response.totalCount || transformedDocuments.length);
      } else {
        console.error('useDocuments - API error response:', response);
        setError(response.error || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('useDocuments - Exception:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, [ideaId]);

  // Upload document
  const uploadDocument = useCallback(async (
    file: File, 
    metadata: {
      description?: string;
      documentType?: string;
      tags?: string[];
    } = {}
  ): Promise<boolean> => {
    if (!ideaId) return false;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Include mentor user ID in metadata
      const enhancedMetadata = {
        ...metadata,
        mentorUserId: user?.user_id || user?.id
      };

      const response = await DocumentService.uploadDocument(ideaId, file, enhancedMetadata);
      
      if (response.success && response.data) {
        const newDocument = DocumentService.transformApiDocument(response.data);
        setDocuments(prev => [newDocument, ...prev]);
        return true;
      } else {
        setUploadError(response.error || 'Failed to upload document');
        return false;
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload document');
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [ideaId, user?.user_id, user?.id]);

  // Download document
  const downloadDocument = useCallback(async (document: Document): Promise<void> => {
    try {
      await DocumentService.downloadDocument(document);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download document');
    }
  }, []);

  // Delete document
  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    if (!ideaId) return false;

    try {
      const response = await DocumentService.deleteDocument(ideaId, documentId);
      
      if (response.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        return true;
      } else {
        setError(response.error || 'Failed to delete document');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      return false;
    }
  }, [ideaId]);

  // Filter documents based on search and type
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Apply search filter
    if (searchEnabled && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
        doc.uploadedBy.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterEnabled && selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    return filtered;
  }, [documents, searchQuery, selectedType, searchEnabled, filterEnabled]);

  // Statistics
  const getTotalCount = useCallback(() => documents.length, [documents]);
  const getFilteredCount = useCallback(() => filteredDocuments.length, [filteredDocuments]);
  const getTypeCount = useCallback((type: string) => {
    return documents.filter(doc => doc.type === type).length;
  }, [documents]);

  // Error management
  const clearError = useCallback(() => setError(null), []);
  const clearUploadError = useCallback(() => setUploadError(null), []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && ideaId) {
      fetchDocuments();
    }
  }, [autoFetch, ideaId, fetchDocuments]);

  return {
    // Data
    documents,
    filteredDocuments,
    totalDocumentsFromApi,
    
    // Loading states
    isLoading,
    isUploading,
    
    // Error states
    error,
    uploadError,
    
    // Search and filter
    searchQuery,
    selectedType,
    
    // Actions
    fetchDocuments,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    setSearchQuery,
    setSelectedType,
    clearError,
    clearUploadError,
    
    // Statistics
    getTotalCount,
    getFilteredCount,
    getTypeCount,
  };
};

export default useDocuments;