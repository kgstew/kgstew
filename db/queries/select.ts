import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm'
import { db } from '../index'
import { SelectUser, learningPlansTable, usersTable } from '../schema'

export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: number
    name: string
    email: string
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.id, id))
}

export async function getUsersWithLearningPlanCount(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    planCount: number
    id: number
    name: string
    email: string
  }>
> {
  return db
    .select({
      ...getTableColumns(usersTable),
      planCount: count(learningPlansTable.id),
    })
    .from(usersTable)
    .leftJoin(learningPlansTable, eq(usersTable.id, learningPlansTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
}

export async function getLearningPlansForLast24Hours(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    id: number
    goal: string
  }>
> {
  return db
    .select({
      id: learningPlansTable.id,
      goal: learningPlansTable.goal,
    })
    .from(learningPlansTable)
    .where(between(learningPlansTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(learningPlansTable.goal), asc(learningPlansTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
}
