import { eq } from 'drizzle-orm'
import { db } from '../index'
import { SelectLearningPlan, SelectUser, learningPlansTable, usersTable } from '../schema'

export async function updateLearningPlan(
  id: SelectLearningPlan['id'],
  data: Partial<Omit<SelectLearningPlan, 'id'>>
) {
  await db.update(learningPlansTable).set(data).where(eq(learningPlansTable.id, id))
}

export async function updateUser(id: SelectUser['id'], data: Partial<Omit<SelectUser, 'id'>>) {
  await db.update(usersTable).set(data).where(eq(usersTable.id, id))
}
