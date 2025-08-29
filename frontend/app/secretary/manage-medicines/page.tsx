"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Trash,
  Edit,
  ChevronLeft,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface Medication {
  id: number;
  name: string;
  category: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  indication: string;
  classification: string;
  stocks: number;
  expiration_date: string;
}

interface Prescription {
  id: number;
  medication: Medication;
  dosage: string;
  frequency: string;
  quantity: number;
  start_date: string;
  end_date: string;
  taken?: number; // how many units have been dispensed for this specific prescription
}

interface GroupedPrescription {
  // One group represents “all prescriptions for this medication in a single month”
  medication: Medication;
  dosage: string;
  frequency: string;
  totalQuantity: number;      // sum of `prescription.quantity` in this group
  prescriptionIds: number[];  // IDs of prescriptions in this group
  prescriptions: Prescription[]; 
  latestStartDate: string;
  latestEndDate: string;
  prescriptionMonth: string; 
  // We will compute “taken” on the fly as sum of prescription.taken
  taken: number;
}

export default function PrescribedMedicines() {
  const router = useRouter();

  // ─── State Hooks ────────────────────────────────────────────────────────────

  // All prescriptions fetched from backend; initialize each .taken = 0
  const [medicines, setMedicines] = useState<Prescription[]>([]);

  // Which group (medication + month) is currently being edited
  const [selectedGroup, setSelectedGroup] = useState<GroupedPrescription | null>(null);

  // “How many more units do we want to mark as dispensed right now?”
  const [additionalTaken, setAdditionalTaken] = useState("");

  const [loading, setLoading] = useState(false);

  // ─── Fetch Data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchMedicines() {
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
        // Initialize taken = 0 on front end (backend hasn’t confirmed any dispenses yet)
        const formatted = data.map((item) => ({ ...item, taken: 0 }));
        setMedicines(formatted);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    }
    fetchMedicines();
  }, []);

  // ─── Grouping Logic ──────────────────────────────────────────────────────────

  // Group by medication ID + month, keep track of total quantity and sum of prescription.taken
  const groupedMedicines = useMemo(() => {
    const map = new Map<string, GroupedPrescription>();

    medicines.forEach((prescription) => {
      const prescriptionMonth = new Date(prescription.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      const key = `${prescription.medication.id}-${prescriptionMonth}`;
      const existing = map.get(key);

      if (existing) {
        existing.totalQuantity += prescription.quantity;
        existing.prescriptionIds.push(prescription.id);
        existing.prescriptions.push(prescription);

        // Add this prescription’s “taken” into the group’s total taken
        existing.taken += prescription.taken || 0;

        // Possibly update latest start/end if this is a newer date
        if (new Date(prescription.start_date) > new Date(existing.latestStartDate)) {
          existing.latestStartDate = prescription.start_date;
        }
        if (new Date(prescription.end_date) > new Date(existing.latestEndDate)) {
          existing.latestEndDate = prescription.end_date;
        }
      } else {
        map.set(key, {
          medication: prescription.medication,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          totalQuantity: prescription.quantity,
          prescriptionIds: [prescription.id],
          prescriptions: [prescription],
          latestStartDate: prescription.start_date,
          latestEndDate: prescription.end_date,
          prescriptionMonth: prescriptionMonth,
          taken: prescription.taken || 0,
        });
      }
    });

    return Array.from(map.values());
  }, [medicines]);

  // Now group those groups by month for rendering (sorted newest month first)
  const medicinesByMonth = useMemo(() => {
    const monthMap = new Map<string, GroupedPrescription[]>();
    groupedMedicines.forEach((grp) => {
      const m = grp.prescriptionMonth;
      if (!monthMap.has(m)) monthMap.set(m, []);
      monthMap.get(m)!.push(grp);
    });
    return Array.from(monthMap.entries()).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedMedicines]);

  // ─── Calculate total “taken” PER MEDICATION (across all months) ───────────────

  const takenPerMedication = useMemo(() => {
    const map = new Map<number, number>();
    groupedMedicines.forEach((grp) => {
      const medId = grp.medication.id;
      const current = map.get(medId) || 0;
      map.set(medId, current + grp.taken);
    });
    return map;
  }, [groupedMedicines]);

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  // When user clicks “Edit” on a group, open its dialog
  const handleEdit = (group: GroupedPrescription) => {
    setSelectedGroup(group);
    setAdditionalTaken(""); // reset any previous input
  };

  // Save the “additional” units by distributing FIFO across that group’s prescriptions
  const saveEdit = () => {
    if (!selectedGroup) return;

    const additional = Number(additionalTaken);
    if (isNaN(additional) || additional < 0) {
      return; // optionally show a validation error
    }

    // How many have already been dispensed for this medication (all months)
    const alreadyTakenTotal = takenPerMedication.get(selectedGroup.medication.id) || 0;

    // The maximum we can ever add is (stocks – alreadyTakenTotal)
    const stocks = selectedGroup.medication.stocks;
    const toAllocate = Math.min(additional, stocks - alreadyTakenTotal);

    if (toAllocate <= 0) {
      // Nothing to add, or no stock left
      setSelectedGroup(null);
      setAdditionalTaken("");
      return;
    }

    // Now distribute `toAllocate` among the prescriptions in this group in ascending start_date
    // (i.e. fill the earliest prescription’s “quantity” first, then move on)
    const sortedPrescs = [...selectedGroup.prescriptions].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    let remainingToFill = toAllocate;
    // We will build a map: prescriptionId → newTakenValue
    const updatedTakenById = new Map<number, number>();

    sortedPrescs.forEach((presc) => {
      if (remainingToFill <= 0) {
        // no more to allocate
        updatedTakenById.set(presc.id, presc.taken || 0);
      } else {
        // Each prescription has a “quantity” (max that can be dispensed for this script)
        const alreadyThisPresc = presc.taken || 0;
        const maxForThisPresc = presc.quantity; // cannot exceed the script’s own quantity
        const canStillTake = maxForThisPresc - alreadyThisPresc;

        const addHere = Math.min(canStillTake, remainingToFill);
        updatedTakenById.set(presc.id, alreadyThisPresc + addHere);
        remainingToFill -= addHere;
      }
    });

    // Finally, update `medicines` state by applying those new taken values
    setMedicines((prev) =>
      prev.map((m) => {
        if (updatedTakenById.has(m.id)) {
          return { ...m, taken: updatedTakenById.get(m.id)! };
        }
        return m;
      })
    );

    // Close dialog
    setSelectedGroup(null);
    setAdditionalTaken("");
  };

  const handleRemove = (medicationId: number, prescriptionMonth: string) => {
    // Find that group’s IDs and filter them out
    const key = `${medicationId}-${prescriptionMonth}`;
    const grp = groupedMedicines.find((g) => `${g.medication.id}-${g.prescriptionMonth}` === key);
    if (!grp) return;

    setMedicines((prev) => prev.filter((p) => !grp.prescriptionIds.includes(p.id)));
  };

  const handleConfirmAll = async () => {
    if (!window.confirm("Are you sure you want to confirm all dispenses?")) return;
    setLoading(true);

    try {
      const payload = {
        prescriptions: medicines.map((m) => ({
          id: m.id,
          confirmed: m.taken || 0,
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
        const err = await res.json();
        throw new Error(err.message || "Failed to confirm dispense");
      }

      // Reload so we see fresh data
      window.location.reload();
    } catch (e) {
      console.error("Error confirming dispense:", e);
    } finally {
      setLoading(false);
    }
  };

  // ─── Utility Functions ────────────────────────────────────────────────────────

  // Determine a stock-status badge (color + text)
  const getStockStatus = (stocks: number, totalTaken: number) => {
    const remaining = stocks - totalTaken;
    if (remaining <= 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (remaining <= 10) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  // Color for classification badge
  const getClassificationColor = (classification: string) => {
    return classification === "Prescription"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  // Overall statistics (using groupedMedicines and takenPerMedication)
  const totalStats = useMemo(() => {
    return {
      totalMedicines: groupedMedicines.length,
      totalQuantity: groupedMedicines.reduce((sum, g) => sum + g.totalQuantity, 0),
      totalDispensed: groupedMedicines.reduce((sum, g) => sum + g.taken, 0),
      lowStockItems: groupedMedicines.filter((g) => {
        const already = takenPerMedication.get(g.medication.id) || 0;
        return g.medication.stocks - already <= 10;
      }).length,
    };
  }, [groupedMedicines, takenPerMedication]);

  // ─── When dialog is open, compute “alreadyTaken” & “remainingStock” ───────────

  let alreadyTaken = 0;
  let remainingStock = 0;
  if (selectedGroup) {
    alreadyTaken = takenPerMedication.get(selectedGroup.medication.id) || 0;
    remainingStock = selectedGroup.medication.stocks - alreadyTaken;
    if (remainingStock < 0) remainingStock = 0;
  }

  // Check if the user’s input exceeds remainingStock
  const inputValue = Number(additionalTaken);
  const isOver = !isNaN(inputValue) && inputValue > remainingStock;

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ────────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push("/secretary/medicine")}
            variant="ghost"
            className="gap-2 hover:bg-white/50"
          >
            <ChevronLeft size={18} />
            Back to Medicines
          </Button>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prescribed Medicines</h1>
              <p className="text-gray-600 mt-1">
                Manage dispensed medications by prescription month
              </p>
            </div>
          </div>

          <Button
            onClick={handleConfirmAll}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm All Dispenses"}
          </Button>
        </div>

        {/* ── Stats Cards ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Prescriptions */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalMedicines}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Quantity */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalQuantity}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Dispensed */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Dispensed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalDispensed}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Items */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.lowStockItems}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Monthly Tables ─────────────────────────────────────────────────────── */}
        {medicinesByMonth.map(([month, monthMedicines]) => (
          <Card key={month} className="border-0 shadow-sm bg-white overflow-hidden mb-8">
            <CardContent className="p-0">
              {/* Month Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">{month}</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {monthMedicines.length} prescriptions
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {monthMedicines.reduce((sum, g) => sum + g.totalQuantity, 0)} total quantity
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prescription Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthMedicines.map((group) => {
                      // How many have already been dispensed for this med (all months)
                      const totalTakenForMed =
                        takenPerMedication.get(group.medication.id) || 0;
                      const stockInfo = getStockStatus(
                        group.medication.stocks,
                        totalTakenForMed
                      );

                      return (
                        <tr
                          key={`${group.medication.id}-${group.prescriptionMonth}`}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* ── Medicine Details ────────────────────────────── */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {group.medication.name}
                                </h3>
                                <Badge
                                  className={getClassificationColor(
                                    group.medication.classification
                                  )}
                                >
                                  {group.medication.classification}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>
                                  {group.medication.strength} •{" "}
                                  {group.medication.dosage_form}
                                </p>
                                <p className="text-xs">
                                  {group.medication.category} •{" "}
                                  {group.medication.indication}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ── Prescription Info ──────────────────────────── */}
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Dosage:</span> {group.dosage}
                              </p>
                              <p>
                                <span className="font-medium">Frequency:</span>{" "}
                                {group.frequency}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(group.latestStartDate).toLocaleDateString()} –{" "}
                                {new Date(group.latestEndDate).toLocaleDateString()}
                              </p>
                            </div>
                          </td>

                          {/* ── Quantity Progress ──────────────────────────── */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Prescribed:</span>
                                  <span className="font-medium ml-1">
                                    {group.totalQuantity}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Dispensed:</span>
                                  <span className="font-medium ml-1 text-blue-600">
                                    {group.taken}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(
                                      (group.taken / group.totalQuantity) * 100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* ── Stock Status ───────────────────────────────── */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <Badge className={stockInfo.color}>
                                {stockInfo.status}
                              </Badge>
                              <div className="text-sm text-gray-600">
                                <p>
                                  Available:{" "}
                                  <span className="font-medium">
                                    {group.medication.stocks}
                                  </span>
                                </p>
                                <p>
                                  Remaining:{" "}
                                  <span className="font-medium">
                                    {group.medication.stocks - totalTakenForMed}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ── Actions (Edit / Remove) ────────────────────── */}
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {/* ─ Edit Dialog ───────────────────────────────── */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(group)}
                                    className="hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <Edit size={16} className="mr-1" />
                                    Edit
                                  </Button>
                                </DialogTrigger>

                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Dispense Additional Quantity
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                      <h4 className="font-medium">
                                        {selectedGroup?.medication.name}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Strength: {selectedGroup?.medication.strength}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Prescribed in {selectedGroup?.prescriptionMonth}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>
                                        Additional Quantity to Dispense
                                      </Label>
                                      <Input
                                        type="number"
                                        value={additionalTaken}
                                        onChange={(e) =>
                                          setAdditionalTaken(e.target.value)
                                        }
                                        min={0}
                                        max={remainingStock}
                                        className="mt-1"
                                      />
                                      <p className="mt-2 text-sm text-gray-500">
                                        Already dispensed: {alreadyTaken} &nbsp;•&nbsp;{" "}
                                        Remaining stock: {remainingStock}
                                      </p>
                                      {isOver && (
                                        <p className="mt-2 text-red-600 animate-pulse">
                                          Not enough stock to dispense that many.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={saveEdit}
                                      className="bg-blue-600 hover:bg-blue-700"
                                      disabled={
                                        isOver ||
                                        additionalTaken === "" ||
                                        Number(additionalTaken) < 0
                                      }
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              {/* ─ Remove Button ──────────────────────────────── */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Remove all ${group.medication.name} prescriptions from ${group.prescriptionMonth}?`
                                    )
                                  ) {
                                    handleRemove(
                                      group.medication.id,
                                      group.prescriptionMonth
                                    );
                                  }
                                }}
                              >
                                <Trash size={16} className="mr-1" />
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {monthMedicines.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No medicines for this month
                  </h3>
                  <p className="text-gray-600">
                    Prescribed medicines will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {medicinesByMonth.length === 0 && (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No prescribed medicines found
              </h3>
              <p className="text-gray-600">
                Prescribed medicines will appear here once available.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
