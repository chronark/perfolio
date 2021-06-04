import { authenticatedClient } from "../client"
import { createDocument, Document } from "./document"
import { Collection, query as q, Ref } from "faunadb"
import { QueryResponse } from "./schema"
import { COLLECTION_USERS } from "../resources/collections/users"
import { z } from "zod"
import { INDEX_SESSION_BY_HANDLE } from "db/resources/indices/session_by_handle"
import { UserDocument } from "./user"
import { COLLECTION_SESSIONS } from "db/resources/collections/sessions"
/**
 * Domain data schema.
 */
const SessionValidation = z.object({
  expiresAt: z.date().optional(),
  handle: z.string(),
  user: z.instanceof(UserDocument),
  hashedSessionToken: z.string().optional(),
  antiCSRFToken: z.string().optional(),
  publicData: z.string().optional(),
  privateData: z.string().optional(),
})
export type Session = z.infer<typeof SessionValidation>

/**
 * Required input data to create a new session.
 */
const CreateSessionValidation = z.object({
  expiresAt: z.date().optional().nullable(),
  handle: z.string(),
  userId: z.string(),
  hashedSessionToken: z.string().optional().nullable(),
  antiCSRFToken: z.string().optional().nullable(),
  publicData: z.string().optional().nullable(),
  privateData: z.string().optional().nullable(),
})
export type CreateSession = z.infer<typeof CreateSessionValidation>

/**
 * Possible fields to update.
 */
const UpdateSessionValidation = z.object({
  expiresAt: z.date().optional().nullable(),
  handle: z.string().optional(),
  hashedSessionToken: z.string().optional().nullable(),
  antiCSRFToken: z.string().optional().nullable(),
  publicData: z.string().optional().nullable(),
  privateData: z.string().optional().nullable(),
})
export type UpdateSession = z.infer<typeof UpdateSessionValidation>

/**
 * Database schema for pages.
 */
const SessionSchemaValidation = z.object({
  expiresAt: z.date().optional(),
  handle: z.string(),
  userRef: z.any(),
  hashedSessionToken: z.string().optional(),
  antiCSRFToken: z.string().optional(),
  publicData: z.string().optional(),
  privateData: z.string().optional(),
})
type SessionSchema = z.infer<typeof SessionSchemaValidation>

/**
 * Handler for user documents.
 */
export class SessionDocument extends Document<Session> {
  /**
   * Load a session by its unique handle
   */
  public static async fromHandle(
    handle: string,
    token: string,
  ): Promise<SessionDocument> {
    const client = authenticatedClient(token)
    const res = await client.query<QueryResponse<Session>>(
      q.Get(q.Match(q.Index(INDEX_SESSION_BY_HANDLE), handle)),
    )
    return new SessionDocument(client, res.ref, res.ts, res.data)
  }

  /**.
   * Create a new user document.
   *
   * Used to sign up new users
   *
   * @token - A server token to bootstrap the creation. The returned
   * SessionDocument will use a user scoped token that is returned from fauna
   * during signup.
   */
  public static async create(
    input: CreateSession,
    token: string,
  ): Promise<SessionDocument> {
    const validatedInput = CreateSessionValidation.parse(input)
    const client = authenticatedClient(token)

    const data = SessionSchemaValidation.parse({
      expiresAt: validatedInput.expiresAt,
      handle: validatedInput.handle,
      userRef: Ref(Collection(COLLECTION_USERS), validatedInput.userId),
      hashedSessionToken: validatedInput.hashedSessionToken,
      antiCSRFToken: validatedInput.antiCSRFToken,
      publicData: validatedInput.publicData,
      privateData: validatedInput.privateData,
    })

    const res = await createDocument(token, COLLECTION_SESSIONS, data)

    return new SessionDocument(client, res.ref, res.ts, {
      ...res.data,
      user: await UserDocument.fromRef(token, data.userRef),
    })
  }

  public async update(input: UpdateSession): Promise<void> {
    const res = await this.client.query<QueryResponse<Session>>(
      q.Update(q.Ref(q.Collection(COLLECTION_SESSIONS), this.ref), {
        data: UpdateSessionValidation.parse(input),
      }),
    )
    this.ts = res.ts
    this.data = SessionValidation.parse(res.data)
  }

  /**
   * Delete this user
   */
  public async delete(): Promise<void> {
    await this.client.query(q.Delete(this.ref))
  }
}