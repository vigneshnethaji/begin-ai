/* Units 6–11 metadata: one mapping for navigation, ownership and lab routes. */
(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const value=factory(node?require('./search-content.js'):root.AcademySearchContent,node?require('./rag-content.js'):root.AcademyRagContent,node?require('./retrieval-content.js'):root.AcademyRetrievalContent,node?require('./workflow-content.js'):root.AcademyWorkflowContent,node?require('./inputs-content.js'):root.AcademyInputsContent,node?require('./operations-content.js'):root.AcademyOperationsContent);
  if(node)module.exports=value;else root.AcademyAdvanced=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(search,rag,retrieval,workflow,inputs,operations){
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
  },
{
  "id": "model-choices",
  "title": "More inputs and model choices",
  "outcome": "Review fictional attachments and choose a suitable model approach.",
  "milestone": "A reviewed attachment-processing feature",
  "navLabel": "Input and model lessons",
  "preview": {
    "heading": "Reviewed attachments",
    "input": "Synthetic image, audio and text observations",
    "result": "Validate → preserve sources → review",
    "note": "Authored OCR/transcript samples, not live inference"
  },
  "lab": {
    "id": "attachment-review",
    "title": "Reviewed attachments",
    "url": "#lab/attachment-review",
    "unitId": "model-choices",
    "related": [
      "local-inference",
      "onnx-quantization",
      "finetuning-decision"
    ],
    "description": "Inspect fictional inputs, provenance, review and model-choice constraints.",
    "buttonLabel": "inputs",
    "renderer": "AcademyInputsLab"
  }
},
{
  "id": "azure-operations",
  "title": "Operate and deploy on Azure",
  "outcome": "Evaluate release readiness and rehearse deployment failure recovery locally.",
  "milestone": "An observable SupportDesk capstone",
  "navLabel": "Operations lessons",
  "preview": {
    "heading": "Operations capstone",
    "input": "Synthetic candidate release and evaluation results",
    "result": "Gates → approval → simulated promote → health check",
    "note": "Local release simulation; no Azure resources created"
  },
  "lab": {
    "id": "operations-capstone",
    "title": "Operations capstone",
    "url": "#lab/operations-capstone",
    "unitId": "azure-operations",
    "related": [
      "latency-cost",
      "azure-release",
      "capstone-drills"
    ],
    "description": "Run release gates, review, synthetic smoke checks and rollback drills.",
    "buttonLabel": "operations",
    "renderer": "AcademyOperationsLab"
  }
}
];
  const modules=[search,rag,retrieval,workflow,inputs,operations];
  return {
    lessons:modules.flatMap(content=>content.lessons),
    references:Object.assign({},...modules.map(content=>content.references)),
    stages:definitions.map((unit,index)=>({id:unit.id,title:unit.title,outcome:unit.outcome,milestone:unit.milestone,navLabel:unit.navLabel,preview:unit.preview,level:index<2?'Intermediate':'Advanced',available:true,topics:modules[index].lessons.map(lesson=>lesson.short)})),
    labs:definitions.map(unit=>unit.lab)
  };
});

