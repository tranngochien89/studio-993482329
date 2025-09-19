import { NextRequest, NextResponse } from 'next/server';
import { JOBS, CANDIDATES } from '@/lib/data';
import type { Job } from '@/lib/types';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const location = searchParams.get('location');
  const skills = searchParams.get('skills');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  let filteredJobs: Job[] = [...jobs];

  if (status && status !== 'All') {
    filteredJobs = filteredJobs.filter((job) => job.status === status);
  }

  if (location) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (skills) {
    const skillsArray = skills.split(',').map((s) => s.trim().toLowerCase());
    filteredJobs = filteredJobs.filter((job) =>
      skillsArray.every((skill) =>
        job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill))
      )
    );
  }
  
  const jobsWithApplicantCounts = filteredJobs.map(job => ({
    ...job,
    numberOfApplicants: CANDIDATES.filter(c => c.jobId === job.id).length
  }));

  const total = jobsWithApplicantCounts.length;
  const paginatedJobs = jobsWithApplicantCounts.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data: paginatedJobs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    error: null,
  });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parseResult = jobSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json({ data: null, error: 'Dữ liệu không hợp lệ', details: parseResult.error.flatten() }, { status: 400 });
    }

    const newJob: Job = {
        id: uuidv4(),
        postedDate: new Date().toISOString(),
        ...parseResult.data,
        numberOfApplicants: 0,
    };

    jobs.unshift(newJob); // Add to the beginning of the array

    return NextResponse.json({ data: newJob, error: null }, { status: 201 });
}
