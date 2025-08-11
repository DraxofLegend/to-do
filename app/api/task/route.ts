import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '../../../lib/generated/prisma'
const prisma = new PrismaClient()
import { z } from 'zod'

const createTaskSchema = z.object({
    title: z.string().min(1).max(255)
})

export async function POST(request: NextRequest) {
    const body = await request.json()
    const validation = createTaskSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.issues, { status: 400 })
    }


    const newTask = await prisma.task.create({
        data: { title: body.title }
    })

    return NextResponse.json(newTask, { status: 201 })
}

export async function GET() {
    const getTask = await prisma.task.findMany()
    return NextResponse.json(getTask, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const body = await request.json()
    const deletedTask = await prisma.task.delete({
        where: { id: body.id }

    })
    return NextResponse.json(deletedTask)
}


