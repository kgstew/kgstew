import { db } from '../index'
import { InsertLearningPlan, InsertUser, learningPlansTable, usersTable } from '../schema'

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data)
}

export async function createLearningPlan(data: InsertLearningPlan) {
  await db.insert(learningPlansTable).values(data)
}
