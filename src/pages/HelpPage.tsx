import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I connect to the WiFi?',
    answer: 'Visit the captive portal page, select a plan that suits your needs, complete the payment, and you will receive instant access to the WiFi network.',
  },
  {
    category: 'Getting Started',
    question: 'What payment methods are accepted?',
    answer: 'We accept M-Pesa, credit/debit cards, and mobile money payments. All transactions are secure and encrypted.',
  },
  {
    category: 'Billing',
    question: 'How can I view my payment history?',
    answer: 'Log in to your dashboard and navigate to the Payments section to view all your transaction history and download invoices.',
  },
  {
    category: 'Billing',
    question: 'Can I get a refund?',
    answer: 'Yes, you can request a refund within 24 hours of purchase if you experienced service issues. Go to Settings > Payments and click "Request Refund" on the eligible payment.',
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your phone number, and you will receive an OTP to reset your password.',
  },
  {
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'Go to Settings > Danger Zone and click "Delete Account". Please note that this action is permanent and cannot be undone.',
  },
  {
    category: 'Technical',
    question: 'Why is my connection slow?',
    answer: 'Connection speed may vary based on network congestion, your device, and your selected plan. Try moving closer to the access point or upgrading to a higher-speed plan.',
  },
  {
    category: 'Technical',
    question: 'How many devices can I connect?',
    answer: 'The number of devices depends on your plan. Basic plans typically allow 1-2 devices, while premium plans allow up to 5 devices simultaneously.',
  },
]

const CATEGORIES = ['All', 'Getting Started', 'Billing', 'Account', 'Technical']

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <PageLayout title="Help & Support">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground">
            Search our knowledge base or contact support
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No results found. Try a different search term or category.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq, index) => (
              <Card key={index}>
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  aria-expanded={expandedItems.has(index)}
                >
                  <div className="flex-1">
                    <span className="text-xs text-primary font-medium">
                      {faq.category}
                    </span>
                    <h3 className="font-medium mt-1">{faq.question}</h3>
                  </div>
                  {expandedItems.has(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedItems.has(index) && (
                  <div className="px-4 pb-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Contact Support */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to assist you with any questions or issues.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:support@wifibilling.com"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@wifibilling.com</p>
                </div>
              </a>
              <a
                href="tel:+254700000000"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+254 700 000 000</p>
                </div>
              </a>
              <a
                href="/contact"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <MessageCircle className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Chat with us</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
