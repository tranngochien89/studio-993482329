import { NextRequest, NextResponse } from 'next/server';
import { JOBS, CANDIDATES } from '@/lib/data';
import { z } from 'zod';

let jobs = [...JOBS];

const jobSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    skills: z.array(z.string()).min(1, "Cần ít nhất một kỹ năng"),
    location: z.string().min(1, "Địa điểm không được để trống"),
    salary: z.string().optional(),
    deadline: z.string().min(1, "Hạn nộp hồ sơ không được để trống"),
    status: z.enum(['Open', 'Extended', 'Pending', 'Closed']),
});


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return NextResponse.json({ data: null, error: 'Không tìm thấy công việc' }, { status: 404 });
  }
  
  const jobWithApplicantCount = {
    ...job,
    numberOfApplicants: CANDIDATES.filter(c => c.jobId === job.id).length
  }

  return NextResponse.json({ data: jobWithApplicantCount, error: null });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const index = jobs.findIndex((j) => j.id === id);

    if (index === -1) {
        return NextResponse.json({ data: null, error: 'Không tìm thấy công việc' }, { status: 404 });
    }

    const body = await request.json();
    const parseResult = jobSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json({ data: null, error: 'Dữ liệu không hợp lệ', details: parseResult.error.flatten() }, { status: 400 });
    }
    
    const updatedJob = { ...jobs[index], ...parseResult.data };
    jobs[index] = updatedJob;

    return NextResponse.json({ data: updatedJob, error: null });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const initialLength = jobs.length;
    jobs = jobs.filter((j) => j.id !== id);

    if (jobs.length === initialLength) {
        return NextResponse.json({ data: null, error: 'Không tìm thấy công việc' }, { status: 404 });
    }

    return NextResponse.json({ data: { message: 'Công việc đã được xóa thành công' }, error: null });
}
