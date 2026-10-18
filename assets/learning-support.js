/* One authored support registry, shared by the site, guides and tests. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const value=factory(node?require('./learning-support-a.js'):root.AcademySupportA,node?require('./learning-support-b.js'):root.AcademySupportB);
 if(node)module.exports=value;else root.AcademySupport=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(a,b){
 const localCommand=command=>command.replace(/ --project labs\/[\w-]+\/?/g,'').replace(/Get-Content labs\/[\w-]+\//g,'Get-Content ');
 const lessons=Object.fromEntries(Object.entries({...a.lessons,...b.lessons}).map(([id,entry])=>[id,{...entry,source:{...entry.source,command:localCommand(entry.source.command)}}]));
 const units=Object.fromEntries(Object.entries({...a.units,...b.units}).map(([id,entry])=>[id,{...entry,challenge:{...entry.challenge,command:localCommand(entry.challenge.command)}}]));
 return {lessons,units,glossary:[...a.glossary,...b.glossary].sort((x,y)=>x.term.localeCompare(y.term,'en'))};
});
