"use client";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

type Settings = {
  notificationsEnabled: boolean;
  emailUpdates: boolean;
};

export default function Page() {
  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: true,
    emailUpdates: true,
  });

  const handleToggle = (setting: keyof Settings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex items-center justify-between rounded-md border p-4">
        <span className="text-lg">Enable Notifications</span>
        <Switch
          checked={settings.notificationsEnabled}
          onCheckedChange={() => handleToggle("notificationsEnabled")}
        />
      </div>
      <div className="flex items-center justify-between rounded-md border p-4">
        <span className="text-lg">Receive Email Updates</span>
        <Switch
          checked={settings.emailUpdates}
          onCheckedChange={() => handleToggle("emailUpdates")}
        />
      </div>
      <button className="mt-4 w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600">
        Save Changes
      </button>
    </div>
  );
}
