import { ShieldCheck, ShoppingCart, Bell } from 'lucide-react'

export default function WhyInstapal() {
  const features = [
    { 
      icon: <ShieldCheck className="text-green-600 w-6 h-6" />,
      title: 'College Email Registration',
      description:
        'Quick signup with your NIT Jamshedpur email. Verified students only for trusted group orders.',
    },
    {
      icon: <ShoppingCart className="text-green-600 w-6 h-6" />,
      title: 'Multi-Platform Ordering',
      description:
        'Order from Blinkit, Swiggy, Zomato, Instamart and Annupurna Canteen. All your favorite platforms in one place.',
    },
    {
      icon: <Bell className="text-green-600 w-6 h-6" />,
      title: 'Smart Notifications',
      description:
        'Get notified when students in your hostel start group orders. Never miss a chance to save.',
    },
  ]

  return (
    <section className="py-16 bg-white px-4 md:px-8 lg:px-24">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">Why Instapal?</h2>
        <p className="text-gray-500 text-lg">
          Designed for NIT Jamshedpur students to make group ordering effortless, economical, and secure.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div>{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}