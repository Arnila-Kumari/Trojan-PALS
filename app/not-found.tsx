import Link from "next/link";
export default function NotFound() {
  return <div className="empty-state"><h1>This path doesn’t exist yet.</h1><p>Explore the course catalog to find your next step.</p><Link className="btn primary" href="/courses">Back to courses</Link></div>;
}
