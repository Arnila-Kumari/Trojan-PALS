import { readFileSync,writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(readFileSync(path.join(root,'supabase/imports',name),'utf8'));
const sql=value=>value==null?'null':"'"+String(value).replaceAll("'","''")+"'";
const arr=values=>'array['+values.map(sql).join(',')+']::text[]';
const code=value=>value.toUpperCase().replace(/^([A-Z]+)[\s-]+/,'$1 ');
const tags={
 'CSCI 570':['Algorithms'],'CSCI 585':['Data Science'],'CSCI 544':['Natural Language Processing','Machine Learning'],
 'CSCI 566':['Machine Learning','Computer Vision'],'CSCI 642':['Robotics','Machine Learning'],
 'CSCI 556':['Cybersecurity','Algorithms'],'CSCI 529A':['Game Development'],'CSCI 445':['Robotics'],
 'CSCI 530':['Cybersecurity'],'CSCI 529AB':['Game Development'],
};
const sources=[['reviews-original.json','message (1).txt'],['reviews-expanded.json','message.txt']];
const rows=sources.flatMap(([file,original])=>read(file).course_reviews.map((data,index)=>({data,sourceFile:original,sourceRow:index+1})));
const catalog=new Map();
for(const {data} of rows){const id=code(data.course_code);if(!/^[A-Z]{2,8} [0-9]{3}[A-Z]{0,3}$/.test(id))throw Error('Invalid course code');if(!catalog.has(id))catalog.set(id,data.course_name);}
let output='-- Generated from the three supplied JSON files. Do not edit manually.\n-- Preserves all review records, including differing reports and distinct course codes.\n-- No authentication users are created. Student records are opt-in templates only.\nbegin;\n';
for(const [id,title] of catalog){const slug=id.toLowerCase().replaceAll(' ','-');const description='Course title and code taken from the supplied review dataset. Instructor, workload, and assessment statements are individual unverified reports; consult current official USC sources.';output+=`insert into public.courses(code,slug,title,description,tags) values (${sql(id)},${sql(slug)},${sql(title)},${sql(description)},${arr(tags[id]??[])}) on conflict(code) do nothing;\n`;}
const manifest={courseCount:catalog.size,reviewCount:rows.length,templateCount:0,courses:[...catalog].map(([id,title])=>({id,title,reviewCount:rows.filter(r=>code(r.data.course_code)===id).length})),notes:['Imported reports are user-supplied and unverified.','Differences between source files are preserved, not silently resolved.','CSCI 529A and CSCI 529AB are distinct records; CSCI 445/642 and CSCI 530/556 are not merged.','No numeric workload estimates, syllabus weights, prerequisites, or account credentials were invented.']};
for(const {data:d,sourceFile,sourceRow} of rows){
 const difficulty=Number(d.difficulty);if(!Number.isFinite(difficulty)||difficulty<1||difficulty>5)throw Error('Invalid difficulty');
 const hash=createHash('sha256').update(JSON.stringify({sourceFile,sourceRow,data:d})).digest('hex');
 const uuid=`${hash.slice(0,8)}-${hash.slice(8,12)}-5${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
 output+=`insert into public.course_reviews(id,course_code,semester,instructor,difficulty,assessments,workload,grade,advice,source_kind,source_label,source_file,source_row,import_key) values (${sql(uuid)},${sql(code(d.course_code))},${sql(d.semester)},${sql(d.instructor)},${difficulty},${sql(d.assessments)},${sql(d.workload)},${sql(d.grade)},${sql(d.advice)},'imported','Supplied review dataset; not independently verified',${sql(sourceFile)},${sourceRow},${sql(hash)}) on conflict(import_key) do nothing;\n`;
}
const expand={AI:'Artificial Intelligence',ML:'Machine Learning'};
const students=read('student-templates.json').students;manifest.templateCount=students.length;
for(const [index,s] of students.entries()){
 const interests=[...new Set(s.technical_interests.map(t=>expand[t]??t))];
 const assessment=s.preferred_assessment==='Only Project'?'Projects':s.preferred_assessment==='Only Exam'?'Exams':'No preference';
 output+=`insert into public.profile_templates(id,label,sort_order,semester,level,courses_taken,interests,assessment,research,source_label) values (${sql('student-'+(index+1))},${sql(s.student)},${index+1},${sql(s.semester)},${sql(s.level)},${arr(s.courses_taken)},${arr(interests)},${sql(assessment)},${s.research?sql(JSON.stringify(s.research))+'::jsonb':'null'},'Supplied sample profile; not an existing account or verified identity') on conflict(id) do nothing;\n`;
}
output+='commit;\n';
writeFileSync(path.join(root,'supabase/002_seed.sql'),output);
writeFileSync(path.join(root,'supabase/import-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Generated idempotent SQL for ${catalog.size} courses, ${rows.length} review records, ${students.length} profile templates.`);
