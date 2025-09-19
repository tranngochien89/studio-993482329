'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Job } from '@/lib/types';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(1, 'Tên vị trí không được để trống.'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự.'),
  skills: z.string().min(1, 'Yêu cầu kỹ năng không được để trống.'),
  salary: z.string().optional(),
  location: z.string().min(1, 'Địa điểm không được để trống.'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Hạn nộp đơn không hợp lệ.',
  }),
  status: z.enum(['Open', 'Pending', 'Closed', 'Extended']),
});

type CreateJobDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onJobCreated: () => void;
  onJobUpdated: () => void;
  jobToEdit: Job | null;
};

export function CreateJobDialog({ isOpen, setIsOpen, onJobCreated, onJobUpdated, jobToEdit }: CreateJobDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      skills: '',
      salary: '',
      location: '',
      deadline: '',
      status: 'Open',
    },
  });
  
  useEffect(() => {
    if (jobToEdit) {
      form.reset({
        title: jobToEdit.title,
        description: jobToEdit.description,
        skills: jobToEdit.skills.join(', '),
        salary: jobToEdit.salary || '',
        location: jobToEdit.location,
        deadline: jobToEdit.deadline ? format(new Date(jobToEdit.deadline), "yyyy-MM-dd") : '',
        status: jobToEdit.status,
      });
    } else {
      form.reset({
          title: '',
          description: '',
          skills: '',
          salary: '',
          location: '',
          deadline: '',
          status: 'Open',
      });
    }
  }, [jobToEdit, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const apiEndpoint = jobToEdit ? `/api/jobs/${jobToEdit.id}` : '/api/jobs';
      const method = jobToEdit ? 'PUT' : 'POST';

      const payload = {
        ...values,
        skills: values.skills.split(',').map(s => s.trim()),
      };
      
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Đã có lỗi xảy ra');
      }

      toast({
        title: `Thành công!`,
        description: `Công việc đã được ${jobToEdit ? 'cập nhật' : 'tạo mới'} thành công.`,
      });
      
      if(jobToEdit) {
        onJobUpdated();
      } else {
        onJobCreated();
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{jobToEdit ? 'Chỉnh sửa vị trí' : 'Tạo vị trí mới'}</DialogTitle>
          <DialogDescription>
            Điền các thông tin chi tiết cho vị trí tuyển dụng.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên vị trí</FormLabel>
                  <FormControl><Input placeholder="Senior Frontend Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả công việc</FormLabel>
                  <FormControl><Textarea placeholder="Mô tả công việc chi tiết..." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yêu cầu kỹ năng</FormLabel>
                  <FormControl><Input placeholder="React, TypeScript, Next.js (phân cách bằng dấu phẩy)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức lương (tùy chọn)</FormLabel>
                    <FormControl><Input placeholder="VD: 20,000,000 - 30,000,000 VND" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl><Input placeholder="Hanoi, Vietnam" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn nộp đơn</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Open">Mở</SelectItem>
                          <SelectItem value="Pending">Chờ duyệt</SelectItem>
                          <SelectItem value="Closed">Đóng</SelectItem>
                          <SelectItem value="Extended">Gia hạn</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Đang lưu...' : (jobToEdit ? 'Lưu thay đổi' : 'Tạo mới')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
