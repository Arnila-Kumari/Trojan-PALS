import { courses, Profile, rankCourses, researchAreas } from "./data";
import type { Message } from "@/components/app-provider";

// Frontend-only example responder. Replace behind a SERVER endpoint when
// connecting an LLM; never put provider API keys in a browser component.
export function getDemoReply(text:string,profile:Profile,contextSlug?:string):Omit<Message,"id"|"role"> {
  const query=text.toLowerCase();
  const requested=courses.filter(c=>query.includes(c.id.toLowerCase())||query.includes(c.id.split(" ")[1])||query.includes(c.title.toLowerCase()));
  const context=courses.find(c=>c.slug===contextSlug);
  const interests=new Set(profile.interests);
  if(/nlp|language|text/.test(query))interests.add("Natural Language Processing");
  if(/health|clinic|medical/.test(query))interests.add("Healthcare AI");
  if(/vision|image/.test(query))interests.add("Computer Vision");
  if(/web|website/.test(query))interests.add("Web Development");
  if(/data|sql/.test(query))interests.add("Data Science");
  if(/machine learning|\bml\b/.test(query))interests.add("Machine Learning");
  if(/fair|responsible|trust/.test(query))interests.add("Responsible AI");
  const localProfile={...profile,interests:[...interests],...(/project/.test(query)?{assessment:"Projects" as const}:{})};
  let ranked=rankCourses(localProfile);
  if(/light|manageable|less work|easier/.test(query))ranked=[...ranked].sort((a,b)=>a.course.hours-b.course.hours||b.score-a.score);
  if(/email|outreach/.test(query))return {text:"Here is an editable starting point, not a message that has been sent:\n\nSubject: Student interested in your work on [specific research topic]\n\nDear Professor [Name],\n\nI’m a USC student interested in [topic]. I read your paper [verified title], and I was especially curious about [specific observation or question]. My background includes [relevant course or project].\n\nAre there ways for students with my background to contribute, or preparation you would recommend? I would appreciate any guidance.\n\nThank you,\n"+profile.name+"\n\nReplace the placeholders using an actual publication and verified faculty information. This demo has no faculty database or confirmed openings."};
  if(/research|lab|professor|faculty/.test(query)) {
    const relevant=[...researchAreas].sort((a,b)=>b.tags.filter(t=>interests.has(t)).length-a.tags.filter(t=>interests.has(t)).length).slice(0,2);
    return {text:`A useful next step is to connect a topic you enjoy with a specific research question. Based on your interests, explore these sample directions:\n\n${relevant.map(r=>`• ${r.title}: ${r.question}`).join("\n\n")}\n\nThese are illustrative topics, not verified USC labs or recruiting opportunities. Open a direction to see preparation steps and official research directories.`,researchIds:relevant.map(r=>r.id),courseIds:ranked.slice(0,2).map(r=>r.course.id)};
  }
  const selected=requested.length?requested:context?[context]:ranked.slice(0,3).map(r=>r.course);
  if(!selected.length)return {text:"You’ve marked all sample courses as completed. You can update your profile, explore the research tab, or ask for a sample faculty outreach draft. There aren’t any additional courses in this small demo catalog."};
  const intro=requested.length>1?"Here’s a side-by-side starting point from the sample catalog:":selected.length===1?"Let’s take a closer look at this sample course:":"Here are a few starting points from the sample catalog. I’ve used your interests and preferences"+(/light|manageable|less work|easier/.test(query)?", prioritizing lower sample workloads":"")+":";
  return {text:`${intro}\n\n${selected.map(c=>`• ${c.id} — ${c.title}\n  ${c.hours} sample hrs/week · ${c.format.toLowerCase()} assessment\n  ${c.short}${c.prerequisiteIds.filter(id=>!profile.completed.includes(id)).length?` Check sample prerequisites: ${c.prerequisiteIds.filter(id=>!profile.completed.includes(id)).join(", ")}.`:""}`).join("\n\n")}\n\nThese are local demo suggestions, not live AI or academic advice. Confirm workload, assessment, and prerequisites with current official information.`,courseIds:selected.map(c=>c.id)};
}
