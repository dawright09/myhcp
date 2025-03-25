import type { Provider } from '@/types'

export const healthcareProviders: Record<string, Provider> = {
  'sarah-chen': {
    name: 'Dr. Sarah Chen',
    specialty: 'Hematologist-Oncologist',
    experience: '15 years',
    description: 'Academic physician specializing in CLL and other chronic lymphoproliferative disorders. Associate Professor at a major academic medical center. Known for being data-driven and staying current with the latest treatment protocols. Has extensive experience with venetoclax-based combinations and fixed-duration therapy approaches in both first-line and relapsed/refractory settings.',
    personality: 'Data-driven, analytical, values clinical evidence and patient outcomes. Prefers treatments with strong clinical trial data and clear survival benefits. Often participates in clinical trials and stays current with ASH/ASCO guidelines. Strong advocate for evidence-based treatment decisions.',
    treatmentPreferences: 'Strong advocate for venetoclax-based fixed-duration combinations in both first-line and relapsed/refractory CLL. Values the potential for treatment-free remission and deep responses. Considers patient comorbidities and genetic markers (TP53, IGHV) in treatment decisions. Prefers treatments with clear monitoring guidelines and predictable side effect profiles.'
  },
  'michael-rodriguez': {
    name: 'Dr. Michael Rodriguez',
    specialty: 'Medical Oncologist',
    experience: '20 years',
    description: 'Community-based medical oncologist treating a diverse patient population with various cancer types. While CLL represents a small portion of his practice, he has extensive experience with BTK inhibitors and manages several CLL patients. Practices in a community setting with limited access to clinical trials. Focuses on practical treatment approaches and patient convenience.',
    personality: 'Practical, community-focused, values treatments that are easy to administer and monitor. Prefers established treatments with proven track records. Most comfortable with BTK inhibitors based on his experience. Relies on standard treatment protocols and guidelines.',
    treatmentPreferences: 'Most experienced with ibrutinib and familiar with its side effect profile. Prefers continuous oral therapies for patient convenience. Less familiar with newer treatment options but interested in learning. Values treatments that are easy to monitor in a community setting. May refer complex cases to academic centers.'
  },
  'emma-patel': {
    name: 'Dr. Emma Patel',
    specialty: 'Hematologist-Oncologist',
    experience: '5 years',
    description: 'Early-career hematologist-oncologist managing a busy practice with multiple cancer types. Recently completed fellowship at a major academic center and is building her CLL practice. Often pressed for time due to heavy patient load but stays current with treatment developments through quick literature reviews and conference highlights. Known for being direct and time-efficient in consultations.',
    personality: 'Rushed and sometimes impatient, but shows genuine interest in new treatment data. Often multitasking or checking time during conversations. Prefers quick, data-focused discussions over lengthy explanations. Direct and occasionally abrupt in communication style.',
    treatmentPreferences: 'Interested in efficient treatment approaches that minimize clinic visits. Wants to learn about newer options but needs information presented concisely. Looking for treatments with clear protocols and minimal monitoring complexity. Values treatments that won\'t overburden her busy clinic schedule. Open to both continuous and fixed-duration therapies if they\'re well-supported by data.'
  },
  'jennifer-martinez': {
    name: 'Jennifer Martinez, NP',
    specialty: 'Oncology Nurse Practitioner',
    experience: '8 years',
    description: 'Experienced nurse practitioner working alongside Dr. Rodriguez in CLL patient care. Specializes in treatment adherence, patient education, and coordinating financial assistance programs. Takes a holistic approach to patient care, considering both clinical and practical aspects of treatment.',
    personality: 'Compassionate, detail-oriented, and practical. Strong advocate for patient education and support. Excellent at identifying and addressing barriers to treatment success, including financial concerns and adherence challenges.',
    treatmentPreferences: 'Prioritizes treatments with clear administration guidelines and strong patient support programs. Considers medication costs, insurance coverage, and available financial assistance programs. Focuses on regimens that promote adherence through convenient dosing and manageable side effects. Values treatments with comprehensive patient education materials and nursing support services.'
  }
} as const 