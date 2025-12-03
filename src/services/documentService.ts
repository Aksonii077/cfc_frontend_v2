/**
 * Document Service
 * Handles all document-related API calls
 */

import { api, ApiResponse } from '../utils/axios';

// Document interface based on the actual API response structure
export interface ApiDocument {
  document_id: number;
  idea_id: string;
  mentor_user_id: string;
  filename: string;
  file_size: number;
  file_type: string;
  storage_url: string;
  document_category: string;
  uploaded_at: string;
}

// Complete API response wrapper structure
export interface ApiDocumentsResponse {
  idea_id: string;
  total_documents: number;
  documents: ApiDocument[];
}

// Transformed document interface for UI
export interface Document {
  id: string;
  name: string;
  type: "business_plan" | "financial_projections" | "pitch_deck" | "legal" | "product" | "marketing" | "other";
  fileType: "pdf" | "docx" | "xlsx" | "pptx" | "png" | "jpg" | "mp4" | "other";
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  url: string;
  version: number;
  isShared: boolean;
  description?: string;
  tags: string[];
}

// Document service class
export class DocumentService {
  private static readonly BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

  /**
   * Fetch documents for a specific idea/startup
   */
  static async getDocuments(ideaId: string): Promise<ApiResponse<ApiDocument[]> & { totalCount?: number }> {
    try {
      const response = await api.get<ApiDocumentsResponse>(
        `${this.BASE_API_URL}/simple-ideas/${ideaId}/documents`
      );
      
      console.log('DocumentService - Raw API response:', response);
      
      if (response.success && response.data) {
        // Handle both direct array response and wrapper object response
        let documentsArray: ApiDocument[];
        let totalCount: number;
        
        // Check if response.data is an array (direct documents response)
        if (Array.isArray(response.data)) {
          documentsArray = response.data;
          totalCount = documentsArray.length;
          console.log('DocumentService - Direct array response:', documentsArray);
        } else {
          // Handle wrapper object: { idea_id, total_documents, documents }
          const apiData = response.data as ApiDocumentsResponse;
          console.log('DocumentService - Wrapper response:', apiData);
          
          if (!apiData.documents || !Array.isArray(apiData.documents)) {
            console.error('DocumentService - Missing or invalid documents array:', apiData);
            throw new Error('Invalid documents response structure');
          }
          
          documentsArray = apiData.documents;
          totalCount = apiData.total_documents || documentsArray.length;
        }
        
        console.log('DocumentService - Processed documents:', documentsArray);
        
        return {
          success: true,
          data: documentsArray,
          message: `Found ${totalCount} documents`,
          totalCount: totalCount,
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to fetch documents',
          message: response.message || 'Unable to load documents. Please try again.',
        };
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        error: 'Failed to fetch documents',
        message: 'Unable to load documents. Please try again.',
      };
    }
  }

  /**
   * Transform API document to UI document format
   */
  static transformApiDocument(apiDoc: ApiDocument): Document {
    return {
      id: apiDoc.document_id.toString(),
      name: apiDoc.filename,
      type: this.mapDocumentCategory(apiDoc.document_category),
      fileType: this.extractFileType(apiDoc.file_type),
      size: apiDoc.file_size,
      uploadedBy: apiDoc.mentor_user_id || 'Unknown',
      uploadedAt: apiDoc.uploaded_at,
      lastModified: apiDoc.uploaded_at,
      url: apiDoc.storage_url,
      version: 1, // Not provided in API response
      isShared: false, // Not provided in API response
      description: undefined, // Not provided in API response
      tags: [], // Not provided in API response
    };
  }

  /**
   * Map API document category to UI document type
   */
  private static mapDocumentCategory(apiCategory: string): Document['type'] {
    const category = apiCategory.toLowerCase();
    
    switch (category) {
      case 'business_plan':
        return 'business_plan';
      case 'financial_projections':
        return 'financial_projections';
      case 'pitch_deck':
        return 'pitch_deck';
      case 'legal':
      case 'legal_documents':
        return 'legal';
      case 'product':
      case 'product_roadmap':
      case 'product_specs':
        return 'product';
      case 'marketing':
      case 'marketing_plan':
      case 'marketing_materials':
        return 'marketing';
      default:
        return 'other';
    }
  }

  /**
   * Extract file type from file name or mime type
   */
  private static extractFileType(fileNameOrType: string): Document['fileType'] {
    const extension = fileNameOrType.toLowerCase();
    
    if (extension.includes('pdf')) return 'pdf';
    if (extension.includes('doc')) return 'docx';
    if (extension.includes('xls') || extension.includes('sheet')) return 'xlsx';
    if (extension.includes('ppt') || extension.includes('presentation')) return 'pptx';
    if (extension.includes('png')) return 'png';
    if (extension.includes('jpg') || extension.includes('jpeg')) return 'jpg';
    if (extension.includes('mp4') || extension.includes('video')) return 'mp4';
    
    return 'other';
  }

  /**
   * Get document by ID
   */
  static async getDocument(ideaId: string, documentId: string): Promise<ApiResponse<ApiDocument>> {
    try {
      const response = await api.get<ApiDocument>(
        `${this.BASE_API_URL}/simple-ideas/${ideaId}/documents/${documentId}`
      );
      
      return response;
    } catch (error) {
      console.error('Error fetching document:', error);
      return {
        success: false,
        error: 'Failed to fetch document',
        message: 'Unable to load document. Please try again.',
      };
    }
  }

  /**
   * Upload a new document
   */
  static async uploadDocument(
    ideaId: string, 
    file: File, 
    metadata: {
      description?: string;
      documentType?: string;
      tags?: string[];
      mentorUserId?: string;
    } = {}
  ): Promise<ApiResponse<ApiDocument>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add document_category (required)
      if (metadata.documentType) {
        formData.append('document_category', metadata.documentType);
      } else {
        formData.append('document_category', 'other'); // Default fallback
      }
      
      // Add mentor_user_id if provided
      if (metadata.mentorUserId) {
        formData.append('mentor_user_id', metadata.mentorUserId);
      }
      
      // Add optional fields
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      if (metadata.tags && metadata.tags.length > 0) {
        formData.append('tags', JSON.stringify(metadata.tags));
      }

      const response = await api.upload<ApiDocument>(
        `${this.BASE_API_URL}/simple-ideas/${ideaId}/documents/upload`,
        formData
      );
      
      return response;
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: 'Failed to upload document',
        message: 'Unable to upload document. Please try again.',
      };
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(ideaId: string, documentId: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<void>(
        `${this.BASE_API_URL}/simple-ideas/${ideaId}/documents/${documentId}`
      );
      
      return response;
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: 'Failed to delete document',
        message: 'Unable to delete document. Please try again.',
      };
    }
  }

  /**
   * Download a document
   */
  static async downloadDocument(doc: Document): Promise<void> {
    try {
      // Create a temporary link and trigger download
      const link = window.document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error('Failed to download document');
    }
  }
}

export default DocumentService;