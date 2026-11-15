import { interestOptions, Profile, ReviewInput } from "./data";
export class InputError extends Error { constructor(message:string){super(message);this.name="InputError";} }
export function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=="object"||Array.isArray(value))throw new InputError("Expected a JSON object.");return value as Record<string,unknown>;}
export function text(value:unknown,label:string,max:number,required=false):string{
  if(value===undefined&&!required)return "";
  if(typeof value!=="string")throw new InputError(`${label} must be text.`);
  const result=value.trim();if(result.length>max||(required&&!result))throw new InputError(`${label} ${required?"must not be empty and ":""}must be at most ${max} characters.`);return result;
}
function list(value:unknown,label:string,maxItems=50,maxLength=160):string[]{
  if(!Array.isArray(value)||value.length>maxItems)throw new InputError(`${label} must be a list of at most ${maxItems} entries.`);
  return [...new Set(value.map(item=>text(item,label,maxLength,true)))];
}
function number(value:unknown,label:string,min:number,max:number):number{if(typeof value!=="number"||!Number.isFinite(value)||value<min||value>max)throw new InputError(`${label} must be between ${min} and ${max}.`);return value;}
export function courseCode(value:unknown):string{const code=text(value,"Course code",30,true).toUpperCase().replace(/^([A-Z]+)[\s-]+/,"$1 ");if(!/^[A-Z]{2,8} [0-9]{3}[A-Z]{0,3}$/.test(code))throw new InputError("Invalid course code.");return code;}
export function validateProfile(value:unknown):Profile{
  const p=object(value);const interests=list(p.interests,"Interests",25);
  if(interests.some(tag=>!interestOptions.includes(tag)))throw new InputError("Choose interests from the available list.");
  if(!["Projects","Exams","No preference"].includes(String(p.assessment)))throw new InputError("Invalid assessment preference.");
  if(!["Undergraduate","Graduate","Other"].includes(String(p.level)))throw new InputError("Invalid study level.");
  let research:Profile["research"]=null;
  if(p.research!==null&&p.research!==undefined){const r=object(p.research);research={lab_name:text(r.lab_name,"Lab name",200),professor:text(r.professor,"Professor",160),research_topic:text(r.research_topic,"Research topic",600),lab_work:text(r.lab_work,"Lab work",1200),work_with_professor:text(r.work_with_professor,"Research contribution",1200)};}
  return {name:text(p.name,"Name",80,true),program:text(p.program,"Program",120,true),semester:text(p.semester,"Semester",30),level:p.level as Profile["level"],interests,assessment:p.assessment as Profile["assessment"],workload:number(p.workload,"Weekly workload",1,40),completed:list(p.completed,"Completed course codes",100,30).map(courseCode),priorCourses:list(p.priorCourses,"Previous course names",100),goal:text(p.goal,"Goal",800),research,onboardingComplete:true};
}
export function validateReview(value:unknown):ReviewInput{
  const r=object(value);const format=String(r.format??"Unknown");if(!["Projects","Exams","Mixed","Unknown"].includes(format))throw new InputError("Invalid assessment format.");
  return {courseCode:courseCode(r.courseCode),semester:text(r.semester,"Course semester",60,true),instructor:text(r.instructor,"Instructor",160),difficulty:number(r.difficulty,"Difficulty",1,5),assessments:text(r.assessments,"Assessments",3000,true),workload:text(r.workload,"Workload",3000,true),weeklyHours:r.weeklyHours===null||r.weeklyHours===undefined?null:number(r.weeklyHours,"Weekly hours",0,100),format:format as ReviewInput["format"],grade:text(r.grade,"Grade",12),advice:text(r.advice,"Advice",5000,true)};
}
export function safeNext(value:string|null){return value&&value.startsWith("/")&&!value.startsWith("//")&&!value.includes("\\")&&!/[\r\n]/.test(value)?value:"/";}
