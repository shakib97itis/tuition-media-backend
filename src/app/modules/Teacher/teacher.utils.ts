import { ITeacher } from './teacher.interface';

export const calculateProfileCompletion = (
  teacher: Partial<ITeacher>,
): { is_completed: boolean; percentage: number } => {
  let percentage = 0;

  // 1. Basic Info & Bio (20%)
  if (
    teacher.full_name &&
    teacher.phone &&
    teacher.gender &&
    teacher.profile_picture &&
    teacher.about_me
  ) {
    percentage += 20;
  }

  // 2. Preferences & Availability (20%)
  const hasLocations = teacher.preferred_teaching_locations?.area?.length
    ? teacher.preferred_teaching_locations.area.length > 0
    : false;
  const hasSubjects = teacher.preferred_tutoring?.subjects?.length
    ? teacher.preferred_tutoring.subjects.length > 0
    : false;
  const hasDays = teacher.tutoring_availability?.days?.length
    ? teacher.tutoring_availability.days.length > 0
    : false;

  if (hasLocations && hasSubjects && hasDays) {
    percentage += 20;
  }

  // 3. Identification Docs (20%)
  if (teacher.identification?.number && teacher.identification?.front_image) {
    percentage += 20;
  }

  // --- Dynamic Education Tracking ---
  const ed = teacher.education;

  // 4. School Level (10%)
  if (ed?.school?.name) {
    percentage += 10;
  }

  // 5. Higher Secondary Level: College OR Diploma (10%)
  // Ensures teachers who went the polytechnic/diploma route aren't penalized for skipping college
  if (ed?.college?.name || ed?.diploma?.name) {
    percentage += 10;
  }

  // 6. Undergrad / Graduation Level (15%)
  if (ed?.graduation?.name) {
    percentage += 15;
  }

  // 7. Post-Graduation Level (5%)
  if (ed?.post_graduation?.name) {
    percentage += 5;
  }

  return {
    percentage,
    // The profile can be considered practically "complete" for platform matching
    // even if they don't have a Post-Graduation degree (e.g., hitting 95%)
    is_completed: percentage >= 95,
  };
};
