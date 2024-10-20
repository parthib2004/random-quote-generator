'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, RefreshCw, Share2 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Fallback quotes in case the API fails
const fallbackQuotes = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" }
]

export function QuoteGeneratorComponent() {
  const [quote, setQuote] = useState({ content: '', author: '' })
  const [loading, setLoading] = useState(true)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchQuote = async () => {
    setLoading(true)
    const url = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': "6418f5f5f0msha8eae855fc45198p1fe4bbjsnf8f784473644",
        'x-rapidapi-host': 'quotes15.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error('API response was not ok')
      }
      const data = await response.json()
      setQuote({ content: data.content, author: data.originator.name })
      setIsUsingFallback(false)
    } catch (error) {
      console.error('Error fetching quote:', error)
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      setQuote(randomQuote)
      setIsUsingFallback(true)
      toast.warn('Using local quotes due to API issue', { autoClose: 3000 })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  const shareQuote = async () => {
    const shareText = `"${quote.content}" - ${quote.author}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this quote!',
          text: shareText,
        })
        toast.success('Shared successfully!')
      } catch (error) {
        console.error('Error sharing:', error)
        fallbackCopyToClipboard(shareText)
      }
    } else {
      fallbackCopyToClipboard(shareText)
    }
  }

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Quote copied to clipboard!')
    }, () => {
      toast.error('Failed to copy quote')
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Random Quote Generator</h1>
          <div className="min-h-[150px] flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            ) : (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-700 mb-4">{`"${quote.content}"`}</p>
                <p className="text-gray-500">- {quote.author}</p>
                {isUsingFallback && (
                  <p className="text-xs text-yellow-600 mt-2">Using local quotes due to API issue</p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={fetchQuote} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Quote
            </Button>
            <Button onClick={shareQuote} className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}
