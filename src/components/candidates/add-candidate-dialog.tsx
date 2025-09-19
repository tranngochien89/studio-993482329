'use client';

import React, { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { parseCandidateProfile } from '@/ai/flows/parse-candidate-profiles';
import { Loader2, Upload } from 'lucide-react';
import type { Job } from '@/lib/types';

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const formSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  experience: z.string().min(10, { message: 'Kinh nghiệm phải có ít nhất 10 ký tự.' }),
  cv: z.any(),
});

type AddCandidateDialogProps = {
  children: React.ReactNode;
  job: Job;
};

export function AddCandidateDialog({ children, job }: AddCandidateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      experience: '',
    },
  });

  const handleCvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const cvDataUri = await fileToDataUri(file);
      const parsedData = await parseCandidateProfile({ cvDataUri });
      
      if(parsedData) {
        form.setValue('name', parsedData.name);
        form.setValue('email', parsedData.email);
        form.setValue('experience', parsedData.experience);
        toast({
          title: "CV đã được phân tích",
          description: "Thông tin ứng viên đã được tự động điền.",
        });
      }
    } catch (error) {
      console.error('Failed to parse CV:', error);
      toast({
        variant: 'destructive',
        title: "Lỗi phân tích CV",
        description: "Không thể trích xuất thông tin từ CV. Vui lòng điền thủ công.",
      });
    } finally {
      setIsParsing(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically save the candidate to your database
    toast({
      title: 'Thêm ứng viên thành công',
      description: `${values.name} đã được thêm vào vị trí ${job.title}.`,
    });
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Thêm ứng viên mới</DialogTitle>
          <DialogDescription>
            Tải lên CV để tự động điền hoặc nhập thông tin thủ công.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-upload">Tải lên CV</Label>
              <div className="relative">
                <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} disabled={isParsing} className="pl-12"/>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {isParsing ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Tự động phân tích thông tin từ CV của ứng viên.</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên ứng viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tóm tắt kinh nghiệm</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tóm tắt kinh nghiệm và kỹ năng nổi bật..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isParsing}>
                {isParsing ? 'Đang xử lý...' : 'Lưu ứng viên'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
