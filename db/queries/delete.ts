import { eq } from 'drizzle-orm'
import { db } from '../index'
import { learningPlansTable, SelectUser, usersTable } from '../schema'

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id))
}

export async function deleteLearningPlans(id: SelectUser['id']) {
  await db.delete(learningPlansTable).where(eq(learningPlansTable.id, id))
}
