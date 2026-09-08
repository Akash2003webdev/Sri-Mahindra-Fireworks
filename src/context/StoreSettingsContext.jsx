import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getSiteSettings, updateSiteSetting } from "../lib/api";

const StoreSettingsContext = createContext(null);

// Global site settings (currently just the online-order on/off switch).
// Fetched once on load; the admin toggle updates both the DB and this
// context so every open tab of the app reflects the change immediately.
export function StoreSettingsProvider({ children }) {
  const [onlineOrderEnabled, setOnlineOrderEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    getSiteSettings()
      .then((map) => {
        setOnlineOrderEnabled(map.online_order_enabled !== "false");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function setOnlineOrder(enabled) {
    setOnlineOrderEnabled(enabled); // optimistic — flips instantly in the UI
    try {
      await updateSiteSetting("online_order_enabled", enabled ? "true" : "false");
    } catch (err) {
      setOnlineOrderEnabled(!enabled); // revert on failure
      throw err;
    }
  }

  return (
    <StoreSettingsContext.Provider
      value={{ onlineOrderEnabled, loaded, setOnlineOrder, refresh }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) throw new Error("useStoreSettings must be used within StoreSettingsProvider");
  return ctx;
}
