import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CustomSelectProps } from "@/app/types/types";

export function CustomSelect({ title, items }: CustomSelectProps) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item, index) => (
          <SelectItem key={index} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
