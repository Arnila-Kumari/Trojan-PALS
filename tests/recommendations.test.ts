import test from "node:test";
import assert from "node:assert/strict";
import { courses, defaultProfile, interestOptions, rankCourses, researchAreas } from "../lib/data";
import { getDemoReply } from "../lib/demo-chat";

test("recommendations respond to a different academic interest",()=>{
  const web=rankCourses({...defaultProfile,interests:["Web Development"],assessment:"Projects",workload:20});
  const nlp=rankCourses({...defaultProfile,interests:["Natural Language Processing"],assessment:"No preference",workload:20});
  assert.ok(web[0].course.tags.includes("Web Development"));
  assert.ok(nlp[0].course.tags.includes("Natural Language Processing"));
  assert.notEqual(web[0].course.id,nlp[0].course.id);
});
test("completed courses disappear from recommendations and satisfy demo prerequisites",()=>{
  const profile={...defaultProfile,completed:["CSCI 570","CSCI 567"]};
  const ranked=rankCourses(profile);
  assert.ok(ranked.every(r=>!profile.completed.includes(r.course.id)));
  assert.deepEqual(ranked.find(r=>r.course.id==="CSCI 544")?.missing,[]);
  assert.deepEqual(rankCourses({...profile,completed:courses.map(c=>c.id)}),[]);
});
test("course and research links are internally consistent",()=>{
  assert.equal(new Set(courses.map(c=>c.slug)).size,courses.length);
  assert.equal(new Set(courses.map(c=>c.id)).size,courses.length);
  for(const c of courses){
    assert.equal(c.assessment.reduce((n,a)=>n+a.percent,0),100,`${c.id}: assessment should total 100`);
    assert.ok(c.tags.every(tag=>interestOptions.includes(tag)));
    assert.ok(c.prerequisiteIds.every(id=>courses.some(item=>item.id===id)));
    assert.ok(c.research.every(id=>researchAreas.some(r=>r.id===id)));
    assert.ok(c.hours>0);
  }
});
test("chat links to an explicitly requested course instead of inventing one",()=>{
  const reply=getDemoReply("Tell me about CSCI 544",defaultProfile);
  assert.deepEqual(reply.courseIds,["CSCI 544"]);
  assert.match(reply.text,/sample/i);
});
test("course detail chat keeps the course as context",()=>{
  const reply=getDemoReply("What is the workload?",defaultProfile,"csci-585");
  assert.deepEqual(reply.courseIds,["CSCI 585"]);
});
test("research responses disclose demo status and link to defined directions",()=>{
  const reply=getDemoReply("I want NLP research in healthcare",defaultProfile);
  assert.equal(reply.researchIds?.[0],"clinical-language");
  assert.ok(reply.researchIds?.every(id=>researchAreas.some(r=>r.id===id)));
  assert.match(reply.text,/not verified USC labs/i);
});
test("outreach stays an unsent draft with placeholders",()=>{
  const reply=getDemoReply("Draft an outreach email",defaultProfile);
  assert.match(reply.text,/not a message that has been sent/i);
  assert.match(reply.text,/\[verified title\]/);
  assert.match(reply.text,/no faculty database or confirmed openings/i);
});
test("all-completed profile has an honest empty recommendation reply",()=>{
  const reply=getDemoReply("Suggest courses",{...defaultProfile,completed:courses.map(c=>c.id)});
  assert.equal(reply.courseIds,undefined);
  assert.match(reply.text,/all sample courses as completed/i);
});
