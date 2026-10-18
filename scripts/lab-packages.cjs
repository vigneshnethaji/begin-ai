// Canonical source-distribution manifests. No compiled files or credentials.
module.exports=[
 ['supportdesk-rules',['SupportDesk.Rules.csproj','Program.cs','README.md']],
 ...[['supportdesk-classifier','lab-files'],['supportdesk-draft-replies','draft-files'],['supportdesk-ticket-summary','summary-files'],['supportdesk-ticket-lookup','lookup-files'],['supportdesk-semantic-search','search-files'],['supportdesk-grounded-answers','rag-files'],['supportdesk-retrieval-quality','retrieval-files'],['supportdesk-bounded-workflow','workflow-files'],['supportdesk-attachment-review','inputs-files'],['supportdesk-operations-capstone','operations-files']].map(([folder,manifest])=>[folder,require('../assets/'+manifest+'.js').map(([file])=>file)])
];
