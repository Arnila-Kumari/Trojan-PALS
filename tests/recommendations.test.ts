import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { defaultProfile, Profile, Review } from "../lib/data";
import { CourseRow, mapCourse, mapReview, mapTemplate, profileToRow } from "../lib/mappers";
import { buildChatContext, matchingReply, validateModelReply } from "../lib/chat-context";
import { InputError, validateProfile, validateReview } from "../lib/validation";
import { rankCourses } from "../lib/data";
import { isUscEmail } from "../lib/usc-email";
const row:CourseRow={code:"CSCI 544",slug:"csci-544",title:"Applied Natural Language Processing",description:"Supplied title",tags:["Natural Language Processing","Machine Learning"],units:null,weekly_hours:null,assessment_format:"Unknown",level:"Unknown",prerequisite_codes:[],prerequisites_verified:false,official_source_url:null};
const second:CourseRow={...row,code:"CSCI 556",slug:"csci-556",title:"Introduction to Cryptography",tags:["Cybersecurity"]};
const review:Review={id:"r1",courseCode:"CSCI 544",semester:"Fall 2026",instructor:"Reported instructor",difficulty:4,assessments:"Projects and presentations",workload:"Moderately demanding",weeklyHours:null,format:"Unknown",grade:"A-",advice:"Start early",sourceKind:"imported",sourceLabel:"Supplied, unverified",sourceFile:"message.txt",sourceRow:1,createdAt:"2026-11-14T00:00:00Z",canEdit:false};
const catalog=[mapCourse(row,[review]),mapCourse(second,[])];
const profile:Profile={...defaultProfile,name:"Private Name",program:"Computer Science",interests:["Natural Language Processing"],goal:"Explore research",onboardingComplete:true};
test("USC email validation accepts only exact usc.edu domains",()=>{
 assert.equal(isUscEmail("student@usc.edu"),true);
 assert.equal(isUscEmail("STUDENT@USC.EDU"),true);
 assert.equal(isUscEmail("student@dept.usc.edu"),false);
 assert.equal(isUscEmail("student@university.edu"),false);
 assert.equal(isUscEmail("student@usc.edu.example.com"),false);
 assert.equal(isUscEmail("student@usc.edu."),false);
});
test("unknown hours and syllabus facts stay unknown instead of using old mock values",()=>{
 const course=mapCourse(row,[review]);assert.equal(course.hours,null);assert.equal(course.units,null);assert.equal(course.format,"Unknown");assert.deepEqual(course.assessment,[]);assert.equal(course.prerequisitesVerified,false);
});
test("recommendations change with interests and exclude completed courses",()=>{
 assert.equal(rankCourses(profile,catalog)[0].course.id,"CSCI 544");assert.equal(rankCourses({...profile,interests:["Cybersecurity"]},catalog)[0].course.id,"CSCI 556");assert.equal(rankCourses({...profile,completed:["CSCI 544"]},catalog)[0].course.id,"CSCI 556");assert.deepEqual(rankCourses({...profile,completed:catalog.map(c=>c.id)},catalog),[]);
});
test("profile validation strips client supplied ownership and refuses unknown interests",()=>{
 const validated=validateProfile({...profile,id:"victim-id",user_id:"victim-id",name:"  My name  "});assert.equal(validated.name,"My name");assert.ok(!("id" in validated));assert.ok(!("user_id" in validated));assert.equal(profileToRow(validated,"authenticated-user").id,"authenticated-user");assert.throws(()=>validateProfile({...profile,interests:["<script>"]}),InputError);
});
test("profile creation needs a real name/program and bounded data",()=>{
 assert.throws(()=>validateProfile({...profile,name:" "}),InputError);assert.throws(()=>validateProfile({...profile,program:""}),InputError);assert.throws(()=>validateProfile({...profile,workload:-2}),InputError);assert.throws(()=>validateProfile({...profile,priorCourses:[9]}),InputError);
});
test("template preferences preserve original course names without inventing USC credits",()=>{
 const t=mapTemplate({id:"student-1",label:"Student 1",semester:"2nd",level:"Undergraduate",courses_taken:["Mathematics","DBMS"],interests:["Machine Learning"],assessment:"Projects",research:null,source_label:"Supplied sample"});assert.equal(t.profile.name,"");assert.equal(t.profile.onboardingComplete,false);assert.deepEqual(t.profile.completed,[]);assert.deepEqual(t.profile.priorCourses,["Mathematics","DBMS"]);
});
test("review validation bounds ratings, normalizes codes, and strips forged ownership/provenance",()=>{
 const input=validateReview({...review,courseCode:"csci-544",author_id:"victim",source_kind:"imported",source_file:"fake.txt"});assert.equal(input.courseCode,"CSCI 544");assert.ok(!("author_id" in input));assert.ok(!("source_kind" in input));assert.throws(()=>validateReview({...review,difficulty:9}),InputError);assert.throws(()=>validateReview({...review,advice:""}),InputError);
});
test("review ownership is derived from verified user, not author hints",()=>{
 const raw={id:"r",course_code:"CSCI 544",author_id:"user-a",semester:"Fall 2026",instructor:"",difficulty:"4.0",assessments:"Assignments",workload:"Heavy",weekly_hours:null,assessment_format:"Unknown" as const,grade:"",advice:"Prepare",source_kind:"student" as const,source_label:null,source_file:null,source_row:null,created_at:"now"};assert.equal(mapReview(raw,"user-a").canEdit,true);assert.equal(mapReview(raw,"user-b").canEdit,false);assert.ok(!("author_id" in mapReview(raw,"user-b")));assert.equal(mapReview({...raw,source_kind:"imported",author_id:null},"user-a").canEdit,false);
});
test("AI context excludes account identity and uses only the supplied profile",()=>{
 const context=buildChatContext("Recommend NLP",profile,catalog,[review],true);assert.ok(context.profile?.interests.includes("Natural Language Processing"));assert.ok(!JSON.stringify(context).includes("Private Name"));assert.ok(!("email" in (context.profile??{})));assert.equal(buildChatContext("Recommend NLP",profile,catalog,[review],false).profile,null);
});
test("AI references cannot cite invented courses or reviews",()=>{
 const context=buildChatContext("NLP",profile,catalog,[review],true);assert.throws(()=>validateModelReply({text:"Try it",courseIds:["MADE UP 101"],researchIds:[],reviewIds:[]},context));assert.throws(()=>validateModelReply({text:"Try it",courseIds:[],researchIds:[],reviewIds:["invented-review"]},context));assert.equal(validateModelReply({text:"Read the report",courseIds:["CSCI 544"],researchIds:[],reviewIds:["r1"]},context).reviewIds[0],"r1");
});
test("matching fallback is explicitly labeled and does not invent numeric hours",()=>{
 const reply=matchingReply("NLP",buildChatContext("NLP",profile,catalog,[review],true));assert.equal(reply.mode,"matching");assert.match(reply.text,/Numeric weekly hours were not supplied/);assert.match(reply.text,/server-side matching/);
});
test("data import preserves all sources and distinct course variants",()=>{
 const manifest=JSON.parse(readFileSync("supabase/import-manifest.json","utf8"));assert.equal(manifest.courseCount,10);assert.equal(manifest.reviewCount,28);assert.equal(manifest.templateCount,10);const codes=manifest.courses.map((c:{id:string})=>c.id);for(const id of ["CSCI 529A","CSCI 529AB","CSCI 445","CSCI 642","CSCI 530","CSCI 556"])assert.ok(codes.includes(id));
});
