"use client";
import Link from "next/link";
import { useState } from "react";
import { Course, rankCourses } from "@/lib/data";
import { useApp } from "./app-provider";
import { Icon } from "./icon";
export function SaveCourse({course,compact=false}:{course:Course;compact?:boolean}){
 const {saved,toggleSaved,toast}=useApp();const [busy,setBusy]=useState(false);const selected=saved.includes(course.id);
 return <button type="button" disabled={busy} className={compact?`icon-button save-button ${selected?"is-saved":""}`:`btn ${selected?"saved-btn":"secondary"}`} aria-pressed={selected} aria-label={`${selected?"Remove":"Save"} ${course.title}`} onClick={async()=>{setBusy(true);try{await toggleSaved(course.id);toast(selected?"Course removed from your path":"Course saved to your account.");}catch(error){toast(error instanceof Error?error.message:"Could not save course.");}finally{setBusy(false);}}}><Icon name={selected?"check":"bookmark"} size={17}/>{!compact&&(busy?"Saving…":selected?"Saved to my path":"Save to my path")}</button>;
}
export function CourseCard({course,index}:{course:Course;index:number}){
 const {profile,courses}=useApp();const ranked=rankCourses(profile,courses).find(r=>r.course.id===course.id);
 return <article className="course-card"><div className={`course-visual ${course.color}`}><div className="visual-lines"/><span className="visual-rank">0{index+1} / FOR YOU</span><Icon name={course.icon} size={64}/><span className="visual-id">{course.id}</span><SaveCourse course={course} compact/></div><div className="course-card-body"><div className="course-meta"><span>{course.id}</span><span>{course.reviewCount} review records</span></div><h3><Link href={`/courses/${course.slug}`}>{course.title}</Link></h3><p className="course-description">{course.averageDifficulty===null?"Be the first to share your experience.":`Reported difficulty: ${course.averageDifficulty} / 5. Read individual experiences before deciding.`}</p><div className="card-pills"><span><Icon name="clock" size={13}/>{course.hours===null?"Hours not reported":`${course.hours} reported hrs/week`}</span><span>{course.format==="Unknown"?"See assessment reports":course.format}</span></div><div className="match-reason"><Icon name="spark" size={15}/><span>{ranked?.reasons[0]??"Explore a new direction"}</span></div><Link className="card-link" href={`/courses/${course.slug}`}>Explore course & reviews <Icon name="arrow" size={17}/></Link></div></article>;
}
