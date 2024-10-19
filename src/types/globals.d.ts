export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator' | 'driver'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}