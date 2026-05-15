import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#/'
  })

  it('shows primary conversion CTAs on home', () => {
    render(<App />)

    expect(screen.getAllByRole('link', { name: 'Start Project' })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'View Offers' })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Request Audit' })[0]).toBeInTheDocument()
  })

  it('navigates to mission control view from menu', () => {
    render(<App />)

    window.location.hash = '#/mission-control'
    fireEvent(window, new HashChangeEvent('hashchange'))

    expect(screen.getByRole('heading', { name: 'Mission Control' })).toBeInTheDocument()
    expect(screen.getByText('Build Sprint')).toBeInTheDocument()
  })
})
