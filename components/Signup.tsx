import React from 'react'
import axios from 'axios'
import Loader from 'components/Loader'
import { ChevronRightIcon, CheckIcon } from '@heroicons/react/outline'

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

const Signup = () => {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await axios
      .post(
        '/api/subscribers',
        {
          email,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(() => triggerSuccess())
      .catch(() => triggerError())
  }

  const triggerSuccess = async () => {
    setLoading(false)
    setSuccess(true)
    setEmail('')
    await delay(6000)
    setSuccess(false)
  }

  const triggerError = async () => {
    setLoading(false)
    setError(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)
    setEmail(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      {error && <span className="absolute text-red-500 -bottom-8">Something went wrong. Please try again.</span>}
      {success ? (
        <CheckIcon className="h-8 w-8 text-avocado mr-2" />
      ) : loading ? (
        <Loader className="mr-2" />
      ) : (
        <button type="submit" className="inline-flex items-end transition hover:translate-x-0.5">
          <ChevronRightIcon
            className={`h-8 w-8 mr-2 text-white inline ${email ? 'motion-safe:animate-none' : 'motion-safe:animate-pulse'}`}
          />
        </button>
      )}
      <input
        onChange={handleChange}
        type="email"
        required
        disabled={success}
        value={email}
        placeholder={success ? 'Subscribed ⌐◨-◨' : 'Enter Email Address'}
        className={`bg-transparent uppercase ${
          error ? 'border-b border-red-500 focus:border-red-500' : ''
        } block text-3xl text-white placeholder-neutral-700 focus:text-white focus:outline-none outline-none`}
      />
    </form>
  )
}

export default Signup
