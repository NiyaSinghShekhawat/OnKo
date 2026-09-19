export interface MedicalSource {sourceId:string;provider:"europe-pmc";title:string;authors:string[];publicationDate?:string;abstract?:string;url:string;pmid?:string;pmcid?:string;}
export interface MedicalChunk {chunkId:string;sourceId:string;text:string;section?:string;rank:number;}
export interface RetrievalResult {query:string;chunks:MedicalChunk[];provider:"europe-pmc";retrievedAt:string;}
export interface RAGResponse {question:string;answer:string;sources:MedicalSource[];retrieval:RetrievalResult;model:string;disclaimer:string;}