"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { CourseDetail } from "@/components/course-detail";
export default function Page(){const {id}=useParams<{id:string}>();const {courses}=useApp();const course=courses.find(c=>c.slug===id);if(!course)return <div className="page"><div className="empty-state"><h1>Course not found</h1><p>This course is not in the connected catalog.</p><Link className="btn primary" href="/courses">Back to courses</Link></div></div>;return <CourseDetail course={course} key={course.id}/>;}
