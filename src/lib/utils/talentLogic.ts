export function calculateTalentStatus(
  avgPotensi: number,
  avgTantangan: number,
  avgMental: number
): 'Ready' | 'Develop' | 'Risk' {
  if (avgPotensi >= 4.0 && avgTantangan <= 2.5 && avgMental >= 4.0) {
    return 'Ready';
  }
  
  if (avgMental <= 2.5 || (avgPotensi <= 2.5 && avgTantangan >= 3.5)) {
    return 'Risk';
  }
  
  return 'Develop';
}
