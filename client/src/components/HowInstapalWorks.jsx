//components/HowInstapalWorks.jsx
import { CheckCircle } from 'lucide-react'

export default function HowInstapalWorks() {
  const steps = [
    {
      title: 'Create or join group orders',
      description: 'Start a new order or join an existing one with a simple link, making collaboration effortless.',
    },
    {
      title: 'Add items with direct links',
      description: 'Paste item links from your favorite food apps, and our system automatically fetches the details.',
    },
    {
      title: 'Chat with group members',
      description: 'Coordinate choices and confirm details with a built-in group chat for seamless communication.',
    },
    {
      title: 'Collect payments via UPI',
      description: 'Split the bill and collect payments from everyone directly in the app using any UPI service.',
    },
    {
      title: 'Track order status together',
      description: 'Everyone gets real-time updates on the order status, from preparation to delivery.',
    },
  ]

  return (
    <section className="bg-gradient-to-b from-blue-100 via-white to-yellow-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
          How Instapal Works
        </h2>
        <p className="text-gray-600 mb-12">
          Collaborate effortlessly with friends and hostelmates — from item selection to delivery tracking.
        </p>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-blue-600 mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}