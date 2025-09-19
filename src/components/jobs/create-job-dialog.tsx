'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CreateJobDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Tạo vị trí mới</DialogTitle>
          <DialogDescription>
            Điền các thông tin chi tiết cho vị trí tuyển dụng mới.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tên vị trí
            </Label>
            <Input id="title" placeholder="Senior Frontend Engineer" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Mô tả công việc
            </Label>
            <Textarea id="description" placeholder="Mô tả công việc chi tiết..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skills" className="text-right">
              Yêu cầu kỹ năng
            </Label>
            <Input id="skills" placeholder="React, TypeScript, Next.js (phân cách bằng dấu phẩy)" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salary" className="text-right">
              Mức lương
            </Label>
            <Input id="salary" placeholder="120,000 - 150,000 USD" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Địa điểm
            </Label>
            <Input id="location" placeholder="Remote" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Hạn nộp đơn
            </Label>
            <Input id="deadline" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Trạng thái
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Mở</SelectItem>
                <SelectItem value="Pending">Chờ duyệt</SelectItem>
                <SelectItem value="Closed">Đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
