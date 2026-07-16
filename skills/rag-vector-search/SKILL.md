---
name: rag-vector-search
description: Retrieval-augmented generation and vector search guide covering document ingestion, parsing, chunking, embeddings, metadata, hybrid retrieval, reranking, citations, freshness, access control, and retrieval evaluation. Use when building, reviewing, or debugging RAG systems or semantic search.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# RAG And Vector Search

Use this skill when building retrieval-augmented generation, semantic search, document Q&A, knowledge bases, or retrieval tools for agents.

## Core Scope

- Document ingestion, parsing, normalization, chunking, and metadata
- Embeddings, vector databases, hybrid search, filters, reranking, and citations
- Access control, source freshness, re-indexing, deletion, and provenance
- Retrieval evaluation, answer faithfulness, latency, and cost
- Integration with OpenAI embeddings, file search, agents, and app databases

## Workflow

1. Define answerable user questions and the source corpus before choosing tools.
2. Preserve document structure during parsing: headings, tables, page numbers, sections, and source URLs.
3. Choose chunking based on document shape, not a fixed token size by default.
4. Attach metadata needed for filtering, permissions, citations, and freshness.
5. Start with simple retrieval, then add hybrid search or reranking when evals show a retrieval failure.
6. Require the model to ground answers in retrieved evidence and cite sources when the product needs trust.
7. Evaluate retrieval and generation separately.

## Chunking Rules

- Chunk by semantic structure when possible: section, heading, paragraph, table, or code block.
- Keep enough context for each chunk to stand alone.
- Avoid splitting tables, procedures, API parameters, or legal clauses mid-structure.
- Store source identifiers, offsets, headings, and timestamps.
- Revisit chunking when top-k retrieval returns nearby but incomplete evidence.

## Retrieval Rules

- Use metadata filters for tenant, permission, product, date, language, or document type.
- Use hybrid retrieval for exact identifiers, error codes, names, acronyms, and keyword-heavy queries.
- Retrieve more candidates before reranking when recall is the bottleneck.
- Add reranking when vector similarity returns plausible but irrelevant chunks.
- Track stale-index and deleted-content behavior explicitly.

## Evaluation

- Measure retrieval recall: did the needed source appear in top-k?
- Measure answer faithfulness: is the final answer supported by retrieved evidence?
- Include hard queries: exact IDs, negative questions, outdated docs, ambiguous phrasing, and multi-hop questions.
- Log query, filters, retrieved chunk IDs, scores, reranker output, answer, citations, and human feedback.
- Keep a small golden dataset before changing chunking, embeddings, reranking, or prompts.

## Handoff

- Use `openai-api-development` for embeddings, file search, and API integration.
- Use `llm-application-delivery-workflow` when retrieval changes are part of a gated product release.
- Use `agents-sdk-development` when RAG is exposed as an agent tool.
- Use `llm-evals` for retrieval and answer quality eval design.
- Use `database-design` for metadata schema and access-control modeling.

## References

- OpenAI Embeddings: `https://developers.openai.com/api/docs/models/text-embedding-3-large`
- OpenAI File Search: `https://platform.openai.com/docs/guides/tools-file-search`
- RAG Playground paper: `https://arxiv.org/abs/2412.12322`
