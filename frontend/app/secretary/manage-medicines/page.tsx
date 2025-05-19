"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash, Edit, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Prescription {
  id: number;
  medication: {
    name: string;
    stocks: number;
  };
  dosage: string;
  quantity: number;
  taken: number; // Changed to number type
}

export default function PrescribedMedicines() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Prescription[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Prescription | null>(
    null
  );
  const [inputTaken, setInputTaken] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch prescribed medicines from the backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/medicine-prescription-display/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch prescribed medicines");

        const data: Prescription[] = await res.json();
        const formattedData = data.map((item) => ({
          id: item.id,
          medication: {
            name: item.medication.name,
            stocks: item.medication.stocks,
          },
          dosage: item.dosage,
          quantity: item.quantity,
          taken: 0, // Initialize taken as 0 (frontend only)
        }));

        setMedicines(formattedData);
      } catch {
        toast.error("Error fetching medicines");
      }
    };

    fetchMedicines();
  }, []);

  const handleEdit = (medicine: Prescription) => {
    setSelectedMedicine(medicine);
    setInputTaken(medicine.taken.toString());
  };

  const saveEdit = () => {
    if (!selectedMedicine || !inputTaken) return;

    const takenValue = Math.min(
      Number(inputTaken),
      selectedMedicine.medication.stocks // Use actual stock for validation
    );

    setMedicines((prev) =>
      prev.map((med) =>
        med.id === selectedMedicine.id ? { ...med, taken: takenValue } : med
      )
    );
    toast.success("Updated taken quantity");
    setSelectedMedicine(null);
  };

  const handleRemove = (id: number) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
    toast.success("Medicine removed from list");
  };

  const handleManageAll = async () => {
    if (!window.confirm("Are you sure you want to confirm all updates?"))
      return;

    setLoading(true);
    try {
      const payload = {
        prescriptions: medicines.map((med) => ({
          id: med.id,
          confirmed: med.taken,
        })),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/medicine/confirm-dispense/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to confirm dispense");
      }

      // Refresh data after successful confirmation
      const newData = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/medicine-prescription-display/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      ).then((res) => res.json());
      setMedicines(
        newData.map((item: Prescription) => ({ ...item, taken: 0 }))
      );

      toast.success("Dispense confirmed and stocks updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update stocks"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stocks: number) => {
    if (stocks === 0) return "Out of Stock";
    if (stocks <= 10) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <Button
          onClick={() => router.push("/secretary/medicine")}
          variant="ghost"
          className="gap-1"
        >
          <ChevronLeft size={18} />
          Back to Medicines
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          Prescribed Medicines
        </h1>
        <div className="w-24" /> {/* Spacer for alignment */}
      </div>

      <div className="mb-8 space-y-4">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">
                    {med.medication.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStockStatus(med.medication.stocks) === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : getStockStatus(med.medication.stocks) === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getStockStatus(med.medication.stocks)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Dosage</Label>
                    <p className="font-medium">{med.dosage}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Prescribed</Label>
                    <p className="font-medium">{med.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Taken</Label>
                    <p className="font-medium">{med.taken}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Remaining Stock
                    </Label>
                    <p className="font-medium">
                      {med.medication.stocks - med.taken}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(med)}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit {med.medication.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Quantity Taken</Label>
                        <Input
                          type="number"
                          value={inputTaken}
                          onChange={(e) => setInputTaken(e.target.value)}
                          min="0"
                          max={med.medication.stocks}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Max available: {med.medication.stocks}
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={saveEdit}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove this medicine?"
                      )
                    ) {
                      handleRemove(med.id);
                    }
                  }}
                >
                  <Trash size={16} className="mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleManageAll}
          className="bg-indigo-600 px-8 py-4 text-lg hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Confirm All Updates"}
        </Button>
      </div>
    </div>
  );
}
