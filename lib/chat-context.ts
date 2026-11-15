import { Course, defaultProfile, Profile, rankCourses, researchAreas, Review } from "./data";
export function buildChatContext(message:string,profile:Profile,catalog:Course[],reviews:Review[],useProfile:boolean,contextSlug?:string){
 const effective=useProfile?profile:defaultProfile;const interests=new Set(effective.interests);const q=message.toLowerCase();
 if(/nlp|language|text/.test(q))interests.add("Natural Language Processing");if(/health|clinic/.test(q))interests.add("Healthcare AI");if(/machine learning|\bml\b/.test(q))interests.add("Machine Learning");if(/game/.test(q))interests.add("Game Development");if(/security|crypto/.test(q))interests.add("Cybersecurity");if(/network/.test(q))interests.add("Networking");if(/robot/.test(q))interests.add("Robotics");
 const explicit=catalog.filter(c=>q.includes(c.id.toLowerCase())||q.includes(c.id.toLowerCase().replace(' ','-'))||q.includes(c.title.toLowerCase()));
 const context=catalog.find(c=>c.slug===contextSlug);const ranked=rankCourses({...effective,interests:[...interests]},catalog);
 const chosen=[...new Map<string,Course>([...explicit,...(context?[context]:[]),...ranked.slice(0,4).map(r=>r.course)].map(c=>[c.id,c] as const)).values()].slice(0,5);
 const selectedReviews=chosen.flatMap(c=>reviews.filter(r=>r.courseCode===c.id).slice(0,6));
 return {
  profile:useProfile?{program:profile.program,level:profile.level,semester:profile.semester,interests:profile.interests,assessmentPreference:profile.assessment,weeklyWorkloadPreference:profile.workload,completedCourseCodes:profile.completed,previousCourseNames:profile.priorCourses,goal:profile.goal,researchTopic:profile.research?.research_topic??null}:null,
  courses:chosen.map(c=>({id:c.id,title:c.title,tags:c.tags,reportedWeeklyHours:c.hours,reportedFormat:c.format,prerequisitesVerified:c.prerequisitesVerified,reviewCount:c.reviewCount})),
  reviews:selectedReviews.map(r=>({id:r.id,courseCode:r.courseCode,semester:r.semester,instructor:r.instructor,difficulty:r.difficulty,assessments:r.assessments.slice(0,800),workload:r.workload.slice(0,800),advice:r.advice.slice(0,1000),sourceLabel:r.sourceLabel})),
  researchDirections:researchAreas.filter(r=>r.tags.some(tag=>interests.has(tag))).slice(0,3).map(r=>({id:r.id,title:r.title,question:r.question,status:"Exploratory only; not a verified lab or vacancy"})),
  note:"Evidence is a bounded subset of supplied, unverified review records. Similar records may overlap. Differences between reports must not be resolved by guessing. Unknown hours, syllabus percentages, or prerequisites must stay unknown.",
 };
}
export type ChatContext=ReturnType<typeof buildChatContext>;
export type ChatReply={text:string;courseIds:string[];researchIds:string[];reviewIds:string[];mode:"matching"|"llm";};
export function matchingReply(message:string,context:ChatContext):ChatReply{
 const q=message.toLowerCase();
 if(/email|outreach/.test(q))return {text:"This is a draft only; nothing has been sent.\n\nSubject: Interest in your work on [verified research topic]\n\nDear Professor [Name],\n\nI’m a USC student interested in [topic]. I read [verified publication title], and I was curious about [specific question]. My background includes [relevant course or project].\n\nAre there ways for a student with my background to contribute, or preparation you would recommend?\n\nThank you,\n[Your name]\n\nReplace all placeholders after checking actual faculty and publication information.",courseIds:[],researchIds:[],reviewIds:[],mode:"matching"};
 if(!context.courses.length)return {text:"There are no new matching courses in the connected catalog. Update your preferences, revisit completed courses, or explore a research direction. No live language model is configured.",courseIds:[],researchIds:context.researchDirections.map(r=>r.id),reviewIds:[],mode:"matching"};
 const selected=context.courses.slice(0,3);const evidence=context.reviews.filter(r=>selected.some(c=>c.id===r.courseCode));
 return {text:"Here are starting points from the connected course catalog"+(context.profile?", using your saved preferences":"")+":\n\n"+selected.map(c=>`• ${c.id} — ${c.title}\n${c.reviewCount} review records. ${c.reportedWeeklyHours===null?'Numeric weekly hours were not supplied.':`Reported hours: ${c.reportedWeeklyHours}/week.`} ${c.reportedFormat==='Unknown'?'Read individual assessment reports.':`Structured assessment reports: ${c.reportedFormat}.`}`).join("\n\n")+"\n\nThe linked reviews preserve the original reports, including disagreements. They are not verified official course information. This reply uses server-side matching; configure an LLM key and model for conversational AI.",courseIds:selected.map(c=>c.id),researchIds:/research|lab|professor/.test(q)?context.researchDirections.map(r=>r.id):[],reviewIds:evidence.slice(0,5).map(r=>r.id),mode:"matching"};
}
export function validateModelReply(value:unknown,context:ChatContext):Omit<ChatReply,"mode">{
 if(!value||typeof value!=="object")throw new Error("Invalid AI reply.");const r=value as Record<string,unknown>;
 if(typeof r.text!=="string"||!r.text.trim()||r.text.length>16000)throw new Error("Invalid AI reply text.");
 const ids=(key:string,allowed:string[])=>{if(!Array.isArray(r[key])||r[key].some(id=>typeof id!=="string"||!allowed.includes(id as string)))throw new Error("AI returned an unsupported reference.");return [...new Set(r[key] as string[])];};
 return {text:r.text,courseIds:ids("courseIds",context.courses.map(c=>c.id)),researchIds:ids("researchIds",context.researchDirections.map(r=>r.id)),reviewIds:ids("reviewIds",context.reviews.map(r=>r.id))};
}
