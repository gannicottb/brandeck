import initializeBasicAuth from 'nextjs-basic-auth'

/**
 * Shared utilities for all of brandeck
 */

const users = process.env.ADMIN_SECRET ? [
  { user: 'admin', password: process.env.ADMIN_SECRET }
] : []

export const basicAuth = initializeBasicAuth({
  users: users
})

// Provide custom markdown-esque parsing for basic layouts (like columns)
export const customFormat = (text: string) => {
  const fmt = text
    .replaceAll("[columns]", `<div class="columns">`)
    .replaceAll("[col]", `<div class="col">`)
    .replaceAll("[row]", `<div class="row">`)
    .replaceAll(/\[\/.*\]/g, "</div>")

  return fmt
}
