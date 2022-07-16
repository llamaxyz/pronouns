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
    await delay(3000)
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
    <form onSubmit={handleSubmit} className="flex items-center justify-center text-transform-uppercase">
      <input
        onChange={handleChange}
        type="email"
        required
        disabled={success}
        value={email}
        placeholder={success ? 'Subscribed!' : 'Enter Email Address'}
        className={`bg-transparent border-b ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-white'
        } block w-6/12 px-4 py-3 text-lg text-white placeholder-gray-200 focus:text-white focus:outline-none outline-none`}
      />
      {error && <span className="absolute text-red-500 -bottom-8">Something went wrong. Please try again.</span>}
      {success ? (
        <CheckIcon className="h-8 w-8 text-green-500" />
      ) : loading ? (
        <Loader />
      ) : (
        <button type="submit">
          <ChevronRightIcon className="h-8 w-8 text-white transition hover:translate-x-0.5" />
        </button>
      )}
    </form>
  )
}

export default Signup
