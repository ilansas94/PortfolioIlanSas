import type { Metadata } from "next";
import LearningExperience from "./LearningExperience";
import "./learning.css";

export const metadata: Metadata = {
  title: "רגע בטוח | למידה אינטראקטיבית בהיגיינת ידיים",
  description: "חוויית מיקרו-למידה אינטראקטיבית לצוותי בריאות: חמשת הרגעים להיגיינת ידיים, תרחישים, משוב מיידי ואתגר ידע. פרויקט קונספט עצמאי.",
  robots: { index: true, follow: true }
};

export default function LearningLabPage() {
  return <LearningExperience />;
}
