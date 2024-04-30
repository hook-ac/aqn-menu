import { profile } from "../../db";

export function updateField(fieldName: string, state: any) {
  const userSettings = profile.getState().userSettings;
  let settings = userSettings![0];

  // Recreate the definition with the new field (upsert field)
  settings.definition = {
    ...(settings.definition as any),
    [fieldName]: state,
  };

  // Set the new state and indicate to update
  profile.setState({
    userSettings: [settings],
    lUpdate: Date.now(),
  });
}

export function getConfigValue(fieldName: string, defaultValue: any) {
  const userSettings = profile.getState().userSettings;

  // If there's no such field, insert it into DB before displaying.
  if ((userSettings![0].definition as any)[fieldName] === undefined) {
    updateField(fieldName, defaultValue);
    return defaultValue;
  }
  return (userSettings![0].definition as any)[fieldName];
}
