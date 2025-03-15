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

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  quantity: number;
  taken: number;
}

export default function PrescribedMedicines() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [inputTaken, setInputTaken] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch prescribed medicines from the backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(
          " http://localhost:8000/medicine-prescription-display/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch prescribed medicines");
        }

        const data = await res.json();
        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.medication.name,
          dosage: item.medication.dosage,
          quantity: item.quantity,
          taken: 0, // Default to 0, user will update this
        }));

        setMedicines(formattedData);
      } catch {
        toast.error("Error fetching medicines");
      }
    };

    fetchMedicines();
  }, []);

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setInputTaken(medicine.taken.toString());
  };

  const saveEdit = () => {
    if (!selectedMedicine || !inputTaken) return;

    const takenValue = Math.min(Number(inputTaken), selectedMedicine.quantity);
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
    toast.success("Medicine removed");
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
        "http://localhost:8000/medicine/confirm-dispense/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.errors?.map((e: any) => e.error).join(", ")
        );
      }

      toast.success("All stocks updated successfully");
      setMedicines((prev) => prev.map((med) => ({ ...med, taken: 0 })));
    } catch {
      toast.error("Failed to update stocks");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 10) return "Low Stock";
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
                  <h2 className="text-xl font-semibold">{med.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStockStatus(med.quantity) === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : getStockStatus(med.quantity) === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getStockStatus(med.quantity)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Dosage</Label>
                    <p className="font-medium">{med.dosage}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Quantity</Label>
                    <p className="font-medium">{med.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Taken</Label>
                    <p className="font-medium">{med.taken}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Remaining</Label>
                    <p className="font-medium">{med.quantity - med.taken}</p>
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
                      <DialogTitle>Edit {med.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Quantity Taken</Label>
                        <Input
                          type="number"
                          value={inputTaken}
                          onChange={(e) => setInputTaken(e.target.value)}
                          min="0"
                          max={med.quantity}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Max available: {med.quantity}
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
