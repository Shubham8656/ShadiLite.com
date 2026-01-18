export function calculateMatchScore(me, other) {
  let score = 0;

  // Mother Tongue
  if (me.motherTongue && me.motherTongue === other.motherTongue) {
    score += 20;
  }

  // Education
  if (me.education && me.education === other.education) {
    score += 15;
  }

  // Diet
  if (me.diet && me.diet === other.diet) {
    score += 10;
  }

  // Location
  if (me.location && me.location === other.location) {
    score += 15;
  }

  // Family type
  if (me.familyType && me.familyType === other.familyType) {
    score += 10;
  }

  // Profession similarity (basic)
  if (
    me.profession &&
    other.profession &&
    me.profession.toLowerCase().includes(other.profession.toLowerCase())
  ) {
    score += 10;
  }

  // Age closeness
  if (me.age && other.age) {
    const diff = Math.abs(me.age - other.age);
    if (diff <= 2) score += 20;
    else if (diff <= 5) score += 10;
  }

  return score;
}

export function passesHardFilters(me, other) {
  if (me.gender && other.gender && me.gender === other.gender) return false;

//   if (me.religion && other.religion && me.religion !== other.religion)
//     return false;

  if (me.age && other.age) {
    const diff = Math.abs(me.age - other.age);
    if (diff > 8) return false;
  }

  return true;
}


export function calculateProfileCompletion(profile) {
  // Define required fields for a complete profile
  const requiredFields = [
    // Personal Info
    'name',
    'age',
    'gender',
    'religion',
    'location',
    
    // Personal Details
    'height',
    'maritalStatus',
    'motherTongue',
    'diet',
    
    // Career Details
    'education',
    'profession',
    'income',
    
    // Family Details
    'familyType',
    'fatherOccupation',
    'motherOccupation',
    'siblings',
    
    // About Me
    'aboutMe'
  ];

  // Count filled fields
  const filledFields = requiredFields.filter(field => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  }).length;

  // Calculate percentage
  const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);

    // return {
    //   percentage: completionPercentage,
    //   filledFields,
    //   totalFields: requiredFields.length,
    //   missingFields: requiredFields.filter(field => {
    //     const value = profile[field];
    //     return value === null || value === undefined || value === '';
    //   })
    // };
  return completionPercentage;
}