import { api } from './apiClient';
import type { GraphRetrieveResponse, GraphExpandRequest, GraphExpandResponse } from './types';

const BASE = '/api/v1/exams';

export const graphService = {
  getGraph(examId: string): Promise<GraphRetrieveResponse> {
    return api.get<GraphRetrieveResponse>(`${BASE}/${examId}/graph`);
  },

  expandNode(examId: string, body: GraphExpandRequest): Promise<GraphExpandResponse> {
    return api.post<GraphExpandResponse>(`${BASE}/${examId}/graph/expand`, body);
  },
};
