import { notFound } from "next/navigation";
import CourseExperience from "@/components/CourseExperience";
import { getCourseById } from "@/lib/course-data";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = getCourseById(params.id);

  if (!course) {
    return notFound();
  }

  return <CourseExperience course={course} />;
}
