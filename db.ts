import { User, createClient } from "@supabase/supabase-js";
import { Database } from "./src/supabase";
import { createStore } from "zustand/vanilla";
const supabaseUrl = "https://bogjwtpfbwbchxteoxlo.supabase.co";
export const supabase = createClient(
  supabaseUrl,
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2p3dHBmYndiY2h4dGVveGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4MjIyNjUsImV4cCI6MjAyOTM5ODI2NX0.sHJfqpD4AvixbYkbM8eBvgM24i9_aweZyBj3MIZyO6o`
);

export const profile = createStore(() => ({
  user: null as User | null,
  features: null as Database["public"]["Tables"]["features"]["Insert"][] | null,
  userSettings: null as
    | Database["public"]["Tables"]["userSettings"]["Insert"][]
    | null,
  lUpdate: Date.now(),
}));

async function onLogin() {
  const user = profile.getState().user;

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

import express from "express";

export async function loginWithDiscord() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: "http://localhost:9001/login",
        skipBrowserRedirect: true,
      },
    });
    const redirectUrl = res.data.url;
    console.log(`Please login at: ${redirectUrl}`);

    const app = express();
    const port = 9001;

    app.get("/login", async (req, res) => {
      if (req.query.access_token) {
        let authres = await supabase.auth.setSession({
          access_token: req.query.access_token as string,
          refresh_token: req.query.refresh_token as string,
        });
        profile.setState({ user: authres.data.user });
        onLogin();
        res.send("OK!");
        server.close();
        resolve();
        return;
      }

      res.send(`
  <script>
  const hash = window.location.hash;
  if(hash.length > 0 && hash.startsWith("#")) {
    window.location.replace(window.location.href.replace('#','?'));
  }
</script>`);
    });

    let server = app.listen(port, () => {});
  });
}
