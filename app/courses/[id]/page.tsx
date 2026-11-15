import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { CourseDetail } from "@/components/course-detail";

export function generateStaticParams() { return courses.map(course => ({ id: course.slug })); }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = courses.find(item => item.slug === id);
  if (!course) notFound();
  return <CourseDetail course={course} />;
}
