import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  notificationPermission,
  requestNotifications,
  type NotifyPermission,
} from "@/lib/belay/notify";

export function DeviceAlerts() {
  const [perm, setPerm] = useState<NotifyPermission>("default");

  useEffect(() => {
    setPerm(notificationPermission());
  }, []);

  if (perm === "unsupported") return null;

  if (perm === "granted") {
    return (
      <p className="text-xs text-faint">This phone pings if you go silent or hit pause.</p>
    );
  }

  if (perm === "denied") {
    return <p className="text-xs text-faint">This browser blocked alerts.</p>;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-11 px-0 text-muted hover:bg-transparent"
      onClick={async () => {
        const next = await requestNotifications();
        setPerm(next);
        if (next === "granted") {
          toast("Alerts on. This phone pings if you go silent or hit pause.");
        } else {
          toast.error("Alerts were not allowed.");
        }
      }}
    >
      Ping this phone
    </Button>
  );
}
