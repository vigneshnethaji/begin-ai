/* Units 6–9 metadata: one mapping for navigation, ownership and lab routes. */
(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const value=factory(node?require('./search-content.js'):root.AcademySearchContent,node?require('./rag-content.js'):root.AcademyRagContent,node?require('./retrieval-content.js'):root.AcademyRetrievalContent,node?require('./workflow-content.js'):root.AcademyWorkflowContent);
  if(node)module.exports=value;else root.AcademyAdvanced=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(search,rag,retrieval,workflow){
  'use strict';
  const definitions=[
  {
    "id": "semantic-search",
    "title": "Vectors and semantic search",
    "outcome": "Find related help articles and explain the scores.",
    "milestone": "A local help-article search",
    "navLabel": "Search lessons",
    "preview": {
      "heading": "Semantic search",
      "input": "Query: money back",
      "result": "Related article: refund guide",
      "note": "Toy vectors, not a trained embedding model"
    },
    "lab": {
      "id": "semantic-search",
      "title": "Semantic search",
      "url": "#lab/semantic-search",
      "unitId": "semantic-search",
      "related": [
        "embedding-storage",
        "vector-indexes",
        "hybrid-search"
      ],
      "description": "Compare keyword and vector results over fictional help articles.",
      "buttonLabel": "search",
      "renderer": "AcademySearchLab"
    }
  },
  {
    "id": "document-answers",
    "title": "Answers grounded in documents",
    "outcome": "Build an evidence-first answer with inspectable source passages.",
    "milestone": "An extractive answer with citations",
    "navLabel": "RAG lessons",
    "preview": {
      "heading": "Grounded answers",
      "input": "Question: How do I reset access?",
      "result": "Retrieved passage with document and chunk IDs",
      "note": "Local extractive answer, not LLM generation"
    },
    "lab": {
      "id": "grounded-answers",
      "title": "Grounded answers",
      "url": "#lab/grounded-answers",
      "unitId": "document-answers",
      "related": [
        "context-assembly",
        "citations-support",
        "retrieval-tests"
      ],
      "description": "Inspect chunks, assemble bounded context, and check cited evidence.",
      "buttonLabel": "rag",
      "renderer": "AcademyRagLab"
    }
  },
  {
    "id": "production-retrieval",
    "title": "Production retrieval",
    "outcome": "Measure retrieval while preserving document access boundaries.",
    "milestone": "A measured, permission-aware retrieval service",
    "navLabel": "Retrieval lessons",
    "preview": {
      "heading": "Retrieval quality",
      "input": "Demo caller: team A",
      "result": "Filter access, retrieve, then inspect a safe trace",
      "note": "Local policy simulation, not production authentication"
    },
    "lab": {
      "id": "retrieval-quality",
      "title": "Retrieval quality",
      "url": "#lab/retrieval-quality",
      "unitId": "production-retrieval",
      "related": [
        "retrieval-permissions",
        "document-injection",
        "retrieval-tracing"
      ],
      "description": "Compare rankings, check freshness, and enforce fictional caller scope.",
      "buttonLabel": "retrieval",
      "renderer": "AcademyRetrievalLab"
    }
  },
  {
    "id": "agents-workflows",
    "title": "Agents and workflows",
    "outcome": "Run a bounded, reviewable support-triage workflow.",
    "milestone": "A bounded support-triage workflow",
    "navLabel": "Workflow lessons",
    "preview": {
      "heading": "Bounded workflow",
      "input": "Request: prepare a support reply",
      "result": "Lookup → draft → wait for approval",
      "note": "Deterministic local workflow, not a model-directed agent"
    },
    "lab": {
      "id": "bounded-workflow",
      "title": "Bounded workflow",
      "url": "#lab/bounded-workflow",
      "unitId": "agents-workflows",
      "related": [
        "agent-framework",
        "mcp-capabilities",
        "workflow-recovery"
      ],
      "description": "Inspect steps, budgets, approval, cancellation, and recovery.",
      "buttonLabel": "workflow",
      "renderer": "AcademyWorkflowLab"
    }
  }
];
  const modules=[search,rag,retrieval,workflow];
  return {
    lessons:modules.flatMap(content=>content.lessons),
    references:Object.assign({},...modules.map(content=>content.references)),
    stages:definitions.map((unit,index)=>({id:unit.id,title:unit.title,outcome:unit.outcome,milestone:unit.milestone,navLabel:unit.navLabel,preview:unit.preview,level:index<2?'Intermediate':'Advanced',available:true,topics:modules[index].lessons.map(lesson=>lesson.short)})),
    labs:definitions.map(unit=>unit.lab)
  };
});

