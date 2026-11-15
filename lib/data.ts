export const interestOptions = ["Artificial Intelligence", "Natural Language Processing", "Machine Learning", "Healthcare AI", "Data Science", "Web Development", "Computer Vision", "Algorithms", "Responsible AI", "Game Development", "Cybersecurity", "Networking", "Robotics"];
export type ResearchExperience = { lab_name:string; professor:string; research_topic:string; lab_work:string; work_with_professor:string; };
export type Profile = {
  name:string; program:string; interests:string[]; assessment:"Projects"|"Exams"|"No preference";
  workload:number; completed:string[]; goal:string; semester:string; level:"Undergraduate"|"Graduate"|"Other";
  priorCourses:string[]; research:ResearchExperience|null; onboardingComplete:boolean;
};
export const defaultProfile:Profile = {name:"",program:"",interests:[],assessment:"No preference",workload:12,completed:[],goal:"",semester:"",level:"Other",priorCourses:[],research:null,onboardingComplete:false};
export type Course = {
  id:string; slug:string; title:string; short:string; description:string; tags:string[];
  hours:number|null; format:"Projects"|"Exams"|"Mixed"|"Unknown"; level:"Foundations"|"Advanced"|"Unknown";
  units:number|null; color:string; icon:"language"|"brain"|"code"|"database"|"nodes"|"eye";
  prerequisites:string; prerequisiteIds:string[]; prerequisitesVerified:boolean; topics:string[];
  assessment:{label:string;percent:number}[]; outcomes:string[]; research:string[];
  reviewCount:number; averageDifficulty:number|null; officialSourceUrl:string|null;
};
export type Review = {
  id:string; courseCode:string; semester:string; instructor:string; difficulty:number; assessments:string;
  workload:string; weeklyHours:number|null; format:"Projects"|"Exams"|"Mixed"|"Unknown"; grade:string; advice:string;
  sourceKind:"imported"|"student"; sourceLabel:string; sourceFile:string|null; sourceRow:number|null; createdAt:string; canEdit:boolean;
};
export type ReviewInput = Pick<Review,"courseCode"|"semester"|"instructor"|"difficulty"|"assessments"|"workload"|"weeklyHours"|"format"|"grade"|"advice">;
export type ProfileTemplate = {id:string;label:string;profile:Profile;sourceLabel:string;};
export type Research = {id:string;title:string;area:string;description:string;tags:string[];color:string;question:string;preparation:string[];};
// These are exploration prompts, not verified USC labs or advertised openings.
export const researchAreas:Research[]=[
 {id:"clinical-language",title:"Language for better healthcare",area:"NLP × Healthcare",description:"An exploratory direction connecting language technologies with healthcare questions.",tags:["Natural Language Processing","Healthcare AI","Data Science"],color:"rose",question:"How could language systems help people work with complex clinical information?",preparation:["Practice information extraction with public, non-sensitive text.","Learn evaluation metrics and dataset limitations.","Use official lab pages and actual publications to identify faculty."]},
 {id:"responsible-language",title:"More trustworthy language models",area:"NLP × Responsible AI",description:"An exploratory direction about evaluating language model reliability and fairness.",tags:["Natural Language Processing","Responsible AI","Machine Learning"],color:"lavender",question:"How can language models be evaluated for reliability and fairness?",preparation:["Compare outputs on a small documented evaluation set.","Study robustness and bias evaluation.","Read a verified publication before contacting a faculty member."]},
 {id:"visual-intelligence",title:"Understanding the visual world",area:"Vision × Deep Learning",description:"An exploratory direction connecting neural models with visual information.",tags:["Computer Vision","Machine Learning","Robotics"],color:"mint",question:"How can visual representations generalize to new situations?",preparation:["Complete an introductory image classification project.","Study augmentation and transfer learning.","Document a failure case and propose an experiment."]},
 {id:"secure-networks",title:"Understanding and securing networks",area:"Networking × Cybersecurity",description:"An exploratory direction inspired by interests in the supplied profile templates.",tags:["Networking","Cybersecurity"],color:"blue",question:"How can network behavior help us understand reliability and security?",preparation:["Learn networking fundamentals and log analysis.","Use public datasets or an authorized isolated test environment.","Find current research through official faculty and lab websites."]},
 {id:"interactive-worlds",title:"Building interactive worlds",area:"Games × Graphics",description:"An exploratory direction inspired by the supplied game-development profiles.",tags:["Game Development","Computer Vision","Web Development"],color:"sand",question:"How can simulation and graphics create more expressive interactive experiences?",preparation:["Build a small playable or visual prototype.","Learn a graphics or game-development tool.","Read a current lab publication and identify one question."]},
];
export type RankedCourse={course:Course;score:number;reasons:string[];missing:string[];};
export function rankCourses(profile:Profile,catalog:Course[]):RankedCourse[]{
  return catalog.filter(c=>!profile.completed.includes(c.id)).map(course=>{
    let score=0;const reasons:string[]=[];
    const shared=course.tags.filter(tag=>profile.interests.includes(tag));
    score+=shared.length*30;
    if(shared.length)reasons.push(`Matches your interest in ${shared[0].toLowerCase()}`);
    if(course.format!=="Unknown"&&profile.assessment!=="No preference"&&course.format===profile.assessment){score+=18;reasons.push("Matches your assessment preference based on structured reports");}
    if(course.hours!==null){if(course.hours<=profile.workload){score+=12;reasons.push("Within your weekly workload preference, based on reported hours");}else score-=(course.hours-profile.workload)*3;}
    const missing=course.prerequisitesVerified?course.prerequisiteIds.filter(id=>!profile.completed.includes(id)):[];
    score-=missing.length*12;
    if(!reasons.length)reasons.push("Explore beyond your current interests");
    return {course,score,reasons,missing};
  }).sort((a,b)=>b.score-a.score||a.course.title.localeCompare(b.course.title));
}
