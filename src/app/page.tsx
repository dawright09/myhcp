import Image from 'next/image'
import Link from 'next/link'

const oncologists = [
  {
    id: 'sarah-chen',
    name: 'Dr. Sarah Chen',
    specialty: 'Hematologic Oncologist',
    treatmentPreference: 'Favors venetoclax-based fixed-duration combinations',
    description: 'Academic physician focused on evidence-based CLL treatment at a major medical center.',
    image: '/images/dr-chen-avatar.jpg',
    imageAlt: 'Dr. Sarah Chen'
  },
  {
    id: 'michael-rodriguez',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Hematologic Oncologist',
    treatmentPreference: 'Uses ibrutinib but hasn\'t tried Brukinsa (zanubrutinib)',
    description: 'Community oncologist with extensive ibrutinib experience seeking to learn about newer options.',
    image: '/images/dr-rodriguez-avatar.jpg',
    imageAlt: 'Dr. Michael Rodriguez'
  },
  {
    id: 'emma-patel',
    name: 'Dr. Emma Patel',
    specialty: 'Hematologic Oncologist',
    treatmentPreference: 'Seeks to understand optimal therapy selection for each patient',
    description: 'Early-career oncologist with strong academic background in personalized medicine.',
    image: '/images/dr-patel-avatar.jpg',
    imageAlt: 'Dr. Emma Patel'
  },
  {
    id: 'jennifer-martinez',
    name: 'Jennifer Martinez',
    specialty: 'Nurse Practitioner',
    treatmentPreference: 'Prioritizes adherence, administration support, and cost management',
    description: 'Experienced NP focused on patient support, medication adherence, and financial assistance.',
    image: '/images/np-martinez-avatar.jpg',
    imageAlt: 'Jennifer Martinez, NP'
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Practice Your CLL Sales Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enhance your interactions with healthcare providers through realistic conversations about CLL treatment options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {oncologists.map((provider) => (
            <Link
              key={provider.id}
              href={`/practice/${provider.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group flex items-center p-6 gap-6"
            >
              <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden ring-2 ring-primary-100">
                <Image
                  src={provider.image}
                  alt={provider.imageAlt}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority={true}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-display font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {provider.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{provider.specialty}</p>
                <div className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full inline-block mb-3">
                  {provider.treatmentPreference}
                </div>
                <p className="text-gray-600 text-sm">{provider.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/practice/sarah-chen"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Practicing Now
          </Link>
        </div>
      </div>
    </main>
  )
} 