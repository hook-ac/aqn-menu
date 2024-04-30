import { User, createClient } from "@supabase/supabase-js";
import { Database } from "./src/supabase";
import { createStore } from "zustand/vanilla";

const supabaseUrl = "https://bogjwtpfbwbchxteoxlo.supabase.co";
export const supabase = createClient(
  supabaseUrl,
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2p3dHBmYndiY2h4dGVveGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4MjIyNjUsImV4cCI6MjAyOTM5ODI2NX0.sHJfqpD4AvixbYkbM8eBvgM24i9_aweZyBj3MIZyO6o`,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true,
    },
  }
);
export const profile = createStore(() => ({
  user: null as User | null,
  features: null as Database["public"]["Tables"]["features"]["Insert"][] | null,
  userSettings: null as
    | Database["public"]["Tables"]["userSettings"]["Insert"][]
    | null,
  lUpdate: Date.now(),
  selectedProfile: 0,
}));

export async function fetchData() {
  const user = (await supabase.auth.getUser()).data.user;

  console.log(user);
  // Retrieve features and user settings
  let { data: features } = await supabase.from("features").select("*");
  let { data: userSettings } = await supabase.from("userSettings").select("*");

  if (user) {
    // Cast to Insert data type
    let settings =
      userSettings![0] as any as Database["public"]["Tables"]["userSettings"]["Insert"];

    if (!settings) {
      // Define a settings row
      settings = {
        user: user.id,
        definition: {
          init: Date.now(),
        },
      };

      // Insert and retrieve back the newly created row.
      await supabase.from("userSettings").upsert(settings);
      let { data: newSettings } = await supabase
        .from("userSettings")
        .select("*");

      profile.setState({
        userSettings: newSettings,
      });
    }

    // Subscribe for config changes
    profile.subscribe(async (profile, prefProfile) => {
      if (!profile.userSettings) return;
      if (profile.lUpdate !== prefProfile.lUpdate) {
        for (const setting of profile.userSettings) {
          await supabase.from("userSettings").upsert(setting);
        }
      }
      return profile;
    });
  }

  // Create profile state, reuse userSettings if they were created.
  profile.setState((prev) => ({
    loading: false,
    user: user,
    features,
    userSettings: prev.userSettings ? prev.userSettings : userSettings,
    lUpdate: Date.now(),
  }));
}
