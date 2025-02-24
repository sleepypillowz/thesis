import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDoctorType() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Doctor Type..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pedia">Pediatrician</SelectItem>
        <SelectItem value="ob-gyne">OB-Gyne</SelectItem>
        <SelectItem value="ent">ENT</SelectItem>
        <SelectItem value="cardio">Cardiologist</SelectItem>
        <SelectItem value="internist">Internist</SelectItem>
        <SelectItem value="nephrologist">Nephrologist</SelectItem>
      </SelectContent>
    </Select>
  );
}
