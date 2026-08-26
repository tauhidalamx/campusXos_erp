export interface VectorPayload {
  tenantId: string;
  documentId: string;
  category: 'policy' | 'notice' | 'academic';
  content: string;
  allowedRoles: string[];
}

export interface VectorPoint {
  id: string;
  vector: number[];
  payload: VectorPayload;
}

export class CampusXRagEngine {
  private static qdrantStore = new Map<string, VectorPoint[]>(); // Collection storage

  /**
   * 1. Vectorize Chunk and Store inside Qdrant collection
   */
  public static async indexDocumentChunk(
    tenantId: string, 
    documentId: string, 
    category: 'policy' | 'notice' | 'academic', 
    content: string, 
    allowedRoles: string[]
  ): Promise<string> {
    const pointId = `pt_${Math.random().toString(36).substr(2, 9)}`;
    const vector = await CampusXRagEngine.generateEmbeddings(content);

    const payload: VectorPayload = {
      tenantId,
      documentId,
      category,
      content,
      allowedRoles
    };

    const point: VectorPoint = { id: pointId, vector, payload };

    const collectionName = `campusx_kb_${tenantId}`;
    const collection = CampusXRagEngine.qdrantStore.get(collectionName) || [];
    collection.push(point);
    CampusXRagEngine.qdrantStore.set(collectionName, collection);

    return pointId;
  }

  /**
   * 2. Search Qdrant with Role-Based Payload Filtering
   */
  public static async queryKnowledgeBase(
    tenantId: string,
    query: string,
    userRole: string,
    categoryLimit: number = 3
  ): Promise<string[]> {
    const queryVector = await CampusXRagEngine.generateEmbeddings(query);
    const collectionName = `campusx_kb_${tenantId}`;
    const collection = CampusXRagEngine.qdrantStore.get(collectionName) || [];

    // Filter points by tenant metadata AND role permissions
    const accessiblePoints = collection.filter(point => 
      point.payload.allowedRoles.includes(userRole) || point.payload.allowedRoles.includes('*')
    );

    // Calculate cosine similarity scores
    const scoredPoints = accessiblePoints.map(point => {
      const score = CampusXRagEngine.cosineSimilarity(queryVector, point.vector);
      return { point, score };
    });

    // Sort by descending score
    scoredPoints.sort((a, b) => b.score - a.score);

    return scoredPoints.slice(0, categoryLimit).map(sp => sp.point.payload.content);
  }

  /**
   * 3. RAG Pipeline Context Injection & Ollama Inference Broker
   */
  public static async generateAnswer(
    tenantId: string,
    query: string,
    userRole: string,
    modelName: 'deepseek-r1' | 'llama3' | 'qwen2.5' = 'deepseek-r1'
  ): Promise<string> {
    // Retrieve context chunks
    const contexts = await CampusXRagEngine.queryKnowledgeBase(tenantId, query, userRole);
    
    if (contexts.length === 0) {
      return `I could not find any internal records relating to your request with role ${userRole}.`;
    }

    const contextParagraphs = contexts.join('\n\n');

    // Prompt construction template
    const systemPrompt = `You are the CampusX ERP AI Assistant. Answer the user's query using the provided context from university policies.
If the context does not contain the answer, explain that the information is unavailable.

[CONTEXT DATA]
${contextParagraphs}

[USER QUESTION]
${query}`;

    // Emulate call to local Ollama API /api/generate
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[Model: ${modelName}] Based on the provided guidelines: ${contexts[0].substr(0, 100)}...`);
      }, 150);
    });
  }

  /**
   * Mock nomic-embed-text embedding generator
   */
  private static async generateEmbeddings(text: string): Promise<number[]> {
    const dimensions = 1536;
    const vector: number[] = new Array(dimensions);
    
    // Deterministic mock vector generation based on character codes
    for (let i = 0; i < dimensions; i++) {
      let charVal = text.charCodeAt(i % text.length) || 32;
      vector[i] = Math.sin(charVal + i) * Math.cos(charVal - i);
    }

    // Normalize vector length
    let magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / (magnitude || 1));
  }

  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return dotProduct; // Already normalized
  }
}
